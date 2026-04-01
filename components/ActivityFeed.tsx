'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ActivityEvent, formatRelativeTime } from '@/lib/activity'
import type { ReactElement } from 'react'

interface ActivityFeedProps {
  events: ActivityEvent[]
}

const typeIcons: Record<ActivityEvent['type'], ReactElement> = {
  interaction: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
      <path d="M8 12h8M12 8l4 4-4 4" />
    </svg>
  ),
  learning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  improvement: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  status: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
}

const typeColors: Record<ActivityEvent['type'], string> = {
  interaction: 'text-cyan-400',
  learning: 'text-amber-400',
  improvement: 'text-emerald-400',
  status: 'text-purple-400',
}

const typeBg: Record<ActivityEvent['type'], string> = {
  interaction: 'bg-cyan-500/10',
  learning: 'bg-amber-500/10',
  improvement: 'bg-emerald-500/10',
  status: 'bg-purple-500/10',
}

export default function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2.5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
          </div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-white/25">Live Feed</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <AnimatePresence mode="popLayout">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/3 transition-colors group"
            >
              <div className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center mt-0.5 ${typeBg[event.type]}`}>
                <span className={typeColors[event.type]}>{typeIcons[event.type]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/60 leading-relaxed">{event.message}</p>
                <p className="text-[10px] text-white/25 mt-0.5">{formatRelativeTime(event.timestamp)}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
