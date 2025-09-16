"use client"

import { useState } from "react"
import { TerminalHeader } from "@/components/terminal-header"
import { HeroTerminal } from "@/components/hero-terminal"
import { CodeRain } from "@/components/code-rain"
import { TerminalFooter } from "@/components/terminal-footer"

export default function HomePage() {
  const [showHeaderFooter, setShowHeaderFooter] = useState(true)

  const handleExitTriggered = (isExiting: boolean) => {
    setShowHeaderFooter(!isExiting)
  }

  return (
    <main className="relative">
      <CodeRain />
      <div className="relative z-10">
        <TerminalHeader isVisible={showHeaderFooter} />
        <HeroTerminal onExitTriggered={handleExitTriggered} />
      </div>
      <TerminalFooter isVisible={showHeaderFooter} />
    </main>
  )
}
