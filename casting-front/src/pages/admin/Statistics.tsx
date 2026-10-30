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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useScrollToHash } from '@/hooks/useScrollToHash'
import { adminApi } from '@/lib/api/admin'
import { apiErrorMessage } from '@/lib/api/errors'

export default function Statistics() {
  const stats = useApiQuery('admin-stats', adminApi.getStats)
  useScrollToHash(stats.status === 'success')

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 p-6">
      <h1 className="sr-only">Statistics</h1>

      <StatisticsSection id="activity">
         <ActivityStatistics />
      </StatisticsSection>

      {stats.status === 'loading' && <Skeleton className="h-72 w-full" />}

      {stats.status === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Statistics could not be loaded</AlertTitle>
          <AlertDescription>{apiErrorMessage(stats.error)}</AlertDescription>
        </Alert>
      )}

      {stats.status === 'success' && (
        <>
          <StatisticsSection id="accounts" count={stats.data.accounts.total}>
            <StatPieCharts pies={accountPies(stats.data.accounts)}>
              <MediaStatistics media={stats.data.media} />
            </StatPieCharts>
          </StatisticsSection>

          <StatisticsSection id="productions" count={stats.data.films.total}>
            <StatPieCharts pies={filmPies(stats.data.films)} />
          </StatisticsSection>

          <StatisticsSection id="applications" count={stats.data.applications.total}>
            <StatPieCharts pies={applicationPies(stats.data.applications)}>
              <ChatStatistics chat={stats.data.chat} />
            </StatPieCharts>
          </StatisticsSection>
        </>
      )}
    </div>
  )
}