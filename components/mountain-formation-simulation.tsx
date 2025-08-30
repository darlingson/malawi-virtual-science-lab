"use client"

import { useState, useEffect, useRef } from "react"

interface MountainFormationSimulationProps {
  formationType: string
  compressionForce: number
  timeScale: number
  isRunning: boolean
  onReset: () => void
}

interface TerrainLayer {
  points: { x: number; y: number }[]
  color: string
  age: number
  hardness: number
}

interface TectonicPlate {
  x: number
  y: number
  width: number
  velocity: number
  direction: number
}

export default function MountainFormationSimulation({
  formationType,
  compressionForce,
  timeScale,
  isRunning,
  onReset,
}: MountainFormationSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [layers, setLayers] = useState<TerrainLayer[]>([])
  const [plates, setPlates] = useState<TectonicPlate[]>([])
  const [simulationTime, setSimulationTime] = useState(0)
  const [volcanoActive, setVolcanoActive] = useState(false)

  // Initialize terrain layers and plates
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const width = canvas.width
    const height = canvas.height

    // Create initial flat terrain layers
    const newLayers: TerrainLayer[] = []
    const layerColors = ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#F4A460"]

    for (let i = 0; i < 5; i++) {
      const points: { x: number; y: number }[] = []
      const baseY = height * 0.8 - i * 20

      for (let x = 0; x <= width; x += 10) {
        points.push({
          x,
          y: baseY + Math.sin(x * 0.01) * 5,
        })
      }

      newLayers.push({
        points,
        color: layerColors[i],
        age: i * 10,
        hardness: 0.5 + i * 0.1,
      })
    }

    // Initialize tectonic plates
    const newPlates: TectonicPlate[] = [
      {
        x: 0,
        y: height * 0.8,
        width: width * 0.6,
        velocity: 0.5,
        direction: 1,
      },
      {
        x: width * 0.4,
        y: height * 0.8,
        width: width * 0.6,
        velocity: 0.5,
        direction: -1,
      },
    ]

    setLayers(newLayers)
    setPlates(newPlates)
    setSimulationTime(0)
    setVolcanoActive(false)
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
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6)
      skyGradient.addColorStop(0, "#87CEEB")
      skyGradient.addColorStop(1, "#E0F6FF")
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6)

      // Update simulation time
      setSimulationTime((prev) => prev + timeScale)

      // Update terrain based on formation type
      setLayers((prevLayers) => {
        return prevLayers.map((layer, layerIndex) => {
          const newPoints = layer.points.map((point, pointIndex) => {
            let newY = point.y
            const centerX = canvas.width / 2
            const distanceFromCenter = Math.abs(point.x - centerX)

            switch (formationType) {
              case "folding":
                // Folding mountains - compression creates folds
                const foldIntensity = compressionForce * 0.1 * timeScale * 0.01
                const foldWave = Math.sin((point.x / canvas.width) * Math.PI * 4) * foldIntensity
                newY -= foldWave * (5 - layerIndex) * layer.hardness
                break

              case "faulting":
                // Fault-block mountains - sudden vertical displacement
                const faultLine = canvas.width / 2
                const faultIntensity = compressionForce * 0.05 * timeScale * 0.01
                if (point.x > faultLine) {
                  newY -= faultIntensity * (5 - layerIndex)
                } else {
                  newY += faultIntensity * 0.3 * (5 - layerIndex)
                }
                break

              case "volcanic":
                // Volcanic mountains - cone shape formation
                const volcanoCenter = canvas.width / 2
                const distance = Math.abs(point.x - volcanoCenter)
                const volcanoIntensity = compressionForce * 0.08 * timeScale * 0.01
                const coneEffect = Math.max(0, volcanoIntensity * (1 - distance / (canvas.width * 0.3)))
                newY -= coneEffect * (5 - layerIndex)

                // Activate volcano effect
                if (simulationTime > 100 && distance < 50) {
                  setVolcanoActive(true)
                }
                break
            }

            return { x: point.x, y: newY }
          })

          return { ...layer, points: newPoints }
        })
      })

      // Draw tectonic plates (underground visualization)
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)"
      plates.forEach((plate) => {
        ctx.fillRect(plate.x, plate.y, plate.width, canvas.height - plate.y)

        // Draw plate movement arrows
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.font = "12px Arial"
        const arrow = plate.direction > 0 ? "→" : "←"
        ctx.fillText(arrow, plate.x + plate.width / 2, plate.y - 10)
      })

      // Draw terrain layers
      layers.forEach((layer, index) => {
        ctx.fillStyle = layer.color
        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        layer.points.forEach((point, pointIndex) => {
          if (pointIndex === 0) {
            ctx.lineTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })

        ctx.lineTo(canvas.width, canvas.height)
        ctx.closePath()
        ctx.fill()

        // Draw layer boundaries
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
        ctx.lineWidth = 1
        ctx.beginPath()
        layer.points.forEach((point, pointIndex) => {
          if (pointIndex === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
      })

      // Draw volcanic activity
      if (volcanoActive && formationType === "volcanic") {
        const volcanoX = canvas.width / 2
        const volcanoY = layers[0]?.points[Math.floor(layers[0].points.length / 2)]?.y || canvas.height * 0.5

        // Draw lava
        ctx.fillStyle = "#FF4500"
        for (let i = 0; i < 10; i++) {
          const x = volcanoX + (Math.random() - 0.5) * 20
          const y = volcanoY - Math.random() * 50
          ctx.beginPath()
          ctx.arc(x, y, 2 + Math.random() * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw smoke
        ctx.fillStyle = "rgba(100, 100, 100, 0.5)"
        for (let i = 0; i < 5; i++) {
          const x = volcanoX + (Math.random() - 0.5) * 30
          const y = volcanoY - 20 - Math.random() * 100
          ctx.beginPath()
          ctx.arc(x, y, 5 + Math.random() * 10, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw time indicator
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.font = "14px Arial"
      ctx.fillText(`Time: ${Math.floor(simulationTime / 10)} million years`, 10, 30)

      // Draw formation type indicator
      ctx.fillText(`Formation: ${formationType.charAt(0).toUpperCase() + formationType.slice(1)}`, 10, 50)

      // Draw compression force indicator
      const forceLevel = compressionForce < 3 ? "Low" : compressionForce < 7 ? "Medium" : "High"
      ctx.fillText(`Tectonic Force: ${forceLevel}`, 10, 70)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, formationType, compressionForce, timeScale, layers, plates, simulationTime, volcanoActive])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={450}
      className="w-full h-full rounded-lg border border-border/50"
      style={{ background: "linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 60%, #8B4513 100%)" }}
    />
  )
}
