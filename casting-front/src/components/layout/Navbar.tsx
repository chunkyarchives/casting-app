import { Link, NavLink } from 'react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { useAuthDrawer } from '@/components/auth/drawer/auth-context'
import { cn } from '@/lib/utils'

const links = [
  { to: '/movies', label: 'Movies' },
  { to: '/roles', label: 'Roles' },
  { to: '/network', label: 'Network' },
]

export function Navbar() {
  const { openAuth } = useAuthDrawer()

  return (
    <header className="w-full">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Replace the text with an <img> or SVG once you have the logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          CastingApp
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(buttonVariants({ variant: 'ghost' }), isActive && 'bg-accent')
              }
            >
              {label}
            </NavLink>
          ))}
          <Button variant="ghost" onClick={() => openAuth('sign-in')}>
            Sign in
          </Button>
        </div>
      </nav>
    </header>
  )
}