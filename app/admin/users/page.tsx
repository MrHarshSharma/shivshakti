'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    Users,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Shield,
    ShieldCheck,
    User,
    Ban,
    ChevronDown,
    Search
} from 'lucide-react'

interface UserData {
    id: string
    email: string
    name: string | null
    avatar: string | null
    role: 'admin' | 'editor' | 'user' | 'blocked'
    created_at: string
    last_sign_in: string | null
}

interface RolePagination {
    users: UserData[]
    page: number
    hasMore: boolean
    loading: boolean
}

const ROLE_CONFIG = {
    admin: {
        label: 'Admin',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: ShieldCheck,
        description: 'Full access to all features'
    },
    editor: {
        label: 'Editor',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Shield,
        description: 'Can manage products and orders'
    },
    user: {
        label: 'User',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: User,
        description: 'Regular customer access'
    },
    blocked: {
        label: 'Blocked',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: Ban,
        description: 'Access denied'
    }
}

const ROLES = ['admin', 'editor', 'user', 'blocked'] as const
const USERS_PER_PAGE = 10

export default function UserManagement() {
    // Counts state
    const [counts, setCounts] = useState<Record<string, number>>({
        admin: 0,
        editor: 0,
        user: 0,
        blocked: 0,
        total: 0
    })
    const [countsLoading, setCountsLoading] = useState(true)

    // Per-role pagination state
    const [roleData, setRoleData] = useState<Record<string, RolePagination>>({
        admin: { users: [], page: 1, hasMore: false, loading: true },
        editor: { users: [], page: 1, hasMore: false, loading: true },
        user: { users: [], page: 1, hasMore: false, loading: true },
        blocked: { users: [], page: 1, hasMore: false, loading: true }
    })

    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Role change dropdown state
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Fetch counts when search changes
    useEffect(() => {
        fetchCounts()
    }, [debouncedSearch])

    // Fetch users for all roles when search changes
    useEffect(() => {
        ROLES.forEach(role => fetchUsersForRole(role, 1, true))
    }, [debouncedSearch])

    const fetchCounts = async () => {
        setCountsLoading(true)
        try {
            const searchParam = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : ''
            const response = await fetch(`/api/users/counts${searchParam}`)
            const data = await response.json()
            if (data.success) {
                setCounts(data.counts)
            }
        } catch (err) {
            console.error('Error fetching counts:', err)
        } finally {
            setCountsLoading(false)
        }
    }

    const fetchUsersForRole = async (role: string, page: number, reset: boolean = false) => {
        setRoleData(prev => ({
            ...prev,
            [role]: { ...prev[role], loading: true }
        }))

        try {
            const params = new URLSearchParams({
                role,
                page: page.toString(),
                limit: USERS_PER_PAGE.toString()
            })
            if (debouncedSearch) {
                params.set('search', debouncedSearch)
            }

            const response = await fetch(`/api/users?${params}`)
            const data = await response.json()

            if (data.success) {
                setRoleData(prev => ({
                    ...prev,
                    [role]: {
                        users: reset ? data.users : [...prev[role].users, ...data.users],
                        page,
                        hasMore: data.pagination.hasMore,
                        loading: false
                    }
                }))
            } else {
                setError(data.error || `Failed to fetch ${role} users`)
                setRoleData(prev => ({
                    ...prev,
                    [role]: { ...prev[role], loading: false }
                }))
            }
        } catch (err) {
            console.error(`Error fetching ${role} users:`, err)
            setRoleData(prev => ({
                ...prev,
                [role]: { ...prev[role], loading: false }
            }))
        }
    }

    const loadMore = (role: string) => {
        const currentPage = roleData[role].page
        fetchUsersForRole(role, currentPage + 1, false)
    }

    const handleRoleChange = async (user: UserData, newRole: string) => {
        const oldRole = user.role
        setOpenDropdownId(null)
        setUpdatingUserId(user.id)
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, role: newRole })
            })
            const data = await response.json()

            if (data.success) {
                setSuccess(`${user.name || user.email}'s role updated to ${newRole}`)

                // Remove user from old role column and add to new role column
                setRoleData(prev => {
                    const updatedUser = { ...user, role: newRole as UserData['role'] }
                    return {
                        ...prev,
                        [oldRole]: {
                            ...prev[oldRole],
                            users: prev[oldRole].users.filter(u => u.id !== user.id)
                        },
                        [newRole]: {
                            ...prev[newRole],
                            users: [updatedUser, ...prev[newRole].users]
                        }
                    }
                })

                // Update counts
                setCounts(prev => ({
                    ...prev,
                    [oldRole]: Math.max(0, (prev[oldRole] || 0) - 1),
                    [newRole]: (prev[newRole] || 0) + 1
                }))

                setTimeout(() => setSuccess(null), 3000)
            } else {
                setError(data.error || 'Failed to update role')
            }
        } catch (err) {
            console.error('Error updating role:', err)
            setError('An error occurred while updating the role')
        } finally {
            setUpdatingUserId(null)
        }
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never'
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const isInitialLoading = ROLES.every(role => roleData[role].loading && roleData[role].users.length === 0)

    return (
        <div className="min-h-screen bg-[#FEFBF5] relative overflow-hidden pt-32 pb-16">
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/20 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-10" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-orange-100 text-saffron hover:text-orange-600 text-xs font-bold uppercase tracking-wider mb-6 transition-all group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="font-cinzel text-4xl sm:text-5xl text-[#2D1B1B] mb-2 font-bold tracking-tight">
                        User <span className="text-saffron">Management</span>
                    </h1>
                    <p className="text-[#4A3737]/70 font-playfair text-lg">Manage user roles and permissions.</p>
                </div>

                {/* Feedback Messages */}
                {(error || success) && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 shadow-sm">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-bold border border-green-100 shadow-sm">
                                <CheckCircle2 className="h-5 w-5 shrink-0" />
                                {success}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Search */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4A3737]/40" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-saffron/20 focus:border-saffron outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Super Admin */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-4 mb-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center border border-amber-200 shrink-0">
                        <ShieldCheck className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-0.5">Store Owner</p>
                        <p className="text-sm text-amber-900 font-medium">
                            {(process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').split(',').map(e => e.trim()).join(', ')}
                        </p>
                    </div>
                </div>

                {/* Users List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-xl"
                >
                    <div className="p-6 sm:p-8 border-b border-orange-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-orange-50">
                                <Users className="h-6 w-6 text-saffron" />
                            </div>
                            <div>
                                <h2 className="font-cinzel text-2xl text-[#2D1B1B] font-bold">All Users</h2>
                                <p className="text-[#4A3737]/50 text-sm">
                                    {countsLoading ? (
                                        <span className="inline-flex items-center gap-1">
                                            <Loader2 className="h-3 w-3 animate-spin" /> Loading...
                                        </span>
                                    ) : (
                                        `${counts.total.toLocaleString()} total users`
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        {isInitialLoading ? (
                            <div className="text-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-saffron mx-auto mb-4" />
                                <p className="text-[#4A3737]/60 font-playfair italic">Loading users...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                {ROLES.map((role) => {
                                    const config = ROLE_CONFIG[role]
                                    const RoleHeaderIcon = config.icon
                                    const data = roleData[role]
                                    const count = counts[role] || 0

                                    return (
                                        <div key={role} className="flex flex-col">
                                            {/* Role Column Header */}
                                            <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border mb-3 ${config.color}`}>
                                                <RoleHeaderIcon className="h-5 w-5" />
                                                <span className="font-bold text-sm">{config.label}</span>
                                                <span className="ml-auto text-xs font-bold opacity-70 bg-white/50 px-2 py-0.5 rounded-full">
                                                    {countsLoading ? '...' : count.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Users in this role */}
                                            <div className="space-y-2 flex-1">
                                                {data.users.length === 0 && !data.loading ? (
                                                    <div className="text-center py-8 bg-orange-50/30 rounded-xl border border-dashed border-orange-100">
                                                        <User className="h-8 w-8 text-[#4A3737]/10 mx-auto mb-2" />
                                                        <p className="text-[#4A3737]/40 text-xs">No users</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {data.users.map((user, idx) => {
                                                            const userConfig = ROLE_CONFIG[user.role]
                                                            const UserRoleIcon = userConfig.icon

                                                            return (
                                                                <motion.div
                                                                    key={user.id}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: idx * 0.02 }}
                                                                    className={`p-3 bg-white rounded-xl border border-orange-50 hover:border-saffron/30 hover:shadow-lg transition-all relative ${openDropdownId === user.id ? 'z-50' : 'z-0'}`}
                                                                >
                                                                    {/* User Info */}
                                                                    <div className="flex items-center gap-3 mb-3">
                                                                        <div className="relative shrink-0">
                                                                            {user.avatar ? (
                                                                                <Image
                                                                                    src={user.avatar}
                                                                                    alt={user.name || user.email}
                                                                                    width={40}
                                                                                    height={40}
                                                                                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-100"
                                                                                />
                                                                            ) : (
                                                                                <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center border-2 border-orange-100">
                                                                                    <User className="h-5 w-5 text-saffron" />
                                                                                </div>
                                                                            )}
                                                                            {updatingUserId === user.id && (
                                                                                <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                                                                                    <Loader2 className="h-4 w-4 animate-spin text-saffron" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <p className="font-bold text-sm text-[#2D1B1B] truncate">
                                                                                {user.name || 'No Name'}
                                                                            </p>
                                                                            <p className="text-xs text-[#4A3737]/60 truncate">{user.email}</p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Date Info */}
                                                                    <p className="text-[10px] text-[#4A3737]/40 mb-3">
                                                                        Joined {formatDate(user.created_at)} · Last seen {formatDate(user.last_sign_in)}
                                                                    </p>

                                                                    {/* Actions */}
                                                                    <div className="flex items-center gap-2">
                                                                        {/* Role Dropdown */}
                                                                        <div className="relative flex-1">
                                                                            <button
                                                                                onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                                                                                className={`w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-bold transition-all ${userConfig.color}`}
                                                                            >
                                                                                <UserRoleIcon className="h-3.5 w-3.5" />
                                                                                {userConfig.label}
                                                                                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openDropdownId === user.id ? 'rotate-180' : ''}`} />
                                                                            </button>

                                                                            {openDropdownId === user.id && (
                                                                                <>
                                                                                    <div
                                                                                        className="fixed inset-0 z-40"
                                                                                        onClick={() => setOpenDropdownId(null)}
                                                                                    />
                                                                                    <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-orange-100 z-50 overflow-hidden">
                                                                                        {Object.entries(ROLE_CONFIG).map(([r, c]) => {
                                                                                            const Icon = c.icon
                                                                                            return (
                                                                                                <button
                                                                                                    key={r}
                                                                                                    onClick={() => handleRoleChange(user, r)}
                                                                                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-orange-50 transition-colors ${user.role === r ? 'bg-orange-50' : ''}`}
                                                                                                >
                                                                                                    <Icon className={`h-4 w-4 ${c.color.split(' ')[1]}`} />
                                                                                                    <div>
                                                                                                        <p className="font-bold text-xs text-[#2D1B1B]">{c.label}</p>
                                                                                                        <p className="text-[10px] text-[#4A3737]/60">{c.description}</p>
                                                                                                    </div>
                                                                                                    {user.role === r && (
                                                                                                        <CheckCircle2 className="h-3.5 w-3.5 text-saffron ml-auto" />
                                                                                                    )}
                                                                                                </button>
                                                                                            )
                                                                                        })}
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )
                                                        })}

                                                        {/* Load More Button */}
                                                        {data.hasMore && (
                                                            <button
                                                                onClick={() => loadMore(role)}
                                                                disabled={data.loading}
                                                                className="w-full py-2.5 text-xs font-bold text-saffron hover:text-orange-600 bg-orange-50/50 hover:bg-orange-50 rounded-xl border border-dashed border-orange-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                                            >
                                                                {data.loading ? (
                                                                    <>
                                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                        Loading...
                                                                    </>
                                                                ) : (
                                                                    <>Load more ({count - data.users.length} remaining)</>
                                                                )}
                                                            </button>
                                                        )}

                                                        {/* Loading indicator for initial load */}
                                                        {data.loading && data.users.length === 0 && (
                                                            <div className="text-center py-8">
                                                                <Loader2 className="h-6 w-6 animate-spin text-saffron mx-auto" />
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
