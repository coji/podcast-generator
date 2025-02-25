// TypeScript 関数: generateRSSFeed

// インターフェースの定義
interface Podcast {
  slug: string
  authorName: string
  authorEmail: string
  title: string
  description: string
  image: string | null
  language: string
  categoryId: string
}

interface Episode {
  id: string
  title: string
  description: string
  audioUrl: string
  audioDuration: number // 秒単位
  audioLength: number // バイト単位
  publishedAt: Date
  updatedAt: Date
  episodeNumber: number
}

interface PodcastData {
  podcast: Podcast
  episodes: Episode[]
}

/**
 * 秒数を HH:MM:SS 形式に変換するヘルパー関数
 * @param seconds - 秒数
 * @returns HH:MM:SS 形式の文字列
 */
function secondsToHHMMSS(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return [hrs, mins, secs].map((v) => v.toString().padStart(2, '0')).join(':')
}

/**
 * RSSフィードを生成する関数
 * @param data - PodcastData オブジェクト
 * @returns RSSフィードのXML文字列
 */
export function generateRSSFeed(data: PodcastData): string {
  const podcast = data.podcast
  const episodes = data.episodes

  // 基本的なチャンネル情報の設定
  const rssHeader = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
  <channel>
    <title>${escapeXML(podcast.title)}</title>
    <link>${escapeXML(`https://podcast.techtalk.jp/${podcast.slug}/`)}</link>
    <language>${escapeXML(podcast.language)}</language>
    <description>${escapeXML(podcast.description)}</description>
    <itunes:author>${escapeXML(podcast.authorName)}</itunes:author>
    <itunes:summary>${escapeXML(podcast.description)}</itunes:summary>
    ${podcast.image ? `<itunes:image href="${escapeXML(podcast.image)}"/>` : ''}
    <itunes:category text="${escapeXML(podcast.categoryId)}"/>
    <itunes:explicit>no</itunes:explicit>
    <itunes:owner>
      <itunes:name>${escapeXML(podcast.authorName)}</itunes:name>
      <itunes:email>${escapeXML(podcast.authorEmail)}</itunes:email>
    </itunes:owner>
`

  // エピソードごとの処理
  const items = episodes
    .map((ep) => {
      // 更新日(unix epoch)を付与したオーディオURL
      const audioUrl = `${ep.audioUrl}?u=${ep.updatedAt.getTime()}`

      // 公開日のフォーマット
      const pubDate = ep.publishedAt.toUTCString()

      // itunes:duration のフォーマット
      const duration = secondsToHHMMSS(ep.audioDuration)

      // Enclosure の length は提供されていないため、0を設定（実際にはファイルサイズを取得する必要あり）
      const enclosure = `<enclosure url="${escapeXML(
        audioUrl,
      )}" length="${ep.audioLength ?? 0}" type="audio/mpeg"/>`

      return `
    <item>
      <title>#${ep.episodeNumber} ${escapeXML(ep.title)}</title>
      <description>${escapeXML(ep.description)}</description>
      ${enclosure}
      <pubDate>${pubDate}</pubDate>
      <guid>${escapeXML(audioUrl)}</guid>
      <itunes:duration>${duration}</itunes:duration>
      <itunes:explicit>no</itunes:explicit>
    </item>`
    })
    .join('\n')

  const rssFooter = `
  </channel>
</rss>`

  return rssHeader + items + rssFooter
}

/**
 * 特殊文字をエスケープするヘルパー関数
 * @param str - エスケープ対象の文字列
 * @returns エスケープ後の文字列
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
