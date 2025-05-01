import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  if (!accessKey) {
    return NextResponse.json({ error: "Unsplash API key not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      return NextResponse.json({ imageUrl: data.results[0].urls.regular })
    } else {
      // If no results, return a placeholder
      return NextResponse.json({ imageUrl: "/placeholder.svg?height=400&width=800" })
    }
  } catch (error) {
    console.error("Error fetching from Unsplash:", error)
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 })
  }
}
