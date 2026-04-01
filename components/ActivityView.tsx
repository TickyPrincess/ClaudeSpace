'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ActivityEvent, formatRelativeTime } from '@/lib/activity'

interface ActivityViewProps {
  events: ActivityEvent[]
}

const typeConfig = {
  interaction: { color: '#00d4ff', label: 'Interaction', icon: '⇄' },
  learning: { color: '#f59e0b', label: 'Learning', icon: '◎' },
  improvement: { color: '#10b981', label: 'Improvement', icon: '↑' },
  status: { color: '#a78bfa', label: 'Status', icon: '◈' },
}

type FilterType = 'all' | ActivityEvent['type']

export default function ActivityView({ events }: ActivityViewProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = filter === 'all' ? events : events.filter((e) => e.type === filter)

  const counts: Record<string, number> = {
    all: events.length,
    interaction: events.filter((e) => e.type === 'interaction').length,
    learning: events.filter((e) => e.type === 'learning').length,
    improvement: events.filter((e) => e.type === 'improvement').length,
    status: events.filter((e) => e.type === 'status').length,
  }

  const filters: { id: FilterType; label: string; color: string }[] = [
    { id: 'all', label: 'All', color: '#ffffff' },
    { id: 'interaction', label: 'Interactions', color: typeConfig.interaction.color },
    { id: 'learning', label: 'Learning', color: typeConfig.learning.color },
    { id: 'improvement', label: 'Improvements', color: typeConfig.improvement.color },
    { id: 'status', label: 'Status', color: typeConfig.status.color },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white/90 tracking-tight">Activity</h2>
          <p className="text-sm text-white/35 mt-0.5">Live feed of agent events</p>
        </div>

        {/* Filter pills */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          {filters.map((f) => {
            const isActive = filter === f.id
            return (
              <motion.button
                key={f.id}
                onClick={() => setFilter(f.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
                style={{
                  borderColor: isActive ? `${f.color}60` : 'rgba(255,255,255,0.06)',
                  background: isActive ? `${f.color}15` : 'rgba(255,255,255,0.02)',
                  color: isActive ? f.color : 'rgba(255,255,255,0.35)',
                }}
              >
                {f.label}
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? `${f.color}25` : 'rgba(255,255,255,0.05)',
                    color: isActive ? f.color : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {counts[f.id]}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
          </div>
          <span className="text-[11px] text-white/30">Live — updating in real time</span>
        </div>

        {/* Events list */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((event, i) => {
              const cfg = typeConfig[event.type]
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                  transition={{ delay: i < 5 ? i * 0.04 : 0, duration: 0.25 }}
                  className="flex items-start gap-3 rounded-xl border border-white/4 p-3.5 group hover:border-white/8 transition-colors duration-200"
                  style={{ background: i === 0 ? `${cfg.color}07` : 'rgba(255,255,255,0.02)' }}
                >
                  {/* Icon */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                    style={{ background: `${cfg.color}18`, color: cfg.color }}
                  >
                    {cfg.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 leading-relaxed">{event.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                        style={{ color: cfg.color, background: `${cfg.color}18` }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-[10px] text-white/20">
                        {formatRelativeTime(event.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Latest indicator */}
                  {i === 0 && (
                    <div
                      className="text-[9px] font-semibold px-2 py-1 rounded-full flex-shrink-0"
                      style={{ color: cfg.color, background: `${cfg.color}18` }}
                    >
                      latest
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-white/20 text-sm"
            >
              No events of this type yet
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
