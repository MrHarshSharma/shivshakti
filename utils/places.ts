// Server-only wrapper around the Google Places API (New).
//
// The API key deliberately lives server-side (GOOGLE_MAPS_API_KEY, no NEXT_PUBLIC_
// prefix) and is proxied through our own routes, so it is never shipped to the
// browser and cannot be scraped off the bundle.

import { STORE_LOCATION } from '@/utils/delivery'

const AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete'
const PLACE_DETAILS_URL = 'https://places.googleapis.com/v1/places'

// Bias suggestions towards Nagpur without hard-restricting them — a customer may
// legitimately be ordering for delivery to a nearby town.
const SEARCH_BIAS_RADIUS_METRES = 40_000

export interface PlaceSuggestion {
    placeId: string
    primary: string
    secondary: string
}

export interface ResolvedPlace {
    placeId: string
    formattedAddress: string
    lat: number
    lng: number
    pincode: string | null
}

// Minimal shapes for the slices of the Google responses we actually read.
interface GoogleAutocompleteResponse {
    suggestions?: Array<{
        placePrediction?: {
            placeId: string
            text?: { text?: string }
            structuredFormat?: {
                mainText?: { text?: string }
                secondaryText?: { text?: string }
            }
        }
    }>
}

interface GooglePlaceDetailsResponse {
    id?: string
    formattedAddress?: string
    location?: { latitude?: number; longitude?: number }
    addressComponents?: Array<{ longText?: string; types?: string[] }>
}

export function getPlacesApiKey(): string | null {
    return process.env.GOOGLE_MAPS_API_KEY || null
}

export async function fetchPlaceSuggestions(
    input: string,
    sessionToken?: string
): Promise<PlaceSuggestion[]> {
    const apiKey = getPlacesApiKey()
    if (!apiKey) return []

    const response = await fetch(AUTOCOMPLETE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
        },
        body: JSON.stringify({
            input,
            includedRegionCodes: ['in'],
            locationBias: {
                circle: {
                    center: { latitude: STORE_LOCATION.lat, longitude: STORE_LOCATION.lng },
                    radius: SEARCH_BIAS_RADIUS_METRES,
                },
            },
            ...(sessionToken ? { sessionToken } : {}),
        }),
    })

    if (!response.ok) {
        console.error('Places autocomplete failed:', response.status, await response.text())
        return []
    }

    const data: GoogleAutocompleteResponse = await response.json()

    return (data.suggestions || [])
        .filter((s) => s.placePrediction)
        .map((s) => ({
            placeId: s.placePrediction!.placeId,
            primary: s.placePrediction!.structuredFormat?.mainText?.text || s.placePrediction!.text?.text || '',
            secondary: s.placePrediction!.structuredFormat?.secondaryText?.text || '',
        }))
}

/** Resolves a placeId to coordinates. Returns null on any failure — callers decide
 *  what an unresolvable place means for them. */
export async function resolvePlace(
    placeId: string,
    sessionToken?: string
): Promise<ResolvedPlace | null> {
    const apiKey = getPlacesApiKey()
    if (!apiKey) return null

    const url = new URL(`${PLACE_DETAILS_URL}/${encodeURIComponent(placeId)}`)
    if (sessionToken) url.searchParams.set('sessionToken', sessionToken)

    const response = await fetch(url.toString(), {
        headers: {
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'id,formattedAddress,location,addressComponents',
        },
    })

    if (!response.ok) {
        console.error('Place details failed:', response.status, await response.text())
        return null
    }

    const data: GooglePlaceDetailsResponse = await response.json()

    if (typeof data.location?.latitude !== 'number' || typeof data.location?.longitude !== 'number') {
        return null
    }

    const pincode =
        (data.addressComponents || []).find((c) => (c.types || []).includes('postal_code'))
            ?.longText || null

    return {
        placeId: data.id || placeId,
        formattedAddress: data.formattedAddress || '',
        lat: data.location.latitude,
        lng: data.location.longitude,
        pincode,
    }
}
