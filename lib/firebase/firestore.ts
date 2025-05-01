import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "./config"

// Get a single itinerary by ID
export const getItinerary = async (id: string) => {
  const docRef = doc(db, "itineraries", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }
  } else {
    return null
  }
}

// // Get all itineraries for a given user ID
// export const getUserItineraries = async (userId: string) => {
//   const q = query(collection(db, "itineraries"), where("userId", "==", userId))
//   const querySnapshot = await getDocs(q)
//   const itineraries = querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }))
//   return itineraries
// }