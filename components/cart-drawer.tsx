
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/context/cart-context'

export default function CartDrawer() {
    const { isCartOpen, toggleCart, items, removeFromCart, updateQuantity, cartTotal } = useCart()

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FEFBF5] shadow-2xl z-[70] flex flex-col border-l border-orange-100"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-orange-100 flex items-center justify-between">
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B]">Shopping Cart</h2>
                            <button onClick={toggleCart} className="p-2 hover:bg-orange-100 rounded-full transition-colors text-[#4A3737]">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                    <ShoppingBag className="h-16 w-16 text-saffron" />
                                    <p className="font-playfair text-xl text-[#4A3737]">Your cart is empty</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative h-24 w-24 bg-white rounded-lg overflow-hidden border border-orange-50 shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-playfair text-[#2D1B1B] font-bold leading-tight mb-1">{item.name}</h3>
                                                <p className="text-saffron text-sm font-bold uppercase tracking-wider">{item.category}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-full border border-orange-100 shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:text-magenta transition-colors disabled:opacity-30"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center text-[#4A3737]">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:text-saffron transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-[#2D1B1B]">₹{item.price * item.quantity}</p>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-400 hover:text-red-600 underline mt-1">
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-orange-100 bg-white">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-playfair text-lg text-[#4A3737]">Subtotal</span>
                                    <span className="font-cinzel text-2xl font-bold text-[#2D1B1B]">₹{cartTotal}</span>
                                </div>
                                <button className="w-full py-4 bg-[#2D1B1B] text-white font-bold uppercase tracking-widest hover:bg-saffron transition-colors shadow-lg rounded-sm">
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
