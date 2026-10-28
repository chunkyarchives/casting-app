import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { AuthTab } from './auth-context'
import { SignInForm } from '../forms/SignInForm'
import { SignUpForm } from '../forms/SignUpForm'
import { signInFormId, signUpFormId } from '../forms/form-ids'

const tabTexts = {
  'sign-in': { title: 'Sign in', submit: 'Sign in', pending: 'Signing in…', formId: signInFormId },
  'sign-up': { title: 'Sign up', submit: 'Sign up', pending: 'Creating account…', formId: signUpFormId },
} satisfies Record<AuthTab, { title: string; submit: string; pending: string; formId: string }>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tab: AuthTab
  onTabChange: (tab: AuthTab) => void
}

export function AuthDrawer({ open, onOpenChange, tab, onTabChange }: Props) {
  const [pending, setPending] = useState(false)
  const texts = tabTexts[tab]
  const close = () => onOpenChange(false)

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{texts.title}</DrawerTitle>
          <DrawerDescription>Sign in or create an account.</DrawerDescription>
        </DrawerHeader>

        <Tabs
          value={tab}
          onValueChange={(value) => onTabChange(value as AuthTab)}
          className="flex min-h-0 flex-1 flex-col gap-6 p-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in" disabled={pending}>
              Sign in
            </TabsTrigger>
            <TabsTrigger value="sign-up" disabled={pending}>
              Sign up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in" className="-mx-1 flex-1 overflow-y-auto px-1">
            <SignInForm onPendingChange={setPending} onSuccess={close} />
          </TabsContent>
          <TabsContent value="sign-up" className="-mx-1 flex-1 overflow-y-auto px-1">
            <SignUpForm onPendingChange={setPending} onSuccess={close} />
          </TabsContent>
        </Tabs>

        <DrawerFooter className="flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={close}>
            Close
          </Button>
          <Button type="submit" form={texts.formId} disabled={pending} className="flex-1">
            {pending ? texts.pending : texts.submit}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}