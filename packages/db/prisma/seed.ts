import { PrismaClient } from '@prisma/client'
import { importClerkObjects } from './clerk/import-clark-objects'
import { testFeed } from './test-feed'

const prisma = new PrismaClient()

const feed = async () => {
  const org = await importClerkObjects(prisma, 'coji@techtalk.jp')
  if (!org) {
    // no seed user
    return
  }

  const podcast = await prisma.podcast.create({
    data: {
      organizationId: org.id,
      speaker: '497929760',
      slug: 'chanmomo',
      authorName: 'ちゃんもも',
      authorEmail: 'chanmomo@example.com',
      title: 'アグレッシブちゃんもも Podcast',
      categoryId: 'Entrepreneurship',
      description: 'ちゃんももポッドキャストです',
    },
  })
  const rssFeed = await prisma.rssFeed.create({
    data: {
      title: testFeed.title,
      description: testFeed.description,
      link: testFeed.link,
      podcastId: podcast.id,
    },
  })
  for (const entry of testFeed.items) {
    await prisma.rssEntry.create({
      data: {
        rssFeedId: rssFeed.id,
        link: entry.link,
        title: entry.title,
        content: entry.content,
        publishedAt: new Date(entry.pubDate),
        isNew: false,
      },
    })
  }
}

await feed()
