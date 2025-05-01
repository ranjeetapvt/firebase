interface GeoapifyResult {
  lat: number
  lon: number
  formatted: string
  mapUrl: string
}

export async function getLocationDetails(query: string): Promise<GeoapifyResult | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/geolocation?query=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error(`Geolocation API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      console.error("Error from geolocation API:", data.error)
      return null
    }

    return {
      lat: data.lat,
      lon: data.lon,
      formatted: data.formatted,
      mapUrl: data.mapUrl,
    }
  } catch (error) {
    console.error("Error fetching location details:", error)
    return null
  }
}
