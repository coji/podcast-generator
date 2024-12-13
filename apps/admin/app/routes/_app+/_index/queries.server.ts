import type { Organization } from '@clerk/react-router/ssr.server'
import { prisma } from '@podcast-generator/db/prisma'

export const listPodcasts = async (organizationId: Organization['id']) => {
  return await prisma.podcast.findMany({ where: { organizationId } })
}
