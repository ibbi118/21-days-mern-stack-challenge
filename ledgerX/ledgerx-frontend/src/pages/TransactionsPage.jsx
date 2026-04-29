import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, ArrowUpDown, RefreshCw, Inbox } from 'lucide-react'
import { format } from 'date-fns'
import { transactionAPI } from '../services/api'
import TransactionRow from '../components/TransactionRow'
import { TransactionSkeleton } from '../components/SkeletonLoader'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'highest', label: 'Highest amount' },
  { value: 'lowest', label: 'Lowest amount' },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const fetchTransactions = async () => {
    try {
      const res = await transactionAPI.getAll()
      const data = res.data.transactions || res.data.data || res.data || []
      setTransactions(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to load transactions.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchTransactions() }, [])

  const handleRefresh = () => { setRefreshing(true); fetchTransactions() }

  const filtered = useMemo(() => {
    let list = [...transactions]
    if (filter !== 'all') list = list.filter((t) => t.type === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          (t.description || '').toLowerCase().includes(q) ||
          String(t.amount).includes(q)
      )
    }
    list.sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
      if (sort === 'oldest') return new Date(a.createdAt || a.date || 0) - new Date(b.createdAt || b.date || 0)
      if (sort === 'highest') return Number(b.amount) - Number(a.amount)
      if (sort === 'lowest') return Number(a.amount) - Number(b.amount)
      return 0
    })
    return list
  }, [transactions, filter, search, sort])

  const totalCredit = transactions.filter((t) => t.type === 'credit').reduce((s, t) => s + Number(t.amount), 0)
  const totalDebit = transactions.filter((t) => t.type === 'debit').reduce((s, t) => s + Number(t.amount), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-800 text-3xl">Transactions</h1>
          <p className="text-mist-400 text-sm mt-1">
            {transactions.length} total · {format(new Date(), 'MMMM yyyy')}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-ghost px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/transactions/new"
            className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <Plus size={16} /> Add
          </Link>
        </motion.div>
      </div>

      {/* Quick stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: 'Total', value: `$${(totalCredit - totalDebit).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-volt-400' },
          { label: 'Credit', value: `+$${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-green-400' },
          { label: 'Debit', value: `-$${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card p-4 text-center">
            <p className="text-mist-500 text-xs uppercase tracking-wider mb-1">{label}</p>
            <p className={`font-display font-700 text-lg ${color}`}>{value}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="stat-card p-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="input-field w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1">
            {FILTER_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === value
                    ? 'bg-volt-400 text-obsidian-950 font-700'
                    : 'text-mist-400 hover:text-mist-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field px-3 py-2.5 rounded-xl text-sm cursor-pointer"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value} className="bg-obsidian-900">{label}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Transaction list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="stat-card p-6"
      >
        {loading ? (
          <TransactionSkeleton count={8} />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={handleRefresh} className="text-volt-400 text-xs mt-3 hover:underline">
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-mist-800/30 flex items-center justify-center">
              <Inbox size={24} className="text-mist-500" />
            </div>
            <div className="text-center">
              <p className="text-mist-300 font-medium mb-1">
                {search || filter !== 'all' ? 'No matching transactions' : 'No transactions yet'}
              </p>
              <p className="text-mist-500 text-sm">
                {search || filter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first transaction to get started'}
              </p>
            </div>
            {!search && filter === 'all' && (
              <Link to="/transactions/new" className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 mt-2">
                <Plus size={16} /> Add Transaction
              </Link>
            )}
          </div>
        ) : (
          <AnimatePresence mode="sync">
            <div>
              {filtered.map((tx, i) => (
                <TransactionRow key={tx._id || i} tx={tx} delay={i < 20 ? i * 0.03 : 0} />
              ))}
            </div>
          </AnimatePresence>
        )}

        {filtered.length > 0 && (
          <p className="text-mist-600 text-xs text-center mt-6">
            Showing {filtered.length} of {transactions.length} transactions
          </p>
        )}
      </motion.div>
    </div>
  )
}
