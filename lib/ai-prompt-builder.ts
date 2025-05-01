interface ItineraryFormData {
  destination: string
  startDate: string
  endDate: string
  arrivalMode: string
  departureMode?: string
  arrivalTime?: string
  departureTime?: string
  travelersCount: number
  travelGroupType: string
  budgetType: string
  tripStyles: string[]
  pace: string
  wakeUpTime: string
  cuisinePreferences: string[]
  specialRequests?: string
  accessibilityRequirements?: string
  additionalOptions?: {
    familyFriendly?: boolean
    offBeatenPath?: boolean
    sustainable?: boolean
  }
}

export function buildItineraryPrompt(formData: ItineraryFormData): string {
  const startDate = new Date(formData.startDate)
  const endDate = new Date(formData.endDate)
  const tripDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  const prompt = `
Create a detailed travel itinerary for a trip to ${formData.destination}.

Trip Details:
- Destination: ${formData.destination}
- Travel Dates: ${new Date(formData.startDate).toLocaleDateString()} to ${new Date(formData.endDate).toLocaleDateString()} (${tripDuration} days)
- Number of Travelers: ${formData.travelersCount}
- Group Type: ${formData.travelGroupType}
- Budget Type: ${formData.budgetType}
- Arrival Mode: ${formData.arrivalMode}${formData.arrivalTime ? ` at ${formData.arrivalTime}` : ""}
- Departure Mode: ${formData.departureMode || "Not specified"}${formData.departureTime ? ` at ${formData.departureTime}` : ""}

Preferences:
- Trip Styles: ${formData.tripStyles.join(", ")}
- Trip Pace: ${formData.pace}
- Wake-up Time: ${formData.wakeUpTime}
- Cuisine Preferences: ${formData.cuisinePreferences.join(", ")}
${formData.specialRequests ? `- Special Requests: ${formData.specialRequests}` : ""}
${formData.accessibilityRequirements ? `- Accessibility Requirements: ${formData.accessibilityRequirements}` : ""}
${formData.additionalOptions?.familyFriendly ? "- Include family-friendly activities" : ""}
${formData.additionalOptions?.offBeatenPath ? "- Include off-the-beaten-path experiences" : ""}
${formData.additionalOptions?.sustainable ? "- Prioritize sustainable travel options" : ""}

Please create a comprehensive day-by-day itinerary with the following structure:

1. A brief overview of the destination
2. Day-by-day plan with:
   - Morning activities
   - Lunch recommendations
   - Afternoon activities
   - Evening activities/dinner
   - Accommodation for each night
3. Accommodation options (3 options with different price ranges)
4. Travel tips specific to the destination
5. Packing recommendations
6. Important local contact information

Format the response as a JSON object with the following structure:
{
  "destination": "Destination Name",
  "description": "Brief overview of the destination",
  "days": [
    {
      "dayNumber": 1,
      "title": "DAY TITLE",
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "type": "Morning",
          "title": "Activity name",
          "time": "Time range",
          "location": "Location name",
          "description": "Brief description"
        },
        // More activities...
      ],
      "accommodation": {
        "name": "Accommodation name",
        "address": "Address"
      }
    }
    // More days...
  ],
  "accommodations": [
    {
      "name": "Accommodation name",
      "type": "Hotel type",
      "address": "Address",
      "priceRange": "Price range",
      "amenities": ["Amenity 1", "Amenity 2"]
    }
    // More accommodations...
  ],
  "tips": [
    {
      "category": "Category name",
      "title": "Tip title",
      "content": ["Tip 1", "Tip 2"]
    }
    // More tips...
  ],
  "travelDetails": {
    "arrival": {
      "mode": "Arrival mode",
      "airline": "Airline name if applicable",
      "departureTime": "Departure time",
      "arrivalTime": "Arrival time",
      "price": "Estimated price",
      "airport": "Airport name if applicable"
    },
    "departure": {
      "mode": "Departure mode",
      "airline": "Airline name if applicable",
      "departureTime": "Departure time",
      "arrivalTime": "Arrival time",
      "price": "Estimated price",
      "airport": "Airport name if applicable"
    }
  }
}
`

  return prompt
}
