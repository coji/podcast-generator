import type { PrismaClient, User } from '@prisma/client'
import clerkObjects from './clerk-data.json'

export const importClerkObjects = async (
  prisma: PrismaClient,
  seedUserEmail: string,
) => {
  let seedUser: User | null = null
  // users
  for (const user of clerkObjects.users) {
    const upserted = await prisma.user.upsert({
      where: { id: user.id },
      update: { name: user.name, email: user.email },
      create: { name: user.name, email: user.email },
    })
    if (upserted.email === seedUserEmail) {
      seedUser = upserted
    }
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

  return seedUser
}
