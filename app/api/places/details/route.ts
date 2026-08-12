import { NextResponse } from 'next/server'
import { resolvePlace } from '@/utils/places'
import { assessDelivery } from '@/utils/delivery'

export async function POST(request: Request) {
    try {
        const { placeId, sessionToken } = await request.json()

        if (!placeId || typeof placeId !== 'string') {
            return NextResponse.json({ error: 'placeId is required' }, { status: 400 })
        }

        const place = await resolvePlace(placeId, sessionToken)

        if (!place) {
            return NextResponse.json({ error: 'Could not resolve that address' }, { status: 502 })
        }

        // The zone shown here is for display only. /api/orders re-derives it from
        // Google at order time so a tampered client cannot award itself free delivery.
        const delivery = assessDelivery(place)

        return NextResponse.json({ place, delivery })
    } catch (error) {
        console.error('Place details error:', error)
        return NextResponse.json({ error: 'Could not resolve that address' }, { status: 500 })
    }
}
