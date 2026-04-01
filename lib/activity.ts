export interface ActivityEvent {
  id: string
  timestamp: Date
  message: string
  type: 'interaction' | 'learning' | 'improvement' | 'status'
}

export const initialEvents: ActivityEvent[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 8000),
    message: 'Orion detected anomaly pattern in sector 7 data',
    type: 'interaction',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 16000),
    message: 'Nova interacted with Cipher — 3 new synthesis paths',
    type: 'interaction',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 24000),
    message: 'Atlas improved accuracy by 2%',
    type: 'improvement',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 35000),
    message: 'Cipher entered deep learning cycle',
    type: 'learning',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 50000),
    message: 'Nexus coordinated exchange between 4 agents',
    type: 'interaction',
  },
]

const interactionMessages = [
  (a: string, b: string) => `${a} interacted with ${b}`,
  (a: string, b: string) => `${a} shared pattern data with ${b}`,
  (a: string, b: string) => `${a} synchronized with ${b}`,
  (a: string, b: string) => `${a} received signal from ${b}`,
  (a: string, b: string) => `${a} and ${b} completed joint analysis`,
]

const learningMessages = [
  (a: string, b: string) => `${a} learned new pattern from ${b}`,
  (a: string, b: string) => `${a} absorbed knowledge cluster from ${b}`,
  (a: string, b: string) => `${a} updated model based on ${b}'s output`,
]

const improvementMessages = [
  (a: string) => `${a} improved accuracy by ${Math.floor(Math.random() * 15) + 3}%`,
  (a: string) => `${a} optimized response latency`,
  (a: string) => `${a} completed learning cycle — confidence up`,
  (a: string) => `${a} recalibrated decision threshold`,
]

const statusMessages = [
  (a: string) => `${a} entered active state`,
  (a: string) => `${a} transitioned to learning mode`,
  (a: string) => `${a} resumed from idle`,
  (a: string) => `${a} flagged interaction anomaly — resolved`,
]

const agentNames = ['Orion', 'Nova', 'Atlas', 'Cipher', 'Echo', 'Lyra', 'Nexus', 'Vega', 'Zephyr', 'Pulse']

function randomAgent(): string {
  return agentNames[Math.floor(Math.random() * agentNames.length)]
}

function randomOtherAgent(exclude: string): string {
  let agent = randomAgent()
  while (agent === exclude) {
    agent = randomAgent()
  }
  return agent
}

export function generateRandomEvent(): ActivityEvent {
  const types: ActivityEvent['type'][] = ['interaction', 'learning', 'improvement', 'status']
  const type = types[Math.floor(Math.random() * types.length)]
  const agentA = randomAgent()
  const agentB = randomOtherAgent(agentA)

  let message = ''
  switch (type) {
    case 'interaction': {
      const fn = interactionMessages[Math.floor(Math.random() * interactionMessages.length)]
      message = fn(agentA, agentB)
      break
    }
    case 'learning': {
      const fn = learningMessages[Math.floor(Math.random() * learningMessages.length)]
      message = fn(agentA, agentB)
      break
    }
    case 'improvement': {
      const fn = improvementMessages[Math.floor(Math.random() * improvementMessages.length)]
      message = fn(agentA)
      break
    }
    case 'status': {
      const fn = statusMessages[Math.floor(Math.random() * statusMessages.length)]
      message = fn(agentA)
      break
    }
  }

  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date(),
    message,
    type,
  }
}

export function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return `${Math.floor(seconds / 3600)}h ago`
}
