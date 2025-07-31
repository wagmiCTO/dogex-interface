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
    throw new Error(
      `Failed to fetch position data: ${response.status} ${response.statusText}`,
    )
  }

  return response.json()
}

export interface AnalyzeRequest {
  positionSize: number
  entryPrice: number
  liquidationPrice: number
  currentPrice: number
  pnlSize: number
}

export interface AnalyzeApiResponse {
  success: boolean
  analysis?: {
    aiAdvice: string
    timestamp: string
  }
  error?: string
  timestamp: string
}

/**
 * Analyzes position data and gets AI trading advice
 * @param request - Position data for analysis
 * @returns Promise containing position analysis and AI advice
 * @throws Error if the request fails
 */
export const analyzePosition = async (
  request: AnalyzeRequest,
): Promise<AnalyzeApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to analyze position: ${response.status} ${response.statusText}`,
    )
  }

  return response.json()
}
