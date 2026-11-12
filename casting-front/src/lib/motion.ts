export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const shakeFrames = [0, -8, 8, -6, 6, -3, 3, 0].map((offset) => ({ transform: `translateX(${offset}px)` }))

export function shake(element: Element | null | undefined) {
  if (!element || prefersReducedMotion()) return
  element.animate(shakeFrames, { duration: 450, easing: 'ease-in-out' })
}

type Point = { x: number; y: number }

const centerOf = (element: Element): Point => {
  const rect = element.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

export function pullTowards(element: HTMLElement, anchor: Element, target: Element | null | undefined, strength = 0.3) {
  if (!target || prefersReducedMotion()) {
    element.style.translate = ''
    return
  }
  const from = centerOf(anchor)
  const to = centerOf(target)
  element.style.translate = `${(to.x - from.x) * strength}px ${(to.y - from.y) * strength}px`
}

type Landing = {
  scale: number
  rotate: number
  duration: number
  easing: string
}

async function land(overlay: Element, destination: Element, landing: Landing) {
  const element = overlay.firstElementChild
  if (!element || prefersReducedMotion() || !destination.isConnected) return
  const from = centerOf(element)
  const to = centerOf(destination)
  await element.animate(
    [
      { transform: 'none', opacity: 1 },
      {
        transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) rotate(${landing.rotate}deg) scale(${landing.scale})`,
        opacity: 0,
      },
    ],
    { duration: landing.duration, easing: landing.easing, fill: 'forwards' },
  ).finished
}

export const fallInto = (element: Element, hole: Element) =>
  land(element, hole, { scale: 0, rotate: 300, duration: 550, easing: 'cubic-bezier(0.55, 0, 1, 0.45)' })

export const returnTo = (element: Element, home: Element) =>
  land(element, home, { scale: 1, rotate: 0, duration: 300, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })