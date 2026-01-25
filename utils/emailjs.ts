import emailjs from '@emailjs/browser'

interface OrderEmailData {
    name: string
    order_id: number
    orders: Array<{
        name: string
        price: number
        units: number
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

        const templateParams = {
            name: data.name,
            order_id: data.order_id,
            orders: data.orders,
            'cost.total': data.cost.total,
            'cost.subtotal': data.cost.subtotal || data.cost.total,
            'cost.discount': data.cost.discount || 0,
            'cost.shipping': data.cost.shipping || 0,
            'cost.tax': data.cost.tax || 0,
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
