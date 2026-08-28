'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { NAME_MAX, MESSAGE_MAX } from '@/utils/sanitize'
import {
    ArrowLeft,
    Loader2,
    Star,
    Eye,
    EyeOff,
    Trash2,
    AlertCircle,
    MessageSquareHeart,
    Plus,
    Pencil,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'

interface Feedback {
    id: number
    created_at: string
    name: string
    rating: number | null
    message: string
    page: string | null
    is_published: boolean
    published_at: string | null
}

type Filter = 'all' | 'pending' | 'published'

interface DraftState {
    /** null = creating a new entry; otherwise the row being edited. */
    editing: Feedback | null
    name: string
    rating: number
    message: string
    isPublished: boolean
}

const PER_PAGE = 20

const EMPTY_DRAFT: DraftState = {
    editing: null,
    name: '',
    rating: 0,
    message: '',
    isPublished: false,
}

export default function FeedbackManagement() {
    const [feedback, setFeedback] = useState<Feedback[]>([])
    const [filter, setFilter] = useState<Filter>('all')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    // Per-row so one slow request doesn't disable every button on the page.
    const [busyId, setBusyId] = useState<number | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

    const [draft, setDraft] = useState<DraftState | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [draftError, setDraftError] = useState<string | null>(null)

    const load = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(PER_PAGE) })
            if (filter !== 'all') params.set('filter', filter)

            const res = await fetch(`/api/feedback?${params}`)
            const data = await res.json()
            if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load feedback')

            setFeedback(data.feedback || [])
            setTotal(data.total ?? 0)
            setTotalPages(data.totalPages ?? 1)

            // Deleting the last row on the final page leaves it empty; step back rather
            // than showing "no entries" on a page that no longer exists.
            if (page > (data.totalPages ?? 1)) setPage(data.totalPages ?? 1)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load feedback')
        } finally {
            setIsLoading(false)
        }
    }, [filter, page])

    useEffect(() => { load() }, [load])

    // Page 3 of "all" is rarely page 3 of "pending", so switching filters restarts.
    useEffect(() => { setPage(1) }, [filter])

    async function togglePublished(item: Feedback) {
        setBusyId(item.id)
        setError(null)
        try {
            const res = await fetch(`/api/feedback/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_published: !item.is_published }),
            })
            const data = await res.json()
            if (!res.ok || !data.success) throw new Error(data.error || 'Update failed')

            // Patch in place rather than refetching, so the list doesn't jump under
            // the cursor while the admin is working through it.
            setFeedback(prev => prev.map(f => (f.id === item.id ? data.feedback : f)))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed')
        } finally {
            setBusyId(null)
        }
    }

    async function remove(id: number) {
        setBusyId(id)
        setError(null)
        try {
            const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (!res.ok || !data.success) throw new Error(data.error || 'Delete failed')
            setConfirmDeleteId(null)
            // Refetch rather than splicing locally: with pagination the gap should be
            // filled by the first row of the next page, which we don't hold.
            await load()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed')
        } finally {
            setBusyId(null)
        }
    }

    function openCreate() {
        setDraftError(null)
        setDraft({ ...EMPTY_DRAFT })
    }

    function openEdit(item: Feedback) {
        setDraftError(null)
        setDraft({
            editing: item,
            name: item.name,
            rating: item.rating ?? 0,
            message: item.message,
            isPublished: item.is_published,
        })
    }

    async function saveDraft(e: React.FormEvent) {
        e.preventDefault()
        if (!draft) return

        if (draft.name.trim().length < 2) return setDraftError('Name is required.')
        if (draft.message.trim().length < 5) return setDraftError('Feedback is too short.')

        setDraftError(null)
        setIsSaving(true)
        try {
            const payload = {
                name: draft.name.trim(),
                message: draft.message.trim(),
                rating: draft.rating || null,
                is_published: draft.isPublished,
            }

            // Edits PATCH the row; new entries PUT to the collection, because POST on
            // that path is the public submit route and always forces unpublished.
            const res = draft.editing
                ? await fetch(`/api/feedback/${draft.editing.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
                : await fetch('/api/feedback', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })

            const data = await res.json()
            if (!res.ok || !data.success) throw new Error(data.error || 'Save failed')

            setDraft(null)
            if (draft.editing) {
                // Patch in place so the list doesn't jump under the cursor.
                setFeedback(prev => prev.map(f => (f.id === draft.editing!.id ? data.feedback : f)))
            } else {
                // Newest first, so a new entry belongs at the top of page 1. Jumping
                // there is the only way the admin actually sees what they just added.
                if (page === 1) await load()
                else setPage(1)
            }
        } catch (err) {
            setDraftError(err instanceof Error ? err.message : 'Save failed')
        } finally {
            setIsSaving(false)
        }
    }

    const firstOnPage = (page - 1) * PER_PAGE + 1
    const lastOnPage = (page - 1) * PER_PAGE + feedback.length

    return (
        <div className="min-h-screen bg-[#F8F8F8] py-8">
            <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-sm text-[#717171] hover:text-[#D29B6C] transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-playfair font-semibold text-[#1A1A1A]">
                            Customer Feedback
                        </h1>
                        <p className="text-sm text-[#717171] mt-1">
                            Published feedback appears in “What People Say” on the homepage.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-white rounded-xl border border-[#EBEBEB] p-1">
                            {(['all', 'pending', 'published'] as Filter[]).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                                        filter === f
                                            ? 'bg-[#D29B6C] text-white'
                                            : 'text-[#717171] hover:text-[#1A1A1A]'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={openCreate}
                            className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-[#D0021B]">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-24 text-[#717171]">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : feedback.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] py-20 text-center">
                        <MessageSquareHeart className="w-10 h-10 text-[#E0E0E0] mx-auto mb-4" />
                        <p className="text-[#1A1A1A] font-medium mb-1">Nothing here yet</p>
                        <p className="text-sm text-[#717171]">
                            {filter === 'all'
                                ? 'Feedback submitted from the site will appear here.'
                                : `No ${filter} feedback.`}
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-[#717171] mb-4">
                            {/* A per-page "N published" tally would be misleading once
                                rows spill onto later pages, so this reports the range
                                and the filtered total instead. */}
                            Showing {firstOnPage}–{lastOnPage} of {total}{' '}
                            {total === 1 ? 'entry' : 'entries'}
                        </p>

                        <div className="space-y-4">
                            {feedback.map(item => (
                                <div
                                    key={item.id}
                                    className={`bg-white rounded-2xl border p-5 transition-colors ${
                                        item.is_published ? 'border-[#E0B08A]' : 'border-[#EBEBEB]'
                                    }`}
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-full bg-[#EBDDC4] flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-semibold text-[#B8845A]">
                                                    {item.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-[#1A1A1A] truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-[#9B9B9B]">
                                                    {new Date(item.created_at).toLocaleString('en-IN', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    })}
                                                    {item.page && ` · from ${item.page}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {item.is_published && (
                                                <span className="badge badge-primary">Live</span>
                                            )}
                                            {item.rating !== null && (
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(v => (
                                                        <Star
                                                            key={v}
                                                            className={`w-3.5 h-3.5 ${v <= item.rating! ? 'text-[#D29B6C]' : 'text-[#E0E0E0]'}`}
                                                            fill={v <= item.rating! ? 'currentColor' : 'none'}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-line mb-4">
                                        {item.message}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#F3F3F3]">
                                        <button
                                            onClick={() => togglePublished(item)}
                                            disabled={busyId === item.id}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-60 ${
                                                item.is_published
                                                    ? 'btn-secondary'
                                                    : 'btn-primary'
                                            }`}
                                        >
                                            {busyId === item.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : item.is_published ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                            {item.is_published ? 'Hide from site' : 'Show on site'}
                                        </button>

                                        <button
                                            onClick={() => openEdit(item)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#717171] hover:text-[#D29B6C] transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </button>

                                        {confirmDeleteId === item.id ? (
                                            <>
                                                <button
                                                    onClick={() => remove(item.id)}
                                                    disabled={busyId === item.id}
                                                    className="px-4 py-2 rounded-lg text-sm bg-[#D0021B] text-white disabled:opacity-60"
                                                >
                                                    Confirm delete
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(null)}
                                                    className="px-4 py-2 rounded-lg text-sm text-[#717171] hover:text-[#1A1A1A]"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setConfirmDeleteId(item.id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#717171] hover:text-[#D0021B] transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || isLoading}
                                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#4A4A4A]
                                               border border-[#EBEBEB] bg-white hover:border-[#E0B08A]
                                               disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Prev
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        disabled={isLoading}
                                        aria-current={p === page ? 'page' : undefined}
                                        className={`w-9 h-9 rounded-lg text-sm transition-colors ${
                                            p === page
                                                ? 'bg-[#D29B6C] text-white'
                                                : 'bg-white border border-[#EBEBEB] text-[#4A4A4A] hover:border-[#E0B08A]'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages || isLoading}
                                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#4A4A4A]
                                               border border-[#EBEBEB] bg-white hover:border-[#E0B08A]
                                               disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {draft && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => !isSaving && setDraft(null)}
                        aria-hidden="true"
                    />

                    <form
                        onSubmit={saveDraft}
                        role="dialog"
                        aria-modal="true"
                        aria-label={draft.editing ? 'Edit feedback' : 'Add feedback'}
                        className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-lg
                                   max-h-[90vh] overflow-y-auto px-6 pt-6 pb-6"
                    >
                        <button
                            type="button"
                            onClick={() => setDraft(null)}
                            disabled={isSaving}
                            aria-label="Close"
                            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#717171] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h2 className="text-xl mb-1 pr-8">
                            {draft.editing ? 'Edit feedback' : 'Add feedback'}
                        </h2>
                        <p className="text-sm text-[#717171] mb-6">
                            {draft.editing
                                ? 'Corrections are saved to the original entry.'
                                : 'For reviews received by phone or WhatsApp.'}
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Rating</label>
                            <div className="flex items-center gap-1.5">
                                {[1, 2, 3, 4, 5].map(v => (
                                    <button
                                        key={v}
                                        type="button"
                                        // Clicking the current value clears it — rating is
                                        // optional and there must be a way back to none.
                                        onClick={() => setDraft(d => d && ({ ...d, rating: d.rating === v ? 0 : v }))}
                                        aria-label={`${v} star${v > 1 ? 's' : ''}`}
                                        className="p-1 rounded transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-6 h-6 ${v <= draft.rating ? 'text-[#D29B6C]' : 'text-[#E0E0E0]'}`}
                                            fill={v <= draft.rating ? 'currentColor' : 'none'}
                                        />
                                    </button>
                                ))}
                                {draft.rating > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setDraft(d => d && ({ ...d, rating: 0 }))}
                                        className="ml-2 text-xs text-[#9B9B9B] hover:text-[#717171]"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="draft-name" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                Name <span className="text-[#D0021B]">*</span>
                            </label>
                            <input
                                id="draft-name"
                                type="text"
                                value={draft.name}
                                onChange={e => setDraft(d => d && ({ ...d, name: e.target.value }))}
                                maxLength={NAME_MAX}
                                placeholder="Customer name"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="draft-message" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                Feedback <span className="text-[#D0021B]">*</span>
                            </label>
                            <textarea
                                id="draft-message"
                                value={draft.message}
                                onChange={e => setDraft(d => d && ({ ...d, message: e.target.value }))}
                                rows={5}
                                maxLength={MESSAGE_MAX}
                                placeholder="What did they say?"
                                className="resize-none"
                            />
                            <div className="mt-1 text-right text-xs text-[#9B9B9B]">
                                {draft.message.length}/{MESSAGE_MAX}
                            </div>
                        </div>

                        <label className="flex items-center gap-3 mb-5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={draft.isPublished}
                                onChange={e => setDraft(d => d && ({ ...d, isPublished: e.target.checked }))}
                                className="w-4 h-4 accent-[#D29B6C]"
                            />
                            <span className="text-sm text-[#4A4A4A]">Show on site straight away</span>
                        </label>

                        {draftError && (
                            <p role="alert" className="mb-4 text-sm text-[#D0021B]">{draftError}</p>
                        )}

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="btn-primary flex-1 py-3 rounded-xl text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {draft.editing ? 'Save changes' : 'Add feedback'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setDraft(null)}
                                disabled={isSaving}
                                className="btn-secondary px-5 py-3 rounded-xl text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
