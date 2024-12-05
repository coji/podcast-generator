import { PrismaClient } from '@prisma/client'
import { testFeed } from './test-feed'

const prisma = new PrismaClient()

const feed = async () => {
  const user = await prisma.user.create({
    data: { name: 'coji', email: 'coji@techtalk.jp' },
  })
  const podcast = await prisma.podcast.create({
    data: {
      userId: user.id,
      speaker: '497929760',
      slug: 'chanmomo',
      title: 'アグレッシブちゃんもも Podcast',
      link: 'https://example.com',
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
