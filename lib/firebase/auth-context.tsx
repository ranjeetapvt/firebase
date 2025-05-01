"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "./config"

interface AuthContextProps {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
    signInWithGoogle: async () => {}, 
    signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  const provider = new GoogleAuthProvider()
  const signInWithGoogle = async () => { await signInWithPopup(auth, provider)}
  const signOut = async () => { await firebaseSignOut(auth)}

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false);
    })
    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext);
  return { ...context };
}