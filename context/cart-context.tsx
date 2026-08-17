
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from '@/data/products'

interface CartItem extends Product {
    quantity: number;
    selectedVariation?: {
        id: string;
        name: string;
        price: number;
        stock?: number;
        sku?: string;
    }
}

export interface AppliedCoupon {
    code: string;
    off_percent: number;
    min_cost: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number, variation?: any) => void;
    addToCartSilent: (product: Product, quantity: number, variation?: any) => void;
    removeFromCart: (productId: string | number, variationId?: string) => void;
    updateQuantity: (productId: string | number, quantity: number, variationId?: string) => void;
    clearCart: () => void;
    toggleCart: () => void;
    isCartOpen: boolean;
    cartCount: number;
    cartTotal: number;
    // Coupon lives here rather than in the drawer so it survives the trip to
    // /checkout — and a page refresh once there.
    appliedCoupon: AppliedCoupon | null;
    setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
    discountAmount: number;
    finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

    // Load cart from local storage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('shivshakti_cart');
        if (storedCart) {
            setItems(JSON.parse(storedCart));
        }
        const storedCoupon = localStorage.getItem('shivshakti_coupon');
        if (storedCoupon) {
            try { setAppliedCoupon(JSON.parse(storedCoupon)); } catch { /* ignore */ }
        }
        setIsInitialized(true);
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('shivshakti_cart', JSON.stringify(items));
        }
    }, [items, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        if (appliedCoupon) {
            localStorage.setItem('shivshakti_coupon', JSON.stringify(appliedCoupon));
        } else {
            localStorage.removeItem('shivshakti_coupon');
        }
    }, [appliedCoupon, isInitialized]);

    const addToCart = (product: Product, quantity: number, variation?: any) => {
        setItems(prev => {
            const existing = prev.find(item =>
                item.id === product.id &&
                (!variation || item.selectedVariation?.id === variation.id)
            );
            if (existing) {
                return prev.map(item =>
                    item.id === product.id && (!variation || item.selectedVariation?.id === variation.id)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity, selectedVariation: variation }];
        });
        setIsCartOpen(true);
    };

    const addToCartSilent = (product: Product, quantity: number, variation?: any) => {
        setItems(prev => {
            const existing = prev.find(item =>
                item.id === product.id &&
                (!variation || item.selectedVariation?.id === variation.id)
            );
            if (existing) {
                return prev.map(item =>
                    item.id === product.id && (!variation || item.selectedVariation?.id === variation.id)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity, selectedVariation: variation }];
        });
        // Don't open cart drawer
    };

    const removeFromCart = (productId: string | number, variationId?: string) => {
        setItems(prev => prev.filter(item =>
            !(item.id === productId && (!variationId || item.selectedVariation?.id === variationId))
        ));
    };

    const updateQuantity = (productId: string | number, quantity: number, variationId?: string) => {
        if (quantity < 1) return;
        setItems(prev => prev.map(item =>
            (item.id === productId && (!variationId || item.selectedVariation?.id === variationId))
                ? { ...item, quantity }
                : item
        ));
    };

    const clearCart = () => {
        setItems([]);
        // A coupon outliving the order it was used on would silently discount the
        // customer's next purchase too.
        setAppliedCoupon(null);
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = items.reduce((sum, item) => {
        const price = item.selectedVariation ? item.selectedVariation.price : item.price;
        return sum + (price * item.quantity);
    }, 0);

    // Derived rather than an effect that nulls the state: a coupon whose minimum
    // spend is no longer met simply stops applying, and starts applying again by
    // itself if the customer adds more. Destroying it on a dip below the threshold
    // would punish someone for briefly decrementing a quantity.
    const effectiveCoupon = appliedCoupon && cartTotal >= appliedCoupon.min_cost
        ? appliedCoupon
        : null;

    const discountAmount = effectiveCoupon
        ? Math.round((cartTotal * effectiveCoupon.off_percent) / 100)
        : 0;
    const finalTotal = cartTotal - discountAmount;

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            addToCartSilent,
            removeFromCart,
            updateQuantity,
            clearCart,
            toggleCart,
            isCartOpen,
            cartCount,
            cartTotal,
            appliedCoupon: effectiveCoupon,
            setAppliedCoupon,
            discountAmount,
            finalTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
