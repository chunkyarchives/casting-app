import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type Props = {
  src: string
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShowreelPlayer({ src, title, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-3 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">Showreel player</DialogDescription>
        </DialogHeader>
        {open && (
          <video src={src} controls autoPlay playsInline className="aspect-video w-full rounded-xl bg-black">
            <track kind="captions" />
          </video>
        )}
      </DialogContent>
    </Dialog>
  )
}