"use client"

import { useState, useEffect, useRef } from "react"

interface LakeFormationSimulationProps {
  formationType: string
  waterFlow: number
  timeScale: number
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
  originalY: number
  erosion: number
}

interface IceSheet {
  x: number
  y: number
  width: number
  height: number
  melting: boolean
}

export default function LakeFormationSimulation({
  formationType,
  waterFlow,
  timeScale,
  isRunning,
  onReset,
}: LakeFormationSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  //@ts-ignore
  const animationRef = useRef<number>()
  const [terrain, setTerrain] = useState<TerrainPoint[]>([])
  const [waterParticles, setWaterParticles] = useState<WaterParticle[]>([])
  const [lakeWaterLevel, setLakeWaterLevel] = useState(0)
  const [iceSheet, setIceSheet] = useState<IceSheet | null>(null)
  const [simulationTime, setSimulationTime] = useState(0)
  const [volcanoActive, setVolcanoActive] = useState(false)

  // Initialize terrain and features based on formation type
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const width = canvas.width
    const height = canvas.height

    const newTerrain: TerrainPoint[] = []

    for (let x = 0; x <= width; x += 5) {
      let y = height * 0.7

      switch (formationType) {
        case "glacial":
          // U-shaped valley for glacial lake
          const centerDistance = Math.abs(x - width / 2)
          const valleyDepth = Math.max(0, 100 - (centerDistance / width) * 200)
          y = height * 0.7 + valleyDepth
          break

        case "tectonic":
          // Fault depression
          if (x > width * 0.3 && x < width * 0.7) {
            y = height * 0.8 + Math.sin(((x - width * 0.3) / (width * 0.4)) * Math.PI) * 50
          }
          break

        case "volcanic":
          // Crater formation
          const craterCenter = width / 2
          const craterDistance = Math.abs(x - craterCenter)
          if (craterDistance < width * 0.2) {
            const craterDepth = Math.cos(((craterDistance / (width * 0.2)) * Math.PI) / 2) * 80
            y = height * 0.6 + craterDepth
          }
          break

        case "erosional":
          // River valley
          y = height * 0.6 + Math.sin(x * 0.01) * 30 + (x / width) * 40
          break
      }

      newTerrain.push({
        x,
        y: Math.min(y, height - 20),
        originalY: y,
        erosion: 0,
      })
    }

    setTerrain(newTerrain)
    setWaterParticles([])
    setLakeWaterLevel(0)
    setSimulationTime(0)
    setVolcanoActive(false)

    // Initialize ice sheet for glacial formation
    if (formationType === "glacial") {
      setIceSheet({
        x: width * 0.2,
        y: height * 0.3,
        width: width * 0.6,
        height: 100,
        melting: false,
      })
    } else {
      setIceSheet(null)
    }
  }, [formationType, onReset])

  // Animation loop
  useEffect(() => {
    if (!isRunning || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw sky
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5)
      skyGradient.addColorStop(0, "#87CEEB")
      skyGradient.addColorStop(1, "#E0F6FF")
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5)

      // Update simulation time
      setSimulationTime((prev) => prev + timeScale)

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

      // Find lowest point for lake formation
      const lowestPoint = terrain.reduce((lowest, point) => (point.y > lowest.y ? point : lowest))
      const lakeBottom = lowestPoint.y

      // Generate water based on formation type
      if (formationType === "glacial" && iceSheet && simulationTime > 50) {
        // Start melting glacier
        setIceSheet((prev) => (prev ? { ...prev, melting: true } : null))

        // Generate meltwater
        if (Math.random() < 0.3) {
          const newWater: WaterParticle[] = []
          for (let i = 0; i < waterFlow; i++) {
            newWater.push({
              x: iceSheet.x + Math.random() * iceSheet.width,
              y: iceSheet.y + iceSheet.height,
              vx: (Math.random() - 0.5) * 2,
              vy: 2 + Math.random(),
              size: 2,
              opacity: 0.8,
            })
          }
          setWaterParticles((prev) => [...prev, ...newWater])
        }
      } else if (formationType === "erosional") {
        // River flow
        if (Math.random() < 0.4) {
          const newWater: WaterParticle[] = []
          for (let i = 0; i < waterFlow; i++) {
            newWater.push({
              x: Math.random() * 50,
              y: canvas.height * 0.4,
              vx: 2 + Math.random(),
              vy: 1,
              size: 1.5,
              opacity: 0.7,
            })
          }
          setWaterParticles((prev) => [...prev, ...newWater])
        }
      } else if (formationType === "volcanic" && simulationTime > 30) {
        // Volcanic activity and rain
        setVolcanoActive(true)
        if (Math.random() < 0.2) {
          const newWater: WaterParticle[] = []
          for (let i = 0; i < waterFlow * 2; i++) {
            newWater.push({
              x: Math.random() * canvas.width,
              y: -10,
              vx: Math.random() - 0.5,
              vy: 3 + Math.random(),
              size: 1,
              opacity: 0.6,
            })
          }
          setWaterParticles((prev) => [...prev, ...newWater])
        }
      } else if (formationType === "tectonic") {
        // Groundwater seepage
        if (Math.random() < 0.1) {
          const faultZone = canvas.width * 0.5
          const newWater: WaterParticle[] = []
          for (let i = 0; i < waterFlow; i++) {
            newWater.push({
              x: faultZone + (Math.random() - 0.5) * 100,
              y: lakeBottom - 20,
              vx: (Math.random() - 0.5) * 0.5,
              vy: -0.5,
              size: 1.5,
              opacity: 0.5,
            })
          }
          setWaterParticles((prev) => [...prev, ...newWater])
        }
      }

      // Update and draw water particles
      setWaterParticles((prevParticles) => {
        const updatedParticles = prevParticles.filter((particle) => {
          // Update particle position
          particle.x += particle.vx
          particle.y += particle.vy

          // Apply gravity
          particle.vy += 0.1

          // Check terrain collision
          const terrainIndex = Math.floor((particle.x / canvas.width) * (terrain.length - 1))
          const terrainPoint = terrain[terrainIndex]

          if (terrainPoint && particle.y >= terrainPoint.y) {
            // Water settles in depression
            if (particle.y >= lakeBottom - 5) {
              particle.y = lakeBottom - 5
              particle.vy = 0
              particle.vx *= 0.9

              // Accumulate lake water
              setLakeWaterLevel((prev) => Math.min(prev + 0.1, lakeBottom - canvas.height * 0.3))
            } else {
              // Water flows down slope
              particle.vx += terrainPoint.x < canvas.width / 2 ? 1 : -1
              particle.vy = 0
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

        return updatedParticles
      })

      // Draw accumulated lake water
      if (lakeWaterLevel > 0) {
        const waterSurface = lakeBottom - lakeWaterLevel

        // Find lake boundaries
        const lakePoints = terrain.filter((point) => point.y >= waterSurface - 10)

        if (lakePoints.length > 0) {
          ctx.fillStyle = "rgba(100, 149, 237, 0.7)"
          ctx.beginPath()
          ctx.moveTo(lakePoints[0].x, waterSurface)

          lakePoints.forEach((point) => {
            ctx.lineTo(point.x, Math.min(point.y, waterSurface))
          })

          ctx.lineTo(lakePoints[lakePoints.length - 1].x, waterSurface)
          ctx.closePath()
          ctx.fill()

          // Draw water surface reflection
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
          ctx.fillRect(lakePoints[0].x, waterSurface, lakePoints[lakePoints.length - 1].x - lakePoints[0].x, 5)
        }
      }

      // Draw ice sheet for glacial formation
      if (iceSheet && formationType === "glacial") {
        ctx.fillStyle = iceSheet.melting ? "rgba(200, 230, 255, 0.8)" : "rgba(240, 248, 255, 0.9)"
        ctx.fillRect(iceSheet.x, iceSheet.y, iceSheet.width, iceSheet.height)

        // Draw ice texture
        ctx.strokeStyle = "rgba(100, 150, 200, 0.5)"
        ctx.lineWidth = 1
        for (let i = 0; i < 10; i++) {
          const x = iceSheet.x + (i / 10) * iceSheet.width
          ctx.beginPath()
          ctx.moveTo(x, iceSheet.y)
          ctx.lineTo(x, iceSheet.y + iceSheet.height)
          ctx.stroke()
        }

        if (iceSheet.melting) {
          // Shrink ice sheet over time
          setIceSheet((prev) =>
            prev
              ? {
                  ...prev,
                  height: Math.max(prev.height - 0.2, 0),
                  y: prev.y + 0.1,
                }
              : null,
          )
        }
      }

      // Draw volcanic activity
      if (volcanoActive && formationType === "volcanic") {
        const volcanoX = canvas.width / 2
        const volcanoY = terrain[Math.floor(terrain.length / 2)]?.y || canvas.height * 0.6

        // Draw lava
        ctx.fillStyle = "#FF4500"
        for (let i = 0; i < 5; i++) {
          const x = volcanoX + (Math.random() - 0.5) * 30
          const y = volcanoY - Math.random() * 30
          ctx.beginPath()
          ctx.arc(x, y, 2 + Math.random() * 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw formation type indicator
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.font = "14px Arial"
      ctx.fillText(`Formation: ${formationType.charAt(0).toUpperCase() + formationType.slice(1)}`, 10, 30)
      ctx.fillText(`Time: ${Math.floor(simulationTime / 10)} thousand years`, 10, 50)

      const waterLevelText = lakeWaterLevel > 0 ? `Lake Depth: ${Math.floor(lakeWaterLevel)}m` : "No Lake Yet"
      ctx.fillText(waterLevelText, 10, 70)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, formationType, waterFlow, timeScale, terrain, iceSheet, lakeWaterLevel, simulationTime, volcanoActive])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={450}
      className="w-full h-full rounded-lg border border-border/50"
      style={{ background: "linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #8B4513 100%)" }}
    />
  )
}
