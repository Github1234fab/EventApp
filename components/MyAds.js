// components/MyAds.js
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, RefreshControl, Button, Alert } from "react-native";
import { auth, db } from "./Firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function MyAds({ navigation }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // ⚠️ La 1re fois, Firestore peut demander un index composite (userId + createdAt desc)
    // Va dans la console et clique “Créer l’index” si un message apparaît.
    try {
      const q = query(
        collection(db, "Submissions"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsub = onSnapshot(
        q,
        (snap) => {
          const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setAds(data);
          setLoading(false);
        },
        (err) => {
          console.log("[MyAds] Firestore error:", err?.code, err?.message);
          setLoading(false);
          Alert.alert("Erreur", "Impossible de charger vos annonces.");
        }
      );

      return () => unsub();
    } catch (e) {
      console.log("[MyAds] query error:", e);
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // onSnapshot se met déjà à jour en temps réel ; petit délai visuel
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const renderItem = ({ item }) => {
    const {
      titre,
      description,
      image,
      lieu,
      date,
      horaire,
      tarif,
      catégorie,
      lien,
      status,
      createdAt,
    } = item;

    return (
      <View style={styles.card}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImg]}>
            <Text style={{ color: "#777" }}>📷 Pas d’image</Text>
          </View>
        )}

        <View style={{ gap: 4 }}>
          <View style={styles.row}>
            <Text style={styles.title} numberOfLines={1}>{titre || "Sans titre"}</Text>
            <StatusPill status={status} />
          </View>

          {description ? <Text style={styles.desc} numberOfLines={2}>{description}</Text> : null}
          <Text style={styles.info}>📍 {lieu || "—"}   •   📅 {date || "—"}</Text>
          {horaire ? <Text style={styles.info}>🕒 {horaire}</Text> : null}
          {tarif ? <Text style={styles.info}>💶 {tarif}</Text> : null}
          {catégorie ? <Text style={styles.info}>🏷️ {catégorie}</Text> : null}

          {lien ? (
            <View style={{ marginTop: 6 }}>
              <Button title="Voir la billetterie" onPress={() => navigation.navigate("EventDetail", { event: item })} />
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Chargement de vos annonces…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {ads.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Aucune annonce</Text>
          <Text style={styles.emptyText}>Crée ta première annonce depuis l’écran Événements.</Text>
        </View>
      ) : (
        <FlatList
          data={ads}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

function StatusPill({ status }) {
  let bg = "#ddd";
  let txt = "#333";
  let label = (status || "pending").toLowerCase();

  if (label === "pending") { bg = "#FFF4CC"; txt = "#7a5c00"; }
  if (label === "approved") { bg = "#E6F6E6"; txt = "#216e39"; }
  if (label === "rejected") { bg = "#FDE8E8"; txt = "#8a1c1c"; }

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: txt }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  emptyText: { color: "#666", textAlign: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    // Ombre web + mobile
    boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: { width: "100%", height: 160, borderRadius: 10, marginBottom: 8, backgroundColor: "#eee" },
  noImg: { alignItems: "center", justifyContent: "center" },

  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title: { fontSize: 18, fontWeight: "bold", flexShrink: 1 },
  desc: { color: "#555" },
  info: { color: "#444" },

  pill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  pillText: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.3 },
});
