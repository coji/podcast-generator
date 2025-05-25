export const postRequest = async <T>(
  url: string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  body: any,
  headers: Record<string, string> = {},
): Promise<T> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 300000) // 5分に延長

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    throw new Error(
      `Error in postRequest: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
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
