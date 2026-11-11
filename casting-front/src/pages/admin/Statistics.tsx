import { ActivityStatistics } from '@/components/admin/statistics/activity/ActivityStatistics'
import { ChatStatistics } from '@/components/admin/statistics/aside/ChatStatistics'
import { MediaStatistics } from '@/components/admin/statistics/aside/MediaStatistics'
import { StatPieCharts } from '@/components/admin/statistics/boreks/StatPieCharts'
import { StatisticsSection } from '@/components/admin/statistics/StatisticsSection'
import {
  accountPies,
  applicationPies,
  filmPies,
} from '@/components/admin/statistics/boreks/stat-pies'
import { LoadError } from '@/components/common/states/LoadError'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { adminApi } from '@/lib/api/admin'
import { AdminWrap } from '@/components/admin/AdminWrap'

export default function Statistics() {
  const stats = useApiQuery('admin-stats', adminApi.getStats)

  return (
    <AdminWrap>
      <h1 className="sr-only">Statistics</h1>

      <StatisticsSection id="activity">
         <ActivityStatistics />
      </StatisticsSection>

      {stats.status === 'loading' && <Skeleton className="h-72 w-full" />}

      {stats.status === 'error' && (
        <LoadError title="Statistics could not be loaded" error={stats.error} onRetry={stats.reload} />
      )}

      {stats.status === 'success' && (
        <>
          <StatisticsSection id="accounts">
            <StatPieCharts pies={accountPies(stats.data.accounts)}>
              <MediaStatistics media={stats.data.media} />
            </StatPieCharts>
          </StatisticsSection>

          <StatisticsSection id="productions">
            <StatPieCharts pies={filmPies(stats.data.films)} />
          </StatisticsSection>

          <StatisticsSection id="applications">
            <StatPieCharts pies={applicationPies(stats.data.applications)}>
              <ChatStatistics chat={stats.data.chat} />
            </StatPieCharts>
          </StatisticsSection>
        </>
      )}
    </AdminWrap>
  )
}