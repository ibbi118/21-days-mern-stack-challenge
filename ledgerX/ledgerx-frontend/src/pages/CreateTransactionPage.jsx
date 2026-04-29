import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight, ArrowDownLeft, DollarSign, FileText,
  CheckCircle, AlertCircle, ArrowLeft
} from 'lucide-react'
import { transactionAPI } from '../services/api'

export default function CreateTransactionPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ amount: '', type: 'credit', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setError('')
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await transactionAPI.create({
        amount: Number(form.amount),
        type: form.type,
        description: form.description.trim() || undefined,
      })
      setSuccess(true)
      setTimeout(() => navigate('/transactions'), 1800)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create transaction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isCredit = form.type === 'credit'

  return (
    <div className="max-w-xl mx-auto">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-mist-400 hover:text-mist-200 text-sm mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-800 text-3xl">New Transaction</h1>
          <p className="text-mist-400 text-sm mt-1">Record a credit or debit to your ledger</p>
        </div>

        {/* Success overlay */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="stat-card p-10 text-center mb-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle size={30} className="text-green-400" />
              </motion.div>
              <p className="font-display font-700 text-xl text-green-400">Transaction Created!</p>
              <p className="text-mist-400 text-sm mt-2">Redirecting to transactions...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!success && (
          <div className="stat-card p-8">
            {/* Type selector */}
            <div className="mb-8">
              <label className="block text-mist-300 text-sm font-medium mb-3">Transaction Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'credit', label: 'Credit', icon: ArrowDownLeft, color: 'green' },
                  { value: 'debit', label: 'Debit', icon: ArrowUpRight, color: 'red' },
                ].map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: value }))}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      form.type === value
                        ? color === 'green'
                          ? 'bg-green-400/10 border-green-400/40 text-green-400'
                          : 'bg-red-400/10 border-red-400/40 text-red-400'
                        : 'border-white/5 text-mist-500 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      form.type === value
                        ? color === 'green' ? 'bg-green-400/20' : 'bg-red-400/20'
                        : 'bg-white/5'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className={`font-display font-700 text-base ${
                        form.type === value ? '' : 'text-mist-300'
                      }`}>{label}</p>
                      <p className="text-xs opacity-60">
                        {value === 'credit' ? 'Money in' : 'Money out'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2.5 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-6"
                >
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Amount */}
              <div>
                <label className="block text-mist-300 text-sm font-medium mb-2">
                  Amount <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-500" />
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                    className="input-field w-full pl-10 pr-4 py-4 rounded-xl text-2xl font-display font-700"
                    style={{ color: form.amount ? (isCredit ? '#4ade80' : '#f87171') : undefined }}
                  />
                </div>
                {form.amount && (
                  <p className={`text-xs mt-1.5 ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                    {isCredit ? '+' : '-'}${Number(form.amount).toFixed(2)} will be {isCredit ? 'added to' : 'deducted from'} your balance
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-mist-300 text-sm font-medium mb-2">
                  Description <span className="text-mist-600 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3.5 top-3.5 text-mist-500" />
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="What's this transaction for?"
                    rows={3}
                    className="input-field w-full pl-10 pr-4 py-3 rounded-xl text-sm resize-none"
                  />
                </div>
              </div>

              {/* Preview card */}
              {form.amount && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-4 border ${
                    isCredit
                      ? 'bg-green-400/5 border-green-400/15'
                      : 'bg-red-400/5 border-red-400/15'
                  }`}
                >
                  <p className="text-mist-400 text-xs uppercase tracking-wider mb-2">Preview</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isCredit ? 'bg-green-400/15' : 'bg-red-400/15'
                      }`}>
                        {isCredit
                          ? <ArrowDownLeft size={16} className="text-green-400" />
                          : <ArrowUpRight size={16} className="text-red-400" />
                        }
                      </div>
                      <div>
                        <p className="text-mist-100 text-sm font-medium">
                          {form.description || 'Transaction'}
                        </p>
                        <p className="text-mist-500 text-xs">Just now</p>
                      </div>
                    </div>
                    <span className={`font-display font-700 ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                      {isCredit ? '+' : '-'}${Number(form.amount).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 rounded-xl text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  `Record ${isCredit ? 'Credit' : 'Debit'}`
                )}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  )
}
