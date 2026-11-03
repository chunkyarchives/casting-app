import { ImageNotFound01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { DetailList, DetailRow } from '@/components/common/display/DetailList'
import { ImageZoom } from '@/components/common/media/ImageZoom'
import { MediaImage } from '@/components/common/media/MediaImage'
import { StatusDot } from '@/components/common/display/StatusDot'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { mediaUrl } from '@/lib/api/media'
import { formatCount } from '@/lib/format'
import type { RoleApplicationCounts } from '@/types/admin'
import type { FilmRole } from '@/types/film'
import type { MediaItem } from '@/types/media'

type Props = {
  role: FilmRole
  applications: RoleApplicationCounts | undefined
}

export function FilmRoleCard({ role, applications }: Props) {
  const requirements = roleRequirements(role)
  const hasContent = requirements.length > 0 || role.conceptArt.length > 0

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{role.name}</CardTitle>
        {role.description && (
          <CardDescription className="whitespace-pre-line">{role.description}</CardDescription>
        )}
        <CardAction>
          <StatusDot tone={role.status === 'Open' ? 'positive' : 'neutral'}>{role.status}</StatusDot>
        </CardAction>
      </CardHeader>

      {hasContent && (
        <CardContent className="flex flex-col gap-4">
          {requirements.length > 0 && (
            <DetailList>
              {requirements.map(({ label, value }) => (
                <DetailRow key={label} label={label}>
                  {value}
                </DetailRow>
              ))}
            </DetailList>
          )}
          {role.conceptArt.length > 0 && <ConceptArtGallery roleName={role.name} items={role.conceptArt} />}
        </CardContent>
      )}

      <CardFooter className="justify-center">
        <dl className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
          <ApplicationCount label="Proposed" value={applications?.proposed ?? 0} />
          <ApplicationCount label="Accepted" value={applications?.accepted ?? 0} />
          <ApplicationCount label="Rejected" value={applications?.rejected ?? 0} />
        </dl>
      </CardFooter>
    </Card>
  )
}

function ConceptArtGallery({ roleName, items }: { roleName: string; items: MediaItem[] }) {
  return (
    <ul className="flex gap-2">
      {items.map((art, index) => {
        const src = mediaUrl(art.url)
        const description = art.caption ?? `Concept art ${index + 1} for ${roleName}`
        const position = `Concept art ${index + 1} of ${items.length}`

        return (
          <li key={art.id} className="min-w-0 flex-1">
            <ImageZoom
              src={src}
              alt={description}
              label={`Show ${description}`}
              caption={{ title: roleName, description: art.caption ? `${art.caption} · ${position}` : position }}
              className="block w-full"
            >
              <MediaImage src={src} alt="" className="aspect-square w-full" fallback={<MissingImage />} />
            </ImageZoom>
          </li>
        )
      })}
    </ul>
  )
}

function MissingImage() {
  return (
    <div className="flex size-full items-center justify-center text-muted-foreground">
      <HugeiconsIcon icon={ImageNotFound01Icon} strokeWidth={1.5} className="size-1/3" />
    </div>
  )
}

function ApplicationCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex gap-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{formatCount(value)}</dd>
    </div>
  )
}

type Requirement = { label: string; value: string }

function roleRequirements(role: FilmRole): Requirement[] {
  const rows = [
    range('Age', role.ageMin, role.ageMax),
    range('Height', role.heightMin, role.heightMax, ' cm'),
    range('Weight', role.weightMin, role.weightMax, ' kg'),
    role.gender ? { label: 'Gender', value: role.gender } : null,
    role.origin ? { label: 'Origin', value: role.origin } : null,
  ]

  return rows.filter((row) => row !== null)
}

function range(label: string, min: number | null, max: number | null, unit = ''): Requirement | null {
  if (min !== null && max !== null) return { label, value: `${min === max ? min : `${min}–${max}`}${unit}` }
  if (min !== null) return { label, value: `from ${min}${unit}` }
  if (max !== null) return { label, value: `up to ${max}${unit}` }
  return null
}