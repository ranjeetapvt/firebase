export async function searchUnsplashImage(query: string): Promise<string> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/unsplash?query=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()
    return data.imageUrl
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error)
    return "/placeholder.svg?height=400&width=800"
  }
}
