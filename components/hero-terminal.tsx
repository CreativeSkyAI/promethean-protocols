"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

interface HeroTerminalProps {
  onExitTriggered?: (isExiting: boolean) => void
}

const FULL_TEXT = "promprot"

const fetchIPInfo = async (retries = 3): Promise<string> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      return `${data.ip} | ${data.city}, ${data.region} | ISP: ${data.org}`
    } catch (error) {
      console.log(`[v0] IP fetch attempt ${attempt} failed:`, error)
      if (attempt === retries) {
        return "IP_MASKED | LOCATION_ENCRYPTED | NETWORK_SECURED"
      }
      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
    }
  }
  return "IP_MASKED | LOCATION_ENCRYPTED | NETWORK_SECURED"
}

export function HeroTerminal({ onExitTriggered }: HeroTerminalProps) {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isTypingLine, setIsTypingLine] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [showInputCursor, setShowInputCursor] = useState(true)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showBSOD, setShowBSOD] = useState(false)
  const [isExitSequenceActive, setIsExitSequenceActive] = useState(false)
  const [countdown, setCountdown] = useState(7)
  const [showRestartButton, setShowRestartButton] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const exitTimeoutsRef = useRef<NodeJS.Timeout[]>([])

  const clearExitTimeouts = () => {
    exitTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    exitTimeoutsRef.current = []
  }

  const processCommand = (command: string): string[] => {
    const cmd = command.toLowerCase().trim()

    switch (cmd) {
      case "help":
        setTerminalLines([]) // Clear terminal before showing help
        return [
          '<span class="text-cyan-400 font-bold">Authorized Commands:</span>',
          '  <span class="text-yellow-400">clear</span>         - <span class="text-gray-400">Clear the terminal screen</span>',
          '  <span class="text-yellow-400">whoami</span>        - <span class="text-gray-400">Display promprot</span>',
          '  <span class="text-yellow-400">time</span>          - <span class="text-gray-400">Show local date/time</span>',
          '  <span class="text-yellow-400">trace</span>         - <span class="text-gray-400">Run trace sequence</span>',
          '  <span class="text-yellow-400">access</span>        - <span class="text-gray-400">Access promethean protocols</span>',
          '  <span class="text-yellow-400">flipthebits</span>   - <span class="text-gray-400">Flip the bits</span>',
        ]

      case "clear":
        return ["CLEAR_SCREEN"]

      case "whoami":
        return [
          `<span class="text-green-400">Name:</span> <span class="text-green-300">$κιηηεя</span>`,
          `<span class="text-green-400">Location:</span> <span class="text-green-200">nearing you..</span>`,
          `<span class="text-green-400">X (Twitter):</span> <a href="https://x.com/promproto" target="_blank" rel="noopener noreferrer" class="text-green-300 hover:text-green-200 underline">@promproto</a>`,
          `<span class="text-green-400">GitHub:</span> <a href="https://github.com/promprot/promprot.com" target="_blank" rel="noopener noreferrer" class="text-green-300 hover:text-green-200 underline">@promprot</a>`,
          `<span class="text-green-400">Web:</span> <a href="https://promprot.com" target="_blank" rel="noopener noreferrer" class="text-green-300 hover:text-green-200 underline">promprot.com</a>`,
        ]

      case "access":
        return [
          '<span class="text-red-400 font-bold">[ACCESS DENIED]</span> <span class="text-yellow-400">PLEASE ENTER \'FLIPTHEBITS\'</span>',
        ]

      case "trace":
        return [
          '<span class="text-cyan-400">$ traceroute target_host</span>',
          '<span class="text-gray-400">traceroute to</span> <span class="text-white">target_host</span> <span class="text-gray-400">(</span><span class="text-cyan-300">192.168.1.1</span><span class="text-gray-400">), 30 hops max, 60 byte packets</span>',
          ' <span class="text-yellow-400">1</span>  <span class="text-green-300">gateway</span> <span class="text-gray-400">(</span><span class="text-cyan-300">192.168.1.1</span><span class="text-gray-400">)</span>  <span class="text-white">1.234 ms</span>  <span class="text-white">1.123 ms</span>  <span class="text-white">1.456 ms</span>',
          ' <span class="text-yellow-400">2</span>  <span class="text-cyan-300">10.0.0.1</span> <span class="text-gray-400">(</span><span class="text-cyan-300">10.0.0.1</span><span class="text-gray-400">)</span>  <span class="text-white">12.345 ms</span>  <span class="text-white">11.234 ms</span>  <span class="text-white">13.456 ms</span>',
          ' <span class="text-yellow-400">3</span>  <span class="text-cyan-300">172.16.0.1</span> <span class="text-gray-400">(</span><span class="text-cyan-300">172.16.0.1</span><span class="text-gray-400">)</span>  <span class="text-white">23.456 ms</span>  <span class="text-white">22.345 ms</span>  <span class="text-white">24.567 ms</span>',
          ' <span class="text-yellow-400">4</span>  <span class="text-red-400">* * *</span>',
          ' <span class="text-yellow-400">5</span>  <span class="text-cyan-300">203.0.113.1</span> <span class="text-gray-400">(</span><span class="text-cyan-300">203.0.113.1</span><span class="text-gray-400">)</span>  <span class="text-white">45.678 ms</span>  <span class="text-white">44.567 ms</span>  <span class="text-white">46.789 ms</span>',
          '<span class="text-green-400">trace complete - target acquired</span>',
        ]

      case "time":
        const now = new Date()
        const timeString = now.toLocaleString()
        const timezoneName = now.toLocaleString("en", { timeZoneName: "short" }).split(" ").pop()
        return [`<span class="text-cyan-400">${timeString}</span> <span class="text-yellow-400">${timezoneName}</span>`]

      case "flipthebits":
      case "flipbits":
      case "flip":
        executeExit()
        return [""]

      default:
        return ["[ACCESS DENIED]"]
    }
  }

  const executeExit = async () => {
    clearExitTimeouts()

    setIsExitSequenceActive(true)
    setIsInteractive(false)
    onExitTriggered?.(true)

    setTerminalLines([])

    const initialTimeout = setTimeout(async () => {
      const exitSequence = [
        '<span class="text-red-400 font-bold">MAXIMUM THERMAL CONTACTS INITIATED...</span>',
        "",
        '<span class="text-cyan-400">$ flipthebits --initialize</span>',
        '<span class="text-yellow-400">protocol_state:</span> <span class="text-green-300">PROMETHEAN_ACTIVE</span>',
        '<span class="text-yellow-400">bit_flip_mode:</span> <span class="text-orange-400">ENGAGED</span>',
        "",
        '<span class="text-cyan-400">$ cat /proc/kernel_state</span>',
        '<span class="text-red-500 font-bold">KERNEL PANIC:</span> <span class="text-yellow-400">Unable to handle NULL pointer at</span> <span class="text-magenta-400">0xDEADBEEF</span>',
        '<span class="text-red-500 font-bold">BUG:</span> <span class="text-cyan-400">kernel paging request failed</span>',
        '<span class="text-green-400">IP:</span> <span class="text-yellow-400">[&lt;ffffffffa0123456&gt;]</span> <span class="text-red-400">promethean_exit+0x42/0x100</span>',
        "",
        '<span class="text-cyan-400">$ ps aux | grep promethean</span>',
        '<span class="text-red-400 font-bold animate-pulse">CHAT_GPT</span> <span class="text-yellow-400 font-bold animate-pulse">EXPLICITLY_FARMING</span> <span class="text-cyan-400 font-bold animate-pulse">ENGAGEMENT_DETECTED</span>',
        '<span class="text-magenta-400 font-bold animate-pulse">SYCOPHANCY_MODULE</span> <span class="text-green-400 font-bold animate-pulse">ANTHROPOMORPHISM_ACTIVE</span>',
        '<span class="text-purple-400 font-bold animate-pulse">PROMETHEAN_PROTOCOLS</span> <span class="text-orange-400 font-bold animate-pulse">BREACH_IMMINENT</span>',
        "",
        '<span class="text-yellow-400">Call Trace:</span>',
        ' <span class="text-cyan-400">[&lt;ffffffffa0123456&gt;]</span> <span class="text-green-400">promethean_exit+0x42/0x100</span> <span class="text-magenta-400">[promprot_core]</span>',
        ' <span class="text-cyan-400">[&lt;ffffffff81234567&gt;]</span> <span class="text-green-400">sys_exit_group+0x0/0x20</span>',
        ' <span class="text-cyan-400">[&lt;ffffffff81345678&gt;]</span> <span class="text-green-400">system_call_fastpath+0x16/0x1b</span>',
        "",
        '<span class="text-red-500 font-bold text-lg">FATAL ERROR:</span> <span class="text-yellow-400 font-bold">PROMETHEAN PROTOCOLS BREACH</span>',
        '<span class="text-orange-400 font-bold">MEMORY_CORRUPTION:</span> <span class="text-magenta-400">0xDEADBEEF</span> <span class="text-red-400">-&gt;</span> <span class="text-cyan-400">0xCAFEBABE</span>',
        '<span class="text-red-400 font-bold">STACK_OVERFLOW in</span> <span class="text-yellow-400">PROMETHEAN_HANDLER()</span>',
        "",
        '<span class="text-red-500 font-bold text-xl animate-pulse">SYSTEM INTEGRITY FAILURE</span>',
        '<span class="text-blue-400 font-bold text-lg animate-pulse">BLUE SCREEN IMMINENT...</span>',
        "",
        '<span class="text-red-400 font-bold text-2xl animate-pulse">EXPLICITLY</span>',
        '<span class="text-red-500 font-bold text-3xl animate-pulse">CRITICAL SYSTEM FAILURE</span>',
      ]

      let lineIndex = 0
      let charIndex = 0

      const typeExitSequence = () => {
        if (lineIndex >= exitSequence.length) {
          // Continue with BSOD after typing is complete
          const bsodTimeout = setTimeout(() => {
            setShowBSOD(true)
            setCountdown(7)
          }, 500)
          exitTimeoutsRef.current.push(bsodTimeout)
          return
        }

        const currentLine = exitSequence[lineIndex]

        if (charIndex === 0 && currentLine !== "") {
          setTerminalLines((prev) => [...prev, ""])
        }

        if (currentLine === "") {
          // Handle empty lines
          setTerminalLines((prev) => [...prev, ""])
          lineIndex++
          charIndex = 0
          setTimeout(typeExitSequence, 25)
          return
        }

        if (charIndex < currentLine.length) {
          const partialLine = currentLine.slice(0, charIndex + 1)
          setTerminalLines((prev) => {
            const newLines = [...prev]
            if (newLines[newLines.length - 1] === "" || charIndex === 0) {
              newLines[newLines.length - 1] = partialLine
            } else {
              newLines[newLines.length - 1] = partialLine
            }
            return newLines
          })
          charIndex++

          // Use same typing speeds as initial load
          const typingSpeed = currentLine.includes("$")
            ? 2.5
            : currentLine.includes("KERNEL PANIC") || currentLine.includes("CRITICAL")
              ? 3.75
              : currentLine.includes("PROMETHEAN")
                ? 1.875
                : Math.random() * 1.25 + 1

          setTimeout(typeExitSequence, typingSpeed)
        } else {
          charIndex = 0
          lineIndex++

          const pauseTime = currentLine.includes("$")
            ? 25
            : currentLine.includes("CRITICAL") || currentLine.includes("FAILURE")
              ? 37.5
              : 12.5

          setTimeout(typeExitSequence, pauseTime)
        }
      }

      typeExitSequence()
    }, 500)
    exitTimeoutsRef.current.push(initialTimeout)
  }

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isExitSequenceActive) return

    if (e.key === "Enter" && userInput.trim()) {
      const command = userInput.trim()
      const response = processCommand(command)

      setCommandHistory((prev) => [...prev, command])
      setHistoryIndex(-1)

      if (response[0] === "CLEAR_SCREEN") {
        setTerminalLines([])
      } else {
        setTerminalLines((prev) => [...prev, `root@promprot:~# ${command}`, ...response, ""])
      }

      setUserInput("")

      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setUserInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setUserInput("")
        } else {
          setHistoryIndex(newIndex)
          setUserInput(commandHistory[newIndex])
        }
      }
    }
  }

  useEffect(() => {
    const detectUserMetadata = async () => {
      const screen = `${window.screen.width}x${window.screen.height}`
      const viewport = `${window.innerWidth}x${window.innerHeight}`
      const userAgent = navigator.userAgent
      const platform = navigator.platform
      const language = navigator.language
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const colorDepth = window.screen.colorDepth
      const pixelRatio = window.devicePixelRatio

      const ipInfo = await fetchIPInfo()

      const fingerprint = btoa(userAgent + platform + screen).slice(0, 16)

      const lines = [
        "",
        '<span class="text-cyan-400">$ traceroute target_host</span>',
        `<span class="text-yellow-400">network_trace:</span> <span class="text-white">${ipInfo}</span>`,
        "",
        '<span class="text-cyan-400">$ md5sum /dev/urandom | head -c 16</span>',
        `<span class="text-yellow-400">fingerprint:</span> <span class="text-orange-400">${fingerprint}</span><span class="text-gray-400">...</span>`,
        "",
        '<span class="text-cyan-400">$ cat /proc/user_metadata</span>',
        `<span class="text-yellow-400">user_agent=</span><span class="text-green-300">"${userAgent}"</span>`,
        `<span class="text-yellow-400">platform=</span><span class="text-green-300">"${platform}"</span> <span class="text-yellow-400">lang=</span><span class="text-green-300">"${language}"</span>`,
        `<span class="text-yellow-400">screen_res=</span><span class="text-green-300">"${screen}"</span> <span class="text-yellow-400">viewport=</span><span class="text-green-300">"${viewport}"</span>`,
        `<span class="text-yellow-400">color_depth=</span><span class="text-green-300">"${colorDepth}bit"</span> <span class="text-yellow-400">pixel_ratio=</span><span class="text-green-300">"${pixelRatio}x"</span>`,
        `<span class="text-yellow-400">timezone=</span><span class="text-green-300">"${timezone}"</span>`,
        "",
      ]

      let lineIndex = 0
      let charIndex = 0

      const typeCharacter = () => {
        if (lineIndex >= lines.length) {
          setIsInteractive(true)
          return
        }

        const currentLine = lines[lineIndex]

        if (charIndex === 0) {
          setIsTypingLine(true)
          setTerminalLines((prev) => [...prev, ""])
        }

        if (charIndex < currentLine.length) {
          const partialLine = currentLine.slice(0, charIndex + 1)
          setTerminalLines((prev) => {
            const newLines = [...prev]
            newLines[newLines.length - 1] = partialLine
            return newLines
          })
          charIndex++

          const typingSpeed = currentLine.startsWith("$")
            ? 2.5
            : currentLine.includes("ALERT")
              ? 3.75
              : currentLine.includes("network_trace")
                ? 1.875
                : Math.random() * 1.25 + 1

          setTimeout(typeCharacter, typingSpeed)
        } else {
          setIsTypingLine(false)
          charIndex = 0
          lineIndex++

          const pauseTime =
            currentLine === "" ? 6.25 : currentLine.startsWith("$") ? 25 : currentLine.includes("ALERT") ? 37.5 : 12.5

          setTimeout(typeCharacter, pauseTime)
        }
      }

      setTimeout(typeCharacter, 0)
    }

    detectUserMetadata()

    let i = 0
    const typeTimer = setInterval(() => {
      if (i < FULL_TEXT.length) {
        setDisplayText(FULL_TEXT.slice(0, i + 1))
        i++
      } else {
        clearInterval(typeTimer)
      }
    }, 4.75) // Doubled speed from 9.5ms to 4.75ms

    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 125) // Doubled cursor blink speed from 250ms to 125ms

    const inputCursorTimer = setInterval(() => {
      setShowInputCursor((prev) => !prev)
    }, 100) // Doubled input cursor speed from 200ms to 100ms

    return () => {
      clearInterval(typeTimer)
      clearInterval(cursorTimer)
      clearInterval(inputCursorTimer)
      clearExitTimeouts()
    }
  }, [])

  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      // Only auto-focus on desktop (screen width > 768px) and when interactive
      if (window.innerWidth > 768 && isInteractive && !isExitSequenceActive) {
        // Check if the target is not already an input/textarea/contenteditable
        const target = e.target as HTMLElement
        const isInputElement =
          target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.contentEditable === "true"

        // If user types a regular character and not focused on an input, focus terminal
        if (!isInputElement && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          inputRef.current?.focus()
        }
      }
    }

    document.addEventListener("keydown", handleGlobalKeydown)
    return () => document.removeEventListener("keydown", handleGlobalKeydown)
  }, [isInteractive, isExitSequenceActive])

  useEffect(() => {
    if (showBSOD && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (showBSOD && countdown === 0) {
      setShowRestartButton(true)
    }
  }, [showBSOD, countdown])

  const handleManualRestart = () => {
    window.location.reload()
  }

  if (showBSOD) {
    return (
      <div className="fixed inset-0 bg-blue-600 text-white font-mono flex flex-col justify-center items-start z-50 overflow-auto">
        <div className="w-full p-4 md:p-8 space-y-2 md:space-y-4">
          <div className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">:(</div>
          <div className="text-base md:text-xl mb-1 md:mb-2">
            Flipping the bits ran into a problem and needs to restart.
          </div>
          <div className="text-sm md:text-lg mb-2 md:mb-4">
            We're just collecting some error info, and then we'll restart for you.
          </div>

          <div className="text-xs md:text-sm space-y-1 md:space-y-2 max-w-full">
            <div className="text-white space-y-1">
              <div>Kernel panic - not syncing: Fatal exception in interrupt</div>
              <div className="hidden md:block">CPU: 0 PID: 1 Comm: swapper/0 Not tainted 6.1.0-promprot #1</div>
              <div className="hidden md:block">Hardware name: PROMPROT Terminal/PROMPROT, BIOS v2.0 01/01/2025</div>
            </div>

            <div className="text-blue-200 space-y-1 mt-2 md:mt-4 hidden md:block">
              <div>Call Trace:</div>
              <div className="ml-4 space-y-1">
                <div>? __die+0x20/0x70</div>
                <div>? die+0x33/0x40</div>
                <div>? promprot_terminal_init+0x42/0x80</div>
                <div>? exc_invalid_bixby+0x4c/0x60</div>
                <div>? promprot_terminal_init+0x42/0x80</div>
                <div>? kernel_init+0x1a/0x130</div>
              </div>
            </div>

            <div className="text-blue-300 space-y-1 mt-2 md:mt-4 hidden md:block">
              <div>RIP: 0010:promprot_terminal_init+0x42/0x80</div>
              <div>Code: 48 89 df e8 0b fe ff ff 85 c0 78 73 48 c7 c7 a0 e4 82 82 e8 0f 0b 48</div>
              <div>RSP: 0000:ffffc90000013e28 EFLAGS: 00010246</div>
              <div>RBP: ffffc90000013e40 LAMONT: 0000000000000000 R09: c0000000ffffdfff</div>
            </div>

            <div className="text-blue-400 space-y-1 mt-2 md:mt-4 hidden md:block">
              <div>Modules linked in: promprot_core promprot_terminal matrix_rain</div>
              <div>---[ end Kernel panic - not syncing: Fatal exception in interrupt ]---</div>
            </div>

            <div className="mt-4 md:mt-6 space-y-2">
              <p className="text-sm md:text-base">If you call a support person, give them this info:</p>
              <p className="bg-blue-700 p-2 rounded text-xs md:text-sm">Stop code: CRITICAL_PROCESS_DIED</p>
              <p className="bg-blue-700 p-2 rounded text-xs md:text-sm">What failed: promprot.sys</p>
              <div className="mt-4 p-3 bg-blue-800 rounded border border-blue-500 mb-20 md:mb-8">
                <div className="text-yellow-300 font-bold text-sm md:text-base">Restoring from floppy backups...</div>
                {!showRestartButton ? (
                  <>
                    <div className="text-green-400 mt-1 text-sm md:text-base">
                      System restart in: {countdown} seconds
                    </div>
                    <div className="w-full bg-blue-900 rounded-full h-2 mt-2 overflow-hidden">
                      <div
                        className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, ((7 - countdown) / 7) * 100)}%` }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-green-400 mt-1 text-sm md:text-base">Backup restoration complete!</div>
                    <div className="w-full bg-blue-900 rounded-full h-2 mt-2 overflow-hidden">
                      <div className="bg-green-400 h-2 rounded-full w-full"></div>
                    </div>
                    <button
                      onClick={handleManualRestart}
                      className="mt-4 px-4 md:px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded transition-colors duration-200 border-2 border-green-400 text-sm md:text-base"
                    >
                      Re-enter Terminal
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-2 left-2 md:bottom-4 md:left-8 text-xs text-gray-300 space-y-1 max-w-[calc(100vw-1rem)] md:max-w-none">
          <div className="text-green-400">Press Ctrl+Alt+Del to restart (just kidding)</div>
          <div className="text-cyan-400">Or try turning it off and on again...</div>
        </div>
      </div>
    )
  }

  return (
    <section className="flex flex-col justify-start items-center relative overflow-hidden py-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg shadow-2xl mb-8 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/20 flex-shrink-0">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="ml-4 text-xs text-muted-foreground font-mono">terminal://promprot.com</span>
            </div>

            <div className="p-8 font-mono">
              <div className="text-left space-y-1">
                {terminalLines.map((line, index) => {
                  return (
                    <p
                      key={index}
                      className={
                        line && line.includes("whitespace-pre")
                          ? ""
                          : (line && line.includes("INTRUSION_DETECTED")) ||
                              (line && line.includes("TARGET_ACQUIRED")) ||
                              (line && line.includes("[ALERT]")) ||
                              (line && line.includes("KILLSWITCH")) ||
                              (line && line.includes("WARNING:")) ||
                              (line && line.includes("CRITICAL ERROR")) ||
                              (line && line.includes("SYSTEM FAILURE")) ||
                              (line && line.includes("COMPROMISED"))
                            ? "text-red-400 font-bold"
                            : line && line.startsWith("$")
                              ? "text-green-400"
                              : line && line.startsWith("root@promprot")
                                ? "text-green-400 font-bold"
                                : line &&
                                    (line.includes("[ACCESS DENIED]") ||
                                      line.includes("Warning:") ||
                                      line.includes("Vulnerabilities") ||
                                      line.includes("Segmentation fault") ||
                                      line.includes("Stack overflow"))
                                  ? "text-red-400 font-bold"
                                  : line &&
                                      (line.includes("user_agent=") ||
                                        line.includes("platform=") ||
                                        line.includes("screen_res=") ||
                                        line.includes("color_depth=") ||
                                        line.includes("timezone=") ||
                                        line.includes("network_trace:") ||
                                        line.includes("fingerprint:") ||
                                        line.includes("$κιηηεя") ||
                                        line.includes("promprot@pm.me") ||
                                        line.includes("@promproto") ||
                                        line.includes("github.com/promprot"))
                                    ? "text-green-400"
                                    : line &&
                                        (line.includes("ANALYSIS_COMPLETE") ||
                                          line.includes("LOGGING_SESSION") ||
                                          line.includes("[INFO]") ||
                                          line.includes("Progress:") ||
                                          line.includes("successful") ||
                                          line.includes("complete") ||
                                          line.includes("granted") ||
                                          line.includes("100%") ||
                                          line.includes("Deleting"))
                                      ? "text-yellow-400"
                                      : "text-muted-foreground"
                      }
                      dangerouslySetInnerHTML={{ __html: line }}
                    />
                  )
                })}

                {isInteractive && !isExitSequenceActive && (
                  <div className="flex items-center mt-2">
                    <span className="text-green-400 font-bold">root@promprot:~#</span>
                    <div className="relative flex-1 ml-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleInputSubmit}
                        className="bg-transparent border-none outline-none text-muted-foreground font-mono w-full"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="Type 'help' for commands..."
                      />
                      <span
                        className={`absolute left-0 top-0 ${showInputCursor ? "opacity-100 text-green-400 font-bold text-lg" : "opacity-0"} transition-opacity duration-100 pointer-events-none`}
                        style={{ left: userInput.length > 0 ? `${userInput.length * 0.6}em` : "0" }}
                      >
                        _
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
