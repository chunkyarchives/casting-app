import { Fragment } from 'react'
import { Link01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { CountryFlag } from '@/components/common/display/CountryFlag'
import { CloseProfileAvatar } from '@/components/common/media/CloseProfileAvatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { countryName } from '@/lib/countries'

export type ProfileLink = {
  label: string
  url: string
}

export type ProfileCheck = {
  label: string
  done: boolean
}

type Props = {
  participantId: string
  pictureUrl: string | null
  name: string
  email: string
  origin?: string | null
  bio?: string | null
  links?: readonly ProfileLink[]
  facts: readonly string[]
  checklist: readonly ProfileCheck[]
}

export function ProfileCard({ participantId, pictureUrl, name, email, origin, bio, links = [], facts, checklist }: Props) {
  const done = checklist.filter((check) => check.done).length
  const next = checklist.find((check) => !check.done)

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:gap-6">
        <CloseProfileAvatar participantId={participantId} pictureUrl={pictureUrl} name={name} className="size-24 shrink-0" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-6 w-1 shrink-0 -skew-x-12 bg-primary" />
              <h2 className="truncate text-2xl font-bold">{name}</h2>
            </div>
            <p className="truncate pl-4 text-sm text-muted-foreground">{email}</p>
          </div>

          {bio && <p className="max-w-prose pl-4 text-sm whitespace-pre-line">{bio}</p>}

          {links.length > 0 && (
            <ul className="flex flex-wrap gap-2 pl-4">
              {links.map((link) => (
                <li key={`${link.label}:${link.url}`}>
                  <Badge
                    variant="outline"
                    render={<a href={link.url} target="_blank" rel="noreferrer" />}
                  >
                    <HugeiconsIcon icon={Link01Icon} strokeWidth={2} data-icon="inline-start" />
                    {link.label}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t bg-muted/40 px-6 py-3 text-sm">
        {origin !== undefined && (
          <span className="flex items-center gap-2">
            <CountryFlag code={origin} decorative className="h-3.5" />
            {origin ? countryName(origin) : 'No origin yet'}
          </span>
        )}
        {facts.map((fact) => (
          <Fragment key={fact}>
            <Separator orientation="vertical" className="h-4 self-center" />
            <span className="text-muted-foreground">{fact}</span>
          </Fragment>
        ))}

        <div className="ml-auto flex min-w-48 items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-[width]" style={{ width: `${(done / checklist.length) * 100}%` }} />
          </div>
          <span className="text-xs whitespace-nowrap text-muted-foreground">
            {next ? `Next: ${next.label}` : 'Profile complete'}
          </span>
        </div>
      </div>
    </section>
  )
}