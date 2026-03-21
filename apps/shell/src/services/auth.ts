import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from './firebase'
import type { User } from '@raga/shared-types'

// Map Firebase user → your app User type
export function toAppUser(fbUser: FirebaseUser): User {
  return {
    uid: fbUser.uid,
    email: fbUser.email ?? '',
    displayName: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'User',
    role: 'doctor', // default — extend with Firestore claims later
    avatar: fbUser.photoURL ?? undefined,
  }
}

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return toAppUser(cred.user)
}

export async function signUp(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  return toAppUser(cred.user)
}

export async function signOut() {
  await firebaseSignOut(auth)
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email)
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, fbUser => callback(fbUser ? toAppUser(fbUser) : null))
}

export async function getIdToken(): Promise<string | null> {
  const fbUser = auth.currentUser
  if (!fbUser) return null
  return fbUser.getIdToken()
}
