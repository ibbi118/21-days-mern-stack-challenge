import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Zap, ArrowRight, BarChart3, Shield, TrendingUp,
  ArrowUpRight, ArrowDownLeft, ChevronRight
} from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Real-Time Balance',
    description: 'Watch your balance update instantly as credits and debits flow through your ledger.',
  },
  {
    icon: TrendingUp,
    title: 'Financial Insights',
    description: 'Understand your money patterns with clear summaries and transaction history.',
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    description: 'JWT-based authentication with HttpOnly cookies keeps your finances protected.',
  },
]

const mockTransactions = [
  { id: 1, type: 'credit', amount: 4200, description: 'Freelance Payment', time: '2h ago' },
  { id: 2, type: 'debit', amount: 89, description: 'Subscription Service', time: '5h ago' },
  { id: 3, type: 'credit', amount: 1500, description: 'Invoice #0042', time: '1d ago' },
  { id: 4, type: 'debit', amount: 340, description: 'Cloud Infrastructure', time: '2d ago' },
]

function MockDashboard() {
  return (
    <div className="relative w-full max-w-md">
      <div className="glass rounded-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-mist-400 text-xs font-medium uppercase tracking-widest">Total Balance</p>
            <p className="font-display font-800 text-3xl text-volt-400 mt-1">$12,480.00</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-volt-400/10 flex items-center justify-center">
            <Zap size={18} className="text-volt-400" fill="currentColor" />
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-400/5 border border-green-400/10 rounded-xl p-3">
            <p className="text-green-400/60 text-xs mb-1">Credit</p>
            <p className="text-green-400 font-display font-700 text-lg">+$5,700</p>
          </div>
          <div className="bg-red-400/5 border border-red-400/10 rounded-xl p-3">
            <p className="text-red-400/60 text-xs mb-1">Debit</p>
            <p className="text-red-400 font-display font-700 text-lg">-$429</p>
          </div>
        </div>

        {/* Transactions */}
        <div>
          <p className="text-mist-500 text-xs font-medium uppercase tracking-widest mb-3">Recent</p>
          {mockTransactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  tx.type === 'credit' ? 'bg-green-400/10' : 'bg-red-400/10'
                }`}>
                  {tx.type === 'credit'
                    ? <ArrowDownLeft size={13} className="text-green-400" />
                    : <ArrowUpRight size={13} className="text-red-400" />
                  }
                </div>
                <div>
                  <p className="text-mist-200 text-xs font-medium">{tx.description}</p>
                  <p className="text-mist-500 text-[10px]">{tx.time}</p>
                </div>
              </div>
              <span className={`font-mono text-xs font-600 ${
                tx.type === 'credit' ? 'text-green-400' : 'text-red-400'
              }`}>
                {tx.type === 'credit' ? '+' : '-'}${tx.amount}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative glow */}
      <div className="absolute -inset-6 bg-volt-400/5 rounded-3xl blur-3xl -z-10" />
    </div>
  )
}

export default function LandingPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <div ref={containerRef} className="min-h-screen bg-obsidian-950 overflow-x-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── NAVBAR ─────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4">
          <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-volt-400 flex items-center justify-center">
                <Zap size={16} className="text-obsidian-950" fill="currentColor" />
              </div>
              <span className="font-display font-700 text-lg tracking-tight">
                Ledger<span className="text-volt-400">X</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-ghost px-4 py-2 rounded-xl text-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary px-4 py-2 rounded-xl text-sm flex items-center gap-1.5">
                Get Started <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-24">
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-volt-400/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs text-mist-300 mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-volt-400 animate-pulse" />
                Smart Finance Tracking · Now Live
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display font-800 text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6"
              >
                Your money,{' '}
                <span className="text-volt-400 relative">
                  crystal
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M0 6 Q50 0 100 6 Q150 12 200 6" stroke="#c8ff00" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
                  </svg>
                </span>{' '}
                clear.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-mist-400 text-lg leading-relaxed mb-10 max-w-md"
              >
                LedgerX gives you a real-time view of every credit and debit.
                Track your balance, understand your cash flow, and stay in control — all in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/register"
                  className="btn-primary px-7 py-3.5 rounded-2xl text-base flex items-center gap-2 shadow-lg"
                >
                  Start Tracking Free
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="btn-ghost px-7 py-3.5 rounded-2xl text-base"
                >
                  Login
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 mt-12"
              >
                {['JWT Secured', 'REST API', 'MongoDB'].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 text-mist-500 text-xs">
                    <div className="w-1 h-1 rounded-full bg-volt-400/50" />
                    {badge}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — mock dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 40, rotateY: -5 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
              style={{ y }}
              className="hidden lg:flex justify-center"
            >
              <MockDashboard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────── */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-volt-400 text-xs font-mono uppercase tracking-[0.3em] mb-4">
              Core Features
            </p>
            <h2 className="font-display font-800 text-4xl sm:text-5xl tracking-tight">
              Everything you need,{' '}
              <span className="text-mist-400">nothing you don't.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="stat-card glass-hover p-8"
              >
                <div className="w-12 h-12 rounded-2xl bg-volt-400/10 flex items-center justify-center mb-6">
                  <Icon size={22} className="text-volt-400" />
                </div>
                <h3 className="font-display font-700 text-xl mb-3">{title}</h3>
                <p className="text-mist-400 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-volt-400/5 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-volt-400/10 rounded-full blur-3xl" />

            <div className="w-14 h-14 rounded-2xl bg-volt-400 flex items-center justify-center mx-auto mb-8">
              <Zap size={26} className="text-obsidian-950" fill="currentColor" />
            </div>
            <h2 className="font-display font-800 text-4xl tracking-tight mb-4">
              Ready to track smarter?
            </h2>
            <p className="text-mist-400 mb-10 max-w-sm mx-auto">
              Join LedgerX and get a clear picture of your finances in seconds.
            </p>
            <Link
              to="/register"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base"
            >
              Create Free Account <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-volt-400 flex items-center justify-center">
              <Zap size={12} className="text-obsidian-950" fill="currentColor" />
            </div>
            <span className="font-display font-700 text-sm">
              Ledger<span className="text-volt-400">X</span>
            </span>
            <span className="text-mist-500 text-xs">· Smart Finance Tracking</span>
          </div>
          <p className="text-mist-600 text-xs">
            © {new Date().getFullYear()} LedgerX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
