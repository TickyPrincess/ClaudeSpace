'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import AgentDetail from '@/components/AgentDetail'
import ActivityFeed from '@/components/ActivityFeed'
import AgentCreationModal from '@/components/AgentCreationModal'
import AgentsView from '@/components/AgentsView'
import LearningView from '@/components/LearningView'
import ActivityView from '@/components/ActivityView'
import { Agent, AgentRole, AgentStatus, initialAgents } from '@/lib/agents'
import { ActivityEvent, initialEvents, generateRandomEvent } from '@/lib/activity'

// Dynamic import for canvas (client-only)
const SpaceCanvas = dynamic(() => import('@/components/SpaceCanvas'), { ssr: false })

function getAgentActivity(agentName: string, events: ActivityEvent[]): string[] {
  return events
    .filter((e) => e.message.includes(agentName))
    .map((e) => e.message)
}

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [events, setEvents] = useState<ActivityEvent[]>(initialEvents)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeView, setActiveView] = useState('space')

  // Live activity feed ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = generateRandomEvent()
      setEvents((prev) => [newEvent, ...prev].slice(0, 8))

      // Randomly update agent statuses to simulate life
      setAgents((prev) => {
        const idx = Math.floor(Math.random() * prev.length)
        const statuses: AgentStatus[] = ['active', 'learning', 'idle', 'interacting']
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
        return prev.map((a, i) =>
          i === idx ? { ...a, status: newStatus } : a
        )
      })
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const handleAgentClick = useCallback((agent: Agent) => {
    setSelectedAgent((prev) => (prev?.id === agent.id ? null : agent))
  }, [])

  const handleCreateAgent = useCallback(
    (name: string, role: AgentRole, personality: string) => {
      const newAgent: Agent = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        role,
        status: 'active',
        learning_progress: 0,
        interactions_count: 0,
        accuracy: 70 + Math.floor(Math.random() * 20),
        connections: agents.slice(0, 2).map((a) => a.id),
        personality,
      }
      setAgents((prev) => [...prev, newAgent])
      const launchEvent: ActivityEvent = {
        id: `launch-${Date.now()}`,
        timestamp: new Date(),
        message: `${name} has joined the space as ${role}`,
        type: 'status',
      }
      setEvents((prev) => [launchEvent, ...prev].slice(0, 8))
    },
    [agents]
  )

  const activeAgentActivity = selectedAgent
    ? getAgentActivity(selectedAgent.name, events)
    : []

  return (
    <div className="flex flex-col h-dvh bg-[#0a0a0f] overflow-hidden">
      {/* Top bar */}
      <TopBar agents={agents} />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          agents={agents}
          selectedAgentId={selectedAgent?.id ?? null}
          onAgentSelect={handleAgentClick}
          onLaunchAgent={() => setModalOpen(true)}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Center canvas area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Subtle radial bg glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-900/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-900/8 rounded-full blur-[100px]" />
          </div>

          {/* View switcher */}
          <motion.div
            key={activeView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {activeView === 'space' && (
              <>
                <div className="relative flex-1">
                  <SpaceCanvas
                    agents={agents}
                    onAgentClick={handleAgentClick}
                    selectedAgentId={selectedAgent?.id ?? null}
                  />
                  {selectedAgent === null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none"
                    >
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/4 border border-white/8 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        <span className="text-[11px] text-white/30">Click any agent to inspect</span>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div className="flex-shrink-0 h-44 border-t border-white/5 bg-[#0a0a0f]/80 backdrop-blur-lg">
                  <ActivityFeed events={events} />
                </div>
              </>
            )}

            {activeView === 'agents' && (
              <AgentsView
                agents={agents}
                onAgentSelect={handleAgentClick}
                selectedAgentId={selectedAgent?.id ?? null}
              />
            )}

            {activeView === 'learning' && (
              <LearningView agents={agents} />
            )}

            {activeView === 'activity' && (
              <ActivityView events={events} />
            )}
          </motion.div>
        </main>

        {/* Right panel — agent detail */}
        <AgentDetail
          agent={selectedAgent}
          allAgents={agents}
          onClose={() => setSelectedAgent(null)}
          recentActivity={activeAgentActivity}
        />
      </div>

      {/* Agent creation modal */}
      <AgentCreationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreateAgent={handleCreateAgent}
      />
    </div>
  )
}
