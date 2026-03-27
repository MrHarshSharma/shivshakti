import Link from 'next/link'
import { Ban } from 'lucide-react'

export default function BlockedPage() {
    return (
        <div className="min-h-screen bg-[#FEFBF5] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-100">
                    <Ban className="h-10 w-10 text-red-500" />
                </div>
                <h1 className="font-cinzel text-3xl font-bold text-[#2D1B1B] mb-3">
                    Account Blocked
                </h1>
                <p className="text-[#4A3737]/60 mb-8">
                    Your account has been blocked by an administrator. You are unable to access this platform.
                    If you believe this is a mistake, please contact support.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-saffron text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-saffron/30"
                >
                    Go to Homepage
                </Link>
            </div>
        </div>
    )
}
