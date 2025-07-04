const GMX_API = 'https://gmx-server-mainnet.uw.r.appspot.com/prices'

interface GMXPricesResponse {
  [address: string]: string
}

export const getPrices = async (): Promise<GMXPricesResponse> => {
  const response = await fetch(GMX_API)

  if (!response.ok) {
    throw new Error(`Failed to fetch GMX prices: ${response.status}`)
  }

  return await response.json()
}
