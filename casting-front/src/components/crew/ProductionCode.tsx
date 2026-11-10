import { Copy01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

const codeRevealStartMs = 250
const codeRevealStepMs = 90

type Props = {
  code: string
  tone?: 'strong' | 'soft'
  animate?: boolean
}

export function ProductionCode({ code, tone = 'strong', animate = false }: Props) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.add({ type: 'success', title: 'Production code copied' })
    } catch {
      toast.add({ type: 'error', title: 'The code could not be copied' })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="sr-only">Production code {code}</span>
      <span aria-hidden="true" className={cn('flex', tone === 'strong' ? 'gap-1.5 sm:gap-2' : 'gap-1')}>
        {[...code].map((character, index) => (
          <span
            key={index}
            style={animate ? { animationDelay: `${codeRevealStartMs + index * codeRevealStepMs}ms` } : undefined}
            className={cn(
              'flex items-center justify-center font-semibold tabular-nums',
              tone === 'strong'
                ? 'size-10 rounded-2xl bg-primary/20 text-xl text-foreground ring-1 ring-primary/40 sm:size-12 sm:text-2xl'
                : 'size-7 rounded-lg bg-muted text-sm text-muted-foreground',
              animate && 'animate-in duration-300 fill-mode-both fade-in-0 zoom-in-50 motion-reduce:animate-none',
            )}
          >
            {character}
          </span>
        ))}
      </span>
      <Button
        variant="ghost"
        size={tone === 'strong' ? 'icon' : 'icon-sm'}
        aria-label="Copy production code"
        onClick={() => void copy()}
      >
        <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
      </Button>
    </div>
  )
}