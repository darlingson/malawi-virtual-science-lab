"use client"

import { useState, useEffect, useRef } from "react"

interface FloodSimulationProps {
  rainfallIntensity: number
  terrainSlope: number
  groundSaturation: number
  isRunning: boolean
  onReset: () => void
}

interface WaterParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

interface TerrainPoint {
  x: number
  y: number
  height: number
  saturation: number
}

export default function FloodSimulation({
  rainfallIntensity,
  terrainSlope,
  groundSaturation,
  isRunning,
  onReset,
}: FloodSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [waterParticles, setWaterParticles] = useState<WaterParticle[]>([])
  const [terrain, setTerrain] = useState<TerrainPoint[]>([])
  const [waterLevel, setWaterLevel] = useState(0)

  // Initialize terrain
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const width = canvas.width
    const height = canvas.height

    const newTerrain: TerrainPoint[] = []
    const points = 100

    for (let i = 0; i < points; i++) {
      const x = (i / points) * width
      const baseHeight = height * 0.7
      const slopeEffect = (x / width) * terrainSlope * 0.01 * height
      const randomVariation = (Math.sin(x * 0.02) + Math.cos(x * 0.015)) * 20
      const y = baseHeight + slopeEffect + randomVariation

      newTerrain.push({
        x,
        y: Math.max(y, height * 0.4),
        height: Math.max(y, height * 0.4),
        saturation: groundSaturation / 100,
      })
    }

    setTerrain(newTerrain)
    setWaterParticles([])
    setWaterLevel(0)
  }, [terrainSlope, groundSaturation, onReset])

  // Animation loop
  useEffect(() => {
    if (!isRunning || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw sky with rain clouds
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.4)
      gradient.addColorStop(0, "#2C3E50")
      gradient.addColorStop(1, "#34495E")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4)

      // Draw terrain
      ctx.fillStyle = "#8B4513"
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)
      terrain.forEach((point, index) => {
        if (index === 0) {
          ctx.lineTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })
      ctx.lineTo(canvas.width, canvas.height)
      ctx.closePath()
      ctx.fill()

      // Draw grass on terrain
      ctx.strokeStyle = "#228B22"
      ctx.lineWidth = 1
      terrain.forEach((point, index) => {
        if (index % 5 === 0) {
          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
          ctx.lineTo(point.x, point.y - 5)
          ctx.stroke()
        }
      })

      // Generate rain particles
      if (Math.random() < rainfallIntensity * 0.1) {
        const newRainParticles: WaterParticle[] = []
        for (let i = 0; i < rainfallIntensity * 2; i++) {
          newRainParticles.push({
            x: Math.random() * canvas.width,
            y: -10,
            vx: Math.random() * 2 - 1,
            vy: 3 + rainfallIntensity * 0.5,
            size: 1 + Math.random(),
            opacity: 0.6 + Math.random() * 0.4,
          })
        }

        setWaterParticles((prev) => [...prev, ...newRainParticles])
      }

      // Update and draw water particles
      setWaterParticles((prevParticles) => {
        return prevParticles.filter((particle) => {
          // Update particle position
          particle.x += particle.vx
          particle.y += particle.vy

          // Check terrain collision
          const terrainIndex = Math.floor((particle.x / canvas.width) * terrain.length)
          const terrainPoint = terrain[terrainIndex]

          if (terrainPoint && particle.y >= terrainPoint.y) {
            // Water hits ground
            if (terrainPoint.saturation < 1) {
              // Ground absorbs some water
              terrainPoint.saturation = Math.min(1, terrainPoint.saturation + 0.01)
              return false // Remove particle
            } else {
              // Ground is saturated, water flows
              particle.y = terrainPoint.y - 2
              particle.vy = 0
              particle.vx = terrainSlope * 0.1 + Math.random() * 2

              // Add some turbulence
              if (Math.random() < 0.1) {
                particle.vy = -1
              }
            }
          }

          // Remove particles that go off screen
          if (particle.x < -10 || particle.x > canvas.width + 10 || particle.y > canvas.height + 10) {
            return false
          }

          // Draw particle
          ctx.fillStyle = `rgba(100, 149, 237, ${particle.opacity})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          return true
        })
      })

      // Draw water accumulation areas
      const saturatedAreas = terrain.filter((point) => point.saturation > 0.8)
      if (saturatedAreas.length > 0) {
        ctx.fillStyle = "rgba(100, 149, 237, 0.3)"
        saturatedAreas.forEach((point) => {
          const waterHeight = (point.saturation - 0.8) * 20
          ctx.fillRect(point.x - 2, point.y - waterHeight, 4, waterHeight)
        })
      }

      // Draw rainfall lines
      ctx.strokeStyle = "rgba(200, 200, 255, 0.3)"
      ctx.lineWidth = 1
      for (let i = 0; i < rainfallIntensity * 10; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height * 0.4
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - 2, y + 10)
        ctx.stroke()
      }

      // Draw flood warning if conditions are severe
      const floodRisk = (rainfallIntensity / 10) * (terrainSlope / 20) * (groundSaturation / 100)
      if (floodRisk > 0.3) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.7)"
        ctx.font = "16px Arial"
        ctx.fillText("FLOOD WARNING", 10, 30)

        if (floodRisk > 0.6) {
          ctx.fillStyle = "rgba(255, 255, 0, 0.2)"
          ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.2)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, rainfallIntensity, terrainSlope, groundSaturation, terrain])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={450}
      className="w-full h-full rounded-lg border border-border/50"
      style={{ background: "linear-gradient(to bottom, #87CEEB 0%, #98FB98 70%, #8B4513 100%)" }}
    />
  )
}
