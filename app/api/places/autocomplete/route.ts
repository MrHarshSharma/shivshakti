import { NextResponse } from 'next/server'
import { fetchPlaceSuggestions, getPlacesApiKey } from '@/utils/places'

// Below this, suggestions are noise and every keystroke is a billable call.
const MIN_QUERY_LENGTH = 3

// Lets checkout learn up front whether address search works, so it can render the
// right field from the start instead of swapping it out under the customer.
export async function GET() {
    return NextResponse.json({ available: !!getPlacesApiKey() })
}

export async function POST(request: Request) {
    try {
        // No key configured — tell the client so it can fall back to a plain address
        // box rather than showing a broken search. Checkout must never hard-fail on
        // an optional integration.
        if (!getPlacesApiKey()) {
            return NextResponse.json({ suggestions: [], unavailable: true })
        }

        const { input, sessionToken } = await request.json()

        if (typeof input !== 'string' || input.trim().length < MIN_QUERY_LENGTH) {
            return NextResponse.json({ suggestions: [] })
        }

        const suggestions = await fetchPlaceSuggestions(input.trim(), sessionToken)

        return NextResponse.json({ suggestions })
    } catch (error) {
        console.error('Address autocomplete error:', error)
        // Degrade quietly: an empty list just means "no matches yet".
        return NextResponse.json({ suggestions: [] })
    }
}
