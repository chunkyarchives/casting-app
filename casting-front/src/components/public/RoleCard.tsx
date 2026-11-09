import { CountryFlag } from '@/components/common/display/CountryFlag'
import { FilmPoster } from '@/components/common/media/FilmPoster'
import { Badge } from '@/components/ui/badge'
import { countryName, isCountryCode } from '@/lib/countries'
import type { PublicRole } from '@/types/public'

const ageLabel = ({ ageMin, ageMax }: PublicRole) => {
  if (ageMin !== null && ageMax !== null) return `${ageMin}–${ageMax} years`
  if (ageMin !== null) return `${ageMin}+ years`
  if (ageMax !== null) return `Up to ${ageMax} years`
  return null
}

const applicationsLabel = (count: number) => {
  if (count === 0) return 'Be the first to apply'
  return count === 1 ? '1 application' : `${count} applications`
}

export function RoleCard({ role, rank }: { role: PublicRole; rank: number }) {
  const age = ageLabel(role)

  return (
    <article className="flex h-full gap-4 rounded-xl border bg-card p-4">
      <FilmPoster posterUrl={role.posterUrl} className="w-20 shrink-0 self-start overflow-hidden rounded-md" />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h2 className="truncate font-bold">{role.name}</h2>
            <p className="truncate text-xs text-muted-foreground">{role.filmTitle}</p>
          </div>
          <span className="text-sm font-bold text-primary tabular-nums">#{rank}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {role.gender && <Badge variant="outline">{role.gender}</Badge>}
          {age && <Badge variant="outline">{age}</Badge>}
          {role.origin && (
            <Badge variant="outline">
              {isCountryCode(role.origin) && <CountryFlag code={role.origin} decorative className="h-2.5" />}
              {countryName(role.origin)}
            </Badge>
          )}
        </div>

        {role.description && <p className="line-clamp-2 text-sm">{role.description}</p>}

        <p className="mt-auto text-xs text-muted-foreground">{applicationsLabel(role.applications)}</p>
      </div>
    </article>
  )
}