import { CountryCombobox } from '@/components/common/form/CountryCombobox'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { Button } from '@/components/ui/button'
import type { RowField } from './row-field'

type Props = {
  field: RowField<string | null>
  hint: string
  error?: string
}

export function OriginRow({ field, hint, error }: Props) {
  return (
    <SettingsRow label="Origin" hint={hint} error={error}>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <CountryCombobox
            label="Origin"
            align="center"
            value={field.value}
            onChange={field.onChange}
            invalid={error !== undefined}
          />
        </div>
        {field.value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => field.onChange(null)}>
            Any
          </Button>
        )}
      </div>
    </SettingsRow>
  )
}