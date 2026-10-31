import { useEffect, useState } from 'react'
import type { ElementType, ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export interface RectangularTextRevealProps {
  text: string
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  id?: string
  accent?: string
  baseColor?: string
  overlayColor?: string
  staggerDelay?: number
  duration?: number
}

/**
 * Reveals each authored line beneath a pair of rectangular colour wipes.
 * The unanimated text is rendered first, so the heading remains visible
 * without JavaScript and for people who prefer reduced motion.
 */
export function RectangularTextReveal({
  text,
  as = 'div',
  className,
  id,
  accent,
  baseColor = 'var(--accent)',
  overlayColor = 'var(--bg)',
  staggerDelay = 0.18,
  duration = 0.82,
}: RectangularTextRevealProps) {
  const [mounted, setMounted] = useState(false)
  const reduceMotion = useReducedMotion()
  const lines = text.split('\n')
  const Tag = as as ElementType

  useEffect(() => setMounted(true), [])

  const renderText = (line: string): ReactNode => {
    if (!accent || !line.includes(accent)) return line

    return line.split(accent).flatMap((part, index, parts) => [
      part,
      ...(index < parts.length - 1
        ? [<em className="rectangular-text-reveal__accent" key={`${line}-${index}`}>{accent}</em>]
        : []),
    ])
  }

  if (!mounted || reduceMotion) {
    return (
      <Tag id={id} className={className}>
        {lines.map((line, index) => (
          <span className="rectangular-text-reveal__line" key={`${line}-${index}`}>
            {renderText(line)}
          </span>
        ))}
      </Tag>
    )
  }

  return (
    <Tag id={id} className={className}>
      {lines.map((line, index) => {
        const delay = index * staggerDelay

        return (
          <span className="rectangular-text-reveal__line" key={`${line}-${index}`}>
            <motion.span
              className="rectangular-text-reveal__content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.01, delay: delay + duration * 0.38 }}
            >
              {renderText(line)}
            </motion.span>
            <motion.span
              className="rectangular-text-reveal__wipe"
              aria-hidden="true"
              style={{ background: baseColor }}
              initial={{ scaleX: 0, transformOrigin: '0% 50%' }}
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ duration, delay, times: [0, 0.42, 1], ease: [0.4, 0, 0.2, 1] }}
            />
            <motion.span
              className="rectangular-text-reveal__wipe"
              aria-hidden="true"
              style={{ background: overlayColor, zIndex: 3 }}
              initial={{ scaleX: 0, transformOrigin: '0% 50%' }}
              animate={{ scaleX: [0, 1, 0] }}
              transition={{
                duration: duration * 0.72,
                delay: delay + duration * 0.12,
                times: [0, 0.42, 1],
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          </span>
        )
      })}
    </Tag>
  )
}
