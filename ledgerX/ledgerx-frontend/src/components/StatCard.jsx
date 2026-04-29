import React from 'react'
import { motion } from 'framer-motion'

export default function StatCard({ label, value, icon: Icon, accent, change, delay = 0 }) {
  const accentMap = {
    volt: {
      icon: 'bg-volt-400/10 text-volt-400',
      value: 'text-volt-400',
      border: 'hover:border-volt-400/20',
    },
    green: {
      icon: 'bg-green-400/10 text-green-400',
      value: 'text-green-400',
      border: 'hover:border-green-400/20',
    },
    red: {
      icon: 'bg-red-400/10 text-red-400',
      value: 'text-red-400',
      border: 'hover:border-red-400/20',
    },
    blue: {
      icon: 'bg-blue-400/10 text-blue-400',
      value: 'text-blue-400',
      border: 'hover:border-blue-400/20',
    },
  }
  const colors = accentMap[accent] || accentMap.volt

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className={`stat-card p-6 ${colors.border}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.icon}`}>
          <Icon size={20} />
        </div>
        {change !== undefined && (
          <span className={`text-xs font-mono px-2 py-1 rounded-lg ${
            change >= 0
              ? 'bg-green-400/10 text-green-400'
              : 'bg-red-400/10 text-red-400'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-mist-400 text-sm font-medium mb-1">{label}</p>
      <p className={`font-display font-700 text-2xl tracking-tight ${colors.value}`}>
        {value}
      </p>
    </motion.div>
  )
}
