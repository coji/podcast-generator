import { getAuth } from '@podcast-generator/clerk-react-router/ssr'
import { redirect } from 'react-router'

export const requireUser = async (request: Request) => {
  const auth = await getAuth({ request, params: {}, context: {} })
  if (!auth.userId) {
    throw redirect('/login')
  }

  return { userId: auth.userId, orgId: auth.orgId, role: auth.orgRole }
}
