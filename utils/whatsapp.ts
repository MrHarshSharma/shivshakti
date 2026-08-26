// WhatsApp Cloud API — owner alerts for new orders.
//
// These env names deliberately omit the NEXT_PUBLIC_ prefix. Anything carrying it is
// inlined into the browser bundle, and a leaked token lets anyone send messages as the
// business. This module must only ever be imported from server code.

const GRAPH_VERSION = 'v21.0'

const TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const OWNER_NUMBER = process.env.OWNER_WHATSAPP_NUMBER
const ORDER_TEMPLATE = process.env.WHATSAPP_ORDER_TEMPLATE || 'new_order_alert'
const ORDER_TEMPLATE_LANG = process.env.WHATSAPP_ORDER_TEMPLATE_LANG || 'en'

/** Only the fields the alert actually uses; the insert returns plenty more. */
export interface OrderRow {
    id: number | string
    name?: string | null
}

/**
 * Template parameters may not contain newlines, tabs or runs of four-plus spaces —
 * Meta rejects the entire send with a 132000-series error if they do. Empty strings
 * are rejected too, hence the dash fallback.
 */
function clean(value: unknown): string {
    const text = String(value ?? '').replace(/\s+/g, ' ').trim()
    return text.slice(0, 900) || '-'
}

/** Cloud API wants a country code and no punctuation; orders often store 10 digits. */
function toE164(raw: string): string {
    const digits = String(raw).replace(/\D/g, '')
    return digits.length === 10 ? `91${digits}` : digits
}

/**
 * Sends an approved template. Returns false rather than throwing so a messaging
 * outage can never take down the caller.
 */
export async function sendWhatsAppTemplate(
    to: string,
    templateName: string,
    params: string[] = [],
    languageCode: string = ORDER_TEMPLATE_LANG,
): Promise<boolean> {
    if (!TOKEN || !PHONE_NUMBER_ID) {
        console.warn('WhatsApp not configured — set WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID')
        return false
    }

    // A template with no variables (the stock `hello_world`) must omit `components`
    // entirely; sending an empty parameter array is an error.
    const template: Record<string, unknown> = {
        name: templateName,
        language: { code: languageCode },
    }
    if (params.length > 0) {
        template.components = [{
            type: 'body',
            parameters: params.map(p => ({ type: 'text', text: clean(p) })),
        }]
    }

    try {
        const res = await fetch(
            `https://graph.facebook.com/${GRAPH_VERSION}/${PHONE_NUMBER_ID}/messages`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: toE164(to),
                    type: 'template',
                    template,
                }),
                // Never let a hanging request stall the order response.
                signal: AbortSignal.timeout(8000),
            },
        )

        if (!res.ok) {
            // Meta puts the actionable detail in the body, not the status line.
            console.error('WhatsApp send failed', res.status, await res.text())
            return false
        }
        return true
    } catch (err) {
        console.error('WhatsApp send threw', err)
        return false
    }
}

/**
 * Alerts the shop owner that a new paid order has landed.
 *
 * Two variables, in this order: {{1}} customer name, {{2}} order id. They are positional
 * — swapping them here without editing the approved template silently sends the id as
 * the name and vice versa.
 *
 * Free-form text is not an option: WhatsApp only allows arbitrary text inside a 24 hour
 * window opened by the recipient messaging us first, which an automated alert cannot
 * rely on, so this goes out as an approved template instead.
 */
export async function notifyOwnerOfNewOrder(order: OrderRow): Promise<boolean> {
    if (!OWNER_NUMBER) {
        console.warn('WhatsApp owner alert skipped — OWNER_WHATSAPP_NUMBER not set')
        return false
    }

    return sendWhatsAppTemplate(OWNER_NUMBER, ORDER_TEMPLATE, [
        order.name || 'Unknown',
        String(order.id),
    ])
}
