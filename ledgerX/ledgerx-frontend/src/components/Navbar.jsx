import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, ArrowLeftRight, PlusCircle, LogOut, Menu, X, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/transactions/new', label: 'Add Transaction', icon: PlusCircle },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4">
          <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo */}
            <NavLink to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-volt-400 flex items-center justify-center">
                <Zap size={16} className="text-obsidian-950" fill="currentColor" />
              </div>
              <span className="font-display font-700 text-lg tracking-tight">
                Ledger<span className="text-volt-400">X</span>
              </span>
            </NavLink>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `nav-link flex items-center gap-2 ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-volt-400/30 to-volt-400/10 border border-volt-400/20 flex items-center justify-center">
                    <span className="text-volt-400 font-display font-700 text-xs uppercase">
                      {(user.name || user.email || 'U')[0]}
                    </span>
                  </div>
                  <span className="text-mist-300 text-sm font-medium">
                    {user.name || user.email}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="btn-ghost px-3 py-2 rounded-xl text-sm flex items-center gap-2"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden text-mist-300 hover:text-white transition-colors p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mx-4 mt-2"
            >
              <div className="glass rounded-2xl p-4 flex flex-col gap-1 max-w-7xl mx-auto">
                {links.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `nav-link flex items-center gap-2.5 ${isActive ? 'active' : ''}`
                    }
                  >
                    <Icon size={15} />
                    {label}
                  </NavLink>
                ))}
                <div className="border-t border-white/5 pt-3 mt-2 flex items-center justify-between">
                  {user && (
                    <span className="text-mist-400 text-sm">{user.name || user.email}</span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="btn-ghost px-3 py-1.5 rounded-xl text-sm flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
