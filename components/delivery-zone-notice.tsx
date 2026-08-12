'use client'

import { motion } from 'framer-motion'
import { Check, Info, Store } from 'lucide-react'
import { FREE_DELIVERY_RADIUS_KM, formatDistance, type DeliveryZone } from '@/utils/delivery'

interface Props {
    zone: DeliveryZone
    distanceKm: number | null
    acknowledged: boolean
    onAcknowledge: (value: boolean) => void
    onSwitchToPickup: () => void
}

export default function DeliveryZoneNotice({
    zone,
    distanceKm,
    acknowledged,
    onAcknowledge,
    onSwitchToPickup,
}: Props) {
    if (zone === 'free') {
        return (
            <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg"
            >
                <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-emerald-700">Free delivery</p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                        You&apos;re {formatDistance(distanceKm)} from our store — well inside our{' '}
                        {FREE_DELIVERY_RADIUS_KM} km free-delivery zone.
                    </p>
                </div>
            </motion.div>
        )
    }

    // Amber, not red: being outside the zone is a fact about geography, not a
    // mistake the customer made.
    return (
        <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-3"
        >
            <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-amber-800">
                        {zone === 'unknown'
                            ? 'Delivery charges may apply'
                            : `Outside our ${FREE_DELIVERY_RADIUS_KM} km free-delivery zone`}
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                        {zone === 'chargeable' && distanceKm !== null && (
                            <>Your address is {formatDistance(distanceKm)} from our store. </>
                        )}
                        Delivery charges for this area are borne by the customer. You&apos;ll pay for
                        your items now, and our team will call you with the exact delivery amount
                        before we dispatch.
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onSwitchToPickup}
                className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-amber-200 rounded-lg text-xs font-medium text-amber-800 hover:bg-amber-100/60 transition-colors"
            >
                <Store className="h-3.5 w-3.5" />
                Switch to Store Pickup and skip the charge
            </button>

            <label className="flex items-start gap-2.5 cursor-pointer pt-3 border-t border-amber-200/70">
                <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => onAcknowledge(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-amber-300 accent-[#D29B6C]"
                />
                {/* min-w-0 lets the text wrap instead of forcing the row wider than
                    the card — flex items default to min-width:auto. */}
                <span className="flex-1 min-w-0 text-xs text-amber-800 leading-relaxed">
                    I understand delivery charges are extra and will be confirmed with me by phone.
                </span>
            </label>
        </motion.div>
    )
}
