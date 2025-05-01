import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  const apiKey = process.env.GEOAPIFY_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Geoapify API key not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${apiKey}`,
      { next: { revalidate: 86400 } }, // Cache for 24 hours
    )

    if (!response.ok) {
      throw new Error(`Geoapify API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const location = data.features[0]
      const { lat, lon } = location.properties
      const formatted = location.properties.formatted

      // Generate Google Maps URL
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`

      return NextResponse.json({
        lat,
        lon,
        formatted,
        mapUrl,
      })
    }

    return NextResponse.json({ error: "Location not found" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching location details:", error)
    return NextResponse.json({ error: "Failed to fetch location details" }, { status: 500 })
  }
}
