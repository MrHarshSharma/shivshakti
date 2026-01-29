import emailjs from '@emailjs/browser'
import { renderToStaticMarkup } from 'react-dom/server'
import { OrderConfirmationEmail } from '@/components/email/order-confirmation'
import React from 'react'

interface OrderEmailData {
    name: string
    order_id: number
    orders: Array<{
        name: string
        price: number
        units: number
        image?: string
    }>
    cost: {
        total: number
        subtotal?: number
        discount?: number
        shipping?: number
        tax?: number
    }
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
    try {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

        if (!serviceId || !templateId || !publicKey) {
            console.error('EmailJS credentials not configured')
            return false
        }

        // Render the email component to HTML string
        const messageHtml = renderToStaticMarkup(
            React.createElement(OrderConfirmationEmail, data)
        )

        const templateParams = {
            name: data.name,
            order_id: data.order_id,
            message_html: messageHtml, // Send the rendered HTML
            orders: data.orders, // Pass the array of orders for {{#orders}} loop
            cost: data.cost, // Pass the cost object for {{cost.shipping}}, etc.
        }

        await emailjs.send(
            serviceId,
            templateId,
            templateParams,
            publicKey
        )

        console.log('Order confirmation email sent successfully')
        return true
    } catch (error) {
        console.error('Failed to send order confirmation email:', error)
        return false
    }
}
