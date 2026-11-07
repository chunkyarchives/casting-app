import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import { CountryFlag } from '@/components/common/display/CountryFlag'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { countries, findCountry, type Country } from '@/lib/countries'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  value: string | null
  onChange: (code: string | null) => void
  invalid?: boolean
  align?: 'start' | 'center'
}

export function CountryCombobox({ label, value, onChange, invalid = false, align = 'start' }: Props) {
  return (
    <Combobox
      items={countries}
      value={findCountry(value)}
      onValueChange={(country: Country | null) => onChange(country?.code ?? null)}
      itemToStringLabel={(country: Country) => country.name}
      isItemEqualToValue={(item: Country, selected: Country) => item.code === selected.code}
    >
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupButton size="icon-xs" variant="ghost" render={<ComboboxTrigger />} aria-label={`Show all ${label.toLowerCase()} options`} />
        </InputGroupAddon>
        <ComboboxPrimitive.Input
        render={
            <InputGroupInput
              aria-label={label}
              aria-invalid={invalid}
              placeholder="Pick a country"
              className={cn(align === 'center' && 'text-center')}
            />
          }
        />
        {value && (
          <InputGroupAddon align="inline-end">
            <CountryFlag code={value} className="h-4" />
          </InputGroupAddon>
        )}
      </InputGroup>
      <ComboboxContent>
        <ComboboxEmpty>No country with that name</ComboboxEmpty>
        <ComboboxList>
          {(country: Country) => (
            <ComboboxItem key={country.code} value={country}>
              <CountryFlag code={country.code} className="h-3.5" />
              {country.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}