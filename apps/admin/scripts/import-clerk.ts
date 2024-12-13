import { prisma } from '@podcast-generator/db/prisma'
import clerkObjects from './clerk-objects.json'

const importClerkObjects = async () => {
  // users
  for (const user of clerkObjects.users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { name: user.name, email: user.email },
      create: { name: user.name, email: user.email },
    })
  }

  // organizations
  for (const org of clerkObjects.organizations) {
    await prisma.organization.upsert({
      where: { id: org.id },
      update: { name: org.name, slug: org.slug },
      create: { name: org.name, slug: org.slug },
    })
  }

  // organization memberships
  for (const membership of clerkObjects.organizationMemberships) {
    await prisma.organizationMembership.upsert({
      where: { id: membership.id },
      update: {
        userId: membership.userId,
        organizationId: membership.organizationId,
        role: membership.role,
        permissions: membership.permissions,
      },
      create: {
        userId: membership.userId,
        organizationId: membership.organizationId,
        role: membership.role,
        permissions: membership.permissions,
      },
    })
  }
}

await importClerkObjects()
