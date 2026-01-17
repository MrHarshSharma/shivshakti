// Razorpay utility functions and type definitions

export interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description: string
    order_id: string
    prefill?: {
        name?: string
        email?: string
        contact?: string
    }
    theme?: {
        color?: string
    }
    handler: (response: RazorpayResponse) => void
    modal?: {
        ondismiss?: () => void
    }
}

export interface RazorpayResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
}

export interface RazorpayInstance {
    open: () => void
    on: (event: string, callback: (response: any) => void) => void
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance
    }
}

/**
 * Load Razorpay checkout script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        // Check if script is already loaded
        if (window.Razorpay) {
            resolve(true)
            return
        }

        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}
