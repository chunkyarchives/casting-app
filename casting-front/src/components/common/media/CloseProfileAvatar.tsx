import { useState } from 'react'
import { ImageZoom } from '@/components/common/media/ImageZoom'
import { ProfileAvatar } from '@/components/common/media/ProfileAvatar'
import { profilePictureSource } from '@/lib/api/participants'

type Props = {
  participantId: string
  name: string
  pictureUrl?: string | null
  className?: string
}

export function CloseProfileAvatar({ participantId, name, pictureUrl, className }: Props) {
  const [loaded, setLoaded] = useState(false)
  const src = profilePictureSource(participantId, pictureUrl)

  return (
    <ImageZoom
      src={src ?? ''}
      alt={`Profile picture of ${name}`}
      label={`Show the profile picture of ${name}`}
      disabled={!src || !loaded}
      className="rounded-full"
    >
      <ProfileAvatar participantId={participantId} pictureUrl={pictureUrl} className={className} onLoadedChange={setLoaded} />
    </ImageZoom>
  )
}