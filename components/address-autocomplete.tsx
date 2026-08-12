'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Loader2, X, Search } from 'lucide-react'

export interface SelectedPlace {
    placeId: string
    formattedAddress: string
    lat: number
    lng: number
    pincode: string | null
}

interface Suggestion {
    placeId: string
    primary: string
    secondary: string
}

interface Props {
    value: SelectedPlace | null
    onSelect: (place: SelectedPlace) => void
    onClear: () => void
    /** Fired once if address search stops working, so the parent can render a plain
     *  address box instead. Receives whatever the customer had typed so far. */
    onUnavailable: (typed: string) => void
    hasError?: boolean
}

const DEBOUNCE_MS = 300

export default function AddressAutocomplete({ value, onSelect, onClear, onUnavailable, hasError }: Props) {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isResolving, setIsResolving] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const [resolveError, setResolveError] = useState('')

    // One session token spans "user types → user picks one", which is how Google
    // bills an autocomplete session. Reset it after each selection.
    const sessionToken = useRef<string>('')
    const containerRef = useRef<HTMLDivElement>(null)
    const reportedUnavailable = useRef(false)

    const ensureSessionToken = () => {
        if (!sessionToken.current) {
            sessionToken.current =
                typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
        }
        return sessionToken.current
    }

    // Debounced lookup
    useEffect(() => {
        if (value) return
        if (query.trim().length < 3) {
            setSuggestions([])
            setIsSearching(false)
            return
        }

        setIsSearching(true)
        let cancelled = false

        const timer = setTimeout(async () => {
            try {
                const response = await fetch('/api/places/autocomplete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ input: query, sessionToken: ensureSessionToken() }),
                })
                const data = await response.json()
                if (cancelled) return

                if (data.unavailable && !reportedUnavailable.current) {
                    reportedUnavailable.current = true
                    onUnavailable(query)
                    return
                }

                setSuggestions(data.suggestions || [])
                setActiveIndex(-1)
                setIsOpen(true)
            } catch (err) {
                console.error('Address lookup failed:', err)
                if (!cancelled) setSuggestions([])
            } finally {
                if (!cancelled) setIsSearching(false)
            }
        }, DEBOUNCE_MS)

        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [query, value, onUnavailable])

    // Close the dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const handlePick = async (suggestion: Suggestion) => {
        setIsOpen(false)
        setIsResolving(true)
        setResolveError('')

        try {
            const response = await fetch('/api/places/details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ placeId: suggestion.placeId, sessionToken: ensureSessionToken() }),
            })
            const data = await response.json()

            if (!response.ok || !data.place) {
                setResolveError('We could not pin that address. Try picking another suggestion.')
                setIsOpen(true)
                return
            }

            sessionToken.current = '' // session ends at selection
            setQuery('')
            setSuggestions([])
            onSelect(data.place)
        } catch (err) {
            console.error('Place resolution failed:', err)
            setResolveError('We could not pin that address. Please try again.')
        } finally {
            setIsResolving(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || suggestions.length === 0) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((i) => (i + 1) % suggestions.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault()
            handlePick(suggestions[activeIndex])
        } else if (e.key === 'Escape') {
            setIsOpen(false)
        }
    }

    // Settled state — show the chosen address as a chip rather than raw text in an
    // input, so it reads as a decision the customer has made.
    if (value) {
        return (
            <div className="flex items-start gap-3 p-3 border border-[#EBEBEB] bg-[#F8F8F8] rounded-lg">
                <MapPin className="h-4 w-4 text-[#D29B6C] mt-0.5 flex-shrink-0" />
                <p className="flex-1 text-sm text-[#1A1A1A] leading-snug">{value.formattedAddress}</p>
                <button
                    type="button"
                    onClick={onClear}
                    aria-label="Change address"
                    className="text-xs font-medium text-[#717171] hover:text-[#D29B6C] transition-colors flex-shrink-0"
                >
                    Change
                </button>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#717171] pointer-events-none" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                    disabled={isResolving}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${hasError
                        ? 'border-red-400 focus:ring-red-200 bg-red-50'
                        : 'border-[#EBEBEB] focus:ring-[#D29B6C]/20 focus:border-[#D29B6C]'
                        }`}
                    placeholder="Search your area, street or landmark"
                    autoComplete="off"
                />
                {(isSearching || isResolving) && (
                    <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D29B6C] animate-spin" />
                )}
                {!isSearching && !isResolving && query.length > 0 && (
                    <button
                        type="button"
                        onClick={() => { setQuery(''); setSuggestions([]) }}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#717171] hover:text-[#1A1A1A]"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {resolveError && <p className="text-red-500 text-xs mt-1">{resolveError}</p>}

            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-[#EBEBEB] rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <li key={suggestion.placeId}>
                            <button
                                type="button"
                                onClick={() => handlePick(suggestion)}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors ${index === activeIndex ? 'bg-[#EBDDC4]' : 'hover:bg-[#F8F8F8]'
                                    }`}
                            >
                                <MapPin className="h-4 w-4 text-[#D29B6C] mt-0.5 flex-shrink-0" />
                                <span className="min-w-0">
                                    <span className="block text-sm text-[#1A1A1A] truncate">{suggestion.primary}</span>
                                    {suggestion.secondary && (
                                        <span className="block text-xs text-[#717171] truncate">{suggestion.secondary}</span>
                                    )}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && !isSearching && query.trim().length >= 3 && suggestions.length === 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-[#EBEBEB] rounded-lg shadow-lg px-4 py-3">
                    <p className="text-sm text-[#717171]">No matches. Try a nearby landmark or main road.</p>
                </div>
            )}
        </div>
    )
}
