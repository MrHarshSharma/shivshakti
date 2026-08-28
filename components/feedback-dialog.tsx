'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquareHeart, Star, X, Check, Loader2 } from 'lucide-react'
import {
    sanitizeLine, sanitizeMultiline, sanitizeWhileTyping, NAME_MAX, MESSAGE_MAX,
} from '@/utils/sanitize'
import { FEEDBACK_MAX, FEEDBACK_WINDOW_MS } from '@/utils/rate-limit'

const SUBMIT_LOG_KEY = 'shivshakti:feedback-submits'

/**
 * Submission timestamps kept in this browser. Purely to save a doomed round trip and
 * give an instant answer — the server enforces the real limit per IP, and anyone can
 * clear storage or use another browser. Never treat this as the control.
 */
function recentSubmissions(): number[] {
    try {
        const raw = window.localStorage.getItem(SUBMIT_LOG_KEY)
        const times: unknown = raw ? JSON.parse(raw) : []
        if (!Array.isArray(times)) return []
        const now = Date.now()
        return times.filter((t): t is number => typeof t === 'number' && now - t < FEEDBACK_WINDOW_MS)
    } catch {
        // Private browsing and blocked site data both throw here; fall back to letting
        // the request through, since the server is the one that actually decides.
        return []
    }
}

