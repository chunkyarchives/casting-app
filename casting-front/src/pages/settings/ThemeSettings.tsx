import { useState } from 'react'
import { PaintBoardIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { OptionSlot } from '@/components/settings/OptionSlot'
import { SettingsScreen } from '@/components/settings/SettingsScreen'
import { ThemeSwatches } from '@/components/settings/ThemeSwatches'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useSiteTheme } from '@/hooks/useSiteTheme'
import { siteThemes } from '@/lib/themes'

const previewClassName = 'min-h-80 flex-none animate-in p-0 duration-200 fade-in-0'

export default function ThemeSettings() {
  const [theme, setTheme] = useSiteTheme()
  const [showPalette, setShowPalette] = useState(false)

  return (
    <SettingsScreen title="Choose a theme" icon={PaintBoardIcon}>
      <div>
        <OptionSlot
          label="Palette"
          options={siteThemes}
          value={theme}
          getLabel={(option) => option.name}
          onChange={setTheme}
          onActiveChange={setShowPalette}
        />
      </div>

      {showPalette ? (
        <Empty key="palette" className={previewClassName}>
          <EmptyMedia>
            <ThemeSwatches theme={theme} />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>{theme.name}</EmptyTitle>
            <EmptyDescription>{theme.description}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Empty key="intro" className={previewClassName}>
          <EmptyMedia>
            <div className="flex size-40 items-center justify-center rounded-2xl border-2 border-dashed text-muted-foreground">
              <HugeiconsIcon icon={PaintBoardIcon} strokeWidth={1.5} className="size-16" />
            </div>
          </EmptyMedia>
          <EmptyHeader>
            <EmptyDescription>
              Pick the look you like: go through the palettes with the arrows, or with ← → on the keyboard.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </SettingsScreen>
  )
}