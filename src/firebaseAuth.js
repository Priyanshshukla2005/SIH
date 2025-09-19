import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

const app = getFirebaseApp()
export const auth = getAuth(app)
export const db = getFirestore(app)

export async function signUpUser({ name, email, password, role }) {
  if (!name || !email || !password || !role) throw new Error('Missing fields')
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if (name) await updateProfile(cred.user, { displayName: name })
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    name,
    email,
    role,
    provider: 'password',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return cred.user
}

export async function loginUser({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  const user = result.user
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      role: 'patient',
      provider: 'google',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  } else {
    await updateDoc(ref, { provider: 'google', updatedAt: serverTimestamp() })
  }
  return user
}

export async function logoutUser() {
  await signOut(auth)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}


