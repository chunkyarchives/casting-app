import { CountryFlag } from '@/components/common/display/CountryFlag'
import { ProfileAvatar } from '@/components/common/media/ProfileAvatar'
import { countryName } from '@/lib/countries'
import { roleLabels } from '@/lib/roles'
import type { PublicPerson } from '@/types/public'

export function PersonCard({ person }: { person: PublicPerson }) {
  return (
    <article className="flex h-full flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center">
      <ProfileAvatar participantId={person.id} pictureUrl={person.profilePictureUrl} className="size-20" />

      <div className="flex w-full min-w-0 flex-col gap-0.5">
        <h2 className="truncate font-bold">
          {person.firstName} {person.lastName}
        </h2>
        <p className="text-xs text-muted-foreground">{roleLabels[person.role]}</p>
      </div>

      <div className="flex min-h-5 flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        {person.origin && (
          <span className="flex items-center gap-1.5">
            <CountryFlag code={person.origin} decorative className="h-3" />
            {countryName(person.origin)}
          </span>
        )}
        {person.age !== null && <span>{person.age} years</span>}
      </div>

      <p className="line-clamp-2 h-10 w-full text-sm">{person.bio}</p>
    </article>
  )
}