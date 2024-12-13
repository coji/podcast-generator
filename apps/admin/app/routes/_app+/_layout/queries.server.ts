import { prisma } from '@podcast-generator/db/prisma'
import type { Organization } from '@prisma/client'

export const listPodcasts = async (organizationId: Organization['id']) => {
  return await prisma.podcast.findMany({
    where: {
      organizationId,
    },
  })
}
