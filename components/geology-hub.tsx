"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain, Waves, ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"
import LandslideSimulation from "./landslide-simulation"
import FloodSimulation from "./flood-simulation"
import MountainFormationSimulation from "./mountain-formation-simulation"
import LakeFormationSimulation from "./lake-formation-simulation"

interface GeologyHubProps {
  onBack: () => void
}

export default function GeologyHub({ onBack }: GeologyHubProps) {
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  // Landslide controls
  const [slopeAngle, setSlopeAngle] = useState(30)
  const [waterContent, setWaterContent] = useState(40)
  const [soilType, setSoilType] = useState("Clay")

  // Flood controls
  const [rainfallIntensity, setRainfallIntensity] = useState(5)
  const [terrainSlope, setTerrainSlope] = useState(8)
  const [groundSaturation, setGroundSaturation] = useState(60)

  // Mountain formation controls
  const [formationType, setFormationType] = useState("folding")
  const [compressionForce, setCompressionForce] = useState(5)
  const [timeScale, setTimeScale] = useState(3)

  // Lake formation controls
  const [lakeFormationType, setLakeFormationType] = useState("glacial")
  const [waterFlow, setWaterFlow] = useState(5)
  const [lakeTimeScale, setLakeTimeScale] = useState(3)

  const [resetKey, setResetKey] = useState(0)

  const simulations = [
    {
      id: "landslide",
      title: "Landslide Simulation",
      description:
        "Observe how slope angle, soil composition, and water content affect landslide formation and movement",
      icon: Mountain,
      color: "bg-amber-500/20 text-amber-600",
    },
    {
      id: "flood",
      title: "Flash Flood Simulation",
      description: "Simulate flash flood formation, water flow patterns, and impact on terrain and structures",
      icon: Waves,
      color: "bg-blue-500/20 text-blue-600",
    },
    {
      id: "mountain",
      title: "Mountain Formation",
      description: "Explore different mountain formation processes: folding, faulting, and volcanic activity",
      icon: Mountain,
      color: "bg-stone-500/20 text-stone-600",
    },
    {
      id: "lake",
      title: "Lake Formation",
      description: "Study various lake formation mechanisms: glacial, tectonic, volcanic, and erosional processes",
      icon: Waves,
      color: "bg-cyan-500/20 text-cyan-600",
    },
  ]

  const handleReset = () => {
    setIsRunning(false)
    setResetKey((prev) => prev + 1)
  }

  if (selectedSimulation) {
    return (
      <div className="min-h-screen bg-background/95 backdrop-blur-sm p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedSimulation(null)}
              className="bg-card/80 backdrop-blur-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Geology Hub
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {simulations.find((s) => s.id === selectedSimulation)?.title}
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Simulation Canvas */}
            <div className="lg:col-span-2">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Simulation View</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSimulation === "landslide" && (
                    <LandslideSimulation
                      key={resetKey}
                      slopeAngle={slopeAngle}
                      waterContent={waterContent}
                      soilType={soilType}
                      isRunning={isRunning}
                      onReset={handleReset}
                    />
                  )}
                  {selectedSimulation === "flood" && (
                    <FloodSimulation
                      key={resetKey}
                      rainfallIntensity={rainfallIntensity}
                      terrainSlope={terrainSlope}
                      groundSaturation={groundSaturation}
                      isRunning={isRunning}
                      onReset={handleReset}
                    />
                  )}
                  {selectedSimulation === "mountain" && (
                    <MountainFormationSimulation
                      key={resetKey}
                      formationType={formationType}
                      compressionForce={compressionForce}
                      timeScale={timeScale}
                      isRunning={isRunning}
                      onReset={handleReset}
                    />
                  )}
                  {selectedSimulation === "lake" && (
                    <LakeFormationSimulation
                      key={resetKey}
                      formationType={lakeFormationType}
                      waterFlow={waterFlow}
                      timeScale={lakeTimeScale}
                      isRunning={isRunning}
                      onReset={handleReset}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Controls Panel */}
            <div className="space-y-4">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Simulation Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => setIsRunning(true)} disabled={isRunning}>
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setIsRunning(false)}
                      disabled={!isRunning}
                    >
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedSimulation === "landslide" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground">Slope Angle</label>
                        <input
                          type="range"
                          min="15"
                          max="60"
                          value={slopeAngle}
                          onChange={(e) => setSlopeAngle(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                        <span className="text-xs text-muted-foreground">{slopeAngle}°</span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Water Content</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={waterContent}
                          onChange={(e) => setWaterContent(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                        <span className="text-xs text-muted-foreground">{waterContent}%</span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Soil Type</label>
                        <select
                          className="w-full mt-1 p-2 rounded border bg-background"
                          value={soilType}
                          onChange={(e) => setSoilType(e.target.value)}
                        >
                          <option>Clay</option>
                          <option>Sand</option>
                          <option>Rock</option>
                          <option>Mixed</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedSimulation === "flood" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground">Rainfall Intensity</label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={rainfallIntensity}
                          onChange={(e) => setRainfallIntensity(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                        <span className="text-xs text-muted-foreground">{rainfallIntensity} in/hr</span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Terrain Slope</label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={terrainSlope}
                          onChange={(e) => setTerrainSlope(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                        <span className="text-xs text-muted-foreground">{terrainSlope}%</span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Ground Saturation</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={groundSaturation}
                          onChange={(e) => setGroundSaturation(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                        <span className="text-xs text-muted-foreground">{groundSaturation}%</span>
                      </div>
                    </div>
                  )}

                  {selectedSimulation === "mountain" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground">Formation Type</label>
                        <select
                          className="w-full mt-1 p-2 rounded border bg-background"
                          value={formationType}
                          onChange={(e) => setFormationType(e.target.value)}
                        >
                          <option value="folding">Folding</option>
                          <option value="faulting">Faulting</option>
                          <option value="volcanic">Volcanic</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Tectonic Force</label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={compressionForce}
                          onChange={(e) => setCompressionForce(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                        <span className="text-xs text-muted-foreground">Level {compressionForce}</span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Time Scale</label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={timeScale}
                          onChange={(e) => setTimeScale(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                        <span className="text-xs text-muted-foreground">{timeScale}x speed</span>
                      </div>
                    </div>
                  )}

                  {selectedSimulation === "lake" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground">Formation Type</label>
                        <select
                          className="w-full mt-1 p-2 rounded border bg-background"
                          value={lakeFormationType}
                          onChange={(e) => setLakeFormationType(e.target.value)}
                        >
                          <option value="glacial">Glacial</option>
                          <option value="tectonic">Tectonic</option>
                          <option value="volcanic">Volcanic</option>
                          <option value="erosional">Erosional</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Water Flow</label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={waterFlow}
                          onChange={(e) => setWaterFlow(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                        <span className="text-xs text-muted-foreground">Level {waterFlow}</span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Time Scale</label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={lakeTimeScale}
                          onChange={(e) => setLakeTimeScale(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                        <span className="text-xs text-muted-foreground">{lakeTimeScale}x speed</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-foreground/80 space-y-2">
                    {selectedSimulation === "landslide" && (
                      <>
                        <li>• Understand slope stability factors</li>
                        <li>• Observe water's role in landslides</li>
                        <li>• Compare different soil behaviors</li>
                        <li>• Analyze prevention strategies</li>
                      </>
                    )}
                    {selectedSimulation === "flood" && (
                      <>
                        <li>• Study flood formation mechanisms</li>
                        <li>• Observe water flow dynamics</li>
                        <li>• Understand terrain impact</li>
                        <li>• Explore mitigation methods</li>
                      </>
                    )}
                    {selectedSimulation === "mountain" && (
                      <>
                        <li>• Compare mountain formation types</li>
                        <li>• Understand tectonic forces</li>
                        <li>• Observe geological time scales</li>
                        <li>• Study rock layer deformation</li>
                      </>
                    )}
                    {selectedSimulation === "lake" && (
                      <>
                        <li>• Compare lake formation mechanisms</li>
                        <li>• Understand glacial processes</li>
                        <li>• Study tectonic depressions</li>
                        <li>• Observe volcanic crater lakes</li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background/95 backdrop-blur-sm p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="bg-card/80 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lab
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Geology & Earth Science</h1>
            <p className="text-foreground/70">Explore geological processes and natural phenomena</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {simulations.map((simulation) => {
            const IconComponent = simulation.icon
            return (
              <Card
                key={simulation.id}
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors cursor-pointer"
                onClick={() => setSelectedSimulation(simulation.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${simulation.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-foreground">{simulation.title}</CardTitle>
                  <CardDescription className="text-foreground/70">{simulation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Launch Simulation</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
