import { useEffect, useRef, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  speed?: number
  hold?: number
}

const fadeClass = '[mask-image:linear-gradient(to_right,black_calc(100%_-_1.5rem),transparent)]'

export function Marquee({ children, className, speed = 30, hold = 1500 }: Props) {
  const viewport = useRef<HTMLSpanElement>(null)
  const track = useRef<HTMLSpanElement>(null)
  const content = useRef<HTMLSpanElement>(null)
  const animation = useRef<Animation | null>(null)
  const [moving, setMoving] = useState(false)

  useEffect(() => {
    const outer = viewport.current
    const inner = content.current
    if (!outer || !inner) return
    const observer = new ResizeObserver(() =>
      setMoving(inner.scrollWidth > outer.clientWidth + 1 && !prefersReducedMotion()),
    )
    observer.observe(outer)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const element = track.current
    if (!moving || !element) return
    const travel = (element.scrollWidth / 2 / speed) * 1000
    const duration = travel + hold
    const running = element.animate(
      [
        { transform: 'translateX(0)', offset: 0 },
        { transform: 'translateX(0)', offset: hold / duration },
        { transform: 'translateX(-50%)', offset: 1 },
      ],
      { duration, iterations: Infinity },
    )
    animation.current = running
    return () => {
      running.cancel()
      animation.current = null
    }
  }, [moving, speed, hold])

  return (
    <span
      ref={viewport}
      className={cn('block overflow-hidden whitespace-nowrap', moving && fadeClass, className)}
      onPointerEnter={() => animation.current?.pause()}
      onPointerLeave={() => animation.current?.play()}
    >
      <span ref={track} className={cn('block', moving && 'flex w-max gap-8 pr-8')}>
        <span ref={content} className={cn('inline-block max-w-full truncate align-bottom', moving && 'max-w-none')}>
          {children}
        </span>
        {moving && <span aria-hidden>{children}</span>}
      </span>
    </span>
  )
}