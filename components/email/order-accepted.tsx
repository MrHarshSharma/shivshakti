import React from 'react'

interface OrderAcceptedEmailProps {
    name: string
    order_id: number
    date?: string
}

export const OrderAcceptedEmail: React.FC<OrderAcceptedEmailProps> = ({
    name,
    order_id,
    date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
}) => {
    return (
        <div style={{
            backgroundColor: '#FEFBF5',
            fontFamily: '"Playfair Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
            padding: '40px 0',
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                margin: '0 auto',
                padding: '0',
                maxWidth: '600px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid #FFF7ED',
            }}>
                {/* Header */}
                <div style={{
                    backgroundColor: '#2D1B1B',
                    padding: '40px 0',
                    textAlign: 'center',
                }}>
                    {/* Logo */}
                    <img
                        src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
                        alt="Shivshakti"
                        style={{
                            width: '120px',
                            height: 'auto',
                            marginBottom: '10px',
                            display: 'inline-block',
                        }}
                    />
                    <p style={{
                        color: '#ffffff',
                        fontSize: '12px',
                        letterSpacing: '2px',
                        marginTop: '8px',
                        textTransform: 'uppercase',
                        opacity: 0.8,
                        margin: 0
                    }}>Tradition & Quality</p>
                </div>

                {/* Content */}
                <div style={{ padding: '40px' }}>
                    <h2 style={{
                        fontSize: '24px',
                        color: '#2D1B1B',
                        margin: '0 0 20px',
                        fontWeight: 'bold',
                    }}>Namaste {name},</h2>
                    <p style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#4A3737',
                        margin: '0 0 20px',
                    }}>
                        Great news! We have accepted your order <strong>#{order_id}</strong> and it is now being prepared with care.
                    </p>

                    <div style={{
                        backgroundColor: '#FEFBF5',
                        padding: '30px',
                        borderRadius: '8px',
                        margin: '30px 0',
                        border: '1px solid #FED7AA',
                        textAlign: 'center',
                    }}>
                        <h3 style={{
                            color: '#D97706',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            fontWeight: 'bold',
                            margin: '0 0 10px',
                            fontSize: '18px'
                        }}>Status Update</h3>
                        <p style={{
                            fontSize: '24px',
                            color: '#2D1B1B',
                            fontWeight: 'bold',
                            margin: '0',
                            fontFamily: '"Cinzel", serif',
                        }}>Processing</p>
                    </div>

                    <p style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#4A3737',
                        margin: '20px 0 0',
                    }}>
                        We will notify you again once your order is out for delivery. Thank you for choosing Shivshakti.
                    </p>
                </div>

                {/* Footer */}
                <div style={{
                    backgroundColor: '#2D1B1B',
                    padding: '30px',
                    textAlign: 'center',
                }}>
                    <p style={{
                        fontSize: '12px',
                        color: '#9CA3AF',
                        lineHeight: '1.5',
                        margin: '0 0 10px',
                    }}>
                        &copy; {new Date().getFullYear()} Shivshakti Provision. All rights reserved.
                    </p>
                    <p style={{
                        fontSize: '12px',
                        color: '#9CA3AF',
                        lineHeight: '1.5',
                        margin: '0',
                    }}>
                        If you have any questions, please contact us at shivshaktiprovision18@gmail.com
                    </p>
                </div>
            </div>
        </div>
    )
}
