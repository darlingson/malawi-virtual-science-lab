"use client"

import { useState, useEffect, useRef } from "react"

interface LandslideSimulationProps {
  slopeAngle: number
  waterContent: number
  soilType: string
  isRunning: boolean
  onReset: () => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  settled: boolean
}

export default function LandslideSimulation({
  slopeAngle,
  waterContent,
  soilType,
  isRunning,
  onReset,
}: LandslideSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [particles, setParticles] = useState<Particle[]>([])
  const [simulationStarted, setSimulationStarted] = useState(false)

  // Initialize particles based on soil type and slope
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const width = canvas.width
    const height = canvas.height

    const newParticles: Particle[] = []
    const particleCount = soilType === "Rock" ? 50 : soilType === "Sand" ? 150 : 100

    // Create slope terrain
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * (width * 0.8) + width * 0.1
      const slopeHeight = height * 0.3 + (x / width) * Math.tan((slopeAngle * Math.PI) / 180) * height * 0.4
      const y = Math.min(slopeHeight + Math.random() * 50, height - 10)

      let color = "#8B4513" // Default brown
      let size = 3

      switch (soilType) {
        case "Clay":
          color = waterContent > 50 ? "#654321" : "#8B4513"
          size = 2
          break
        case "Sand":
          color = "#F4A460"
          size = 1.5
          break
        case "Rock":
          color = "#696969"
          size = 4
          break
        case "Mixed":
          color = Math.random() > 0.5 ? "#8B4513" : "#F4A460"
          size = 2 + Math.random() * 2
          break
      }

      newParticles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        size,
        color,
        settled: true,
      })
    }

    setParticles(newParticles)
    setSimulationStarted(false)
  }, [slopeAngle, waterContent, soilType, onReset])

  // Animation loop
  useEffect(() => {
    if (!isRunning || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw slope background
      ctx.fillStyle = "#2D5016"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw slope line
      ctx.strokeStyle = "#4A7C59"
      ctx.lineWidth = 2
      ctx.beginPath()
      const startY = canvas.height * 0.3
      const endY = startY + Math.tan((slopeAngle * Math.PI) / 180) * canvas.width * 0.4
      ctx.moveTo(0, startY)
      ctx.lineTo(canvas.width, endY)
      ctx.stroke()

      // Update and draw particles
      setParticles((prevParticles) => {
        return prevParticles.map((particle) => {
          if (!simulationStarted && isRunning) {
            // Start landslide based on conditions
            const instabilityFactor = (slopeAngle - 15) / 45 + waterContent / 100
            const soilStability = soilType === "Rock" ? 0.8 : soilType === "Clay" ? 0.3 : 0.5

            if (Math.random() < instabilityFactor - soilStability + 0.1) {
              particle.settled = false
              particle.vx = (Math.random() - 0.5) * 2
              particle.vy = Math.random() * 2 + 1
            }
          }

          if (!particle.settled) {
            // Apply gravity and slope forces
            const gravity = 0.2
            const slopeForce = Math.sin((slopeAngle * Math.PI) / 180) * 0.3
            const friction = soilType === "Rock" ? 0.95 : soilType === "Sand" ? 0.98 : 0.92

            particle.vy += gravity
            particle.vx += slopeForce

            // Water effect - more fluid movement
            if (waterContent > 50) {
              particle.vx *= 1.02
              particle.vy *= 1.01
            }

            particle.x += particle.vx
            particle.y += particle.vy

            // Apply friction
            particle.vx *= friction
            particle.vy *= friction

            // Boundary conditions
            if (particle.y >= canvas.height - particle.size) {
              particle.y = canvas.height - particle.size
              particle.vy *= -0.3
              particle.vx *= 0.8

              if (Math.abs(particle.vy) < 0.5 && Math.abs(particle.vx) < 0.5) {
                particle.settled = true
                particle.vx = 0
                particle.vy = 0
              }
            }

            if (particle.x <= 0 || particle.x >= canvas.width) {
              particle.vx *= -0.5
            }
          }

          // Draw particle
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          // Add water effect visualization
          if (waterContent > 30 && !particle.settled) {
            ctx.fillStyle = `rgba(100, 149, 237, ${waterContent / 200})`
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size + 1, 0, Math.PI * 2)
            ctx.fill()
          }

          return particle
        })
      })

      if (!simulationStarted) {
        setSimulationStarted(true)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, slopeAngle, waterContent, soilType, simulationStarted])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={450}
      className="w-full h-full rounded-lg border border-border/50"
      style={{ background: "linear-gradient(to bottom, #87CEEB 0%, #2D5016 30%)" }}
    />
  )
}
