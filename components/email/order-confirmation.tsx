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

export const OrderConfirmationEmail: React.FC<OrderEmailData> = ({
    name,
    order_id,
    orders,
    cost
}) => {
    return (
        <div style={{
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            backgroundColor: '#FEFBF5',
            padding: '40px 20px',
            color: '#2D1B1B'
        }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
                {/* Header */}
                <div style={{
                    backgroundColor: '#2D1B1B',
                    padding: '30px',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        color: '#D97706',
                        margin: 0,
                        fontSize: '28px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>Shivshakti</h1>
                </div>

                {/* Content */}
                <div style={{ padding: '40px 30px' }}>
                    <h2 style={{
                        marginTop: 0,
                        color: '#2D1B1B',
                        fontSize: '24px'
                    }}>Namaste {name},</h2>

                    <p style={{
                        color: '#4A3737',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        marginBottom: '30px'
                    }}>
                        Thank you for your order. We are delighted to confirm that we have received your request.
                        Here are the details of your purchase regarding Order #{order_id}.
                    </p>

                    {/* Order Items */}
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{
                            borderBottom: '2px solid #D97706',
                            paddingBottom: '10px',
                            color: '#2D1B1B',
                            fontSize: '18px'
                        }}>Order Summary</h3>

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <tbody>
                                {orders.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '15px 0', verticalAlign: 'top', width: '70%' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#2D1B1B' }}>
                                                {item.name}
                                            </div>
                                            <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
                                                Qty: {item.units}
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px 0', verticalAlign: 'top', textAlign: 'right', fontWeight: 'bold', color: '#2D1B1B' }}>
                                            ₹{item.price * item.units}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cost Summary */}
                    <div style={{
                        backgroundColor: '#FEFBF5',
                        padding: '20px',
                        borderRadius: '4px',
                        border: '1px solid #FFF7ED'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '5px 0', color: '#4A3737' }}>Subtotal</td>
                                    <td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 'bold' }}>₹{cost.subtotal || cost.total}</td>
                                </tr>
                                {cost.discount ? (
                                    <tr>
                                        <td style={{ padding: '5px 0', color: '#16a34a' }}>Discount</td>
                                        <td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 'bold', color: '#16a34a' }}>-₹{cost.discount}</td>
                                    </tr>
                                ) : null}
                                {cost.shipping ? (
                                    <tr>
                                        <td style={{ padding: '5px 0', color: '#4A3737' }}>Shipping</td>
                                        <td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 'bold' }}>₹{cost.shipping}</td>
                                    </tr>
                                ) : null}
                                <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '15px 0 0', color: '#2D1B1B', fontWeight: 'bold', fontSize: '18px' }}>Total</td>
                                    <td style={{ padding: '15px 0 0', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: '#D97706' }}>₹{cost.total}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    backgroundColor: '#FAFAFA',
                    padding: '20px',
                    textAlign: 'center',
                    borderTop: '1px solid #EEEEEE',
                    fontSize: '12px',
                    color: '#999999'
                }}>
                    <p style={{ margin: '0 0 10px' }}>
                        &copy; {new Date().getFullYear()} Shivshakti. All rights reserved.
                    </p>
                    <p style={{ margin: 0 }}>
                        Thank you for choosing tradition and quality.
                    </p>
                </div>
            </div>
        </div>
    )
}
