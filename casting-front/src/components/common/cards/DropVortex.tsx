import { cn } from '@/lib/utils'

export function DropVortex({ active }: { active: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={cn(
          'absolute -inset-1/4 bg-[conic-gradient(transparent,rgb(0_0_0/0.45),transparent_50%,rgb(0_0_0/0.45),transparent)] [mask-image:radial-gradient(circle,black_15%,transparent_60%)] transition-opacity duration-500 ease-out motion-reduce:animate-none',
          active ? 'animate-[spin_2.5s_linear_infinite] opacity-100' : 'opacity-0',
        )}
      />
      <div
        className={cn(
          'absolute inset-0 bg-[radial-gradient(circle,rgb(0_0_0/0.95)_0%,rgb(0_0_0/0.6)_22%,transparent_62%)] transition-[opacity,scale] duration-500 ease-out motion-reduce:transition-none',
          active ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
        )}
      />
    </div>
  )
}