import { OrderCancelledEmail } from '@/components/email/order-cancelled'
import React from 'react'

export interface CancelEmailData {
    order_id: number
    user_email: string
    reason?: string
}

export async function sendOrderCancellationEmail(data: CancelEmailData): Promise<boolean> {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
        console.error('EmailJS credentials not configured')
        return false
    }

    const { renderToStaticMarkup } = await import('react-dom/server')
    const messageHtml = renderToStaticMarkup(
        React.createElement(OrderCancelledEmail, {
            order_id: data.order_id,
            user_email: data.user_email,
            reason: data.reason
        })
    )

    const templateParams = {
        name: 'Admin',
        to_email: (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').split(',')[0], // Send to primary admin
        order_id: data.order_id,
        message_html: messageHtml,
        subject: `Cancelled by User - Order #${data.order_id}`
    }

    const privateKey = process.env.NEXT_PUBLIC_EMAILJS_PRIVATE_KEY

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                service_id: serviceId,
                template_id: templateId,
                user_id: publicKey,
                accessToken: privateKey, // Required because "Use Private Key" is enabled
                template_params: templateParams,
            }),
        })

        if (!response.ok) {
            const text = await response.text()
            console.error('EmailJS API Error:', text)
            return false
        }

        console.log('Order cancellation email sent successfully via REST API')
        return true
    } catch (error) {
        console.error('Failed to send order cancellation email:', error)
        return false
    }
}
