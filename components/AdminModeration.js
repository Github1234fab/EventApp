// components/AdminModeration.js
import React, { useEffect, useState, useMemo } from "react";
import { View, Text, FlatList, Image, StyleSheet, Button, Alert, ActivityIndicator } from "react-native";
import { db } from "./Firebase";
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";

export default function AdminModeration() {
  const [pendingAds, setPendingAds] = useState([]);
  const [loading, setLoading] = useState(true);

  // écoute en temps réel des Submissions en attente
  useEffect(() => {
    const q = query(
      collection(db, "Submissions"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPendingAds(data);
      setLoading(false);
    }, (err) => {
      console.log("[AdminModeration] error:", err?.code, err?.message);
      setLoading(false);
      Alert.alert("Erreur", "Impossible de charger les annonces à modérer.");
    });

    return () => unsub();
  }, []);

  const approve = async (item) => {
    try {
      // 1) publier dans BDDjson
      const pub = {
        titre: item.titre || "",
        description: item.description || "",
        lieu: item.lieu || "",
        date: item.date || "",
        horaire: item.horaire || "",
        tarif: item.tarif || "",
        catégorie: item.catégorie || "",
        lien: item.lien || "",
        image: item.image || "",
        annonceur: item.userId || "",
        createdAt: serverTimestamp(),
        sourceSubmissionId: item.id,
      };
      const pubRef = await addDoc(collection(db, "BDDjson"), pub);

      // 2) marquer la submission comme approuvée
      await updateDoc(doc(db, "Submissions", item.id), {
        status: "approved",
        publishedId: pubRef.id,
        moderatedAt: serverTimestamp(),
      });

      Alert.alert("Validé", "Annonce publiée.");
    } catch (e) {
      console.log("[Approve] error:", e);
      Alert.alert("Erreur", e.message);
    }
  };

  const reject = async (item) => {
    try {
      await updateDoc(doc(db, "Submissions", item.id), {
        status: "rejected",
        moderatedAt: serverTimestamp(),
      });
      Alert.alert("Rejeté", "Annonce rejetée.");
    } catch (e) {
      console.log("[Reject] error:", e);
      Alert.alert("Erreur", e.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImg]}>
          <Text style={{ color: "#777" }}>📷 Pas d’image</Text>
        </View>
      )}
      <Text style={styles.title}>{item.titre || "Sans titre"}</Text>
      {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
      <Text style={styles.info}>📍 {item.lieu || "—"} • 📅 {item.date || "—"}</Text>
      {item.horaire ? <Text style={styles.info}>🕒 {item.horaire}</Text> : null}
      {item.tarif ? <Text style={styles.info}>💶 {item.tarif}</Text> : null}
      {item.catégorie ? <Text style={styles.info}>🏷️ {item.catégorie}</Text> : null}

      <View style={styles.actions}>
        <Button title="✅ Valider" onPress={() => approve(item)} />
        <View style={{ width: 8 }} />
        <Button color="#cc3333" title="❌ Rejeter" onPress={() => reject(item)} />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Chargement…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      {pendingAds.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Aucune annonce à modérer</Text>
          <Text style={styles.emptyText}>Les nouvelles annonces apparaîtront ici.</Text>
        </View>
      ) : (
        <FlatList
          data={pendingAds}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  emptyText: { color: "#666", textAlign: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: { width: "100%", height: 160, borderRadius: 10, marginBottom: 8, backgroundColor: "#eee" },
  noImg: { alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  desc: { color: "#555", marginBottom: 6 },
  info: { color: "#444" },
  actions: { flexDirection: "row", marginTop: 10 },
});
