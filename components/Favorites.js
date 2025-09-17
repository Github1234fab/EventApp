// components/Favorites.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { auth, db } from "./Firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Card from "./Card";

export default function Favorites({ navigation }) {
  const uid = auth.currentUser?.uid;
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (!uid) return setItems([]);
    const q = query(
      collection(db, "Users", uid, "favorites"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id, // = eventId
        ...d.data(),
      }));
      // Important: pour réutiliser <Card />, on recompose un objet "event" minimal
      setItems(
        data.map((f) => ({
          id: f.eventId || f.id,
          titre: f.titre || "Sans titre",
          image: f.image || "",
          date: f.date || "",
          lieu: f.lieu || "",
          description: "", // pas stocké dans favoris → affichage compact
          tarif: "",
        }))
      );
    });
    return () => unsub();
  }, [uid]);

  if (items === null) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Chargement des favoris…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptyText}>Tapote le cœur sur une carte pour l’ajouter ici.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id)}
          renderItem={({ item }) => <Card event={item} navigation={navigation} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingTop: 8 },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  emptyText: { color: "#666", textAlign: "center" },
});
