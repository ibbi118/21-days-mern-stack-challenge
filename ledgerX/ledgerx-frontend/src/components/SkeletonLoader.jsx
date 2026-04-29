import React from 'react'

export function SkeletonBlock({ className = '' }) {
  return (
    <div className={`shimmer rounded-xl bg-white/[0.03] ${className}`} />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card p-6">
      <SkeletonBlock className="w-10 h-10 rounded-xl mb-4" />
      <SkeletonBlock className="w-24 h-3 mb-2" />
      <SkeletonBlock className="w-32 h-6" />
    </div>
  )
}

export function TransactionSkeleton({ count = 5 }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-4 px-2">
          <div className="flex items-center gap-4">
            <SkeletonBlock className="w-10 h-10 rounded-xl" />
            <div>
              <SkeletonBlock className="w-32 h-3 mb-2" />
              <SkeletonBlock className="w-24 h-2" />
            </div>
          </div>
          <SkeletonBlock className="w-20 h-5" />
        </div>
      ))}
    </div>
  )
}
