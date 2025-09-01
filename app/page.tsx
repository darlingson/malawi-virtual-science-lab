"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SolarSystem from "@/components/solar-system"
import GeologyHub from "@/components/geology-hub"
import { Microscope, Atom, Mountain, Zap, FlaskConical, Eye, EyeOff } from "lucide-react"

export default function HomePage() {
  const [cosmosOnly, setCosmosOnly] = useState(false)
  const [currentView, setCurrentView] = useState<"home" | "geology" | "physics">("home")

  if (cosmosOnly) {
    return (
      <div className="min-h-screen relative">
        <SolarSystem />
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCosmosOnly(false)}
            className="bg-card/80 backdrop-blur-sm"
          >
            <Eye className="mr-2 h-4 w-4" />
            Show Lab
          </Button>
        </div>
      </div>
    )
  }

  if (currentView === "geology") {
    return <GeologyHub onBack={() => setCurrentView("home")} />
  }

  return (
    <div className="min-h-screen relative">
      <SolarSystem />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 bg-background/20 backdrop-blur-sm border-b border-border/20">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">VirtualSciLab</h1>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <a href="#simulations" className="text-foreground/80 hover:text-foreground transition-colors">
              Simulations
            </a>
            <a href="#subjects" className="text-foreground/80 hover:text-foreground transition-colors">
              Subjects
            </a>
            <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </a>
          </nav>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCosmosOnly(true)}
            className="bg-card/50 backdrop-blur-sm"
          >
            <EyeOff className="mr-2 h-4 w-4" />
            Cosmos Only
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-bold text-foreground text-balance">
              Virtual
              <span className="text-primary"> Science</span>
              Laboratory
            </h2>
            <p className="text-xl md:text-2xl text-foreground/80 text-pretty max-w-2xl mx-auto">
              Interactive simulations for students and teachers to explore physics, chemistry, geology, and more through
              immersive experiments
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              <Microscope className="mr-2 h-5 w-5" />
              Start Experimenting
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-card/50 backdrop-blur-sm">
              <Atom className="mr-2 h-5 w-5" />
              Browse Simulations
            </Button>
          </div>
        </div>
      </main>

      {/* Simulations Section */}
      <section id="simulations" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Interactive Science Simulations</h3>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              From quantum physics to geological processes, explore science concepts through hands-on virtual
              experiments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Atom className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Physics Experiments</CardTitle>
                <CardDescription className="text-foreground/70">
                  Explore mechanics, thermodynamics, electromagnetism, and quantum physics through interactive
                  simulations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors cursor-pointer"
              onClick={() => setCurrentView("geology")}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Mountain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Geology & Earth Science</CardTitle>
                <CardDescription className="text-foreground/70">
                  Simulate landslides, flash floods, mountain formation, and lake formation processes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <FlaskConical className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Chemistry Lab</CardTitle>
                <CardDescription className="text-foreground/70">
                  Virtual chemical reactions, molecular modeling, and safe experimentation environments
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Electromagnetic Fields</CardTitle>
                <CardDescription className="text-foreground/70">
                  Visualize magnetic fields, electric circuits, and electromagnetic wave propagation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Microscope className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Biology & Life Sciences</CardTitle>
                <CardDescription className="text-foreground/70">
                  Cell division, ecosystem dynamics, genetics, and anatomical explorations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-background rounded-full"></div>
                  </div>
                </div>
                <CardTitle className="text-foreground">Astronomy & Space</CardTitle>
                <CardDescription className="text-foreground/70">
                  Solar system mechanics, stellar evolution, and cosmic phenomena like our live background simulation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-6 bg-card/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Education Through Simulation</h3>
          <p className="text-lg text-foreground/80 leading-relaxed mb-8">
            VirtualSciLab provides students and teachers with immersive, interactive simulations that make complex
            scientific concepts accessible and engaging. From subatomic particles to geological formations, explore
            science in ways that traditional textbooks simply cannot offer.
          </p>
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-8 border border-border/50">
            <p className="text-foreground/90 italic">
              "Science is not only a disciple of reason but also one of romance and passion."
            </p>
            <p className="text-foreground/70 mt-2">— Stephen Hawking</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 bg-background/40 backdrop-blur-sm border-t border-border/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FlaskConical className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">VirtualSciLab</span>
          </div>
          <p className="text-foreground/60">Making science accessible through interactive simulations</p>
          <p className="text-foreground/60">App By Darlingson Makuwila</p>
        </div>
      </footer>
    </div>
  )
}
