import { SignOutButton } from '@/components/auth/SignOutButton'

export default function ActorDashboard() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-medium">Actor</h1>
      <SignOutButton />
    </main>
  )
}