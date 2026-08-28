/**
 * Sanitising for user-submitted free text.
 *
 * IMPORTANT: calling these in the browser is a convenience, not a security boundary.
 * Anyone can POST straight to the endpoint and skip the form entirely, so whatever API
 * eventually stores this MUST call the same functions again server-side. Treat the
 * client pass as "keeps honest input tidy", never as "keeps attackers out".
 *
 * React escapes every string it renders, so stored text is already safe in ordinary
 * JSX. These rules are defence in depth for the cases where escaping is not automatic:
 * text reaching an HTML email body, a JSON-LD <script> block, a CSV export, or a log.
 */

/**
 * Field limits, shared by the public form, the admin editor and the API routes.
 *
 * These must agree everywhere. If a form lets someone type more than the server
 * accepts, the server silently truncates and the person loses the tail of what they
 * wrote with no warning — so both sides import these rather than hard-coding numbers.
 */
export const NAME_MAX = 80
export const MESSAGE_MAX = 200

// C0/C1 control characters and DEL. Never legitimate in typed prose, and they corrupt
// CSV exports, terminal output and log lines.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g

// Zero-width and bidirectional-override characters. Invisible, and used to make stored
// text read differently from what a moderator sees.
const INVISIBLE_CHARS = /[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g

// Tag-shaped sequences only — `<script>`, `<img ...>`, `</b>`. A letter or slash must
// follow `<` and the tag must actually close, so ordinary prose ("3 < 5", "a < b") is
// left untouched. An unclosed `<script` survives as literal text, which is harmless
// once escaped and preferable to mangling someone's sentence.
const HTML_TAG = /<\/?[a-zA-Z][^>]*>/g

// Dangerous URL schemes, in case feedback is ever linkified or embedded in an email.
const DANGEROUS_SCHEME = /\b(?:javascript|vbscript|data)\s*:/gi

/** Removes characters that are invisible, non-printable, or corrupt downstream output. */
function stripUnsafeChars(input: string): string {
    return input.replace(CONTROL_CHARS, '').replace(INVISIBLE_CHARS, '')
}

/**
 * Light pass safe to run on every keystroke. Only drops characters a person cannot
 * see anyway — running the full sanitiser here would fight the user mid-sentence.
 */
export function sanitizeWhileTyping(input: string, maxLength: number): string {
    return stripUnsafeChars(input).slice(0, maxLength)
}

/** Single-line fields: all whitespace collapses to single spaces. */
export function sanitizeLine(input: string, maxLength = 200): string {
    return stripUnsafeChars(input)
        .replace(HTML_TAG, '')
        .replace(DANGEROUS_SCHEME, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength)
}

/** Multi-line fields: newlines are meaningful, so only runs of blank lines collapse. */
export function sanitizeMultiline(input: string, maxLength = 2000): string {
    return stripUnsafeChars(input)
        .replace(HTML_TAG, '')
        .replace(DANGEROUS_SCHEME, '')
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map(line => line.replace(/[^\S\n]+/g, ' ').trimEnd())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .slice(0, maxLength)
}
