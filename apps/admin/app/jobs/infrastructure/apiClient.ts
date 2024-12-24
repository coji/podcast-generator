export const postRequest = async <T>(
  url: string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  body: any,
  headers: Record<string, string> = {},
): Promise<T> => {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return await response.json()
}

export const fetchArrayBuffer = async (
  url: string,
  options: RequestInit = {},
): Promise<ArrayBuffer> => {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.statusText}`)
  }
  return await response.arrayBuffer()
}
