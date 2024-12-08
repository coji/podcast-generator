import { ImageResponse } from '@vercel/og'
import { getFontData } from '~/services/font.server'

export const getOgpImageResponse = async ({
  episodeTitle,
  episodeNumber,
  podcastTitle,
  podcastImageUrl,
}: {
  episodeTitle: string
  episodeNumber: number
  podcastTitle: string
  podcastImageUrl: string | null
}) => {
  const fontData = await getFontData()
  const response = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000000',
          padding: '4rem',
          boxShadow: 'none',
          color: 'white',
          border: '10px',
          borderRadius: '30px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'baseline',
            flexGrow: '1',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
            }}
          >{`#${episodeNumber}`}</div>
          <div
            style={{
              fontSize: '76px',
              flexDirection: 'column',
              justifyContent: 'center',
              wordBreak: 'break-word',
              flexGrow: '1',
            }}
          >
            {episodeTitle}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '32px',
          }}
        >
          <div style={{ flexGrow: '1' }}>{podcastTitle}</div>
          {podcastImageUrl && (
            <img
              src={podcastImageUrl}
              alt="Podcast"
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
          )}
        </div>
      </div>
    ),
    {
      fonts: [
        {
          name: 'NotoSansJP',
          data: fontData,
          style: 'normal',
        },
      ],
    },
  )
  return response
}
