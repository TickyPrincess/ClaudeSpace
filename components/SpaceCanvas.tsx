'use client'

import { useRef, useEffect, useCallback } from 'react'
import { Agent, ROLE_COLORS_HEX } from '@/lib/agents'

interface NodeState {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  baseX: number
  baseY: number
  phaseX: number
  phaseY: number
  pulsePhase: number
  spinAngle: number
}

interface SpaceCanvasProps {
  agents: Agent[]
  onAgentClick: (agent: Agent) => void
  selectedAgentId: string | null
}

const NODE_RADIUS = 28

function hexToRgb(role: Agent['role']) {
  return ROLE_COLORS_HEX[role]
}

export default function SpaceCanvas({ agents, onAgentClick, selectedAgentId }: SpaceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const nodesRef = useRef<NodeState[]>([])
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 })
  const hoveredRef = useRef<string | null>(null)
  const agentsRef = useRef<Agent[]>(agents)

  useEffect(() => {
    agentsRef.current = agents
  }, [agents])

  const initNodes = useCallback((width: number, height: number) => {
    // Arrange agents in a roughly circular pattern with some variation
    const count = agentsRef.current.length
    nodesRef.current = agentsRef.current.map((agent, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2
      const radiusX = width * 0.32
      const radiusY = height * 0.32
      const cx = width / 2
      const cy = height / 2
      const bx = cx + Math.cos(angle) * radiusX * (0.7 + Math.random() * 0.5)
      const by = cy + Math.sin(angle) * radiusY * (0.7 + Math.random() * 0.5)
      return {
        id: agent.id,
        x: bx,
        y: by,
        vx: 0,
        vy: 0,
        baseX: bx,
        baseY: by,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        pulsePhase: Math.random() * Math.PI * 2,
        spinAngle: 0,
      }
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      initNodes(canvas.width, canvas.height)
    }

    resize()
    const resizeObs = new ResizeObserver(resize)
    if (canvas.parentElement) resizeObs.observe(canvas.parentElement)

    let lastTime = 0

    function drawGlowCircle(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      rgb: { r: number; g: number; b: number },
      alpha: number,
      glowIntensity: number
    ) {
      // Outer glow layers
      for (let layer = 3; layer >= 1; layer--) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r * (1 + layer * 1.5))
        gradient.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha * 0.4 * glowIntensity / layer})`)
        gradient.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`)
        ctx.beginPath()
        ctx.arc(x, y, r * (1 + layer * 1.5), 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Inner fill
      const innerGrad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r)
      innerGrad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`)
      innerGrad.addColorStop(0.6, `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha * 0.8})`)
      innerGrad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha * 0.3})`)
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = innerGrad
      ctx.fill()

      // Rim highlight
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha * 0.9})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    function drawSpinArc(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      rgb: { r: number; g: number; b: number },
      angle: number
    ) {
      ctx.beginPath()
      ctx.arc(x, y, r + 8, angle, angle + Math.PI * 1.2)
      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.9)`
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x, y, r + 12, angle + Math.PI, angle + Math.PI + Math.PI * 0.8)
      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.4)`
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    function drawConnection(
      ctx: CanvasRenderingContext2D,
      x1: number, y1: number,
      x2: number, y2: number,
      rgb: { r: number; g: number; b: number },
      alpha: number,
      animated: boolean,
      time: number
    ) {
      if (animated) {
        // Animated dashes for interacting agents
        const dashOffset = (time * 0.04) % 30
        ctx.setLineDash([8, 14])
        ctx.lineDashOffset = -dashOffset
      } else {
        ctx.setLineDash([])
      }

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
      gradient.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`)
      gradient.addColorStop(0.5, `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha * 0.6})`)
      gradient.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`)

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = gradient
      ctx.lineWidth = animated ? 1.5 : 0.8
      ctx.stroke()
      ctx.setLineDash([])
    }

    const c = canvas
    const cx2 = ctx

    function animate(time: number) {
      const dt = Math.min(time - lastTime, 50)
      lastTime = time

      const W = c.width
      const H = c.height
      cx2.clearRect(0, 0, W, H)

      // Background grid (subtle)
      cx2.save()
      const gridSize = 60
      cx2.strokeStyle = 'rgba(255,255,255,0.025)'
      cx2.lineWidth = 0.5
      for (let gx = gridSize; gx < W; gx += gridSize) {
        cx2.beginPath(); cx2.moveTo(gx, 0); cx2.lineTo(gx, H); cx2.stroke()
      }
      for (let gy = gridSize; gy < H; gy += gridSize) {
        cx2.beginPath(); cx2.moveTo(0, gy); cx2.lineTo(W, gy); cx2.stroke()
      }
      cx2.restore()

      const currentAgents = agentsRef.current

      // Update node positions with sinusoidal drift
      nodesRef.current.forEach((node) => {
        const speed = 0.0004
        node.phaseX += speed * dt
        node.phaseY += speed * dt * 0.7
        node.pulsePhase += 0.002 * dt
        node.spinAngle += 0.002 * dt

        node.x = node.baseX + Math.sin(node.phaseX) * 22
        node.y = node.baseY + Math.cos(node.phaseY) * 18
      })

      const nodeMap = new Map(nodesRef.current.map((n) => [n.id, n]))

      // Draw connections first (behind nodes)
      currentAgents.forEach((agent) => {
        const fromNode = nodeMap.get(agent.id)
        if (!fromNode) return
        const fromRgb = hexToRgb(agent.role)

        agent.connections.forEach((targetId) => {
          const toNode = nodeMap.get(targetId)
          if (!toNode) return
          const targetAgent = currentAgents.find((a) => a.id === targetId)
          if (!targetAgent) return

          const isInteracting = agent.status === 'interacting' || targetAgent.status === 'interacting'
          const isSelected = selectedAgentId === agent.id || selectedAgentId === targetId
          const isHovered = hoveredRef.current === agent.id || hoveredRef.current === targetId

          const baseAlpha = isSelected || isHovered ? 0.5 : 0.12
          const alpha = isInteracting ? baseAlpha * 2 : baseAlpha

          // Only draw each connection once
          if (agent.id < targetId) {
            drawConnection(
              cx2,
              fromNode.x, fromNode.y,
              toNode.x, toNode.y,
              fromRgb,
              alpha,
              isInteracting,
              time
            )
          }
        })
      })

      // Draw nodes
      nodesRef.current.forEach((node) => {
        const agent = currentAgents.find((a) => a.id === node.id)
        if (!agent) return
        const rgb = hexToRgb(agent.role)
        const isSelected = selectedAgentId === agent.id
        const isHovered = hoveredRef.current === agent.id

        const pulseScale = 1 + Math.sin(node.pulsePhase) * 0.08
        const r = NODE_RADIUS * pulseScale * (isSelected ? 1.2 : isHovered ? 1.1 : 1)
        const glowIntensity = agent.status === 'active' || agent.status === 'interacting' ? 1.4 : 0.7

        drawGlowCircle(cx2, node.x, node.y, r, rgb, isSelected ? 1 : isHovered ? 0.95 : 0.85, glowIntensity)

        // Learning spin arc
        if (agent.status === 'learning') {
          drawSpinArc(cx2, node.x, node.y, r, rgb, node.spinAngle)
        }

        // Selected ring
        if (isSelected) {
          cx2.beginPath()
          cx2.arc(node.x, node.y, r + 6, 0, Math.PI * 2)
          cx2.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.6)`
          cx2.lineWidth = 2
          cx2.setLineDash([4, 6])
          cx2.stroke()
          cx2.setLineDash([])
        }

        // Agent name label
        cx2.font = `600 11px -apple-system, BlinkMacSystemFont, "Inter", sans-serif`
        cx2.textAlign = 'center'
        cx2.textBaseline = 'middle'
        cx2.fillStyle = `rgba(255,255,255,${isHovered || isSelected ? 1 : 0.85})`
        cx2.fillText(agent.name, node.x, node.y)

        // Status dot under name
        const statusColors: Record<string, string> = {
          active: '#10b981',
          learning: '#f59e0b',
          idle: '#6b7280',
          interacting: '#00d4ff',
        }
        cx2.beginPath()
        cx2.arc(node.x, node.y + r + 10, 3, 0, Math.PI * 2)
        cx2.fillStyle = statusColors[agent.status] || '#6b7280'
        cx2.fill()
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      resizeObs.disconnect()
    }
  }, [initNodes])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    mouseRef.current = { x: mx, y: my }

    let hovered: string | null = null
    for (const node of nodesRef.current) {
      const dx = node.x - mx
      const dy = node.y - my
      if (Math.sqrt(dx * dx + dy * dy) < NODE_RADIUS + 12) {
        hovered = node.id
        break
      }
    }
    hoveredRef.current = hovered
    canvas.style.cursor = hovered ? 'pointer' : 'default'
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top

      for (const node of nodesRef.current) {
        const dx = node.x - mx
        const dy = node.y - my
        if (Math.sqrt(dx * dx + dy * dy) < NODE_RADIUS + 12) {
          const agent = agentsRef.current.find((a) => a.id === node.id)
          if (agent) onAgentClick(agent)
          return
        }
      }
    },
    [onAgentClick]
  )

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className="absolute inset-0 w-full h-full"
    />
  )
}
