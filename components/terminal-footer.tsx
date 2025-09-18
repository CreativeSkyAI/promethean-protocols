"use client"

/**
 * Props interface for the TerminalFooter component
 */
interface TerminalFooterProps {
  /** Controls footer visibility with smooth transitions */
  isVisible?: boolean
}

/**
 * TerminalFooter Component
 *
 * Displays a cyberpunk-styled footer with:
 * - Copyright and branding information
 * - Creator attribution
 * - Smooth show/hide animations
 * - Fixed positioning at bottom of screen
 *
 * Features:
 * - Backdrop blur effect for depth
 * - Responsive design
 * - Smooth transitions when hiding/showing
 * - Terminal-style typography
 */
export function TerminalFooter({ isVisible = true }: TerminalFooterProps) {
  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 border-t border-border bg-black/70 backdrop-blur-sm z-20 transition-all duration-2000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center font-mono text-sm">
          <span className="text-muted-foreground">
            {/* Copyright and project name */}
            <span className="text-green-400 font-medium">©2025 promprot (promethean protocols)</span>{" "}
            <span className="text-green-400 font-bold">by</span>{" "}
            {/* Creator attribution with special character styling */}
            <span className="text-green-400 font-medium">$κιηηεя</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
