import { useEffect, useRef, type ComponentProps } from 'react'

type Props = Omit<ComponentProps<'img'>, 'src' | 'ref'> & {
  blob: Blob
}

export function BlobImage({ blob, alt = '', ...props }: Props) {
  const image = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const element = image.current
    if (!element) return
    const url = URL.createObjectURL(blob)
    element.src = url
    return () => URL.revokeObjectURL(url)
  }, [blob])

  return <img ref={image} alt={alt} {...props} />
}