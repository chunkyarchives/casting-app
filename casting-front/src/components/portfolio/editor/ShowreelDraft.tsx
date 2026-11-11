import { useId, useState } from 'react'
import { captionMaxLength } from '@/components/portfolio/media/CaptionEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { apiErrorMessage } from '@/lib/api/errors'
import { portfolioApi } from '@/lib/api/portfolio'
import type { MediaItem } from '@/types/media'

type Props = {
  file: File
  previewUrl: string
  onUploaded: (showreel: MediaItem) => void
  onCancel: () => void
}

export function ShowreelDraft({ file, previewUrl, onUploaded, onCancel }: Props) {
  const captionId = useId()
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)

  const upload = async () => {
    setUploading(true)
    const showreel = await portfolioApi.addShowreel(file, caption.trim() || null).catch((error: unknown) => {
      toast.add({ type: 'error', title: 'The showreel could not be uploaded', description: apiErrorMessage(error) })
      return null
    })
    setUploading(false)
    if (showreel) onUploaded(showreel)
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void upload()
      }}
      className="flex flex-col gap-2 rounded-2xl border bg-card p-2"
    >
      <video src={previewUrl} muted autoPlay loop playsInline aria-hidden className="aspect-video w-full rounded-xl bg-black object-cover" />
      <label htmlFor={captionId} className="sr-only">
        Caption
      </label>
      <Input
        id={captionId}
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
        maxLength={captionMaxLength}
        placeholder="Caption, optional"
        disabled={uploading}
        className="h-8 text-xs"
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" className="flex-1" disabled={uploading} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" className="flex-1" disabled={uploading}>
          {uploading ? 'Uploading…' : 'Upload'}
        </Button>
      </div>
    </form>
  )
}