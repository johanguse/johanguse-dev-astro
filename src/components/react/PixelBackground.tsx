import { useEffect, useRef } from 'react'
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

interface PixelBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number
  speed?: number
  pattern?: string
  darkColors?: string
  lightColors?: string
  children?: ReactNode
  style?: CSSProperties
}

interface Wave {
  x: number
  y: number
  radius: number
  maxRadius: number
}

/**
 * Canvas-based pixel background. Tiny square pixels ripple outward in waves
 * from the center (auto) and from the cursor (on hover). Adapts to dark/light
 * theme by reading the `dark` class on <html>.
 *
 * Props mirror the unlumen-ui PixelBackground component.
 */
export function PixelBackground({
  gap = 5,
  speed = 35,
  pattern = 'center',
  darkColors = '#2a2a2a,#3b3b3b,#525252',
  lightColors = '#d4d4d4,#bdbdbd,#a3a3a3',
  children,
  style,
  className,
  ...props
}: PixelBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0

    const resize = () => {
      width = container.offsetWidth
      height = container.offsetHeight
      canvas.width = width
      canvas.height = height
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const waves: Wave[] = []
    let lastAutoWave = 0
    let lastMouseWave = 0
    let lastTime = 0
    let raf = 0

    const spawnWave = (x: number, y: number) => {
      const maxDist = Math.sqrt(
        Math.max(x, width - x) ** 2 + Math.max(y, height - y) ** 2,
      )
      waves.push({ x, y, radius: 0, maxRadius: maxDist + gap * 4 })
    }

    // Kick off immediately
    spawnWave(width / 2, height / 2)

    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastMouseWave < 500) return
      lastMouseWave = now
      const rect = container.getBoundingClientRect()
      spawnWave(e.clientX - rect.left, e.clientY - rect.top)
    }
    container.addEventListener('mousemove', onMouseMove)

    const pixelSz = Math.max(1.5, gap * 0.55)
    const falloff = gap * 5

    const frame = (time: number) => {
      const dt = Math.min((time - (lastTime || time)) / 1000, 0.05)
      lastTime = time

      if (time - lastAutoWave > 4500 || waves.length === 0) {
        lastAutoWave = time
        spawnWave(width / 2, height / 2)
      }

      ctx.clearRect(0, 0, width, height)

      const isDark = document.documentElement.classList.contains('dark')
      const colors = (isDark ? darkColors : lightColors)
        .split(',')
        .map(c => c.trim())
      const speedPx = (speed / 100) * 280

      // Advance waves
      for (let i = waves.length - 1; i >= 0; i--) {
        waves[i].radius += speedPx * dt
        if (waves[i].radius > waves[i].maxRadius + falloff) {
          waves.splice(i, 1)
        }
      }

      // Draw pixels
      for (let px = gap; px < width; px += gap * 2) {
        for (let py = gap; py < height; py += gap * 2) {
          let brightness = 0

          for (const w of waves) {
            const d = Math.sqrt((px - w.x) ** 2 + (py - w.y) ** 2)
            const diff = Math.abs(d - w.radius)
            const b = Math.max(0, 1 - diff / falloff)
            const fade = Math.max(0, 1 - w.radius / w.maxRadius)
            const combined = b * fade
            if (combined > brightness) brightness = combined
          }

          if (brightness < 0.025) continue

          // Deterministic color per pixel — no per-frame flicker
          const ci =
            ((Math.floor(px / gap) * 31 + Math.floor(py / gap) * 17) %
              colors.length +
              colors.length) %
            colors.length

          ctx.fillStyle = colors[ci]
          ctx.globalAlpha = brightness
          ctx.fillRect(px - pixelSz / 2, py - pixelSz / 2, pixelSz, pixelSz)
        }
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      container.removeEventListener('mousemove', onMouseMove)
    }
  }, [gap, speed, darkColors, lightColors])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}
