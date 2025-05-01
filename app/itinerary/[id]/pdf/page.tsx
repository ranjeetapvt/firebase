"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { generatePDF } from "@/lib/pdf-generator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/firebase/auth-context"
import { getItinerary } from "@/lib/firebase/firestore"

export default function PrintItinerary({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [itinerary, setItinerary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // If not logged in and not loading, redirect to sign in
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    // Fetch the itinerary if user is logged in
    const fetchItinerary = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const itineraryData = await getItinerary(params.id)

        if (!itineraryData || itineraryData.userId !== user.uid) {
          // Itinerary not found or doesn't belong to the user
          router.push("/dashboard")
          return
        }

        // Format the itinerary data
        const formattedItinerary = {
          id: itineraryData.id,
          destination: itineraryData.destination,
          startDate: new Date(itineraryData.startDate),
          endDate: new Date(itineraryData.endDate),
          travelersCount: itineraryData.travelersCount,
          travelGroupType: itineraryData.travelGroupType,
          description: itineraryData.content.description,
          image: itineraryData.content.image_url || "/placeholder.svg?height=400&width=800",
          days: itineraryData.content.days,
          accommodations: itineraryData.content.accommodations,
          tips: itineraryData.content.tips,
          travelDetails: itineraryData.content.travelDetails,
        }

        setItinerary(formattedItinerary)
      } catch (error) {
        console.error("Error fetching itinerary:", error)
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchItinerary()
    }
  }, [user, loading, params.id, router])

  const handleDownload = () => {
    if (!itinerary) return

    const pdfBlob = generatePDF(itinerary)
    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = `TripPlannrs-${itinerary.destination.replace(/\s+/g, "-")}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading itinerary...</p>
        </div>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Itinerary not found</h2>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link href={`/itinerary/${params.id}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to Itinerary
          </Button>
        </Link>

        <div className="flex gap-4">
          <Button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Download size={18} />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="p-4">
          <h2 className="text-2xl font-bold">PDF Preview</h2>
          <p className="text-muted-foreground">Your itinerary is ready to download or print.</p>
        </div>

        {/* PDF Preview */}
        <div className="h-[800px] overflow-auto border-t p-4">
          <div className="mx-auto max-w-4xl border border-gray-300 p-8">
            {/* Header */}
            <div className="mb-8 border-b pb-4 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                TRIPPLANNRS
              </h1>
              <p className="text-sm text-muted-foreground">www.tripplannrs.com</p>
            </div>

            {/* Travel Overview */}
            <div className="mb-8 rounded border p-4">
              <h2 className="mb-4 font-bold uppercase">TRAVEL OVERVIEW</h2>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <span className="font-semibold">Destination:</span> {itinerary.destination}
                </div>
                <div>
                  <span className="font-semibold">Travel Dates:</span>{" "}
                  {itinerary.startDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  –{" "}
                  {itinerary.endDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div>
                  <span className="font-semibold">Number of People:</span> {itinerary.travelersCount} Travelers
                </div>
                <div>
                  <span className="font-semibold">Group Info:</span> {itinerary.travelGroupType}
                </div>
              </div>
            </div>

            {/* Travel Mode */}
            <div className="mb-8 rounded border p-4">
              <h2 className="mb-4 font-bold uppercase">TRAVEL MODE</h2>

              <h3 className="mb-2 font-semibold uppercase">ARRIVAL:</h3>
              <div className="mb-4 ml-4 space-y-1">
                <div>
                  <span className="font-semibold">Mode:</span> {itinerary.travelDetails.arrival.mode}
                </div>
                <div>
                  <span className="font-semibold">Airline:</span> {itinerary.travelDetails.arrival.airline}
                </div>
                <div>
                  <span className="font-semibold">Departure Time:</span> {itinerary.travelDetails.arrival.departureTime}
                </div>
                <div>
                  <span className="font-semibold">Arrival Time:</span> {itinerary.travelDetails.arrival.arrivalTime}
                </div>
                <div>
                  <span className="font-semibold">Price:</span> {itinerary.travelDetails.arrival.price}
                </div>
                <div>
                  <span className="font-semibold">Airport:</span> {itinerary.travelDetails.arrival.airport} [Google Maps
                  Link]
                </div>
              </div>

              <h3 className="mb-2 font-semibold uppercase">DEPARTURE:</h3>
              <div className="ml-4 space-y-1">
                <div>
                  <span className="font-semibold">Mode:</span> {itinerary.travelDetails.departure.mode}
                </div>
                <div>
                  <span className="font-semibold">Airline:</span> {itinerary.travelDetails.departure.airline}
                </div>
                <div>
                  <span className="font-semibold">Departure Time:</span>{" "}
                  {itinerary.travelDetails.departure.departureTime}
                </div>
                <div>
                  <span className="font-semibold">Arrival Time:</span> {itinerary.travelDetails.departure.arrivalTime}
                </div>
                <div>
                  <span className="font-semibold">Price:</span> {itinerary.travelDetails.departure.price}
                </div>
                <div>
                  <span className="font-semibold">Airport:</span> {itinerary.travelDetails.departure.airport} [Google
                  Maps Link]
                </div>
              </div>
            </div>

            {/* Accommodation Options */}
            <div className="mb-8 rounded border p-4">
              <h2 className="mb-4 font-bold uppercase">ACCOMMODATION OPTIONS</h2>

              {itinerary.accommodations.map((accommodation, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold">
                    OPTION {index + 1}: {accommodation.name}
                  </h3>
                  <div className="ml-4 space-y-1">
                    <div>
                      <span className="font-semibold">Type:</span> {accommodation.type}
                    </div>
                    <div>
                      <span className="font-semibold">Address:</span> {accommodation.address}
                    </div>
                    <div>
                      <span className="font-semibold">Price Range:</span> {accommodation.priceRange}
                    </div>
                    <div>
                      <span className="font-semibold">Maps:</span> [Google Maps Link]
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Day-wise Plan */}
            <div className="mb-8 rounded border p-4">
              <h2 className="mb-4 font-bold uppercase">DAY-WISE PLAN</h2>

              {itinerary.days.map((day) => (
                <div key={day.dayNumber} className="mb-6">
                  <h3 className="font-semibold uppercase">
                    DAY {day.dayNumber}: {day.title}
                  </h3>
                  <p className="mb-2 text-sm">
                    {new Date(day.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>

                  {day.activities.map((activity, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold">{activity.type}:</h4>
                      <div className="ml-4 space-y-1">
                        <div>
                          <span className="font-semibold">Activity:</span> {activity.title}
                        </div>
                        <div>
                          <span className="font-semibold">Location:</span> {activity.location} [Google Maps Link]
                        </div>
                        <div>
                          <span className="font-semibold">Time:</span> {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-2">
                    <span className="font-semibold">Accommodation for the Night:</span>
                    <div className="ml-4">
                      <div>
                        <span className="font-semibold">Hotel Name:</span> {day.accommodation.name}
                      </div>
                      <div>
                        <span className="font-semibold">Location:</span> {day.accommodation.name} [Google Maps Link]
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="mb-8 rounded border p-4">
              <h2 className="mb-4 font-bold uppercase">NOTES</h2>

              {itinerary.tips.map((tip, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold">{tip.title}:</h3>
                  <ul className="ml-4 list-disc space-y-1 pl-4">
                    {tip.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 border-t pt-4 text-center">
              <p className="text-sm text-muted-foreground">Generated by TripPlannrs • www.tripplannrs.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
