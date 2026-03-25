import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const favoritesCol = collection(db, "favorites");

export async function getFavorites(uid) {
  const q = query(favoritesCol, where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addFavorite(uid, city) {
  // Check for duplicate in JS
  const existing = await getFavorites(uid);
  const alreadySaved = existing.find(
    (f) => f.name === city.name && f.country === city.country
  );
  if (alreadySaved) return alreadySaved.id;

  const docRef = await addDoc(favoritesCol, {
    uid,
    name: city.name,
    country: city.country,
    state: city.state || "",
    lat: city.lat,
    lon: city.lon,
    addedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function removeFavorite(docId) {
  await deleteDoc(doc(db, "favorites", docId));
}

export async function isFavorite(uid, cityName, country) {
  const existing = await getFavorites(uid);
  const found = existing.find(
    (f) => f.name === cityName && f.country === country
  );
  return found ? { id: found.id } : null;
}