function recordSubmission() {
    try {
        const times = [...recentSubmissions(), Date.now()]
        window.localStorage.setItem(SUBMIT_LOG_KEY, JSON.stringify(times))
    } catch {
        /* storage unavailable — server-side limit still applies */
    }
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

interface FeedbackDialogProps {
    /** Styling for the trigger, so the same dialog can be opened from a footer link or a button. */
    triggerClassName?: string
    triggerLabel?: string
}

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent']

/**
 * Feedback capture. Self-contained: owns its own open state so it can be dropped
 * anywhere without a provider.
 *
 * NOTE: submissions are not persisted yet — `submitFeedback` below is a stub that
 * resolves without storing anything. Swap it for the real call once the table exists.
 */
export default function FeedbackDialog({
    triggerClassName = '',
    triggerLabel = 'Share Feedback',
}: FeedbackDialogProps) {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState<Status>('idle')
    const [error, setError] = useState('')

    const nameRef = useRef<HTMLInputElement>(null)

    // Shareable link: ?feedback=open pops the form on whatever page it is appended to,
    // so a "how did we do?" message can point straight at it.
    //
    // Read from window rather than useSearchParams deliberately. This component lives in
    // the footer, and useSearchParams would pull the entire footer out of the prerendered
    // HTML — taking the internal links to /products, /about and the policy pages with it.
    // A shared link is always a fresh page load, so a mount-only read is sufficient.
    //
    // The param is stripped once consumed: otherwise closing the form and refreshing
    // reopens it, and the customer is left with a messy URL in their address bar.
    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('feedback') !== 'open') return

        setOpen(true)
        const url = new URL(window.location.href)
        url.searchParams.delete('feedback')
        window.history.replaceState({}, '', url.pathname + url.search + url.hash)
    }, [])

    // Escape to close, and lock body scroll so the page behind doesn't drift.
    useEffect(() => {
        if (!open) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('keydown', onKeyDown)

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = previousOverflow
        }
    }, [open])

    // Focus the first field so the form is usable without reaching for the mouse.
    useEffect(() => {
        if (open && status === 'idle') {
            const t = setTimeout(() => nameRef.current?.focus(), 120)
            return () => clearTimeout(t)
        }
    }, [open, status])

    function resetAfterClose() {
        // Delayed so the form doesn't visibly wipe during the exit animation.
        setTimeout(() => {
            setRating(0)
            setHoverRating(0)
            setName('')
            setMessage('')
            setStatus('idle')
            setError('')
        }, 250)
    }

    function close() {
        setOpen(false)
        resetAfterClose()
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        // Full sanitising pass at submit rather than per keystroke, so nothing fights
        // the user mid-sentence. The API must repeat this — the browser is not a
        // security boundary, and a direct POST skips everything here.
        const trimmedName = sanitizeLine(name, NAME_MAX)
        const trimmed = sanitizeMultiline(message, MESSAGE_MAX)

        // Checked in the order the fields appear, so the message always points at the
        // first thing that needs attention rather than the last.
        if (rating < 1) {
            setError('Please choose a star rating.')
            return
        }
        if (trimmedName.length < 2) {
            setError('Please tell us your name.')
            nameRef.current?.focus()
            return
        }
        if (trimmed.length < 5) {
            setError('Please tell us a little more — at least a few words.')
            return
        }
        if (recentSubmissions().length >= FEEDBACK_MAX) {
            setError(`You've sent ${FEEDBACK_MAX} messages recently. Please try again later.`)
            return
        }

        setError('')
        setStatus('sending')

        try {
            await submitFeedback({
                rating,
                name: trimmedName,
                message: trimmed,
                page: typeof window !== 'undefined' ? window.location.pathname : null,
            })
            recordSubmission()
            setStatus('sent')
        } catch (err) {
            console.error('Feedback submission failed', err)
            // Back to 'idle' rather than 'error': the form stays on screen with its
            // contents intact so the message can be resent, instead of stranding the
            // customer on a dead end after they typed something out.
            setStatus('idle')
            setError(err instanceof Error && err.message
                ? err.message
                : 'Could not send your feedback. Please try again.')
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={triggerClassName || 'inline-flex items-center gap-2 text-sm text-[#717171] hover:text-[#D29B6C] transition-colors'}
            >
                <MessageSquareHeart className="w-4 h-4 flex-shrink-0" />
                {triggerLabel}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                    >
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={close}
                            aria-hidden="true"
                        />

                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="feedback-title"
                            className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto"
                            initial={{ y: 24, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 24, opacity: 0, scale: 0.98 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                        >
                            <button
                                type="button"
                                onClick={close}
                                aria-label="Close feedback form"
                                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#717171] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {status === 'sent' ? (
                                <div className="px-6 py-12 text-center">
                                    <div className="w-14 h-14 rounded-full bg-[#E8F5EF] flex items-center justify-center mx-auto mb-5">
                                        <Check className="w-7 h-7 text-[#0A8A50]" />
                                    </div>
                                    <h2 id="feedback-title" className="text-xl mb-2">Thank you</h2>
                                    <p className="text-sm text-[#717171] mb-7 max-w-xs mx-auto">
                                        Your feedback helps us make Shivshakti better for everyone.
                                    </p>
                                    <button type="button" onClick={close} className="btn-primary px-6 py-2.5 rounded-xl text-sm">
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="px-6 pt-6 pb-6">
                                    <h2 id="feedback-title" className="text-xl mb-1 pr-8">Share your feedback</h2>
                                    <p className="text-sm text-[#717171] mb-6">
                                        Tell us what you loved, or what we could do better.
                                    </p>

                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                            How was your experience? <span className="text-[#D0021B]">*</span>
                                        </label>
                                        <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
                                            {[1, 2, 3, 4, 5].map(value => {
                                                const active = value <= (hoverRating || rating)
                                                return (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        onClick={() => setRating(value === rating ? 0 : value)}
                                                        onMouseEnter={() => setHoverRating(value)}
                                                        aria-label={`${value} star${value > 1 ? 's' : ''}`}
                                                        aria-pressed={value === rating}
                                                        className="p-1 rounded transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            className={`w-7 h-7 transition-colors ${active ? 'text-[#D29B6C]' : 'text-[#E0E0E0]'}`}
                                                            fill={active ? 'currentColor' : 'none'}
                                                        />
                                                    </button>
                                                )
                                            })}
                                            <span className="ml-2 text-sm text-[#717171] min-w-[70px]">
                                                {RATING_LABELS[hoverRating || rating] || ''}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="feedback-name" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                            Your name <span className="text-[#D0021B]">*</span>
                                        </label>
                                        <input
                                            id="feedback-name"
                                            ref={nameRef}
                                            type="text"
                                            value={name}
                                            onChange={e => setName(sanitizeWhileTyping(e.target.value, NAME_MAX))}
                                            maxLength={NAME_MAX}
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label htmlFor="feedback-message" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                            Your feedback <span className="text-[#D0021B]">*</span>
                                        </label>
                                        <textarea
                                            id="feedback-message"
                                            value={message}
                                            onChange={e => setMessage(sanitizeWhileTyping(e.target.value, MESSAGE_MAX))}
                                            rows={4}
                                            maxLength={MESSAGE_MAX}
                                            placeholder="What stood out? Anything we could improve?"
                                            className="resize-none"
                                        />
                                        <div className="mt-1 text-right text-xs text-[#9B9B9B]">
                                            {message.length}/{MESSAGE_MAX}
                                        </div>
                                    </div>

                                    {error && (
                                        <p role="alert" className="mb-4 text-sm text-[#D0021B]">{error}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {status === 'sending' ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Sending…
                                            </>
                                        ) : 'Submit Feedback'}
                                    </button>

                                    <p className="mt-3 text-xs text-[#9B9B9B] text-center">
                                        We read every message. Your name may be shown if we
                                        feature your feedback on the site.
                                    </p>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export interface FeedbackPayload {
    /** 1-5. Required on the public form; admin-entered rows may still have none. */
    rating: number
    name: string
    message: string
    page: string | null
}

/**
 * The endpoint re-sanitises and re-validates everything sent here — this call is a
 * convenience, not the boundary. Submissions land unpublished and stay invisible on
 * the storefront until an admin approves them in /admin/feedback.
 */
async function submitFeedback(payload: FeedbackPayload): Promise<void> {
    const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        const detail = await res.json().catch(() => null)
        // 429 carries a message written for the customer, so surface it as-is.
        throw new Error(detail?.error || `Feedback request failed (${res.status})`)
    }
}
