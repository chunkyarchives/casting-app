import { useEffect, useState } from 'react'

const words = [
  'crew.',
  'cast.',
  'scene.',
  'story.',
  'film.',
  'production.',
  'premiere.',
  'prequel',
  'sequel.',
  'trilogy.',
  'montage.',
  'festival.',
  'franchise.',
  'screening.',
  'final cut.',
  'long take.',
  'table read.',
  'cult classic.',
  'blockbuster.',
  'masterpiece.',
]
const holdMs = 1000
const slideMs = 500
const lineHeight = 1.2 // em

const items = [...words, words[0]]

export function RotatingWord() {
  const [index, setIndex] = useState(0)
  const [animated, setAnimated] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setIndex((i) => (i >= words.length ? i : i + 1))
    }, holdMs)
    return () => clearInterval(id)
  }, [])

  const handleTransitionEnd = () => {
    if (index === words.length) {
      setAnimated(false)
      setIndex(0)
    }
  }

  useEffect(() => {
    if (animated) return
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimated(true)),
    )
    return () => cancelAnimationFrame(id)
  }, [animated])

  return (
    <span
      aria-hidden
      className="block overflow-hidden text-primary"
      style={{ height: `${lineHeight}em` }}
    >
      <span
        className="flex flex-col items-end"
        style={{
          transform: `translateY(-${index * lineHeight}em)`,
          transition: animated
            ? `transform ${slideMs}ms cubic-bezier(0.65, 0, 0.35, 1)`
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {items.map((word, i) => (
          <span key={i} style={{ height: `${lineHeight}em`, lineHeight }}>
            {word}
          </span>
        ))}
      </span>
    </span>
  )
}