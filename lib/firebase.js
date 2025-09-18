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

// Replace with your provided config
const firebaseConfig = {
  apiKey: "AIzaSyDuVEGH4U05e0Eo47C87jXmnRgI3IlYUAk",
  authDomain: "ayursutra-app-16d14.firebaseapp.com",
  projectId: "ayursutra-app-16d14",
  storageBucket: "ayursutra-app-16d14.firebasestorage.app",
  messagingSenderId: "465745801729",
  appId: "1:465745801729:web:e7f2717bdbf23313eb8600",
  measurementId: "G-5D9FE0975V",
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

// Fetches the user's profile document from Firestore.
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ----- Appointment Helpers (Firestore) -----
// Creates a new appointment document.
export async function createAppointment({
  patientId,
  practitionerId,
  therapyType,
  date, // ISO string or Date
  status = "pending", // pending | approved | cancelled | completed
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
