import type { Podcast, RssEntry } from '@prisma/client'
import { prisma } from '~/services/prisma.server'
import { fetchRssFeed } from '~/services/rss.server'

export const syncRssEntries = async (podcastId: Podcast['id']) => {
  const feeds = await prisma.rssFeed.findMany({
    where: { podcastId },
  })
  if (feeds.length === 0) {
    throw new Error('No feed found for the given podcast channel')
  }

  const results: {
    added: RssEntry[]
    updated: RssEntry[]
  } = {
    added: [],
    updated: [],
  }

  for (const feed of feeds) {
    const feedData = await fetchRssFeed(feed.link)
    const rssFeed = await prisma.rssFeed.upsert({
      where: { link: feed.link, podcastId },
      create: {
        link: feed.link,
        title: feedData.title,
        description: feedData.description,
        podcastId,
      },
      update: {
        title: feedData.title,
        description: feedData.description,
      },
    })
    for (const entry of feedData.items) {
      const existingEntry = await prisma.rssEntry.findFirst({
        where: { link: entry.link },
      })

      if (existingEntry) {
        // 更新
        const updatedEntry = await prisma.rssEntry.update({
          where: { id: existingEntry.id },
          data: {
            title: entry.title,
            content: entry.content,
            publishedAt: new Date(entry.pubDate),
          },
        })
        results.updated.push(updatedEntry)
      } else {
        // 新規作成
        const createdEntry = await prisma.rssEntry.create({
          data: {
            title: entry.title,
            link: entry.link,
            content: entry.content,
            publishedAt: new Date(entry.pubDate),
            rssFeedId: rssFeed.id,
          },
        })
        results.added.push(createdEntry)
      }
    }
  }
  return results
}
