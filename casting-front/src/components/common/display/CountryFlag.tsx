import { countryName } from '@/lib/countries'
import { cn } from '@/lib/utils'

const flagUrls = import.meta.glob<string>('/node_modules/flag-icons/flags/4x3/*.svg', {
  eager: true,
  query: '?no-inline',
  import: 'default',
})

const flagUrl = (code: string) => flagUrls[`/node_modules/flag-icons/flags/4x3/${code.toLowerCase()}.svg`]

const unknownFlag = 'xx'

type Props = {
  code: string | null
  className?: string
}

export function CountryFlag({ code, className }: Props) {
  const src = (code && flagUrl(code)) || flagUrl(unknownFlag)
  const label = code ? countryName(code) : 'Unknown country'

  return (
    <img
      src={src}
      alt={label}
      title={label}
      className={cn('inline-block aspect-4/3 h-[1em] w-auto rounded-xs object-cover', className)}
    />
  )
}