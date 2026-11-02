import { useState } from 'react'
import { preload } from 'react-dom'
import defaultProfilePicture from '@/assets/images/default.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { profilePictureUrl } from '@/lib/api/participants'
import { cn } from '@/lib/utils'

type PictureState = 'loading' | 'loaded' | 'missing'

type Props = {
  participantId: string
  className?: string
  onLoadedChange?: (loaded: boolean) => void
}

export function ProfileAvatar({ participantId, className, onLoadedChange }: Props) {
  const [picture, setPicture] = useState<PictureState>('loading')

  preload(defaultProfilePicture, { as: 'image' })

  return (
    <Avatar className={cn(picture === 'loading' && 'animate-pulse bg-muted', className)}>
      <AvatarImage
        src={profilePictureUrl(participantId)}
        alt=""
        onLoadingStatusChange={(status) => {
          const next = status === 'loaded' ? 'loaded' : status === 'error' ? 'missing' : 'loading'
          setPicture(next)
          onLoadedChange?.(next === 'loaded')
        }}
        className="animate-in duration-300 fade-in-0"
      />
      {picture === 'missing' && (
        <AvatarFallback>
          <img
            src={defaultProfilePicture}
            alt=""
            className="size-full animate-in rounded-full object-cover duration-300 fade-in-0"
          />
        </AvatarFallback>
      )}
    </Avatar>
  )
}