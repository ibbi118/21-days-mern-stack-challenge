import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { format } from 'date-fns'

export default function TransactionRow({ tx, delay = 0, compact = false }) {
  const isCredit = tx.type === 'credit'
  const date = tx.createdAt || tx.date || tx.timestamp

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group hover:bg-white/[0.02] px-2 rounded-xl -mx-2 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isCredit ? 'bg-green-400/10' : 'bg-red-400/10'
        }`}>
          {isCredit
            ? <ArrowDownLeft size={18} className="text-green-400" />
            : <ArrowUpRight size={18} className="text-red-400" />
          }
        </div>
        <div className="min-w-0">
          <p className="text-mist-100 font-medium text-sm truncate">
            {tx.description || tx.title || 'Transaction'}
          </p>
          {!compact && (
            <p className="text-mist-500 text-xs mt-0.5 font-mono">
              {date ? format(new Date(date), 'MMM dd, yyyy · HH:mm') : '—'}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {!compact && (
          <span className={`text-xs px-2.5 py-1 rounded-lg font-mono uppercase tracking-wider ${
            isCredit ? 'credit-badge' : 'debit-badge'
          }`}>
            {tx.type}
          </span>
        )}
        <span className={`font-display font-700 text-base ${
          isCredit ? 'text-green-400' : 'text-red-400'
        }`}>
          {isCredit ? '+' : '-'}${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </motion.div>
  )
}
