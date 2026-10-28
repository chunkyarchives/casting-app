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

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tab: AuthTab
  onTabChange: (tab: AuthTab) => void
}

export function AuthDrawer({ open, onOpenChange, tab, onTabChange }: Props) {
  const [pending, setPending] = useState(false)

  const isSignIn = tab === 'sign-in'
  const submitLabel = isSignIn ? (pending ? 'Signing in…' : 'Sign in') : 'Sign up'

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{isSignIn ? 'Sign in' : 'Sign up'}</DrawerTitle>
          <DrawerDescription>Sign in or create an account.</DrawerDescription>
        </DrawerHeader>

        <Tabs
          value={tab}
          onValueChange={(value) => onTabChange(value as AuthTab)}
          className="flex min-h-0 flex-1 flex-col gap-6 p-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign in</TabsTrigger>
            <TabsTrigger value="sign-up">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in" className="-mx-1 flex-1 overflow-y-auto px-1">
            <SignInForm onPendingChange={setPending} onSuccess={() => onOpenChange(false)} />
          </TabsContent>
          <TabsContent value="sign-up" className="-mx-1 flex-1 overflow-y-auto px-1">
            <SignUpForm />
          </TabsContent>
        </Tabs>

        <DrawerFooter className="flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            type="submit"
            form={isSignIn ? signInFormId : signUpFormId}
            disabled={pending}
            className="flex-1"
          >
            {submitLabel}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}