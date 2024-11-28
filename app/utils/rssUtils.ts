import Parser from 'rss-parser'

const parser = new Parser()

export interface RssEntry {
  title: string
  link: string
  content: string
  pubDate: string
}

export async function fetchRssFeed(url: string): Promise<RssEntry[]> {
  try {
    const feed = await parser.parseURL(url)
    return feed.items.map((item) => ({
      title: item.title ?? 'no title',
      link: item.link ?? 'no link',
      content: item.content ?? 'no content',
      pubDate: item.pubDate ?? 'no date',
    }))
  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    throw new Error('Failed to fetch RSS feed')
  }
}
