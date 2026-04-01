'use client'

import { motion } from 'framer-motion'
import { Agent, ROLE_COLORS } from '@/lib/agents'

interface LearningViewProps {
  agents: Agent[]
}

const learningInsights = [
  'Pattern cluster recognized across 3 agents',
  'Collective accuracy trending +4.2% this cycle',
  'Cross-agent knowledge transfer active',
  'Anomaly detection model updated',
  'Behavioral adaptation protocols synchronized',
]

export default function LearningView({ agents }: LearningViewProps) {
  const learningAgents = agents.filter((a) => a.status === 'learning')
  const avgProgress = Math.round(agents.reduce((s, a) => s + a.learning_progress, 0) / agents.length)
  const avgAccuracy = Math.round(agents.reduce((s, a) => s + a.accuracy, 0) / agents.length)

  const sorted = [...agents].sort((a, b) => b.learning_progress - a.learning_progress)

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white/90 tracking-tight">Learning</h2>
          <p className="text-sm text-white/35 mt-0.5">
            {learningAgents.length} active learning cycle{learningAgents.length !== 1 ? 's' : ''} running
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Avg Learning Progress', value: `${avgProgress}%`, color: '#f59e0b', icon: '◎' },
            { label: 'Avg Accuracy', value: `${avgAccuracy}%`, color: '#10b981', icon: '◈' },
            { label: 'Active Cycles', value: learningAgents.length.toString(), color: '#00d4ff', icon: '⟳' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/6 p-4"
              style={{ background: `${card.color}08` }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: card.color }}>
                {card.value}
              </div>
              <div className="text-[11px] text-white/35">{card.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Active learning agents highlight */}
        {learningAgents.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-3">
              Currently Learning
            </p>
            <div className="flex gap-2 flex-wrap">
              {learningAgents.map((agent) => {
                const color = ROLE_COLORS[agent.role]
                return (
                  <motion.div
                    key={agent.id}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
                    style={{ borderColor: `${color}40`, background: `${color}10` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: color }} />
                    <span className="text-xs font-medium" style={{ color }}>{agent.name}</span>
                    <span className="text-[10px] text-white/30">{agent.learning_progress}%</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* All agents progress list */}
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-3">
            Progress by Agent
          </p>
          <div className="space-y-2">
            {sorted.map((agent, i) => {
              const color = ROLE_COLORS[agent.role]
              const isLearning = agent.status === 'learning'
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 rounded-xl p-3 border border-white/4"
                  style={{ background: isLearning ? `${color}08` : 'rgba(255,255,255,0.02)' }}
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${color}18`, color }}
                  >
                    {agent.name[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-white/80">{agent.name}</span>
                        <span
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ color, background: `${color}18` }}
                        >
                          {agent.role}
                        </span>
                        {isLearning && (
                          <span className="text-[9px] text-amber-400/70">● Learning</span>
                        )}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: color }}>
                        {agent.learning_progress}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.learning_progress}%` }}
                        transition={{ delay: i * 0.04 + 0.2, duration: 0.9, ease: 'easeOut' }}
                        className="h-full rounded-full relative overflow-hidden"
                        style={{ background: `linear-gradient(90deg, ${color}60, ${color})` }}
                      >
                        {isLearning && (
                          <motion.div
                            className="absolute inset-y-0 w-8 bg-white/20"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            style={{ filter: 'blur(4px)' }}
                          />
                        )}
                      </motion.div>
                    </div>
                  </div>

                  {/* Accuracy */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-semibold text-white/60">{agent.accuracy}%</div>
                    <div className="text-[9px] text-white/25">accuracy</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Insights */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-3">
            System Insights
          </p>
          <div className="space-y-1.5">
            {learningInsights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-white/4 bg-white/2"
              >
                <div className="w-1 h-1 rounded-full bg-cyan-400/60 flex-shrink-0" />
                <span className="text-xs text-white/40">{insight}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
