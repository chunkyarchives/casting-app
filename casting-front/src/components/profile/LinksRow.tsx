import { Add01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useController, useFieldArray } from 'react-hook-form'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { maxLinks, type ActorProfileValues } from '@/lib/validation/actor'

export function LinksRow() {
  const links = useFieldArray<ActorProfileValues, 'links'>({ name: 'links' })

  return (
    <SettingsRow
      label="Links"
      hint={`Your portfolio, IMDb, social media or showreel. Up to ${maxLinks}, each a full https:// link.`}
      align="start"
    >
      {links.fields.length > 0 && (
        <ul className="flex flex-col gap-2">
          {links.fields.map((link, index) => (
            <LinkFields key={link.id} index={index} onRemove={() => links.remove(index)} />
          ))}
        </ul>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={links.fields.length >= maxLinks}
        onClick={() => links.append({ label: '', url: '' })}
      >
        <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
        Add link
      </Button>
    </SettingsRow>
  )
}

type LinkFieldsProps = {
  index: number
  onRemove: () => void
}

function LinkFields({ index, onRemove }: LinkFieldsProps) {
  const label = useController<ActorProfileValues, `links.${number}.label`>({ name: `links.${index}.label` })
  const url = useController<ActorProfileValues, `links.${number}.url`>({ name: `links.${index}.url` })
  const error = label.fieldState.error?.message ?? url.fieldState.error?.message

  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Input
          {...label.field}
          aria-label={`Name of link ${index + 1}`}
          aria-invalid={label.fieldState.invalid}
          placeholder="Name, e.g. IMDb"
          maxLength={50}
          className="w-28 shrink-0 sm:w-40"
        />
        <Input
          {...url.field}
          aria-label={`Address of link ${index + 1}`}
          aria-invalid={url.fieldState.invalid}
          type="url"
          placeholder="https://"
          maxLength={500}
          className="min-w-0 flex-1"
        />
        <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove link ${index + 1}`} onClick={onRemove}>
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </li>
  )
}