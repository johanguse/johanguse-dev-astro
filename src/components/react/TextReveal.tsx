'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

export interface TextRevealProps {
  text: string
  as?: keyof React.JSX.IntrinsicElements
  splitBy?: 'words' | 'characters'
  staggerDelay?: number
  duration?: number
  once?: boolean
  className?: string
  threshold?: number
}

/**
 * Scroll-driven text reveal. Each word (or character) blurs in from an
 * obscured state as the element enters the viewport.
 *
 * Props mirror the unlumen-ui TextReveal component.
 */
export function TextReveal({
  text,
  as: Tag = 'p',
  splitBy = 'words',
  staggerDelay = 0.05,
  duration = 0.55,
  once = true,
  className,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, {
    once,
    margin: '0px 0px -8% 0px',
  })

  const units =
    splitBy === 'words'
      ? text
          .split(/\s+/)
          .map((w, i, arr) => (i < arr.length - 1 ? `${w}\u00A0` : w))
      : text.split('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AnyTag = Tag as any

  return (
    <AnyTag ref={ref} className={className} aria-label={text}>
      {units.map((unit, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.08, filter: 'blur(10px)' }}
          animate={
            isInView
              ? { opacity: 1, filter: 'blur(0px)' }
              : { opacity: 0.08, filter: 'blur(10px)' }
          }
          transition={{
            duration,
            delay: i * staggerDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block', willChange: 'opacity, filter' }}
        >
          {unit}
        </motion.span>
      ))}
    </AnyTag>
  )
}
