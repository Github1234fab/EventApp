// components/useFavorites.js
import { useEffect, useMemo, useState, useCallback } from "react";
import { auth, db } from "./Firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

/**
 * Stocke les favoris de l'utilisateur dans:
 *   Users/{uid}/favorites/{eventId}
 * Le docID est l'id de l'évènement (provenant de BDDjson).
 */


export default function useFavorites() {
  const uid = auth.currentUser?.uid || null;
  const [favIds, setFavIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setFavIds(new Set());
      setLoading(false);
      return;
    }

    const colRef = collection(db, "Users", uid, "favorites");
    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const ids = new Set(snap.docs.map((d) => d.id)); // doc.id === eventId
        setFavIds(ids);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [uid]);

  const isFavorite = useCallback(
    (eventId) => favIds.has(String(eventId)),
    [favIds]
  );

  const toggleFavorite = useCallback(
    async (event) => {
      if (!uid || !event?.id) return;

      const docRef = doc(db, "Users", uid, "favorites", String(event.id));

      if (favIds.has(String(event.id))) {
        await deleteDoc(docRef);
      } else {
        // on peut stocker un minimum d’infos pour lister plus tard
        await setDoc(docRef, {
          eventId: String(event.id),
          titre: event.titre || "",
          image: event.image || "",
          date: event.date || "",
          lieu: event.lieu || "",
          createdAt: new Date(),
        });
      }
    },
    [uid, favIds]
  );

  return { loading, favIds, isFavorite, toggleFavorite };
}
