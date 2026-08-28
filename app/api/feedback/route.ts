import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { sanitizeLine, sanitizeMultiline, NAME_MAX, MESSAGE_MAX } from '@/utils/sanitize'
import { rateLimit, clientIp, FEEDBACK_MAX, FEEDBACK_WINDOW_MS } from '@/utils/rate-limit'

/**
 * POST /api/feedback — public. Anyone can leave feedback.
 *
 * Sanitising happens here, not just in the form: the browser is not a security
 * boundary and a direct POST skips every client-side check. Rows land unpublished, so
 * nothing a stranger submits reaches the storefront until an admin approves it.
 */
export async function POST(request: NextRequest) {
    try {
        // Checked before parsing the body, so a flood costs as little as possible.
        const ip = clientIp(request)
        const limit = rateLimit(`feedback:${ip}`, FEEDBACK_MAX, FEEDBACK_WINDOW_MS)
        if (!limit.allowed) {
            return NextResponse.json(
                { success: false, error: 'Too many submissions. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(limit.retryAfterSeconds),
                        'X-RateLimit-Limit': String(FEEDBACK_MAX),
                        'X-RateLimit-Remaining': '0',
                    },
                },
            )
        }

        const body = await request.json()

        const name = sanitizeLine(String(body?.name ?? ''), NAME_MAX)
        const message = sanitizeMultiline(String(body?.message ?? ''), MESSAGE_MAX)
        const page = body?.page ? sanitizeLine(String(body.page), 200) : null

        if (name.length < 2) {
            return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
        }
        if (message.length < 5) {
            return NextResponse.json({ success: false, error: 'Feedback is too short' }, { status: 400 })
        }

        // Required on the public form, so enforced here too — a hand-rolled request
        // must not be able to create a row the form itself would reject. Admin-created
        // rows (PUT below) may still omit it, since a review taken over the phone
        // often has no star value.
        const rawRating = Number(body?.rating)
        if (!Number.isInteger(rawRating) || rawRating < 1 || rawRating > 5) {
            return NextResponse.json(
                { success: false, error: 'A rating between 1 and 5 is required' },
                { status: 400 },
            )
        }
        const rating = rawRating

        const supabase = createServiceRoleClient()
        const { error } = await supabase
            .from('feedback')
            .insert({ name, rating, message, page, is_published: false })

        if (error) {
            console.error('Error inserting feedback:', error)
            return NextResponse.json({ success: false, error: 'Could not save feedback' }, { status: 500 })
        }

        // Deliberately returns nothing about the stored row — the submitter has no
        // reason to learn its id, and it keeps the endpoint useless for enumeration.
        return NextResponse.json({ success: true }, { status: 201 })
    } catch (error) {
        console.error('API Error (POST /api/feedback):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * PUT /api/feedback — admin only, gated in middleware. Creates an entry by hand.
 *
 * Deliberately PUT rather than POST: the middleware exempts POST on this exact path
 * so the public can submit, so an admin-only create has to use a different verb.
 * Unlike the public route this one may publish immediately — an admin transcribing a
 * review from WhatsApp has already vetted it.
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()

        const name = sanitizeLine(String(body?.name ?? ''), NAME_MAX)
        const message = sanitizeMultiline(String(body?.message ?? ''), MESSAGE_MAX)

        if (name.length < 2) {
            return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
        }
        if (message.length < 5) {
            return NextResponse.json({ success: false, error: 'Feedback is too short' }, { status: 400 })
        }

        const rawRating = Number(body?.rating)
        const rating = Number.isInteger(rawRating) && rawRating >= 1 && rawRating <= 5
            ? rawRating
            : null

        const isPublished = body?.is_published === true

        const supabase = createServiceRoleClient()
        const { data, error } = await supabase
            .from('feedback')
            .insert({
                name,
                rating,
                message,
                page: null,
                is_published: isPublished,
                published_at: isPublished ? new Date().toISOString() : null,
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating feedback:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, feedback: data }, { status: 201 })
    } catch (error) {
        console.error('API Error (PUT /api/feedback):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * GET /api/feedback — admin only, gated in middleware.
 * Returns every row including unpublished ones, so the admin can triage.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const filter = searchParams.get('filter') // 'published' | 'pending' | null

        // Clamped rather than trusted: a hand-rolled request asking for limit=100000
        // would otherwise pull the whole table into memory.
        const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20') || 20))
        const offset = (page - 1) * limit

        const supabase = createServiceRoleClient()
        // `count: 'exact'` gives the total across the whole filtered set, not just this
        // page, which is what the page numbers are derived from.
        let query = supabase
            .from('feedback')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })

        if (filter === 'published') query = query.eq('is_published', true)
        if (filter === 'pending') query = query.eq('is_published', false)

        const { data, error, count } = await query.range(offset, offset + limit - 1)

        if (error) {
            console.error('Error fetching feedback:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        const total = count ?? 0
        return NextResponse.json({
            success: true,
            feedback: data,
            total,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(total / limit)),
        })
    } catch (error) {
        console.error('API Error (GET /api/feedback):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
