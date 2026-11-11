import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const overlayActionClass = cn(buttonVariants({ variant: 'secondary', size: 'icon-sm' }), 'shadow-md')