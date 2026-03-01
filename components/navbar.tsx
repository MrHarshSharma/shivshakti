'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, User, Menu, X, ChevronDown, Search, Home, Package, Info, Mail, ClipboardList, LayoutDashboard } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface SearchProduct {
    id: string | number
    name: string
    price: number
    images: string[]
    product_type?: 'simple' | 'variable'
    variations?: Array<{
        id: string
        name: string
        price: number
        is_default?: boolean
    }>
}

export default function Navbar() {
    const { toggleCart, cartCount } = useCart()
    const { user, loginWithGoogle, logout, isAdmin, loading } = useAuth()
    const [showProfilePopup, setShowProfilePopup] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchProduct[]>([])
    const [searchCount, setSearchCount] = useState(0)
    const [showSearchDropdown, setShowSearchDropdown] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const mobileSearchRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        setIsMenuOpen(false)
        setShowSearchDropdown(false)
    }, [pathname])

    // Initialize search query from URL if on products page
    useEffect(() => {
        if (pathname === '/products') {
            const query = searchParams.get('search') || ''
            setSearchQuery(query)
        }
    }, [pathname, searchParams])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setIsSearching(true)
                try {
                    const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`)
                    const data = await res.json()
                    setSearchResults(data.products || [])
                    setSearchCount(data.count || 0)
                    setShowSearchDropdown(true)
                } catch (error) {
                    console.error('Search error:', error)
                } finally {
                    setIsSearching(false)
                }
            } else {
                setSearchResults([])
                setSearchCount(0)
                setShowSearchDropdown(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
            setShowSearchDropdown(false)
            setIsMenuOpen(false)
        } else {
            router.push('/products')
        }
    }

    const getProductPrice = (product: SearchProduct) => {
        if (product.product_type === 'variable' && product.variations && product.variations.length > 0) {
            const defaultVariation = product.variations.find(v => v.is_default) || product.variations[0]
            const prices = product.variations.map(v => v.price)
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)
            if (minPrice === maxPrice) {
                return { current: minPrice, original: null }
            }
            return { current: minPrice, original: maxPrice, isRange: true }
        }
        return { current: product.price, original: null }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price)
    }

    const highlightMatch = (text: string, query: string) => {
        if (!query.trim()) return text
        const regex = new RegExp(`(${query.trim()})`, 'gi')
        const parts = text.split(regex)
        return parts.map((part, i) =>
            regex.test(part) ? <span key={i} className="text-[#D29B6C] font-semibold">{part}</span> : part
        )
    }

    const navLinks = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'All Products', href: '/products', icon: Package },
        { name: 'About Us', href: '/about', icon: Info },
        { name: 'Contact Us', href: '/contact', icon: Mail },
    ]

    return (
        <>
            {/* Top Banner */}
            <div className="bg-[#D29B6C] text-white text-center py-2 text-xs font-medium tracking-wide">
                Free Shipping on orders above ₹999 | Use code WELCOME10 for 10% off
            </div>

            {/* Main Header - White Section */}
            <div className="bg-white border-b border-[#EBEBEB]">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-24 md:h-28">
                        {/* Left - Search Bar (Desktop) */}
                        <div className="hidden md:flex items-center flex-1">
                            <div ref={searchRef} className="relative w-72">
                                <form onSubmit={handleSearch} className="relative flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Search for..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => searchQuery.trim().length >= 2 && setShowSearchDropdown(true)}
                                        className="w-full pl-4 pr-16 py-2.5 border border-[#E0E0E0] rounded-md text-sm focus:outline-none focus:border-[#D29B6C] transition-colors"
                                    />
                                    <div className="absolute right-3 inset-y-0 flex items-center gap-2">
                                        {searchQuery && !isSearching && (
                                            <button
                                                type="button"
                                                onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); if (pathname === '/products') router.push('/products'); }}
                                                className="text-[#999] hover:text-[#666] flex items-center justify-center"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                        {isSearching ? (
                                            <div className="w-5 h-5 border-2 border-[#D29B6C] border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <button type="submit" className="text-[#666] hover:text-[#D29B6C] flex items-center justify-center">
                                                <Search className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </form>

                                {/* Search Dropdown */}
                                <AnimatePresence>
                                    {showSearchDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-[#EBEBEB] z-[100] max-h-[400px] overflow-hidden"
                                        >
                                            {/* Header */}
                                            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EBEBEB] bg-[#FAFAFA]">
                                                <span className="text-sm font-semibold text-[#1A1A1A]">Products</span>
                                                <span className="text-xs text-[#717171]">{searchCount} items found</span>
                                            </div>

                                            {/* Results */}
                                            <div className="overflow-y-auto max-h-[320px]">
                                                {isSearching ? (
                                                    <div className="flex items-center justify-center py-8">
                                                        <div className="w-6 h-6 border-2 border-[#D29B6C] border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                ) : searchResults.length > 0 ? (
                                                    <>
                                                        {searchResults.map((product) => {
                                                            const priceInfo = getProductPrice(product)
                                                            return (
                                                                <Link
                                                                    key={product.id}
                                                                    href={`/product/${product.id}`}
                                                                    onClick={() => setShowSearchDropdown(false)}
                                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#FDF8F3] transition-colors border-b border-[#F5F5F5] last:border-b-0"
                                                                >
                                                                    <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-[#F8F8F8]">
                                                                        <Image
                                                                            src={product.images?.[0] || '/placeholder.png'}
                                                                            alt={product.name}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm text-[#1A1A1A] truncate">
                                                                            {highlightMatch(product.name, searchQuery)}
                                                                        </p>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <span className="text-sm font-semibold text-[#D29B6C]">
                                                                                {formatPrice(priceInfo.current)}
                                                                            </span>
                                                                            {priceInfo.original && !priceInfo.isRange && (
                                                                                <span className="text-xs text-[#999] line-through">
                                                                                    {formatPrice(priceInfo.original)}
                                                                                </span>
                                                                            )}
                                                                            {priceInfo.isRange && (
                                                                                <span className="text-xs text-[#999]">
                                                                                    - {formatPrice(priceInfo.original!)}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            )
                                                        })}
                                                        {searchCount > searchResults.length && (
                                                            <button
                                                                onClick={handleSearch}
                                                                className="w-full py-3 text-sm font-medium text-[#D29B6C] hover:bg-[#FDF8F3] transition-colors"
                                                            >
                                                                View all {searchCount} results
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="py-8 text-center">
                                                        <p className="text-sm text-[#717171]">No products found for &quot;{searchQuery}&quot;</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-[#F8F8F8] transition-colors"
                        >
                            <Menu className="w-6 h-6 text-[#4A4A4A]" />
                        </button>

                        {/* Center - Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <div className="relative h-20 w-30 md:h-24 md:w-30">
                                <Image
                                    src="/logo.png"
                                    alt="Heart and Hampers"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>

                        {/* Right - Actions */}
                        <div className="flex items-center gap-4 md:gap-6 flex-1 justify-end">
                            {/* User/Sign In */}
                            {loading ? (
                                <div className="w-10 h-10 rounded-full bg-[#F3F3F3] animate-pulse" />
                            ) : user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfilePopup(!showProfilePopup)}
                                        className="flex flex-col items-center gap-1 hover:text-[#D29B6C] transition-colors"
                                    >
                                        {user.user_metadata.avatar_url ? (
                                            <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                                <Image
                                                    src={user.user_metadata.avatar_url}
                                                    alt="Profile"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <User className="w-6 h-6 text-[#4A4A4A]" />
                                        )}
                                        <span className="text-xs text-[#4A4A4A] hidden md:block">
                                            {user.user_metadata.full_name?.split(' ')[0] || 'Account'}
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {showProfilePopup && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowProfilePopup(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 8 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#EBEBEB] py-2 z-[60]"
                                                >
                                                    <div className="px-4 py-3 border-b border-[#EBEBEB]">
                                                        <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                                                            {user.user_metadata.full_name || 'Welcome!'}
                                                        </p>
                                                        <p className="text-xs text-[#717171] truncate mt-0.5">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                    {!isAdmin && (
                                                        <Link
                                                            href="/my-orders"
                                                            onClick={() => setShowProfilePopup(false)}
                                                            className="block px-4 py-2.5 text-sm text-[#4A4A4A] hover:bg-[#F8F8F8] transition-colors"
                                                        >
                                                            My Orders
                                                        </Link>
                                                    )}
                                                    {isAdmin && (
                                                        <Link
                                                            href="/admin"
                                                            onClick={() => setShowProfilePopup(false)}
                                                            className="block px-4 py-2.5 text-sm text-[#4A4A4A] hover:bg-[#F8F8F8] transition-colors"
                                                        >
                                                            Admin Dashboard
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={() => { logout(); setShowProfilePopup(false); }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-[#D0021B] hover:bg-[#FEF2F2] transition-colors"
                                                    >
                                                        Sign Out
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <button
                                    onClick={() => loginWithGoogle()}
                                    className="flex flex-col items-center gap-1 hover:text-[#D29B6C] transition-colors"
                                >
                                    <User className="w-6 h-6 text-[#4A4A4A]" />
                                    <span className="text-xs text-[#4A4A4A] hidden md:block">Sign in</span>
                                </button>
                            )}

                            {/* Cart */}
                            <button
                                onClick={toggleCart}
                                className="relative flex flex-col items-center gap-1 hover:text-[#D29B6C] transition-colors"
                            >
                                <div className="relative">
                                    <ShoppingBag className="w-6 h-6 text-[#4A4A4A]" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#D29B6C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-[#4A4A4A] hidden md:block">Cart</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Bar - Colored Section */}
            <nav className="sticky top-0 z-50 bg-[#D29B6C] shadow-sm">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="hidden md:flex items-center justify-center gap-8 h-12">
                        {navLinks.map((link) => {
                            const Icon = link.icon
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === link.href
                                        ? 'text-white'
                                        : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.name.toUpperCase()}
                                </Link>
                            )
                        })}
                        {user && !isAdmin && (
                            <Link
                                href="/my-orders"
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === '/my-orders'
                                    ? 'text-white'
                                    : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                <ClipboardList className="w-4 h-4" />
                                TRACK ORDER
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === '/admin'
                                    ? 'text-white'
                                    : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                DASHBOARD
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-[60]"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[70] shadow-xl overflow-y-auto"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-[#EBEBEB]">
                                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                                    <div className="relative h-12 w-12">
                                        <Image src="/logo.png" alt="Heart and Hampers" fill className="object-contain" />
                                    </div>
                                </Link>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 rounded-lg hover:bg-[#F8F8F8] transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Mobile Search */}
                            <div ref={mobileSearchRef} className="p-4 border-b border-[#EBEBEB]">
                                <form onSubmit={handleSearch} className="relative flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Search for..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 border border-[#E0E0E0] rounded-md text-sm focus:outline-none focus:border-[#D29B6C]"
                                    />
                                    <div className="absolute right-3 inset-y-0 flex items-center">
                                        {isSearching ? (
                                            <div className="w-5 h-5 border-2 border-[#D29B6C] border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <button type="submit" className="flex items-center justify-center">
                                                <Search className="w-5 h-5 text-[#666]" />
                                            </button>
                                        )}
                                    </div>
                                </form>

                                {/* Mobile Search Results */}
                                {showSearchDropdown && searchQuery.trim().length >= 2 && (
                                    <div className="mt-3 bg-[#FAFAFA] rounded-lg border border-[#EBEBEB] max-h-[300px] overflow-y-auto">
                                        <div className="flex items-center justify-between px-3 py-2 border-b border-[#EBEBEB]">
                                            <span className="text-xs font-semibold text-[#1A1A1A]">Products</span>
                                            <span className="text-xs text-[#717171]">{searchCount} found</span>
                                        </div>
                                        {isSearching ? (
                                            <div className="flex items-center justify-center py-6">
                                                <div className="w-5 h-5 border-2 border-[#D29B6C] border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            searchResults.slice(0, 5).map((product) => {
                                                const priceInfo = getProductPrice(product)
                                                return (
                                                    <Link
                                                        key={product.id}
                                                        href={`/product/${product.id}`}
                                                        onClick={() => { setShowSearchDropdown(false); setIsMenuOpen(false); }}
                                                        className="flex items-center gap-3 px-3 py-2 hover:bg-white transition-colors border-b border-[#F0F0F0] last:border-b-0"
                                                    >
                                                        <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-[#F8F8F8]">
                                                            <Image
                                                                src={product.images?.[0] || '/placeholder.png'}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-[#1A1A1A] truncate">{product.name}</p>
                                                            <p className="text-xs font-semibold text-[#D29B6C]">{formatPrice(priceInfo.current)}</p>
                                                        </div>
                                                    </Link>
                                                )
                                            })
                                        ) : (
                                            <div className="py-6 text-center">
                                                <p className="text-xs text-[#717171]">No products found</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* User Section */}
                            {!loading && (
                                <div className="p-4 border-b border-[#EBEBEB]">
                                    {user ? (
                                        <div className="flex items-center gap-3">
                                            {user.user_metadata.avatar_url ? (
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                                    <Image src={user.user_metadata.avatar_url} alt="Profile" fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-[#D29B6C] flex items-center justify-center">
                                                    <span className="text-white text-lg font-medium">
                                                        {user.user_metadata.full_name?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                                                    {user.user_metadata.full_name || 'Welcome!'}
                                                </p>
                                                <p className="text-xs text-[#717171] truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { loginWithGoogle(); setIsMenuOpen(false); }}
                                            className="w-full py-3 bg-[#D29B6C] text-white text-sm font-semibold rounded-lg hover:bg-[#B8845A] transition-colors"
                                        >
                                            Sign In with Google
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Navigation Links */}
                            <div className="py-2">
                                {navLinks.map((link) => {
                                    const Icon = link.icon
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${pathname === link.href
                                                ? 'text-[#D29B6C] bg-[#FDF8F3]'
                                                : 'text-[#4A4A4A] hover:bg-[#F8F8F8]'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {link.name}
                                        </Link>
                                    )
                                })}
                                {user && !isAdmin && (
                                    <Link
                                        href="/my-orders"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${pathname === '/my-orders'
                                            ? 'text-[#D29B6C] bg-[#FDF8F3]'
                                            : 'text-[#4A4A4A] hover:bg-[#F8F8F8]'
                                            }`}
                                    >
                                        <ClipboardList className="w-5 h-5" />
                                        Track Order
                                    </Link>
                                )}
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${pathname === '/admin'
                                            ? 'text-[#D29B6C] bg-[#FDF8F3]'
                                            : 'text-[#4A4A4A] hover:bg-[#F8F8F8]'
                                            }`}
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        Admin Dashboard
                                    </Link>
                                )}
                            </div>

                            {/* Sign Out */}
                            {user && (
                                <div className="p-4 border-t border-[#EBEBEB] mt-auto">
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="w-full py-3 text-sm font-medium text-[#D0021B] border border-[#D0021B] rounded-lg hover:bg-[#FEF2F2] transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
