import { countryName } from '@/lib/countries'
import { flagUrl, unknownFlagUrl } from '@/lib/flags'
import { cn } from '@/lib/utils'

type Props = {
  code: string | null
  decorative?: boolean
  className?: string
}

export function CountryFlag({ code, decorative = false, className }: Props) {
  const src = (code && flagUrl(code)) || unknownFlagUrl
  const label = code ? countryName(code) : 'Unknown country'

  return (
    <img
      src={src}
      alt={decorative ? '' : label}
      title={decorative ? undefined : label}
      loading="lazy"
      decoding="async"
      className={cn('inline-block aspect-4/3 h-[1em] w-auto rounded-xs object-cover text-transparent', className)}
    />
  )
}