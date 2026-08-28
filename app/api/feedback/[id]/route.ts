import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { sanitizeLine, sanitizeMultiline, NAME_MAX, MESSAGE_MAX } from '@/utils/sanitize'

interface RouteParams {
    params: Promise<{ id: string }>
}

/**
 * PATCH /api/feedback/[id] — admin only, gated in middleware.
 *
 * Handles both the publish toggle and content edits. Every field is optional, so the
 * same endpoint serves a one-click publish and a full edit without the caller having
 * to resend fields it isn't changing.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const body = await request.json()

        const update: Record<string, unknown> = {}

        if (typeof body?.is_published === 'boolean') {
            update.is_published = body.is_published
            // Stamped on publish so the storefront could later order by when it was
            // approved rather than when it was written.
            update.published_at = body.is_published ? new Date().toISOString() : null
        }

        if (body?.name !== undefined) {
            const name = sanitizeLine(String(body.name), NAME_MAX)
            if (name.length < 2) {
                return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
            }
            update.name = name
        }

        if (body?.message !== undefined) {
            const message = sanitizeMultiline(String(body.message), MESSAGE_MAX)
            if (message.length < 5) {
                return NextResponse.json({ success: false, error: 'Feedback is too short' }, { status: 400 })
            }
            update.message = message
        }

        if (body?.rating !== undefined) {
            const rawRating = Number(body.rating)
            update.rating = Number.isInteger(rawRating) && rawRating >= 1 && rawRating <= 5
                ? rawRating
                : null
        }

        if (Object.keys(update).length === 0) {
            return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 })
        }

        const supabase = createServiceRoleClient()
        const { data, error } = await supabase
            .from('feedback')
            .update(update)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating feedback:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }
        if (!data) {
            return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, feedback: data })
    } catch (error) {
        console.error('API Error (PATCH /api/feedback/[id]):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

/** DELETE /api/feedback/[id] — admin only, gated in middleware. */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params

        const supabase = createServiceRoleClient()
        const { error } = await supabase.from('feedback').delete().eq('id', id)

        if (error) {
            console.error('Error deleting feedback:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('API Error (DELETE /api/feedback/[id]):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
