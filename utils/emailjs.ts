import emailjs from '@emailjs/browser'
import { renderToStaticMarkup } from 'react-dom/server'
import { OrderReceivedEmail } from '@/components/email/order-received'
import { OrderAcceptedEmail } from '@/components/email/order-accepted'
import { OrderDeliveredEmail } from '@/components/email/order-delivered'
import { CustomerOrderCancelledEmail } from '@/components/email/customer-order-cancelled'
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
    from_name?: string
    reply_to?: string
    mode?: string
}

export async function sendOrderReceivedEmail(data: OrderEmailData): Promise<boolean> {
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
            React.createElement(OrderReceivedEmail, { ...data, mode: data.mode })
        )

        const templateParams = {
            name: data.name,
            order_id: data.order_id,
            message_html: messageHtml, // Send the rendered HTML
            orders: data.orders, // Pass the array of orders for {{#orders}} loop
            cost: data.cost, // Pass the cost object for {{cost.shipping}}, etc.
            from_name: data.from_name || 'Shivshakti',
            reply_to: data.reply_to || process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
            to_email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || '', // Send to admin, not customer
            subject: `Order Received #${data.order_id} - Shivshakti`
        }

        await emailjs.send(
            serviceId,
            templateId,
            templateParams,
            publicKey
        )

        console.log('Order received email sent successfully')
        return true
    } catch (error) {
        console.error('Failed to send order received email:', error)
        return false
    }
}

export async function sendOrderAcceptedEmail(data: {
    name: string;
    order_id: number;
    email: string;
    phone?: string;
    address?: string;
    orders?: Array<{
        name: string;
        price: number;
        units: number;
        image?: string;
    }>;
    cost?: {
        total: number;
        subtotal?: number;
        discount?: number;
        shipping?: number;
        tax?: number;
    };
}): Promise<boolean> {
    try {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

        if (!serviceId || !templateId || !publicKey) return false

        const messageHtml = renderToStaticMarkup(
            React.createElement(OrderAcceptedEmail, {
                name: data.name,
                order_id: data.order_id,
                phone: data.phone,
                address: data.address,
                orders: data.orders,
                cost: data.cost
            })
        )

        const templateParams = {
            name: data.name,
            order_id: data.order_id,
            message_html: messageHtml,
            to_email: data.email,
            subject: `Order #${data.order_id} Accepted - Shivshakti`,
            from_name: 'Shivshakti',
            reply_to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
        }

        console.log('Sending Accepted Email Params:', JSON.stringify(templateParams, null, 2))

        await emailjs.send(serviceId, templateId, templateParams, publicKey)
        return true
    } catch (error) {
        console.error('Failed to send accepted email:', error)
        return false
    }
}

export async function sendOrderDeliveredEmail(data: {
    name: string;
    order_id: number;
    email: string;
    phone?: string;
    address?: string;
    orders?: Array<{
        name: string;
        price: number;
        units: number;
        image?: string;
    }>;
    cost?: {
        total: number;
        subtotal?: number;
        discount?: number;
        shipping?: number;
        tax?: number;
    };
}): Promise<boolean> {
    try {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

        if (!serviceId || !templateId || !publicKey) return false

        const messageHtml = renderToStaticMarkup(
            React.createElement(OrderDeliveredEmail, {
                name: data.name,
                order_id: data.order_id,
                phone: data.phone,
                address: data.address,
                orders: data.orders,
                cost: data.cost
            })
        )

        const templateParams = {
            name: data.name,
            order_id: data.order_id,
            message_html: messageHtml,
            to_email: data.email,
            subject: `Order #${data.order_id} Delivered - Shivshakti`,
            from_name: 'Shivshakti',
            reply_to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
        }

        await emailjs.send(serviceId, templateId, templateParams, publicKey)
        return true
    } catch (error) {
        console.error('Failed to send delivered email:', error)
        return false
    }
}

export async function sendCustomerCancellationEmail(data: {
    name: string;
    order_id: number;
    email: string;
    phone?: string;
    address?: string;
    orders?: Array<{
        name: string;
        price: number;
        units: number;
        image?: string;
    }>;
    cost?: {
        total: number;
        subtotal?: number;
        discount?: number;
        shipping?: number;
        tax?: number;
    };
}): Promise<boolean> {
    try {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

        if (!serviceId || !templateId || !publicKey) return false

        const messageHtml = renderToStaticMarkup(
            React.createElement(CustomerOrderCancelledEmail, {
                name: data.name,
                order_id: data.order_id,
                phone: data.phone,
                address: data.address,
                orders: data.orders,
                cost: data.cost
            })
        )

        const templateParams = {
            name: data.name,
            order_id: data.order_id,
            message_html: messageHtml,
            to_email: data.email,
            subject: `Order #${data.order_id} Cancelled - Shivshakti`,
            from_name: 'Shivshakti',
            reply_to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
        }

        console.log('Sending Customer Cancellation Email:', JSON.stringify(templateParams, null, 2))

        await emailjs.send(serviceId, templateId, templateParams, publicKey)
        return true
    } catch (error) {
        console.error('Failed to send customer cancellation email:', error)
        return false
    }
}
