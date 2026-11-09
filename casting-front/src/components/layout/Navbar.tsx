import { Menu01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, NavLink } from 'react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuthDrawer } from '@/components/auth/drawer/auth-context'
import { paths } from '@/lib/routes'
import { cn } from '@/lib/utils'

const links = [
  { to: paths.movies, label: 'Movies' },
  { to: paths.roles, label: 'Roles' },
  { to: paths.network, label: 'Network' },
]

export function Navbar() {
  const { openAuth } = useAuthDrawer()

  return (
    <header className="w-full">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Replace the text with an <img> or SVG once you have the logo */}
        <Link to={paths.landing} className="text-2xl font-bold tracking-tight">
          CastingApp
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(buttonVariants({ variant: 'ghost' }), 'max-sm:hidden', isActive && 'bg-accent')
              }
            >
              {label}
            </NavLink>
          ))}
          <Button variant="ghost" onClick={() => openAuth('sign-in')}>
            Sign in
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Menu" className="sm:hidden" />}>
              <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {links.map(({ to, label }) => (
                <DropdownMenuItem key={to} render={<Link to={to} />}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  )
}