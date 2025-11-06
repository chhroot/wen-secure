"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"

interface HyperTextProps {
  children: string
  className?: string
  duration?: number
}

const DEFAULT_CHARACTER_SET = "abcdefghijklmnopqrstuvwxyz".split("")
const getRandomInt = (max: number): number => Math.floor(Math.random() * max)

export function HyperText({
  children,
  className,
  duration = 800,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  // Initialize and start animation when text changes
  useEffect(() => {
    const textArray = children.split("")
    setDisplayText(textArray)
    
    // Use setTimeout to avoid the setState warning
    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, 0)
    
    return () => clearTimeout(timer)
  }, [children])

  // Handle scramble animation
  useEffect(() => {
    if (!isAnimating) return

    const maxIterations = children.length
    const startTime = performance.now()
    let iterationCount = 0
    let animationFrameId: number

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      iterationCount = progress * maxIterations

      setDisplayText(
        children.split("").map((letter, index) =>
          letter === " "
            ? letter
            : index <= iterationCount
              ? children[index]
              : DEFAULT_CHARACTER_SET[getRandomInt(DEFAULT_CHARACTER_SET.length)]
        )
      )

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [children, duration, isAnimating])

  return (
    <div className={cn("overflow-hidden", className)}>
      <AnimatePresence>
        {displayText.map((letter, index) => (
          <motion.span
            key={`${children}-${index}`}
            className="font-mono"
          >
            {letter}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}