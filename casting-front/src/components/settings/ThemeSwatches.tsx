import type { SiteTheme } from '@/lib/themes'
import { cn } from '@/lib/utils'

const swatches = [
  { name: 'Background', className: 'bg-background' },
  { name: 'Muted', className: 'bg-muted' },
  { name: 'Secondary', className: 'bg-secondary' },
  { name: 'Highlight', className: 'bg-sidebar-accent' },
  { name: 'Primary', className: 'bg-primary' },
  { name: 'Accent', className: 'bg-sidebar-primary' },
  { name: 'Destructive', className: 'bg-destructive' },
  { name: 'Text', className: 'bg-foreground' },
]

export function ThemeSwatches({ theme }: { theme: SiteTheme }) {
  return (
    <ul aria-label={`${theme.name} colors`} className={cn(theme.className, 'flex flex-wrap justify-center gap-3')}>
      {swatches.map(({ name, className }) => (
        <li key={name} aria-label={name} className={cn('size-12 rounded-md ring-1 ring-foreground/15', className)} />
      ))}
    </ul>
  )
}