import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Trash2 } from "lucide-react"
import Image from "next/image"

interface Itinerary {
  id: string
  destination: string
  startDate: Date
  endDate: Date
  image: string
}

interface ItineraryGridProps {
  itineraries: Itinerary[]
}

export function ItineraryGrid({ itineraries }: ItineraryGridProps) {
  const formatDateRange = (start: Date, end: Date) => {
    const startMonth = start.toLocaleString("default", { month: "short" })
    const endMonth = end.toLocaleString("default", { month: "short" })

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}, ${end.getFullYear()}`
    }

    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${end.getFullYear()}`
  }

  return (
    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {itineraries.map((itinerary) => (
        <Card key={itinerary.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={itinerary.image || "/placeholder.svg"}
              alt={itinerary.destination}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold">{itinerary.destination}</h3>
            <p className="text-sm text-muted-foreground">{formatDateRange(itinerary.startDate, itinerary.endDate)}</p>
          </CardContent>
          <CardFooter className="flex justify-between p-4 pt-0">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href={`/itinerary/${itinerary.id}`}>
                <Eye size={16} />
                View
              </Link>
            </Button>
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 size={16} />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}

      {/* Create New Card */}
      <Link href="/generate">
        <Card className="flex h-full min-h-[250px] cursor-pointer flex-col items-center justify-center p-6 transition-colors hover:bg-muted/50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed">
            <span className="text-3xl">+</span>
          </div>
          <p className="mt-4 text-center font-medium">Create New Itinerary</p>
        </Card>
      </Link>
    </div>
  )
}