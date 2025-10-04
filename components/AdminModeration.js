// components/AdminModeration.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { db } from "./Firebase";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from "firebase/firestore";

export default function AdminModeration({ navigation }) {
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

  const editAd = (item) => {
    navigation.navigate("EditAd", { submissionId: item.id });
  };

  const approve = async (item) => {
    // ✅ Vérifier que l'annonce est payée
    if (!item.paid) {
      Alert.alert(
        "⚠️ Annonce non payée", 
        "Cette annonce n'a pas encore été payée par l'utilisateur. Elle ne peut pas être approuvée.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      // ✅ Simplement marquer comme approuvée dans Submissions
      await updateDoc(doc(db, "Submissions", item.id), {
        status: "approved",
        moderatedAt: serverTimestamp(),
      });

      Alert.alert("✅ Validé", "L'annonce est maintenant publiée et visible par tous.");
    } catch (e) {
      console.log("[Approve] error:", e);
      Alert.alert("Erreur", e.message);
    }
  };

  const reject = async (item) => {
    Alert.alert(
      "Rejeter l'annonce ?",
      "Cette action est définitive. L'annonce ne sera pas publiée.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Rejeter",
          style: "destructive",
          onPress: async () => {
            try {
              await updateDoc(doc(db, "Submissions", item.id), {
                status: "rejected",
                moderatedAt: serverTimestamp(),
              });
              Alert.alert("❌ Rejeté", "Annonce rejetée.");
            } catch (e) {
              console.log("[Reject] error:", e);
              Alert.alert("Erreur", e.message);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isPaid = item.paid === true;

    return (
      <View style={styles.card}>
        {/* Badge de statut paiement */}
        <View style={[styles.badge, isPaid ? styles.badgePaid : styles.badgeUnpaid]}>
          <Text style={styles.badgeText}>
            {isPaid ? "💳 Payé" : "⏳ Non payé"}
          </Text>
        </View>

        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImg]}>
            <Text style={{ color: "#777" }}>📷 Pas d'image</Text>
          </View>
        )}
        
        <Text style={styles.title}>{item.titre || "Sans titre"}</Text>
        {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
        <Text style={styles.info}>📍 {item.lieu || "—"} • 📅 {item.date || "—"}</Text>
        {item.horaire ? <Text style={styles.info}>🕒 {item.horaire}</Text> : null}
        {item.tarif ? <Text style={styles.info}>💶 {item.tarif}</Text> : null}
        {item.catégorie ? <Text style={styles.info}>🏷️ {item.catégorie}</Text> : null}
        {item.lien ? <Text style={styles.info}>🔗 {item.lien}</Text> : null}

        {/* User ID */}
        <Text style={styles.userId}>👤 User: {item.userId?.substring(0, 8)}...</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton, !isPaid && styles.disabledButton]}
            onPress={() => approve(item)}
            disabled={!isPaid}
          >
            <Text style={styles.actionButtonText}>
              ✅ Approuver
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => editAd(item)}
          >
            <Text style={styles.actionButtonText}>
              ✏️ Modifier
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => reject(item)}
          >
            <Text style={styles.actionButtonText}>
              ❌ Rejeter
            </Text>
          </TouchableOpacity>
        </View>

        {!isPaid && (
          <Text style={styles.warning}>
            ⚠️ En attente du paiement utilisateur
          </Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 8, color: "#666" }}>Chargement des annonces...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛡️ Modération</Text>
        <Text style={styles.headerSubtitle}>
          {pendingAds.length} annonce{pendingAds.length > 1 ? "s" : ""} en attente
        </Text>
      </View>

      {pendingAds.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✨</Text>
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
  loader: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "#f7f7f7",
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
    padding: 24 
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 6 
  },
  emptyText: { 
    color: "#666", 
    textAlign: "center" 
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  badgePaid: {
    backgroundColor: "#34C759",
  },
  badgeUnpaid: {
    backgroundColor: "#FF9500",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  image: { 
    width: "100%", 
    height: 160, 
    borderRadius: 10, 
    marginBottom: 8, 
    backgroundColor: "#eee" 
  },
  noImg: { 
    alignItems: "center", 
    justifyContent: "center" 
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 4 
  },
  desc: { 
    color: "#555", 
    marginBottom: 6,
    lineHeight: 20,
  },
  info: { 
    color: "#444",
    marginTop: 2,
  },
  userId: {
    color: "#999",
    fontSize: 12,
    marginTop: 6,
    fontFamily: "monospace",
  },
  actions: { 
    flexDirection: "row", 
    marginTop: 12,
    gap: 6,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: {
    backgroundColor: "#34C759",
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  rejectButton: {
    backgroundColor: "#FF3B30",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  warning: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#FFF3CD",
    borderRadius: 6,
    color: "#856404",
    fontSize: 13,
    textAlign: "center",
  },
});