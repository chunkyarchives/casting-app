import type { ReactNode } from 'react'
import { CountryFlag } from '@/components/common/display/CountryFlag'
import { CloseProfileAvatar } from '@/components/common/media/CloseProfileAvatar'
import { countryName } from '@/lib/countries'

type Props = {
  participantId: string
  name: string
  facts: (string | null)[]
  origin: string | null
  children?: ReactNode
}

export function ProfileBasics({ participantId, name, facts, origin, children }: Props) {
  const shownFacts = facts.filter((fact) => fact !== null)

  return (
    <section className="flex flex-col items-center gap-3 text-center">
      <CloseProfileAvatar participantId={participantId} name={name} className="size-24" />
      <div className="flex flex-col items-center gap-1">
        {shownFacts.length > 0 && <p className="text-sm text-muted-foreground">{shownFacts.join(' · ')}</p>}
        {origin && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CountryFlag code={origin} decorative className="h-3" />
            {countryName(origin)}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}