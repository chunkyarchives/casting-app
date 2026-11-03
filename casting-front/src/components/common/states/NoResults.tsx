import { Search01Icon } from '@hugeicons/core-free-icons'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'

export function NoResults() {
  return (
    <EmptyMessage
      icon={Search01Icon}
      title="Nothing found"
      description="Try another search, or clear the filters."
    />
  )
}