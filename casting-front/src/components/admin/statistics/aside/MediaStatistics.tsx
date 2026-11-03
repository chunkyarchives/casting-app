import { useState } from 'react'
import { File01Icon } from '@hugeicons/core-free-icons'
import { Switch } from '@/components/ui/switch'
import { ByteSizeValue } from '@/components/common/display/ByteSizeValue'
import { formatCount, type ByteUnit } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { MediaStats } from '@/types/admin'
import { StatAside } from './StatAside'

type Props = {
  media: MediaStats
}

export function MediaStatistics({ media }: Props) {
  const [unit, setUnit] = useState<ByteUnit>('MB')

  return (
    <StatAside
      icon={File01Icon}
      title="Media"
      items={[
        { label: 'Files', value: formatCount(media.files) },
        { label: 'Total size', value: <ByteSizeValue bytes={media.totalBytes} unit={unit} /> },
      ]}
    >
      <div className="mt-2 flex items-center justify-end gap-2.5">
        <UnitLabel active={unit === 'MB'}>MB</UnitLabel>
        <Switch
          checked={unit === 'GB'}
          onCheckedChange={(checked) => setUnit(checked ? 'GB' : 'MB')}
          aria-label="Show total size in gigabytes"
        />
        <UnitLabel active={unit === 'GB'}>GB</UnitLabel>
      </div>
    </StatAside>
  )
}

function UnitLabel({ active, children }: { active: boolean; children: string }) {
  return (
    <span aria-hidden className={cn('font-medium', active ? 'text-foreground' : 'text-muted-foreground')}>
      {children}
    </span>
  )
}