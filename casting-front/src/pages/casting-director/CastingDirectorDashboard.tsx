import { SignOutButton } from '@/components/auth/SignOutButton'
import { CompleteProfileNotice } from '@/components/profile/CompleteProfileNotice'

export default function CastingDirectorDashboard() {
  return (
    <main className="flex min-h-svh flex-col items-center gap-4 p-6">
      <CompleteProfileNotice className="w-full max-w-md" />

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-medium">Casting Director</h1>
        <SignOutButton />
      </div>
    </main>
  )
}