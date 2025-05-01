"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ItineraryHeader } from "@/components/itinerary-header";
import { ItineraryTabs } from "@/components/itinerary-tabs";
import { DayPlan } from "@/components/day-plan";
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/firebase/auth-context"
import { getItinerary } from "@/lib/firebase/firestore"
import DeleteItineraryButton from "@/components/delete-itinerary-button"

export default function ItineraryView({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [itinerary, setItinerary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const id = use(params).id

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
        const itineraryData = await getItinerary(id)

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
  }, [user, loading, id, router])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold">Itinerary not found</h2>
            <Button asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ItineraryHeader itinerary={itinerary} />

        <ItineraryTabs itinerary={itinerary} />

        <div className="mt-8 space-y-8">
          {itinerary.days.map((day) => (
            <DayPlan key={day.dayNumber} day={day} />
          ))}
        </div>

        <div className="mt-12 flex justify-between">
          <Link href={`/itinerary/${id}/pdf`}>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Printer size={18} />
              Print Itinerary
            </Button>
          </Link>
        </div>
        
        <DeleteItineraryButton itineraryId={id}/>
      </div>
    </div>
  )
}