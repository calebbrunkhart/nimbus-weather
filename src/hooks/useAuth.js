import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = loading, null = logged out

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return unsub
  }, [])

  async function signIn() {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      console.error('Sign in failed:', err)
    }
  }

  async function signOutUser() {
    await signOut(auth)
  }

  return { user, signIn, signOut: signOutUser, loading: user === undefined }
}
