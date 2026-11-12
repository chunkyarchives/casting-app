import defaultProfilePicture from '@/assets/images/default.png'
import { MediaImage } from '@/components/common/media/MediaImage'
import { profilePictureUrl } from '@/lib/api/participants'
import { cn } from '@/lib/utils'

type Props = {
  actorId: string
  className?: string
}

function DefaultPicture() {
  return <img src={defaultProfilePicture} alt="" className="size-full object-cover" />
}

export function ActorPicture({ actorId, className }: Props) {
  return (
    <div className={cn('aspect-square overflow-hidden bg-muted', className)}>
      <MediaImage src={profilePictureUrl(actorId)} alt="" className="size-full" fallback={<DefaultPicture />} />
    </div>
  )
}