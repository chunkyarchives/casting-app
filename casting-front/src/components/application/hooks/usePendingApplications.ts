import { useApiQuery } from '@/hooks/useApiQuery'
import { applicationsApi } from '@/lib/api/applications'

export const pendingApplicationsKey = 'director-pending-applications'

export const usePendingApplications = () => useApiQuery(pendingApplicationsKey, () => applicationsApi.pending())