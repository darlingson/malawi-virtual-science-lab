"use client"

import { useEffect, useRef, useState } from "react"

interface Planet {
  name: string
  distance: number
  size: number
  color: string
  orbitSpeed: number
  rotationSpeed: number
  moons?: Moon[]
}

interface Moon {
  name: string
  distance: number
  size: number
  color: string
  orbitSpeed: number
}

const planets: Planet[] = [
  {
    name: "Mercury",
    distance: 80,
    size: 4,
    color: "#8C7853",
    orbitSpeed: 4.15,
    rotationSpeed: 0.017,
    moons: [],
  },
  {
    name: "Venus",
    distance: 110,
    size: 7,
    color: "#FFC649",
    orbitSpeed: 1.62,
    rotationSpeed: -0.004,
    moons: [],
  },
  {
    name: "Earth",
    distance: 150,
    size: 8,
    color: "#6B93D6",
    orbitSpeed: 1,
    rotationSpeed: 1,
    moons: [{ name: "Moon", distance: 15, size: 2, color: "#C0C0C0", orbitSpeed: 13.4 }],
  },
  {
    name: "Mars",
    distance: 200,
    size: 6,
    color: "#CD5C5C",
    orbitSpeed: 0.53,
    rotationSpeed: 0.97,
    moons: [
      { name: "Phobos", distance: 12, size: 1, color: "#8C7853", orbitSpeed: 7.6 },
      { name: "Deimos", distance: 18, size: 1, color: "#8C7853", orbitSpeed: 1.3 },
    ],
  },
  {
    name: "Jupiter",
    distance: 280,
    size: 20,
    color: "#D8CA9D",
    orbitSpeed: 0.084,
    rotationSpeed: 2.4,
    moons: [
      { name: "Io", distance: 30, size: 2, color: "#FFFF99", orbitSpeed: 17.3 },
      { name: "Europa", distance: 35, size: 2, color: "#87CEEB", orbitSpeed: 8.5 },
      { name: "Ganymede", distance: 40, size: 3, color: "#8C7853", orbitSpeed: 4.3 },
      { name: "Callisto", distance: 45, size: 3, color: "#696969", orbitSpeed: 2.4 },
    ],
  },
  {
    name: "Saturn",
    distance: 380,
    size: 18,
    color: "#FAD5A5",
    orbitSpeed: 0.034,
    rotationSpeed: 2.3,
    moons: [
      { name: "Titan", distance: 35, size: 3, color: "#FFA500", orbitSpeed: 6.2 },
      { name: "Enceladus", distance: 25, size: 1, color: "#F0F8FF", orbitSpeed: 32.9 },
    ],
  },
  {
    name: "Uranus",
    distance: 480,
    size: 14,
    color: "#4FD0E7",
    orbitSpeed: 0.012,
    rotationSpeed: -1.4,
    moons: [{ name: "Miranda", distance: 20, size: 1, color: "#C0C0C0", orbitSpeed: 13.5 }],
  },
  {
    name: "Neptune",
    distance: 580,
    size: 14,
    color: "#4B70DD",
    orbitSpeed: 0.006,
    rotationSpeed: 1.5,
    moons: [{ name: "Triton", distance: 25, size: 2, color: "#FFB6C1", orbitSpeed: -5.9 }],
  },
]

export default function SolarSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  //@ts-ignore
  const animationRef = useRef<number>()
  const [speedMultiplier, setSpeedMultiplier] = useState(3)
  const [showOrbits, setShowOrbits] = useState(true)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const animate = () => {
      timeRef.current += 0.016 * speedMultiplier // 60fps base

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw orbital paths
      if (showOrbits) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.lineWidth = 1
        planets.forEach((planet) => {
          ctx.beginPath()
          ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2)
          ctx.stroke()
        })
      }

      // Draw sun
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25)
      gradient.addColorStop(0, "#FFD700")
      gradient.addColorStop(0.5, "#FFA500")
      gradient.addColorStop(1, "#FF4500")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 25, 0, Math.PI * 2)
      ctx.fill()

      // Add sun glow
      ctx.shadowColor = "#FFD700"
      ctx.shadowBlur = 30
      ctx.beginPath()
      ctx.arc(centerX, centerY, 25, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Draw planets
      planets.forEach((planet, index) => {
        const angle = timeRef.current * planet.orbitSpeed * 0.01
        const x = centerX + Math.cos(angle) * planet.distance
        const y = centerY + Math.sin(angle) * planet.distance

        // Planet rotation
        const rotationAngle = timeRef.current * planet.rotationSpeed * 0.1

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rotationAngle)

        // Draw planet
        ctx.fillStyle = planet.color
        ctx.beginPath()
        ctx.arc(0, 0, planet.size, 0, Math.PI * 2)
        ctx.fill()

        // Add planet glow
        ctx.shadowColor = planet.color
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(0, 0, planet.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        // Draw Saturn's rings
        if (planet.name === "Saturn") {
          ctx.strokeStyle = "rgba(250, 213, 165, 0.6)"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.ellipse(0, 0, planet.size + 8, planet.size + 4, 0, 0, Math.PI * 2)
          ctx.stroke()
          ctx.beginPath()
          ctx.ellipse(0, 0, planet.size + 12, planet.size + 6, 0, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.restore()

        // Draw moons
        planet.moons?.forEach((moon) => {
          const moonAngle = timeRef.current * moon.orbitSpeed * 0.01
          const moonX = x + Math.cos(moonAngle) * moon.distance
          const moonY = y + Math.sin(moonAngle) * moon.distance

          ctx.fillStyle = moon.color
          ctx.beginPath()
          ctx.arc(moonX, moonY, moon.size, 0, Math.PI * 2)
          ctx.fill()

          // Moon orbit path
          if (showOrbits) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(x, y, moon.distance, 0, Math.PI * 2)
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [speedMultiplier, showOrbits])

  return (
    <div className="fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900 to-black" />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 bg-card/80 backdrop-blur-sm p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-card-foreground">Speed:</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(Number.parseFloat(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">{speedMultiplier}x</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="orbits"
            checked={showOrbits}
            onChange={(e) => setShowOrbits(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="orbits" className="text-sm font-medium text-card-foreground">
            Show Orbits
          </label>
        </div>
      </div>
    </div>
  )
}
