'use client'

import { motion } from 'framer-motion'
import { Agent } from '@/lib/agents'

interface TopBarProps {
  agents: Agent[]
}

export default function TopBar({ agents }: TopBarProps) {
  const activeCount = agents.filter((a) => a.status === 'active' || a.status === 'interacting').length
  const interactingCount = agents.filter((a) => a.status === 'interacting').length
  const learningCount = agents.filter((a) => a.status === 'learning').length

  const metrics = [
    { label: 'agents active', value: activeCount, color: '#10b981' },
    { label: 'interactions', value: interactingCount, color: '#00d4ff' },
    { label: 'learning cycles', value: learningCount, color: '#f59e0b' },
  ]

  return (
    <header className="h-12 flex-shrink-0 flex items-center justify-between px-5 border-b border-white/5 bg-[#0a0a0f]/60 backdrop-blur-xl">
      {/* Left spacer for sidebar width */}
      <div className="w-0" />

      {/* Status pills */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-1.5 bg-white/4 border border-white/8 rounded-full px-3 py-1.5"
      >
        {metrics.map((metric, i) => (
          <div key={metric.label} className="flex items-center gap-1.5">
            {i > 0 && <div className="w-px h-3 bg-white/15 mx-0.5" />}
            <div className="relative flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metric.color }} />
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-70"
                style={{ backgroundColor: metric.color }}
              />
            </div>
            <span className="text-xs font-semibold text-white/90 tabular-nums">{metric.value}</span>
            <span className="text-xs text-white/35">{metric.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Right side links */}
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/dmitriidiagilev/ClaudeSpace"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-white/30 hover:text-white/70 transition-colors duration-200"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.52 11.52 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          <span className="text-[11px] font-medium">GitHub</span>
        </a>
      </div>
    </header>
  )
}
