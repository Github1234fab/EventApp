// components/Favorites.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { auth, db } from "./Firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Card from "./Card";

export default function Favorites({ navigation }) {
  const uid = auth.currentUser?.uid;
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setItems([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "Users", uid, "favorites"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Recomposer les objets "event" complets pour Card
        const events = data.map((f) => ({
          id: f.eventId || f.id,
          titre: f.titre || "Sans titre",
          description: f.description || "",
          image: f.image || "",
          date: f.date || "",
          horaire: f.horaire || "",
          lieu: f.lieu || "",
          tarif: f.tarif || "",
          catégorie: f.catégorie || "",
          lien: f.lien || "",
        }));

        setItems(events);
        setLoading(false);
      },
      (error) => {
        console.error("[Favorites] error:", error);
        setItems([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#e0245e" />
        <Text style={styles.loaderText}>Chargement de vos favoris...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptyText}>
            Tapez sur le cœur d'un événement pour l'ajouter à vos favoris.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate("EventsList")}
          >
            <Text style={styles.exploreButtonText}>
              🔍 Explorer les événements
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>❤️ Mes favoris</Text>
            <Text style={styles.headerSubtitle}>
              {items.length} événement{items.length > 1 ? "s" : ""} sauvegardé{items.length > 1 ? "s" : ""}
            </Text>
          </View>
          <FlatList
            data={items}
            keyExtractor={(it) => String(it.id)}
            renderItem={({ item }) => (
              <Card event={item} navigation={navigation} />
            )}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  loaderText: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    fontSize: 15,
  },
  exploreButton: {
    backgroundColor: "#e0245e",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});