import { createClerkClient } from '@clerk/react-router/api.server'
import type { Organization, OrganizationMembership, User } from '@prisma/client'

interface ClerkObjects {
  users: Pick<User, 'id' | 'name' | 'email'>[]
  organizations: Pick<Organization, 'id' | 'name' | 'slug'>[]
  organizationMemberships: Pick<
    OrganizationMembership,
    'id' | 'userId' | 'organizationId' | 'role' | 'permissions'
  >[]
}

const listClerkObjects = async () => {
  const client = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  })

  const objects: ClerkObjects = {
    users: [],
    organizations: [],
    organizationMemberships: [],
  }

  // users
  const users = await client.users.getUserList()
  for (const user of users.data) {
    objects.users.push({
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.username ?? 'no name',
    })

    // user の membership 追加
    const userMemberships = await client.users.getOrganizationMembershipList({
      userId: user.id,
    })
    for (const membership of userMemberships.data) {
      objects.organizationMemberships.push({
        id: membership.id,
        userId: user.id,
        organizationId: membership.organization.id,
        role: membership.role,
        permissions: JSON.stringify(membership.permissions),
      })
    }
  }

  // organizations
  const organizations = await client.organizations.getOrganizationList()
  for (const org of organizations.data) {
    objects.organizations.push({
      id: org.id,
      name: org.name,
      slug: org.slug ?? '',
    })
  }

  console.log(JSON.stringify(objects, null, 2))
}

await listClerkObjects()
