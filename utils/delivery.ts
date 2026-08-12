// Free-delivery zone rules.
//
// Every free-vs-paid decision is measured from this point, so an error here shifts
// the whole 5 km circle. Resolved via the Google Places text search for the shop's
// postal address, which returned an exact `street_address` / `subpremise` match:
//
//   362, Wanjari Complex, Dr Ambedkar Rd, Kamal Chowk,
//   Gurunanakpura, Balabhaupeth, Nagpur, Maharashtra 440017
//
// If the shopfront ever moves, re-run that search rather than eyeballing the map.
export const STORE_LOCATION = { lat: 21.1692279, lng: 79.1019096 }

export const FREE_DELIVERY_RADIUS_KM = 5

export interface Coordinates {
    lat: number
    lng: number
}

/** `free` — inside the radius. `chargeable` — outside it. `unknown` — we could not
 *  measure, which we deliberately treat as chargeable so the shop is never left
 *  absorbing a delivery cost it did not agree to. */
export type DeliveryZone = 'free' | 'chargeable' | 'unknown'

export interface DeliveryAssessment {
    zone: DeliveryZone
    distanceKm: number | null
    isFree: boolean
}

const EARTH_RADIUS_KM = 6371

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

/** Great-circle distance. Straight-line, not road distance — a customer 4.9 km away
 *  as the crow flies may be a 7 km drive. That is intentional: it is the more
 *  generous reading, and generosity is the cheaper mistake here. */
export function haversineKm(from: Coordinates, to: Coordinates): number {
    const dLat = toRadians(to.lat - from.lat)
    const dLng = toRadians(to.lng - from.lng)

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2

    return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(a))
}

export function assessDelivery(location: Coordinates | null | undefined): DeliveryAssessment {
    if (
        !location ||
        typeof location.lat !== 'number' ||
        typeof location.lng !== 'number' ||
        Number.isNaN(location.lat) ||
        Number.isNaN(location.lng)
    ) {
        return { zone: 'unknown', distanceKm: null, isFree: false }
    }

    const distanceKm = haversineKm(STORE_LOCATION, location)
    const isFree = distanceKm <= FREE_DELIVERY_RADIUS_KM

    return {
        zone: isFree ? 'free' : 'chargeable',
        distanceKm: Math.round(distanceKm * 10) / 10,
        isFree,
    }
}

/** Human-friendly distance for the checkout badge. */
export function formatDistance(distanceKm: number | null): string {
    if (distanceKm === null) return ''
    if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`
    return `${distanceKm.toFixed(1)} km`
}
