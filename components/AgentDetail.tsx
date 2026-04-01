'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Agent, ROLE_COLORS, initialAgents } from '@/lib/agents'

interface AgentDetailProps {
  agent: Agent | null
  allAgents: Agent[]
  onClose: () => void
  recentActivity: string[]
}

const statusLabels: Record<string, string> = {
  active: 'Active',
  learning: 'Learning',
  idle: 'Idle',
  interacting: 'Interacting',
}

const statusBg: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  learning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  idle: 'bg-zinc-700/30 text-zinc-400 border-zinc-600/20',
  interacting: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
}

export default function AgentDetail({ agent, allAgents, onClose, recentActivity }: AgentDetailProps) {
  return (
    <AnimatePresence>
      {agent && (
        <motion.aside
          key={agent.id}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-72 flex-shrink-0 flex flex-col bg-[#0a0a0f]/90 border-l border-white/5 backdrop-blur-xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-white/5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ROLE_COLORS[agent.role] }}
                  />
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-white/30">
                    {agent.role}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">{agent.name}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/8 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBg[agent.status]}`}>
              <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
              {statusLabels[agent.status]}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Personality */}
            <div className="px-5 py-4 border-b border-white/5">
              <p className="text-xs text-white/40 leading-relaxed">{agent.personality}</p>
            </div>

            {/* Stats grid */}
            <div className="px-5 py-4 border-b border-white/5">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/25 mb-3">Metrics</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Interactions', value: agent.interactions_count, suffix: '' },
                  { label: 'Accuracy', value: `${agent.accuracy}%`, suffix: '' },
                  { label: 'Connections', value: agent.connections.length, suffix: '' },
                  { label: 'Learning', value: `${agent.learning_progress}%`, suffix: '' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/4 rounded-xl p-3">
                    <div
                      className="text-lg font-bold tabular-nums"
                      style={{ color: ROLE_COLORS[agent.role] }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-white/35 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning progress bar */}
            <div className="px-5 py-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-white/25">Learning Progress</p>
                <span className="text-xs font-semibold" style={{ color: ROLE_COLORS[agent.role] }}>
                  {agent.learning_progress}%
                </span>
              </div>
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${agent.learning_progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  className="h-full rounded-full relative"
                  style={{ backgroundColor: ROLE_COLORS[agent.role] }}
                >
                  <div
                    className="absolute inset-0 rounded-full blur-sm opacity-60"
                    style={{ backgroundColor: ROLE_COLORS[agent.role] }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Connections */}
            <div className="px-5 py-4 border-b border-white/5">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/25 mb-2">Connected to</p>
              <div className="flex flex-wrap gap-1.5">
                {agent.connections.map((connId) => {
                  const connAgent = allAgents.find((a) => a.id === connId) ||
                    initialAgents.find((a) => a.id === connId)
                  if (!connAgent) return null
                  return (
                    <span
                      key={connId}
                      className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                      style={{
                        color: ROLE_COLORS[connAgent.role],
                        borderColor: `${ROLE_COLORS[connAgent.role]}40`,
                        backgroundColor: `${ROLE_COLORS[connAgent.role]}10`,
                      }}
                    >
                      {connAgent.name}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Recent activity */}
            <div className="px-5 py-4">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/25 mb-2">Recent Activity</p>
              <div className="space-y-2">
                {recentActivity.length === 0 ? (
                  <p className="text-xs text-white/25 italic">No recent activity</p>
                ) : (
                  recentActivity.slice(0, 5).map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-2"
                    >
                      <div
                        className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: ROLE_COLORS[agent.role] }}
                      />
                      <p className="text-[11px] text-white/45 leading-relaxed">{msg}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
