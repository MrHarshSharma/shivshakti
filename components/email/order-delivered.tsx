import React from 'react'

interface OrderDeliveredEmailProps {
    name: string
    order_id: number
    phone?: string
    address?: string
    orders?: Array<{
        name: string
        price: number
        units: number
        image?: string
    }>
    cost?: {
        total: number
        subtotal?: number
        discount?: number
        shipping?: number
        tax?: number
    }
    date?: string
}

export const OrderDeliveredEmail: React.FC<OrderDeliveredEmailProps> = ({
    name,
    order_id,
    phone,
    address,
    orders = [],
    cost,
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
                        Your order <strong>#{order_id}</strong> has been successfully delivered! We hope you enjoy your purchase.
                    </p>

                    <div style={{
                        backgroundColor: '#dcfce7',
                        padding: '30px',
                        borderRadius: '8px',
                        margin: '30px 0',
                        border: '1px solid #bbf7d0',
                        textAlign: 'center',
                    }}>
                        <h3 style={{
                            color: '#15803d',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            fontWeight: 'bold',
                            margin: '0 0 10px',
                            fontSize: '18px'
                        }}>Status Update</h3>
                        <p style={{
                            fontSize: '24px',
                            color: '#14532d',
                            fontWeight: 'bold',
                            margin: '0',
                            fontFamily: '"Cinzel", serif',
                        }}>Delivered</p>
                    </div>

                    <p style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#4A3737',
                        margin: '20px 0 0',
                    }}>
                        Thank you for shopping with Shivshakti. We look forward to serving you again soon!
                    </p>

                    {/* Customer Details */}
                    {(phone || address) && (
                        <div style={{
                            backgroundColor: '#f9fafb',
                            padding: '20px',
                            borderRadius: '8px',
                            margin: '20px 0',
                            border: '1px solid #e5e7eb',
                        }}>
                            <h3 style={{
                                fontSize: '14px',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                margin: '0 0 15px',
                                fontWeight: 'bold',
                            }}>Delivery Information</h3>
                            {phone && (
                                <p style={{
                                    fontSize: '14px',
                                    color: '#2D1B1B',
                                    margin: '0 0 8px',
                                    lineHeight: '1.5',
                                }}>
                                    <strong>Phone:</strong> {phone}
                                </p>
                            )}
                            {address && (
                                <p style={{
                                    fontSize: '14px',
                                    color: '#2D1B1B',
                                    margin: '0',
                                    lineHeight: '1.5',
                                }}>
                                    <strong>Address:</strong> {address}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Order Summary */}
                    {orders && orders.length > 0 && (
                        <div style={{ marginTop: '30px' }}>
                            <h3 style={{
                                fontSize: '18px',
                                color: '#2D1B1B',
                                margin: '0 0 20px',
                                fontWeight: 'bold',
                            }}>Order Summary</h3>

                            {orders.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '15px 0',
                                    borderBottom: index < orders.length - 1 ? '1px solid #f3f4f6' : 'none',
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#2D1B1B',
                                            margin: '0 0 4px',
                                            fontWeight: 'bold',
                                        }}>{item.name}</p>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#6b7280',
                                            margin: '0',
                                        }}>Qty: {item.units} × ₹{item.price}</p>
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#2D1B1B',
                                        fontWeight: 'bold',
                                    }}>₹{item.price * item.units}</div>
                                </div>
                            ))}

                            {cost && (
                                <div style={{
                                    marginTop: '20px',
                                    paddingTop: '20px',
                                    borderTop: '2px solid #2D1B1B',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <span style={{
                                            fontSize: '16px',
                                            color: '#2D1B1B',
                                            fontWeight: 'bold',
                                        }}>Total</span>
                                        <span style={{
                                            fontSize: '20px',
                                            color: '#15803d',
                                            fontWeight: 'bold',
                                            fontFamily: '"Cinzel", serif',
                                        }}>₹{cost.total}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
                        If you have any questions, please contact us at {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
                    </p>
                </div>
            </div>
        </div>
    )
}
