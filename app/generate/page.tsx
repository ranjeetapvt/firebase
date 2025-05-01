"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ProgressIndicator } from "@/components/progress-indicator"
import { TripDetailsForm } from "@/components/trip-details-form"
import { TravelersForm } from "@/components/travelers-form"
import { BudgetForm } from "@/components/budget-form"
import { TripStyleForm } from "@/components/trip-style-form"
import { FoodPreferencesForm } from "@/components/food-preferences-form"
import { ExtrasForm } from "@/components/extras-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function GenerateItinerary() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    arrivalMode: "",
    departureMode: "",
    arrivalTime: "",
    departureTime: "",
    travelersCount: 2,
    travelGroupType: "Couple",
    budgetType: "Moderate",
    tripStyles: [],
    pace: "Balanced",
    wakeUpTime: "Mid",
    cuisinePreferences: [],
  })

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data })
  }

  const nextStep = () => {
    if (step < 6) {
      setStep(step + 1)
    } else {
      router.push("/itinerary/1")
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Generate Your Itinerary</h1>

        <ProgressIndicator currentStep={step} />

        <div className="mt-8 rounded-lg border p-6 shadow-sm">
          {step === 1 && <TripDetailsForm formData={formData} updateFormData={updateFormData} />}
          {step === 2 && <TravelersForm formData={formData} updateFormData={updateFormData} />}
          {step === 3 && <BudgetForm formData={formData} updateFormData={updateFormData} />}
          {step === 4 && <TripStyleForm formData={formData} updateFormData={updateFormData} />}
          {step === 5 && <FoodPreferencesForm formData={formData} updateFormData={updateFormData} />}
          {step === 6 && <ExtrasForm formData={formData} updateFormData={updateFormData} />}

          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep}>
                ← Previous Step
              </Button>
            )}
            {step === 1 && <div />}
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {step < 6 ? "Next Step →" : "Generate Itinerary"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
