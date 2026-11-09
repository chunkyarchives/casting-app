import { useRef, useState, type ChangeEvent } from 'react'
import { Delete02Icon, ImageUpload01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useSession } from '@/components/auth/session/session-context'
import { ImageCropDialog } from '@/components/common/media/ImageCropDialog'
import { SettingsRow } from '@/components/settings/SettingsRow'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { apiErrorMessage } from '@/lib/api/errors'
import { profilePictureApi } from '@/lib/api/media'
import { cropImage, type CropArea } from '@/lib/crop-image'
import { acceptedImageTypes, imageShapes } from '@/lib/media-shapes'

type Props = {
  hasPicture: boolean
  required: boolean
}

export function ProfilePictureRow({ hasPicture, required }: Props) {
  const { refresh } = useSession()
  const input = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [confirmingRemoval, setConfirmingRemoval] = useState(false)
  const [pending, setPending] = useState(false)

  const closeCrop = () => {
    if (image) URL.revokeObjectURL(image)
    setImage(null)
  }

  const choose = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!acceptedImageTypes.includes(file.type)) {
      toast.add({ type: 'error', title: 'Pick a JPEG, PNG or WebP picture' })
      return
    }
    setImage(URL.createObjectURL(file))
  }

  const run = async (action: () => Promise<unknown>, success: string) => {
    setPending(true)
    try {
      await action()
      await refresh()
      setPending(false)
      toast.add({ type: 'success', title: success })
      return true
    } catch (error) {
      setPending(false)
      toast.add({ type: 'error', title: 'The picture could not be changed', description: apiErrorMessage(error) })
      return false
    }
  }

  const save = async (area: CropArea) => {
    if (!image) return
    const saved = await run(
      async () => profilePictureApi.upload(await cropImage(image, area, imageShapes.profilePicture)),
      'Profile picture saved',
    )
    if (saved) closeCrop()
  }

  const remove = async () => {
    if (await run(profilePictureApi.remove, 'Profile picture removed')) setConfirmingRemoval(false)
  }

  return (
    <SettingsRow
      label="Profile picture"
      hint="Shown on your profile and next to your name everywhere. It changes right away, without Save."
      missing={required && !hasPicture}
    >
      <div className="flex gap-2 *:flex-1">
        <Button type="button" variant="outline" disabled={pending} onClick={() => input.current?.click()}>
          <HugeiconsIcon icon={ImageUpload01Icon} strokeWidth={2} data-icon="inline-start" />
          {hasPicture ? 'Change picture' : 'Upload picture'}
        </Button>
        {hasPicture && (
          <Button type="button" variant="outline" disabled={pending} onClick={() => setConfirmingRemoval(true)}>
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} data-icon="inline-start" />
            Remove
          </Button>
        )}
        <input ref={input} type="file" accept={acceptedImageTypes.join(',')} hidden onChange={choose} />
      </div>

      <ImageCropDialog
        image={image}
        shape={imageShapes.profilePicture}
        title="Crop your profile picture"
        round
        saving={pending}
        onCancel={closeCrop}
        onConfirm={save}
      />

      <AlertDialog open={confirmingRemoval} onOpenChange={(open) => !pending && setConfirmingRemoval(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove your profile picture?</AlertDialogTitle>
            <AlertDialogDescription>
              {required
                ? 'Your profile shows the default picture instead, and stays incomplete until you upload a new one.'
                : 'Your profile shows the default picture instead.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Keep it</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={pending} onClick={remove}>
              {pending ? 'Removing…' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsRow>
  )
}