import React from 'react'

interface OrderReceivedEmailProps {
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
    date?: string
    mode?: string
}

export const OrderReceivedEmail: React.FC<OrderReceivedEmailProps> = ({
    name,
    order_id,
    orders,
    cost,
    date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    mode,
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
                            marginBottom: '20px',
                            display: 'inline-block',
                        }}
                    />
                    <h1 style={{
                        color: '#D97706',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        margin: '0',
                        letterSpacing: '4px',
                        fontFamily: '"Cinzel", serif',
                        textTransform: 'uppercase',
                    }}>New Order</h1>

                </div>

                {/* Content */}
                <div style={{ padding: '40px' }}>
                    <div style={{
                        backgroundColor: '#FEFBF5',
                        padding: '20px',
                        borderRadius: '8px',
                        margin: '30px 0',
                        border: '1px solid #FED7AA',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around !important' }}>
                            <div>
                                <p style={{
                                    fontSize: '12px',
                                    color: '#D97706',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 'bold',
                                    margin: '0 0 5px',
                                }}>Order Number</p>
                                <p style={{
                                    fontSize: '16px',
                                    color: '#2D1B1B',
                                    fontWeight: 'bold',
                                    margin: '0',
                                }}>#{order_id}</p>
                            </div>
                            <div>
                                <p style={{
                                    fontSize: '12px',
                                    color: '#D97706',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 'bold',
                                    margin: '0 0 5px',
                                }}>Date</p>
                                <p style={{
                                    fontSize: '16px',
                                    color: '#2D1B1B',
                                    fontWeight: 'bold',
                                    margin: '0',
                                    marginBottom: '15px',
                                }}>{date}</p>
                            </div>
                            <div>
                                {mode && (
                                    <>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#D97706',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            fontWeight: 'bold',
                                            margin: '0 0 5px',
                                        }}>Collection Mode</p>
                                        <p style={{
                                            fontSize: '16px',
                                            color: '#2D1B1B',
                                            fontWeight: 'bold',
                                            margin: '0',
                                        }}>{mode}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <hr style={{ borderColor: '#FED7AA', margin: '20px 0', borderTop: '1px solid #FED7AA', borderBottom: 'none' }} />

                    {/* Order Items */}
                    <h3 style={{
                        fontSize: '18px',
                        color: '#2D1B1B',
                        fontWeight: 'bold',
                        margin: '30px 0 15px',
                        borderBottom: '2px solid #D97706',
                        paddingBottom: '5px',
                        display: 'inline-block',
                    }}>Order Summary</h3>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            {orders.map((item, index) => (
                                <tr key={index} style={{ borderBottom: index !== orders.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                    <td style={{ padding: '15px 0', verticalAlign: 'top', width: '70%' }}>
                                        <div style={{
                                            fontSize: '16px',
                                            color: '#2D1B1B',
                                            fontWeight: 'bold',
                                            marginBottom: '5px',
                                        }}>{item.name}</div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#666666',
                                        }}>Qty: {item.units}</div>
                                    </td>
                                    <td style={{ padding: '15px 0', verticalAlign: 'top', textAlign: 'right', fontWeight: 'bold', color: '#2D1B1B' }}>
                                        ₹{item.price * item.units}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <hr style={{ borderColor: '#FED7AA', margin: '20px 0', borderTop: '1px solid #FED7AA', borderBottom: 'none' }} />

                    {/* Totals */}
                    <div style={{
                        backgroundColor: '#FAFAFA',
                        padding: '20px',
                        borderRadius: '8px',
                        marginTop: '20px',
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '5px 0', fontSize: '14px', color: '#666666' }}>Subtotal</td>
                                    <td style={{ padding: '5px 0', textAlign: 'right', fontSize: '14px', color: '#2D1B1B', fontWeight: 'bold' }}>₹{cost.subtotal || cost.total}</td>
                                </tr>
                                {cost.discount ? (
                                    <tr>
                                        <td style={{ padding: '5px 0', fontSize: '14px', color: '#16a34a' }}>Discount</td>
                                        <td style={{ padding: '5px 0', textAlign: 'right', fontSize: '14px', color: '#16a34a', fontWeight: 'bold' }}>-₹{cost.discount}</td>
                                    </tr>
                                ) : null}
                                {cost.shipping ? (
                                    <tr>
                                        <td style={{ padding: '5px 0', fontSize: '14px', color: '#666666' }}>Shipping</td>
                                        <td style={{ padding: '5px 0', textAlign: 'right', fontSize: '14px', color: '#2D1B1B', fontWeight: 'bold' }}>₹{cost.shipping}</td>
                                    </tr>
                                ) : null}
                                <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '15px 0 0', fontSize: '18px', color: '#2D1B1B', fontWeight: 'bold' }}>Total</td>
                                    <td style={{ padding: '15px 0 0', textAlign: 'right', fontSize: '18px', color: '#D97706', fontWeight: 'bold' }}>₹{cost.total}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#4A3737',
                        margin: '20px 0 0',
                    }}>
                        We will notify you once your order has been accepted and shipped.
                    </p>

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <a
                            href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders?search=${order_id}`}
                            style={{
                                display: 'inline-block',
                                padding: '12px 24px',
                                backgroundColor: '#2D1B1B',
                                color: '#ffffff',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontSize: '14px'
                            }}
                        >
                            View Order in Admin Dashboard
                        </a>
                    </div>
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
