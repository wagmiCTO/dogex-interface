import { API_BASE_URL } from '@/lib/constant'

export interface PositionApiResponse {
  leverage: number
  position: string
}

/**
 * Fetches position data from the AI vibe trader API
 * @returns Promise containing position advice, emoji, and trading parameters
 * @throws Error if the request fails
 */
export const fetchPositionData = async (): Promise<PositionApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/position`)

  if (!response.ok) {
    throw new Error(`Failed to fetch position data: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
