import { SignIn } from '@clerk/react-router'
import { getAuth } from '@clerk/react-router/ssr.server'
import { redirect } from 'react-router'
import type { Route } from './+types/login'

export const loader = async (args: Route.LoaderArgs) => {
  const auth = await getAuth(args)
  if (auth.userId) {
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
