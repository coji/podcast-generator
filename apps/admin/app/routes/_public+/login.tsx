import { SignIn } from '@clerk/react-router'
import { redirect } from 'react-router'
import { getUser } from '~/services/auth.server'
import type { Route } from './+types/login'

export const loader = async (args: Route.LoaderArgs) => {
  const user = await getUser(args)
  if (user) {
    return redirect('/')
  }
  return null
}

export default function Index() {
  return (
    <div className="grid min-h-dvh grid-cols-1 place-items-center">
      <SignIn />
    </div>
  )
}
