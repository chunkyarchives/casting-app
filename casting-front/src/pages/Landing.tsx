import { Button } from '@/components/ui/button'
import { useAuthDrawer } from '@/components/auth/drawer/auth-context'
import { RotatingWord } from '@/components/landing/RotatingWord'

export default function Landing() {
  const { openAuth } = useAuthDrawer()

  return (
    <section className="relative isolate flex flex-1 items-center overflow-hidden">
      {/* Later: add bg-[url(...)] bg-cover bg-center to this div */}
      <div aria-hidden className="absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="ml-auto flex max-w-xl flex-col items-end gap-8 pt-24 text-right">
          <h1
            aria-label="Be a part of a crew."
            className="text-5xl font-bold tracking-tight md:text-6xl"
            style={{ lineHeight: 1.2 }}
            >
            <span aria-hidden className="block">Be a part of a</span>
            <RotatingWord />
          </h1>
          <Button size="xl" onClick={() => openAuth('sign-up')}>
            Get started - It's free
          </Button>
        </div>
      </div>
    </section>
  )
}