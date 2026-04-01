'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AgentRole, ROLE_COLORS } from '@/lib/agents'

interface AgentCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateAgent: (name: string, role: AgentRole, personality: string) => void
}

const roles: AgentRole[] = ['Analyst', 'Strategist', 'Creator', 'Guardian', 'Connector']

const roleDescriptions: Record<AgentRole, string> = {
  Analyst: 'Data-driven pattern recognition and synthesis',
  Strategist: 'Long-range planning and optimization',
  Creator: 'Novel synthesis and creative problem-solving',
  Guardian: 'System integrity and safety monitoring',
  Connector: 'Inter-agent coordination and communication',
}

export default function AgentCreationModal({ isOpen, onClose, onCreateAgent }: AgentCreationModalProps) {
  const [name, setName] = useState('')
  const [selectedRole, setSelectedRole] = useState<AgentRole | null>(null)
  const [personality, setPersonality] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !selectedRole) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSuccess(true)
    onCreateAgent(name.trim(), selectedRole, personality.trim() || `A ${selectedRole.toLowerCase()} agent focused on intelligent analysis and rapid adaptation.`)
    await new Promise((r) => setTimeout(r, 900))
    setSuccess(false)
    setName('')
    setSelectedRole(null)
    setPersonality('')
    onClose()
  }

  const canSubmit = name.trim().length > 0 && selectedRole !== null && !loading && !success

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md bg-[#0f0f18] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-6 pb-5 border-b border-white/8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Launch New Agent</h2>
                    <p className="text-xs text-white/35 mt-0.5">Define its role and personality</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/8 transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-2">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Axiom, Drift, Prism..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/25 focus:bg-white/8 transition-all"
                  />
                </div>

                {/* Role selector */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-2">
                    Role
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => {
                      const isSelected = selectedRole === role
                      const color = ROLE_COLORS[role]
                      return (
                        <button
                          key={role}
                          onClick={() => setSelectedRole(role)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150"
                          style={
                            isSelected
                              ? {
                                  backgroundColor: `${color}20`,
                                  borderColor: `${color}60`,
                                  color: color,
                                }
                              : {
                                  backgroundColor: 'transparent',
                                  borderColor: 'rgba(255,255,255,0.1)',
                                  color: 'rgba(255,255,255,0.4)',
                                }
                          }
                        >
                          {role}
                        </button>
                      )
                    })}
                  </div>
                  {selectedRole && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-white/30 mt-2"
                    >
                      {roleDescriptions[selectedRole]}
                    </motion.p>
                  )}
                </div>

                {/* Personality */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-2">
                    Personality <span className="text-white/20 normal-case">(optional)</span>
                  </label>
                  <textarea
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    placeholder="Describe how this agent thinks and operates..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/25 focus:bg-white/8 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <motion.button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  whileHover={canSubmit ? { scale: 1.02 } : {}}
                  whileTap={canSubmit ? { scale: 0.98 } : {}}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white relative overflow-hidden transition-opacity disabled:opacity-40"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600" />
                  <AnimatePresence mode="wait">
                    {success ? (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative flex items-center justify-center gap-2"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Agent Launched
                      </motion.span>
                    ) : loading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative flex items-center justify-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Launching...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative flex items-center justify-center gap-2"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Launch Agent
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
