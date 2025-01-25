import { prisma, type Organization } from '@podcast-generator/db/prisma'

export const listPodcasts = async (organizationId: Organization['id']) => {
  return await prisma.podcast.findMany({
    where: {
      organizationId,
    },
  })
}
