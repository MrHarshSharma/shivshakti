import { Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-[#FEFBF5] z-50 flex flex-col items-center justify-center">
            <div className="relative">
                <div className="absolute inset-0 bg-saffron/20 blur-xl rounded-full animate-pulse"></div>
                <Loader2 className="h-12 w-12 text-saffron animate-spin relative z-10" />
            </div>
            <p className="mt-4 font-cinzel text-[#2D1B1B] font-bold tracking-widest animate-pulse">
                Loading Shivshakti...
            </p>
        </div>
    )
}
