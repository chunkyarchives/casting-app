import { useApiQuery } from '@/hooks/useApiQuery'
import { applicationsApi } from '@/lib/api/applications'

export const pendingProposalsKey = 'casting-director-proposals'

export const usePendingProposals = () => useApiQuery(pendingProposalsKey, () => applicationsApi.proposals())