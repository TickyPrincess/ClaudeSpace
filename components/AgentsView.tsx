'use client'

import { motion } from 'framer-motion'
import { Agent, ROLE_COLORS } from '@/lib/agents'

interface AgentsViewProps {
  agents: Agent[]
  onAgentSelect: (agent: Agent) => void
  selectedAgentId: string | null
}

const statusColors: Record<string, string> = {
  active: '#10b981',
  learning: '#f59e0b',
  idle: '#6b7280',
  interacting: '#00d4ff',
}

const statusLabel: Record<string, string> = {
  active: 'Active',
  learning: 'Learning',
  idle: 'Idle',
  interacting: 'Interacting',
}

const roleDescriptions: Record<string, string> = {
  Analyst: 'Data synthesis & pattern recognition',
  Strategist: 'Long-range planning & optimization',
  Creator: 'Novel ideation & generative output',
  Guardian: 'System integrity & safety monitoring',
  Connector: 'Inter-agent coordination & bridging',
}

export default function AgentsView({ agents, onAgentSelect, selectedAgentId }: AgentsViewProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white/90 tracking-tight">Agents</h2>
          <p className="text-sm text-white/35 mt-0.5">{agents.length} agents deployed in this space</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {agents.map((agent, i) => {
            const roleColor = ROLE_COLORS[agent.role]
            const sColor = statusColors[agent.status]
            const isSelected = selectedAgentId === agent.id

            return (
              <motion.button
                key={agent.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.045, duration: 0.35 }}
                onClick={() => onAgentSelect(agent)}
                className="relative text-left rounded-2xl border overflow-hidden group transition-all duration-200"
                style={{
                  borderColor: isSelected ? `${roleColor}60` : 'rgba(255,255,255,0.06)',
                  background: isSelected
                    ? `linear-gradient(135deg, ${roleColor}0d 0%, rgba(10,10,15,0.95) 60%)`
                    : 'rgba(255,255,255,0.02)',
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Top glow bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-px transition-opacity duration-200"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${roleColor}80, transparent)`,
                    opacity: isSelected ? 1 : 0.3,
                  }}
                />

                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar circle */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          background: `${roleColor}18`,
                          color: roleColor,
                          boxShadow: `0 0 16px ${roleColor}25`,
                        }}
                      >
                        {agent.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white/90">{agent.name}</div>
                        <div className="text-[10px] text-white/35 mt-0.5">{roleDescriptions[agent.role]}</div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sColor }} />
                        {(agent.status === 'active' || agent.status === 'interacting') && (
                          <div
                            className="absolute inset-0 rounded-full animate-ping opacity-60"
                            style={{ backgroundColor: sColor }}
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-white/40">{statusLabel[agent.status]}</span>
                    </div>
                  </div>

                  {/* Role badge */}
                  <div className="mb-3">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ color: roleColor, background: `${roleColor}18`, border: `1px solid ${roleColor}30` }}
                    >
                      {agent.role}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: 'Accuracy', value: `${agent.accuracy}%` },
                      { label: 'Interactions', value: agent.interactions_count.toString() },
                      { label: 'Learning', value: `${agent.learning_progress}%` },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-lg p-2 text-center"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                      >
                        <div className="text-sm font-semibold text-white/80">{stat.value}</div>
                        <div className="text-[9px] text-white/30 mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Learning progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-white/25 uppercase tracking-wider">Learning progress</span>
                      <span className="text-[10px] text-white/40">{agent.learning_progress}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.learning_progress}%` }}
                        transition={{ delay: i * 0.05 + 0.3, duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${roleColor}80, ${roleColor})` }}
                      />
                    </div>
                  </div>

                  {/* Personality */}
                  <p className="text-[10px] text-white/30 leading-relaxed line-clamp-2">{agent.personality}</p>

                  {/* Connections */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {agent.connections.slice(0, 3).map((connId) => (
                      <span
                        key={connId}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-white/4 text-white/30 capitalize"
                      >
                        {connId}
                      </span>
                    ))}
                    {agent.connections.length > 3 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/4 text-white/20">
                        +{agent.connections.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
