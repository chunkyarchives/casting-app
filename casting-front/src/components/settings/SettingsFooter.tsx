import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  hint: string | null
  defaultHint: string
  dirty: boolean
  saving: boolean
  formId: string
  onDiscard: () => void
}

export function SettingsFooter({ hint, defaultHint, dirty, saving, formId, onDiscard }: Props) {
  return (
    <div
      data-slot="settings-footer"
      className={cn(
        'sticky bottom-0 z-10 -mx-6 mt-auto flex min-h-16 items-center gap-4 border-t bg-background/90 px-6 py-3 sm:px-10',
        !dirty && 'max-sm:hidden',
      )}
    >
      <p key={hint ?? ''} className="flex-1 animate-in text-sm text-muted-foreground duration-200 fade-in-0 max-sm:hidden">
        {hint ?? defaultHint}
      </p>
      {dirty && (
        <div className="ml-auto flex animate-in items-center gap-3 duration-200 fade-in-0 slide-in-from-bottom-2">
          <span className="text-sm max-sm:hidden">Unsaved changes</span>
          <Button type="button" variant="outline" disabled={saving} onClick={onDiscard}>
            Discard
          </Button>
          <Button type="submit" form={formId} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      )}
    </div>
  )
}