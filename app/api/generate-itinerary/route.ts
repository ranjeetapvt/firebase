import { type NextRequest, NextResponse } from "next/server"
import { buildItineraryPrompt } from "@/lib/ai-prompt-builder"
import { searchUnsplashImage } from "@/lib/unsplash"
import { v4 as uuidv4 } from 'uuid';
import { getLocationDetails } from "@/lib/geoapify"
import { parse } from 'path';
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.json()
    const prompt = buildItineraryPrompt(formData)

    // Call Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      },
    )
    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json()
      console.log(errorData)
      console.error("Gemini API error:", errorData)
      return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
    }
    
    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json()
      console.error("Gemini API error:", errorData)
      return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
    }    
    const itineraryId = uuidv4()
    const geminiData = await geminiResponse.json()
    if (!geminiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log(geminiData);
      return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 });
    }
    let itineraryContent;
     try {
         const generatedText = geminiData.candidates[0].content.parts[0].text.replace(/[`\n]/g, "");
        const jsonStart = generatedText.search(/\{/);
        const jsonString = jsonStart !== -1 ? generatedText.slice(jsonStart) : generatedText;

        itineraryContent = JSON.parse(jsonString) as any;



    } catch (error) {

        console.log("generatedText", generatedText);
        console.error("Error parsing JSON from Gemini response:", error);
        return NextResponse.json({ error: "Failed to parse itinerary data" }, { status: 500 });
    }

    if (!itineraryContent) {
        console.error("Error: itineraryContent is undefined after parsing.", geminiData);
        return NextResponse.json({ error: "Failed to parse itinerary data" }, { status: 500 });
    }

    if (!itineraryContent.days || !itineraryContent.accommodations) {
      return NextResponse.json({ error: "Invalid data in response" }, { status: 500 });
    }

    // Get an image for the destination
    const imageUrl = await searchUnsplashImage(`${formData.destination} travel landmark`)
    itineraryContent.image_url = imageUrl

    // Enhance the itinerary with location data
    for (const day of itineraryContent.days) {
      for (const activity of day.activities) {
        // Get location details for each activity
        const locationDetails = await getLocationDetails(`${activity.location}, ${formData.destination}`)
        if (locationDetails) {
          activity.mapLink = locationDetails.mapUrl;
        } else {
           console.error(`Failed to get location details for: ${activity.location}, ${formData.destination}`)
          activity.mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location + ", " + formData.destination)}`;
        }
        // Get an image for each activity
        const activityImage = await searchUnsplashImage(`${activity.title} ${formData.destination}`)
        activity.image = activityImage
      }

      // Get location details for accommodation
      const accommodationDetails = await getLocationDetails(`${day.accommodation.name}, ${formData.destination}`)
      if (accommodationDetails) {
        day.accommodation.mapLink = accommodationDetails.mapUrl
      } else {
         console.error(`Failed to get location details for: ${day.accommodation.name}, ${formData.destination}`)
        day.accommodation.mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(day.accommodation.name + ", " + formData.destination)}`;
      }
    }

    // Add travel details to the itineraryContent
    itineraryContent.travelDetails = {
        arrival: {
            mode: formData.arrivalMode || "Not specified",
            arrivalTime: formData.arrivalTime || "Not specified"
        },
        departure: {
            mode: formData.departureMode || "Not specified",
            departureTime: formData.departureTime || "Not specified",
        }

    }
    // Add map links to accommodations
    if (itineraryContent.accommodations) {
      for (let accommodation of itineraryContent.accommodations) {
        const accommodationDetails = await getLocationDetails(`${accommodation.name}, ${formData.destination}`)
        if (accommodationDetails) {
          accommodation.mapLink = accommodationDetails.mapUrl;
        } else {
         console.error(`Failed to get location details for: ${accommodation.name}, ${formData.destination}`)
          accommodation.mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(accommodation.name + ", " + formData.destination)}`;
        }
      }
    }
    return NextResponse.json({ itineraryId: itineraryId, itinerary: itineraryContent });
  } catch (error) {
    console.error("Error generating itinerary:", error)
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}
