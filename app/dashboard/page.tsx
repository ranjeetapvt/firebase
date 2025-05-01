"use client"


import { Navbar } from "@/components/navbar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader title="My Trips" />
        <div className="mb-6">

          <Link href="/generate">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <PlusCircle size={18} />
              Create New Itinerary
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

