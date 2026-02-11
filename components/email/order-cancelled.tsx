import React from 'react'

interface OrderCancelledEmailProps {
    order_id: number
    user_email: string
    reason?: string
    date?: string
}

export const OrderCancelledEmail: React.FC<OrderCancelledEmailProps> = ({
    order_id,
    user_email,
    reason,
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
                            width: '80px',
                            height: 'auto',
                            marginBottom: '15px',
                            display: 'inline-block',
                        }}
                    />
                    <h1 style={{
                        color: '#ef4444',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        margin: '0',
                        letterSpacing: '4px',
                        fontFamily: '"Cinzel", serif',
                        textTransform: 'uppercase',
                    }}>Order Cancelled</h1>
                    <p style={{
                        color: '#ffffff',
                        fontSize: '12px',
                        letterSpacing: '2px',
                        marginTop: '8px',
                        textTransform: 'uppercase',
                        opacity: 0.8,
                        margin: 0
                    }}>Action Required</p>
                </div>

                {/* Content */}
                <div style={{ padding: '40px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        color: '#2D1B1B',
                        margin: '0 0 20px',
                        fontWeight: 'bold',
                    }}>Admin Notification</h2>
                    <p style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#4A3737',
                        margin: '0 0 20px',
                    }}>
                        An order has been cancelled by the user. Please update your records accordingly.
                    </p>

                    <div style={{
                        backgroundColor: '#FEFBF5',
                        padding: '20px',
                        borderRadius: '8px',
                        margin: '30px 0',
                        border: '1px solid #FED7AA',
                    }}>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{
                                fontSize: '12px',
                                color: '#D97706',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: 'bold',
                                margin: '0 0 5px',
                            }}>Order ID</p>
                            <p style={{
                                fontSize: '16px',
                                color: '#2D1B1B',
                                fontWeight: 'bold',
                                margin: '0',
                            }}>#{order_id}</p>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{
                                fontSize: '12px',
                                color: '#D97706',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: 'bold',
                                margin: '0 0 5px',
                            }}>Customer Email</p>
                            <p style={{
                                fontSize: '16px',
                                color: '#2D1B1B',
                                fontWeight: 'bold',
                                margin: '0',
                            }}>{user_email}</p>
                        </div>
                        {reason && (
                            <div>
                                <p style={{
                                    fontSize: '12px',
                                    color: '#D97706',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 'bold',
                                    margin: '0 0 5px',
                                }}>Cancellation Reason</p>
                                <p style={{
                                    fontSize: '16px',
                                    color: '#2D1B1B',
                                    fontWeight: 'bold',
                                    margin: '0',
                                }}>{reason}</p>
                            </div>
                        )}
                    </div>

                    <p style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#666666',
                        margin: '0',
                        fontStyle: 'italic'
                    }}>
                        Note: This order was manually cancelled by the user from their profile/dashboard.
                    </p>
                </div>

                {/* Footer */}
                <div style={{
                    backgroundColor: '#FAFAFA',
                    padding: '20px',
                    textAlign: 'center',
                    borderTop: '1px solid #EEEEEE',
                }}>
                    <p style={{
                        fontSize: '12px',
                        color: '#999999',
                        margin: '0',
                    }}>
                        System Notification • Shivshakti Admin
                    </p>
                </div>
            </div>
        </div>
    )
}
