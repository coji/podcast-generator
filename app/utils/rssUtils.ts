import Parser from 'rss-parser'
import { testFeed } from './test-feed'

const parser = new Parser()

export interface RssFeed {
  title: string
  description: string
  link: string
  updatedAt: Date
  items: RssEntry[]
}

export interface RssEntry {
  title: string
  link: string
  content: string
  pubDate: string
}

export async function fetchRssFeed(url: string): Promise<RssFeed> {
  try {
    const feed = testFeed //  await parser.parseURL(url)

    return {
      title: feed.title ?? 'no title',
      link: feed.link ?? 'no link',
      description: feed.description ?? 'no description',
      updatedAt: new Date(feed.lastBuildDate),
      items: feed.items.map((item) => ({
        title: item.title ?? 'no title',
        link: item.link ?? 'no link',
        content: item.content
          ? item.content.replace(/<[^>]+>/g, '')
          : 'no content',
        pubDate: item.pubDate ?? 'no date',
      })),
    } satisfies RssFeed
  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    throw new Error('Failed to fetch RSS feed')
  }
}
