import React from 'react'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-volt-400 flex items-center justify-center">
            <Zap size={12} className="text-obsidian-950" fill="currentColor" />
          </div>
          <span className="font-display font-700 text-sm">
            Ledger<span className="text-volt-400">X</span>
          </span>
          <span className="text-mist-400 text-xs">· Smart Finance Tracking</span>
        </div>
        <p className="text-mist-500 text-xs">
          © {new Date().getFullYear()} LedgerX. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
