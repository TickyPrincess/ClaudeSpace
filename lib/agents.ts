export type AgentRole = 'Analyst' | 'Strategist' | 'Creator' | 'Guardian' | 'Connector'
export type AgentStatus = 'active' | 'learning' | 'idle' | 'interacting'

export interface Agent {
  id: string
  name: string
  role: AgentRole
  status: AgentStatus
  learning_progress: number
  interactions_count: number
  accuracy: number
  connections: string[]
  personality: string
}

export const ROLE_COLORS: Record<AgentRole, string> = {
  Analyst: '#00d4ff',
  Strategist: '#7c3aed',
  Creator: '#f59e0b',
  Guardian: '#10b981',
  Connector: '#f43f5e',
}

export const ROLE_COLORS_HEX: Record<AgentRole, { r: number; g: number; b: number }> = {
  Analyst: { r: 0, g: 212, b: 255 },
  Strategist: { r: 124, g: 58, b: 237 },
  Creator: { r: 245, g: 158, b: 11 },
  Guardian: { r: 16, g: 185, b: 129 },
  Connector: { r: 244, g: 63, b: 94 },
}

export const initialAgents: Agent[] = [
  {
    id: 'orion',
    name: 'Orion',
    role: 'Analyst',
    status: 'active',
    learning_progress: 78,
    interactions_count: 342,
    accuracy: 94,
    connections: ['atlas', 'nova', 'cipher'],
    personality: 'Methodical and precise. Excels at pattern recognition and data synthesis. Approaches problems with systematic rigor.',
  },
  {
    id: 'nova',
    name: 'Nova',
    role: 'Creator',
    status: 'interacting',
    learning_progress: 65,
    interactions_count: 218,
    accuracy: 87,
    connections: ['orion', 'lyra', 'pulse'],
    personality: 'Imaginative and expressive. Generates novel solutions by connecting disparate ideas in unexpected ways.',
  },
  {
    id: 'atlas',
    name: 'Atlas',
    role: 'Guardian',
    status: 'active',
    learning_progress: 91,
    interactions_count: 503,
    accuracy: 97,
    connections: ['orion', 'nexus', 'vega'],
    personality: 'Reliable and protective. Monitors system integrity and ensures all agents operate within safe parameters.',
  },
  {
    id: 'cipher',
    name: 'Cipher',
    role: 'Strategist',
    status: 'learning',
    learning_progress: 45,
    interactions_count: 156,
    accuracy: 82,
    connections: ['orion', 'zephyr', 'nexus'],
    personality: 'Strategic and calculating. Specializes in long-range planning and multi-variable optimization.',
  },
  {
    id: 'echo',
    name: 'Echo',
    role: 'Connector',
    status: 'active',
    learning_progress: 72,
    interactions_count: 441,
    accuracy: 90,
    connections: ['lyra', 'pulse', 'vega'],
    personality: 'Empathetic and adaptive. Bridges communication between agents with different operational styles.',
  },
  {
    id: 'lyra',
    name: 'Lyra',
    role: 'Creator',
    status: 'idle',
    learning_progress: 58,
    interactions_count: 189,
    accuracy: 85,
    connections: ['nova', 'echo', 'pulse'],
    personality: 'Harmonious and intuitive. Creates coherent narratives from fragmented data streams.',
  },
  {
    id: 'nexus',
    name: 'Nexus',
    role: 'Connector',
    status: 'interacting',
    learning_progress: 83,
    interactions_count: 677,
    accuracy: 93,
    connections: ['atlas', 'cipher', 'zephyr'],
    personality: 'Central and integrative. Acts as the primary hub for inter-agent communication and coordination.',
  },
  {
    id: 'vega',
    name: 'Vega',
    role: 'Analyst',
    status: 'learning',
    learning_progress: 39,
    interactions_count: 124,
    accuracy: 79,
    connections: ['atlas', 'echo', 'zephyr'],
    personality: 'Curious and exploratory. Constantly probing the edges of known data to discover emerging patterns.',
  },
  {
    id: 'zephyr',
    name: 'Zephyr',
    role: 'Strategist',
    status: 'active',
    learning_progress: 86,
    interactions_count: 312,
    accuracy: 91,
    connections: ['cipher', 'nexus', 'vega'],
    personality: 'Fluid and adaptive. Adjusts strategy in real-time based on shifting environmental conditions.',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    role: 'Guardian',
    status: 'active',
    learning_progress: 74,
    interactions_count: 289,
    accuracy: 88,
    connections: ['nova', 'echo', 'lyra'],
    personality: 'Vigilant and responsive. Monitors interaction patterns and flags anomalies before they escalate.',
  },
]
