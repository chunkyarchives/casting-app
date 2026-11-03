import { useState } from 'react'
import { ImageZoom } from '@/components/common/media/ImageZoom'
import { ProfileAvatar } from '@/components/common/media/ProfileAvatar'
import { profilePictureUrl } from '@/lib/api/participants'

type Props = {
  participantId: string
  name: string
  className?: string
}

export function CloseProfileAvatar({ participantId, name, className }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <ImageZoom
      src={profilePictureUrl(participantId)}
      alt={`Profile picture of ${name}`}
      label={`Show the profile picture of ${name}`}
      disabled={!loaded}
      className="rounded-full"
    >
      <ProfileAvatar participantId={participantId} className={className} onLoadedChange={setLoaded} />
    </ImageZoom>
  )
}