import { useCallback, useRef } from 'react'
import type { ReactNode } from 'react'

export interface TiltCardProps {
  title: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  href?: string
  externalHref?: string
  skills?: string[]
  date?: string
  /** Optional badge label */
  badge?: string
  badgeVariant?: 'success' | 'warning'
  children?: ReactNode
  className?: string
  /** Max rotation in degrees (default 12) */
  rotationFactor?: number
  /** Image height in px (default 180) */
  imageHeight?: number
}

/**
 * 3D spring-tilt card with a radial shine on hover and a floating image.
 * Built to mirror the unlumen-ui TiltCard behaviour.
 *
 * Mouse tracking → CSS perspective transform + shine gradient.
 * Spring feel comes from a fast cubic-bezier on mouse move and a slow
 * ease-out reset on mouse leave.
 */
export function TiltCard({
  title,
  description,
  imageSrc,
  imageAlt,
  href,
  externalHref,
  skills,
  date,
  badge,
  badgeVariant = 'success',
  children,
  className = '',
  rotationFactor = 12,
  imageHeight = 180,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const dx = (e.clientX - rect.left) / rect.width - 0.5
      const dy = (e.clientY - rect.top) / rect.height - 0.5

      const rx = -dy * rotationFactor
      const ry = dx * rotationFactor

      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`

      if (shineRef.current) {
        const px = ((e.clientX - rect.left) / rect.width) * 100
        const py = ((e.clientY - rect.top) / rect.height) * 100
        shineRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.11) 0%, transparent 62%)`
        shineRef.current.style.opacity = '1'
      }

      if (imgRef.current) {
        imgRef.current.style.transform = `translateZ(24px) scale(1.04) rotateX(${-rx * 0.25}deg) rotateY(${-ry * 0.25}deg)`
      }
    },
    [rotationFactor],
  )

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform =
      'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    if (shineRef.current) shineRef.current.style.opacity = '0'
    if (imgRef.current) imgRef.current.style.transform = 'translateZ(0px) scale(1)'
  }, [])

  const linkHref = href || externalHref
  const isExternal = !href && !!externalHref

  const inner = (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '1rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        transition:
          'transform 0.14s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.14s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        cursor: linkHref ? 'pointer' : 'default',
      }}
    >
      {/* Radial shine overlay */}
      <div
        ref={shineRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.18s ease',
          borderRadius: 'inherit',
        }}
      />

      {/* Image */}
      {imageSrc && (
        <div
          style={{
            overflow: 'hidden',
            height: `${imageHeight}px`,
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt={imageAlt || title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition:
                'transform 0.14s cubic-bezier(0.25,0.46,0.45,0.94)',
              willChange: 'transform',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
        {date && (
          <p
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-3)',
              marginBottom: '0.5rem',
            }}
          >
            {date}
          </p>
        )}

        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            lineHeight: 1.3,
            color: 'var(--text-1)',
            marginBottom: '0.4rem',
            fontFamily: 'var(--font-display)',
          }}
        >
          {title}
        </h3>

        {description && (
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-2)',
              lineHeight: 1.65,
            }}
          >
            {description.length > 110
              ? `${description.slice(0, 110)}…`
              : description}
          </p>
        )}

        {skills && skills.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.35rem',
              marginTop: '0.85rem',
            }}
          >
            {skills.slice(0, 4).map(s => (
              <span
                key={s}
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.04em',
                  padding: '0.18rem 0.6rem',
                  borderRadius: '9999px',
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-3)',
                  border: '1px solid var(--border)',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {badge && (
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.75rem',
              fontSize: '0.7rem',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              background:
                badgeVariant === 'success'
                  ? 'color-mix(in oklch, oklch(0.76 0.19 55) 15%, transparent)'
                  : 'color-mix(in oklch, oklch(0.8 0.18 80) 18%, transparent)',
              color: badgeVariant === 'success' ? 'var(--accent)' : 'oklch(0.78 0.18 80)',
            }}
          >
            {badge}
          </span>
        )}

        {children}
      </div>
    </div>
  )

  if (linkHref) {
    return (
      <a
        href={linkHref}
        {...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        style={{ display: 'block', textDecoration: 'none' }}
        aria-label={`View project: ${title}`}
      >
        {inner}
      </a>
    )
  }

  return inner
}
