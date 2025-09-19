// Firebase client SDK helpers for AyurSutra (Auth, Firestore, Storage)
// Usage: import needed functions from "@/lib/firebase" in your React components.

// ----- Initialization -----
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase config (env vars with safe public defaults)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDuVEGH4U05e0Eo47C87jXmnRgI3IlYUAk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ayursutra-app-16d14.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ayursutra-app-16d14",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ayursutra-app-16d14.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "465745801729",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:465745801729:web:e7f2717bdbf23313eb8600",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-5D9FE0975V",
};

function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// Singletons
const app = getFirebaseApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ----- Auth Helpers -----
// Creates a user account and profile document. Role must be "patient" or "practitioner".
export async function signUpUser({ name, email, password, role }) {
  if (!name || !email || !password || !role) {
    throw new Error("Missing required fields for signup");
  }
  if (role !== "patient" && role !== "practitioner") {
    throw new Error("Invalid role. Use 'patient' or 'practitioner'.");
  }

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(cred.user, { displayName: name });
  }
  const userRef = doc(db, "users", cred.user.uid);
  await setDoc(userRef, {
    uid: cred.user.uid,
    name,
    email,
    role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return cred.user;
}

// Signs in a user with email/password.
export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// Signs out current user.
export async function logoutUser() {
  await signOut(auth);
}

// Subscribe to auth state changes (useful in React useEffect)
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Google sign-in with profile upsert
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const existing = await getDoc(doc(db, "users", user.uid));
  if (!existing.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      role: "patient",
      provider: "google",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(doc(db, "users", user.uid), { provider: "google", updatedAt: serverTimestamp() });
  }
  return user;
}

// Fetches the user's profile document from Firestore.
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Creates or updates a user profile document in Firestore.
// userData: { uid, name, email, role, provider? }
export async function createUserProfile(userData) {
  const { uid, name, email, role, provider = "password" } = userData || {};
  if (!uid || !name || !email || !role) {
    throw new Error("uid, name, email and role are required to create user profile");
  }
  const ref = doc(db, "users", uid);
  await setDoc(
    ref,
    {
      uid,
      name,
      email,
      role,
      provider,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// ----- Appointment Helpers (Firestore) -----
// Creates a new appointment document.
export async function createAppointment({
  patientId,
  practitionerId,
  therapyType,
  date, // ISO string or Date
  status = "pending", // pending | confirmed | completed
}) {
  if (!patientId || !practitionerId || !therapyType || !date) {
    throw new Error("Missing required appointment fields");
  }
  const col = collection(db, "appointments");
  const docRef = await addDoc(col, {
    patientId,
    practitionerId,
    therapyType,
    date: typeof date === "string" ? date : date.toISOString(),
    status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Lists appointments for a given user based on role.
export async function listAppointmentsByUser({ uid, role }) {
  if (!uid || !role) {
    throw new Error("uid and role are required");
  }
  const col = collection(db, "appointments");
  const q =
    role === "patient"
      ? query(col, where("patientId", "==", uid))
      : query(col, where("practitionerId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Updates an appointment document by id.
export async function updateAppointment({ id, data }) {
  if (!id || !data) {
    throw new Error("id and data are required");
  }
  const ref = doc(db, "appointments", id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// Deletes an appointment document by id.
export async function deleteAppointment(id) {
  if (!id) {
    throw new Error("id is required");
  }
  await deleteDoc(doc(db, "appointments", id));
}

// ----- Wellness Metrics Helpers -----
export async function getWellnessMetrics(uid) {
  if (!uid) throw new Error("uid is required");
  const snap = await getDoc(doc(db, "wellness", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function upsertWellnessMetrics(uid, metrics) {
  if (!uid) throw new Error("uid is required");
  const ref = doc(db, "wellness", uid);
  await setDoc(
    ref,
    {
      ...metrics,
      uid,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// ----- Messages Helpers -----
// Thread id can be `${patientId}_${practitionerId}` to keep it simple
export async function listMessages({ threadId }) {
  if (!threadId) throw new Error("threadId is required");
  const col = collection(db, "messages", threadId, "items");
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function sendMessage({ threadId, fromUid, toUid, text }) {
  if (!threadId || !fromUid || !toUid || !text) throw new Error("Missing fields");
  const col = collection(db, "messages", threadId, "items");
  const docRef = await addDoc(col, {
    fromUid,
    toUid,
    text,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ----- User Profile Helpers -----
export async function updateUserProfile(uid, data) {
  if (!uid || !data) throw new Error("uid and data are required");
  const ref = doc(db, "users", uid);
  await setDoc(
    ref,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// ----- Storage Helpers (optional) -----
// Uploads a patient document (e.g., PDF, image). `file` is a Browser File object.
export async function uploadPatientDocument({ patientId, file }) {
  if (!patientId || !file) {
    throw new Error("patientId and file are required");
  }
  const filePath = `patients/${patientId}/documents/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { filePath, url };
}

// ----- Exports -----
export { app, auth, db, storage };
