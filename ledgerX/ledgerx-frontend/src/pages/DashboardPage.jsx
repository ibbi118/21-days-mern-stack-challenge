import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, Plus, RefreshCw
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'
import { format, subDays, parseISO } from 'date-fns'
import { useAuth } from '../context/AuthContext'
import { transactionAPI } from '../services/api'
import StatCard from '../components/StatCard'
import TransactionRow from '../components/TransactionRow'
import { StatCardSkeleton, TransactionSkeleton } from '../components/SkeletonLoader'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl p-3 text-xs">
      <p className="text-mist-400 mb-1">{label}</p>
      <p className="text-volt-400 font-display font-700">
        ${Number(payload[0].value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const fetchTransactions = async () => {
    try {
      const res = await transactionAPI.getAll()
      const data = res.data.transactions || res.data.data || res.data || []
      setTransactions(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load transactions.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchTransactions() }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchTransactions()
  }

  const { balance, totalCredit, totalDebit, chartData, recent } = useMemo(() => {
    let totalCredit = 0
    let totalDebit = 0

    transactions.forEach((tx) => {
      const amount = Number(tx.amount) || 0
      if (tx.type === 'credit') totalCredit += amount
      else totalDebit += amount
    })

    const balance = totalCredit - totalDebit

    // Build last-7-days running-balance chart
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = subDays(new Date(), 6 - i)
      return { date: format(day, 'MMM d'), isoDate: format(day, 'yyyy-MM-dd'), balance: 0 }
    })

    // Cumulative balance per day
    let running = 0
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date)
    )
    sorted.forEach((tx) => {
      const txDate = format(new Date(tx.createdAt || tx.date || Date.now()), 'yyyy-MM-dd')
      const day = days.find((d) => d.isoDate === txDate)
      const amount = Number(tx.amount) || 0
      running += tx.type === 'credit' ? amount : -amount
      if (day) day.balance = running
    })

    // Forward-fill
    let prev = 0
    days.forEach((d) => { if (d.balance === 0) d.balance = prev; else prev = d.balance })

    const recent = transactions
      .slice()
      .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
      .slice(0, 6)

    return { balance, totalCredit, totalDebit, chartData: days, recent }
  }, [transactions])

  const fmt = (n) => `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-mist-400 text-sm">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
          <h1 className="font-display font-800 text-3xl mt-1">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
            <span className="text-volt-400">{user?.name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
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
            Refresh
          </button>
          <Link
            to="/transactions/new"
            className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <Plus size={16} /> Add Transaction
          </Link>
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          [0, 1, 2].map((i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Current Balance"
              value={balance >= 0 ? fmt(balance) : `-${fmt(balance)}`}
              icon={Wallet}
              accent="volt"
              delay={0}
            />
            <StatCard
              label="Total Credit"
              value={fmt(totalCredit)}
              icon={TrendingUp}
              accent="green"
              delay={0.1}
            />
            <StatCard
              label="Total Debit"
              value={fmt(totalDebit)}
              icon={TrendingDown}
              accent="red"
              delay={0.2}
            />
          </>
        )}
      </div>

      {/* Chart + Recent */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Balance chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 stat-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-mist-400 text-xs font-medium uppercase tracking-widest mb-1">Balance Trend</p>
              <p className="font-display font-700 text-xl">Last 7 Days</p>
            </div>
          </div>
          {loading ? (
            <div className="h-48 shimmer rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="voltGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c8ff00" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#c8ff00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#6666aa', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6666aa', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(200,255,0,0.2)', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#c8ff00"
                  strokeWidth={2}
                  fill="url(#voltGrad)"
                  dot={{ fill: '#c8ff00', r: 3, strokeWidth: 0 }}
                  activeDot={{ fill: '#c8ff00', r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Recent transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 stat-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <p className="font-display font-700 text-lg">Recent</p>
            <Link
              to="/transactions"
              className="text-volt-400 text-xs font-medium flex items-center gap-1 hover:text-volt-500 transition-colors"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {loading ? (
            <TransactionSkeleton count={4} />
          ) : recent.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-mist-500 text-sm">No transactions yet</p>
              <Link to="/transactions/new" className="text-volt-400 text-xs mt-2 inline-block hover:underline">
                Add your first one →
              </Link>
            </div>
          ) : (
            <div>
              {recent.map((tx, i) => (
                <TransactionRow key={tx._id || i} tx={tx} delay={0.05 * i} compact />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-400/10 border border-red-400/20 rounded-xl px-5 py-4 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
