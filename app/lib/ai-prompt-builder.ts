import { FormData } from '@/app/generate/page';

export const buildItineraryPrompt = (formData: FormData) => {
  const {
    destination,
    startDate,
    endDate,
    travelers,
    budget,
    tripStyle,
    foodPreferences,
    extras,
  } = formData;

  const prompt = `
  Create a detailed and creative travel itinerary for a trip to ${destination} starting from ${startDate} and ending on ${endDate}. 
  This itinerary is for ${travelers.quantity} ${travelers.groupType}. 
  The trip budget is ${budget}. 
  The preferred trip style is ${tripStyle.join(', ')}. 
  Food preferences are: ${foodPreferences.join(', ')}. 
  Extras: ${extras.join(', ')}.
  
  The itinerary should include:

  1. A brief introduction to the destination.
  2. Daily plans with morning, afternoon, and evening activities.
  3. For each activity, suggest a specific time, a location, and a brief description.
  4. Accommodation suggestions with name, type, address, price range, and amenities.
  5. Tips for travelers (safety, culture, food, transportation, etc.).
  6. Detailed travel information for arrival and departure (mode of transportation, airline if applicable, departure and arrival times, price ranges, airport if applicable).
  7. A list of packing recommendations.
  8. Important local contact information (police, hospital, etc.).
  
  Please provide the itinerary in JSON format.
  `;
  console.log(prompt)
  return prompt;
};