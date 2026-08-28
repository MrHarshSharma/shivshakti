'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

export interface PublishedFeedback {
    id: number
    name: string
    rating: number | null
    message: string
    created_at: string
}

/** How long each card stays before the strip advances. */
const AUTOPLAY_MS = 5000
/** Slide transition length; must stay well under AUTOPLAY_MS or steps overlap. */
const TRANSITION_MS = 600

const AVATAR_TINTS = [
    { bg: '#EBDDC4', fg: '#8A6238' },
    { bg: '#E4DCCF', fg: '#6E6153' },
    { bg: '#EDD9CE', fg: '#8C5A42' },
    { bg: '#DFE3DA', fg: '#556052' },
    { bg: '#EAD9D9', fg: '#8A5252' },
]

function tintFor(name: string) {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % AVATAR_TINTS.length
    return AVATAR_TINTS[hash]
}

function Stars({ value, size = 'w-3.5 h-3.5' }: { value: number; size?: string }) {
    return (
        <div className="flex items-center justify-center gap-0.5" aria-label={`${value} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map(v => (
                <Star
                    key={v}
                    className={`${size} ${v <= value ? 'text-[#D29B6C]' : 'text-[#E0E0E0]'}`}
                    fill={v <= value ? 'currentColor' : 'none'}
                    aria-hidden="true"
                />
            ))}
        </div>
    )
}

function ReviewCard({
    review, isActive, ariaHidden,
}: { review: PublishedFeedback; isActive: boolean; ariaHidden?: boolean }) {
    const tint = tintFor(review.name)

    return (
        <figure
            aria-hidden={ariaHidden}
            className={`w-[260px] sm:w-[300px] flex-shrink-0 flex flex-col bg-white rounded-3xl
                        px-6 pt-7 pb-8 transition-all duration-500 ease-out
                        ${isActive
                            ? 'scale-100 opacity-100 shadow-[0_18px_50px_-12px_rgba(45,27,27,0.18)] z-10'
                            : 'scale-[0.88] opacity-70 shadow-[0_8px_24px_-12px_rgba(45,27,27,0.12)]'}`}
        >
            {/* Identity sits at the top, centred — the reference leads with the person
                rather than the quote. */}
            <div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center flex-shrink-0 ring-4 ring-white shadow-sm"
                style={{ backgroundColor: tint.bg }}
            >
                <span className="text-xl font-semibold" style={{ color: tint.fg }}>
                    {review.name.charAt(0).toUpperCase()}
                </span>
            </div>

            <figcaption className="mt-3 text-center">
                <p className="text-sm font-semibold text-[#1A1A1A] truncate">{review.name}</p>
                {review.rating !== null && (
                    <div className="mt-1.5">
                        <Stars value={review.rating} />
                    </div>
                )}
            </figcaption>

            {/* Text framed by an opening and closing mark, as in the reference. The
                glyphs are decorative, so the quote itself keeps its own padding and
                never runs underneath them. */}
            <div className="relative mt-5 flex-grow">
                <Quote
                    className="absolute -top-1 left-0 w-6 h-6 text-[#EDE7DD] rotate-180"
                    aria-hidden="true"
                />
                <blockquote className="px-7 text-[13.5px] text-[#4A4A4A] leading-relaxed line-clamp-6 text-left">
                    {review.message}
                </blockquote>
                <Quote
                    className="absolute -bottom-2 right-0 w-6 h-6 text-[#EDE7DD]"
                    aria-hidden="true"
                />
            </div>
        </figure>
    )
}

function NavButton({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
    const Icon = dir === 'prev' ? ChevronLeft : ChevronRight
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={dir === 'prev' ? 'Previous review' : 'Next review'}
            className={`absolute top-1/2 -translate-y-1/2 z-30 ${dir === 'prev' ? 'left-3 sm:left-8' : 'right-3 sm:right-8'}
                        w-11 h-11 rounded-full bg-white border border-[#EBEBEB] shadow-md
                        flex items-center justify-center text-[#4A4A4A]
                        hover:text-[#D29B6C] hover:border-[#E0B08A] hover:shadow-lg
                        transition-all active:scale-95`}
        >
            <Icon className="w-5 h-5" />
        </button>
    )
}

/**
 * "What People Say" — an auto-advancing, infinitely looping review slider with the
 * active card centred and raised.
 *
 * Renders nothing when there is nothing approved yet: an empty testimonials band with
 * a heading and no content looks broken, and on a new store that is the normal state
 * for a while.
 */
/**
 * Below this many reviews the strip is shown as a static centred row instead. A
 * carousel cycling two or three cards reads as broken rather than lively, and with so
 * few reviews they all fit on screen anyway.
 */
const MIN_TO_LOOP = 4

export default function Testimonials({ reviews }: { reviews: PublishedFeedback[] }) {
    const count = reviews?.length ?? 0
    const shouldLoop = count >= MIN_TO_LOOP

    // Three copies are rendered and `index` lives in the middle one, so there is always
    // a real card on both sides. Two copies looked seamless going forward but left an
    // empty gap to the left of the first card after each wrap.
    const [index, setIndex] = useState(count)
    const [animated, setAnimated] = useState(true)
    const [paused, setPaused] = useState(false)
    const [ready, setReady] = useState(false)
    const [metrics, setMetrics] = useState({ step: 0, cardWidth: 0, viewport: 0 })

    const trackRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)

    // Card width is responsive, so measure real elements rather than hard-coding.
    useLayoutEffect(() => {
        const track = trackRef.current
        const viewport = viewportRef.current
        if (!track || !viewport) return

        const measure = () => {
            const card = track.firstElementChild as HTMLElement | null
            if (!card) return
            const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0
            setMetrics({
                // offsetWidth ignores the scale transform, which is what we want:
                // layout position is unaffected by the active card being scaled.
                step: card.offsetWidth + gap,
                cardWidth: card.offsetWidth,
                viewport: viewport.clientWidth,
            })
            // Until this runs the offset is 0, so the very first positioning must not
            // animate — otherwise the strip visibly slides in from the left on load.
            setReady(true)
        }

        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(viewport)
        observer.observe(track)
        return () => observer.disconnect()
    }, [count])

    useEffect(() => {
        if (paused || !shouldLoop) return
        const timer = setInterval(() => setIndex(i => i + 1), AUTOPLAY_MS)
        return () => clearInterval(timer)
    }, [paused, shouldLoop])

    // Keep `index` inside the middle copy. Once a slide finishes outside that band,
    // shift by one whole set with the transition off: the card under the centre and
    // both its neighbours are identical either side of the jump, so nothing moves on
    // screen and the loop reads as continuous in both directions.
    useEffect(() => {
        if (!shouldLoop) return
        if (index >= count && index < count * 2) return

        const timer = setTimeout(() => {
            setAnimated(false)
            setIndex(i => (i >= count * 2 ? i - count : i + count))
        }, TRANSITION_MS)
        return () => clearTimeout(timer)
    }, [index, count, shouldLoop])

    // Re-enable the transition only after the browser has painted the snapped
    // position, otherwise the jump itself animates.
    useEffect(() => {
        if (animated) return
        const raf = requestAnimationFrame(() => setAnimated(true))
        return () => cancelAnimationFrame(raf)
    }, [animated])

    // Both directions just step; the effect above rebalances back into the middle
    // copy afterwards, so neither end ever runs out of cards.
    const next = useCallback(() => setIndex(i => i + 1), [])
    const prev = useCallback(() => setIndex(i => i - 1), [])

    const onKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); next() }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    }, [next, prev])

    if (count === 0) return null

    const rated = reviews.filter(r => r.rating !== null)
    const average = rated.length > 0
        ? rated.reduce((sum, r) => sum + (r.rating as number), 0) / rated.length
        : null

    // Three copies: one to the left, the live one, one to the right.
    const slides = [...reviews, ...reviews, ...reviews]
    const activeDot = ((index % count) + count) % count

    // Centre the active card rather than left-aligning the track, so the raised card
    // always sits in the middle with its neighbours peeking either side.
    const offset = metrics.viewport / 2 - metrics.cardWidth / 2 - index * metrics.step

    return (
        <section className="relative py-16 lg:py-24 bg-[#F1EFEB] overflow-hidden">
            {/* Raised panel behind the heading and the middle of the strip. The outer
                cards and the enlarged active card deliberately overflow it — that
                overlap is what creates the layered depth in the reference, so the panel
                stops short of the section's edges and of its own bottom. */}
            <div
                aria-hidden="true"
                className="absolute left-1/2 -translate-x-1/2 top-10 bottom-28 w-[min(1080px,88%)]
                           rounded-[2.5rem] bg-white/75 shadow-[0_24px_70px_-40px_rgba(45,27,27,0.35)]"
            />

            <div className="relative container mx-auto px-4 lg:px-8">
                <div className="relative text-center mb-1">
                    {/* Oversized decorative mark behind the heading. */}
                    <Quote
                        className="absolute left-1/2 -top-6 -translate-x-[190px] w-24 h-24 text-[#E8E4DC] rotate-180 hidden sm:block"
                        aria-hidden="true"
                        strokeWidth={1.5}
                    />

                    <h2 className="relative text-2xl lg:text-3xl font-playfair font-semibold text-[#1A1A1A]">
                        What our Customers say!
                    </h2>

                    {/* Accent rule: long bar plus a detached dash, as in the reference. */}
                    <div className="relative flex items-center justify-center gap-1.5 mt-4">
                        <span className="h-1 w-28 rounded-full bg-[#D29B6C]" />
                        <span className="h-1 w-3 rounded-full bg-[#D29B6C]/45" />
                    </div>

                    {average !== null && (
                        <div className="relative inline-flex items-center gap-3 mt-6 px-4 py-2 rounded-full bg-white border border-[#EBEBEB]">
                            <span className="text-lg font-semibold text-[#1A1A1A]">{average.toFixed(1)}</span>
                            <Stars value={Math.round(average)} size="w-4 h-4" />
                            <span className="text-sm text-[#717171]">
                                {rated.length} {rated.length === 1 ? 'review' : 'reviews'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {!shouldLoop ? (
                /* Too few to loop: lay them out as a centred row. Every card renders at
                   full size, since with nothing moving there is no "active" one to
                   distinguish and dimming any of them would look accidental. */
                <div className="relative z-10 container mx-auto px-4 lg:px-8 py-8">
                    <div className="flex flex-wrap items-stretch justify-center gap-6">
                        {reviews.map(review => (
                            <ReviewCard key={review.id} review={review} isActive />
                        ))}
                    </div>
                </div>
            ) : (
            <div
                className="relative z-10"
                role="region"
                aria-roledescription="carousel"
                aria-label="Customer reviews"
                tabIndex={0}
                onKeyDown={onKeyDown}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
            >
                <NavButton dir="prev" onClick={prev} />
                <NavButton dir="next" onClick={next} />

                {/* Vertical padding leaves room for the active card's scale and shadow
                    to breathe instead of being clipped by the overflow. */}
                <div ref={viewportRef} className="overflow-hidden py-8">
                    <div
                        ref={trackRef}
                        className="flex gap-5 w-max items-center"
                        style={{
                            transform: `translate3d(${offset}px, 0, 0)`,
                            transition: animated && ready
                                ? `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
                                : 'none',
                        }}
                    >
                        {slides.map((review, i) => (
                            <ReviewCard
                                key={`${i}-${review.id}`}
                                review={review}
                                isActive={i === index}
                                // Only the middle copy is real to assistive tech; the
                                // outer two exist so the loop always has neighbours.
                                ariaHidden={i < count || i >= count * 2}
                            />
                        ))}
                    </div>
                </div>

                {/* Narrower than before: the panel now provides most of the framing, so
                    these only need to soften the very edge of the viewport. */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-24 bg-gradient-to-r from-[#F1EFEB] to-transparent z-20" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-24 bg-gradient-to-l from-[#F1EFEB] to-transparent z-20" />
            </div>
            )}

            {shouldLoop && (
                <div className="relative z-10 flex items-center justify-center gap-2 mt-8">
                    {reviews.map((review, i) => (
                        <button
                            key={review.id}
                            type="button"
                            // Target the middle copy so the jump lands inside the safe
                            // band and doesn't trigger an immediate rebalance.
                            onClick={() => setIndex(count + i)}
                            aria-label={`Go to review ${i + 1}`}
                            aria-current={i === activeDot}
                            className={`h-2 rounded-full transition-all ${
                                i === activeDot ? 'w-6 bg-[#D29B6C]' : 'w-2 bg-[#E0E0E0] hover:bg-[#C9C9C9]'
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
