'use client'

import { motion } from 'framer-motion'
import { Agent, ROLE_COLORS } from '@/lib/agents'

interface SidebarProps {
  agents: Agent[]
  selectedAgentId: string | null
  onAgentSelect: (agent: Agent) => void
  onLaunchAgent: () => void
  activeView: string
  onViewChange: (view: string) => void
}

const navItems = [
  {
    id: 'space',
    label: 'Space',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
        <path d="M2 12h4M18 12h4M12 2v4M12 18v4" />
      </svg>
    ),
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="8" r="3" />
        <circle cx="12" cy="16" r="3" />
        <line x1="10.5" y1="9.5" x2="13.5" y2="9.5" />
        <line x1="9.5" y1="10.5" x2="11" y2="13.5" />
        <line x1="14.5" y1="10.5" x2="13" y2="13.5" />
      </svg>
    ),
  },
  {
    id: 'learning',
    label: 'Learning',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
]

const statusColors: Record<string, string> = {
  active: '#10b981',
  learning: '#f59e0b',
  idle: '#6b7280',
  interacting: '#00d4ff',
}

const statusLabels: Record<string, string> = {
  active: 'Active',
  learning: 'Learning',
  idle: 'Idle',
  interacting: 'Interacting',
}

export default function Sidebar({
  agents,
  selectedAgentId,
  onAgentSelect,
  onLaunchAgent,
  activeView,
  onViewChange,
}: SidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col bg-[#0a0a0f]/80 border-r border-white/5 backdrop-blur-xl overflow-hidden">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-600/30 blur-sm" />
            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <circle cx="12" cy="12" r="3" />
                <circle cx="4" cy="4" r="2" />
                <circle cx="20" cy="4" r="2" />
                <circle cx="4" cy="20" r="2" />
                <circle cx="20" cy="20" r="2" />
                <line x1="6" y1="6" x2="10" y2="10" stroke="white" strokeWidth="1.5" />
                <line x1="18" y1="6" x2="14" y2="10" stroke="white" strokeWidth="1.5" />
                <line x1="6" y1="18" x2="10" y2="14" stroke="white" strokeWidth="1.5" />
                <line x1="18" y1="18" x2="14" y2="14" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">ClaudeSpace</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-2 pt-3 pb-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group relative mb-0.5"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-lg bg-white/8"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-white/40 group-hover:text-white/70'
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`relative font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="mx-3 my-1 h-px bg-white/5" />

      {/* Agents list */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/25">
          Active Agents
        </p>
        {agents.map((agent, i) => {
          const roleColor = ROLE_COLORS[agent.role]
          const sColor = statusColors[agent.status]
          const isSelected = selectedAgentId === agent.id

          return (
            <motion.button
              key={agent.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onAgentSelect(agent)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 group ${
                isSelected ? 'bg-white/8' : 'hover:bg-white/4'
              }`}
            >
              {/* Status dot */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: roleColor }}
                />
                {(agent.status === 'active' || agent.status === 'interacting') && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-60"
                    style={{ backgroundColor: sColor }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-white/70'}`}>
                  {agent.name}
                </div>
                <div className="text-[10px] text-white/30 truncate">{statusLabels[agent.status]}</div>
              </div>

              {/* Role badge */}
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm opacity-70"
                style={{ color: roleColor, backgroundColor: `${roleColor}18` }}
              >
                {agent.role[0]}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Launch Agent button */}
      <div className="p-3 border-t border-white/5">
        <motion.button
          onClick={onLaunchAgent}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/80 to-purple-600/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 blur-lg bg-gradient-to-r from-cyan-500/30 to-purple-500/30 group-hover:opacity-100 opacity-50 transition-opacity" />
          <span className="relative flex items-center justify-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Launch Agent
          </span>
        </motion.button>
      </div>
    </aside>
  )
}
