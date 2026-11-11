import type { ReactNode } from 'react'
import { PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from 'react-router'
import defaultProfilePicture from '@/assets/images/default.png'
import { overlayActionClass } from '@/components/common/actions/overlay-action'
import { CountryFlag } from '@/components/common/display/CountryFlag'
import { ImageZoom } from '@/components/common/media/ImageZoom'
import { MediaImage } from '@/components/common/media/MediaImage'
import { profilePictureSource } from '@/lib/api/participants'
import { countryName } from '@/lib/countries'
import { cn } from '@/lib/utils'
import type { Actor } from '@/types/actor'

type Fact = {
  label: string
  value: ReactNode
}

type Props = {
  actor: Actor
  email: string
  pictureUrl: string | null
  editTo: string
}

const missing = <span className="text-muted-foreground">Not set</span>

function FactList({ facts }: { facts: Fact[] }) {
  return (
    <dl className="grid grid-cols-[6.5rem_minmax(0,1fr)] content-start gap-x-4 gap-y-3 text-sm">
      {facts.map((fact) => (
        <div key={fact.label} className="contents">
          <dt className="text-muted-foreground">{fact.label}</dt>
          <dd className="min-w-0 wrap-break-word">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function IdentityCard({ actor, email, pictureUrl, editTo }: Props) {
  const name = `${actor.firstName} ${actor.lastName}`
  const picture = profilePictureSource(actor.id, pictureUrl)

  const personal: Fact[] = [
    { label: 'First name', value: actor.firstName },
    { label: 'Last name', value: actor.lastName },
    { label: 'Email', value: email },
  ]

  const physical: Fact[] = [
    { label: 'Age', value: actor.age !== null ? `${actor.age} years` : missing },
    { label: 'Gender', value: actor.gender ?? missing },
    { label: 'Height', value: actor.height !== null ? `${actor.height} cm` : missing },
    { label: 'Weight', value: actor.weight !== null ? `${actor.weight} kg` : missing },
    {
      label: 'Origin',
      value: actor.origin ? (
        <span className="inline-flex items-center gap-2">
          {countryName(actor.origin)}
          <CountryFlag code={actor.origin} decorative className="h-3.5" />
        </span>
      ) : (
        missing
      ),
    },
  ]

  return (
    <section
      aria-label="Your details"
      className="grid gap-6 rounded-2xl border bg-card p-6 shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
    >
      <div className="relative order-first size-36 self-start md:order-last md:size-44">
        {picture ? (
          <ImageZoom
            src={picture}
            alt={`Profile picture of ${name}`}
            label={`Show the profile picture of ${name}`}
            className="block size-full overflow-hidden rounded-xl ring-1 ring-border"
          >
            <MediaImage src={picture} alt="" className="size-full" />
          </ImageZoom>
        ) : (
          <img src={defaultProfilePicture} alt="" className="size-full rounded-xl object-cover ring-1 ring-border" />
        )}
        <Link to={editTo} aria-label="Edit your details" title="Edit your details" className={cn(overlayActionClass, 'absolute top-2 right-2')}>
          <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} />
        </Link>
      </div>

      <FactList facts={personal} />
      <FactList facts={physical} />
    </section>
  )
}