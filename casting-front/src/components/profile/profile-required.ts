import { toast } from '@/components/ui/toast'

const toastId = 'profile-required'

export function showProfileRequired() {
  toast.add({
    id: toastId,
    type: 'error',
    priority: 'high',
    title: 'Complete your profile first!',
    description: 'Visit account settings to fill in your data.',
  })
}