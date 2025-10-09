// components/MyAds.js
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "./Firebase";
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { formatDate, formatHoraire, isPastDate } from "../utils/dateFormatter";

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
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const handleEdit = (item) => {
    // Option C : Pas de modification user, uniquement admin
    Alert.alert(
      "Modification impossible",
      "Une fois votre annonce payée, seule notre équipe peut la modifier si nécessaire. Vérifiez bien vos informations avant de payer.",
      [{ text: "OK" }]
    );
  };

  const handlePay = (item) => {
    navigation.navigate("PayAd", {
      submissionId: item.id,
      price: 100, // 1 euro en centimes
    });
  };

  const handleDelete = (item) => {
    if (item.status === "approved") {
      Alert.alert(
        "Suppression impossible",
        "Vous ne pouvez pas supprimer une annonce déjà publiée. Contactez le support si nécessaire.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Supprimer l'annonce ?",
      "Cette action est définitive.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "Submissions", item.id));
              Alert.alert("Supprimé", "Votre annonce a été supprimée.");
            } catch (e) {
              console.error("[Delete] error:", e);
              Alert.alert("Erreur", "Impossible de supprimer l'annonce.");
            }
          },
        },
      ]
    );
  };

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
      status,
      paid,
    } = item;

    const canEdit = status === "pending" && paid;
    const canDelete = status === "pending" || status === "rejected";
    const needsPayment = status === "pending" && !paid;
    const eventPassed = isPastDate(date);

    return (
      <View style={styles.card}>
        {/* Badges statut */}
        <View style={styles.badgeContainer}>
          <StatusPill status={status} />
          <PaymentPill paid={paid} />
        </View>

        {/* Image */}
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImg]}>
            <Text style={{ color: "#777" }}>📷 Pas d'image</Text>
          </View>
        )}

        {/* Contenu */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {titre || "Sans titre"}
          </Text>

          {description ? (
            <Text style={styles.desc} numberOfLines={2}>
              {description}
            </Text>
          ) : null}

          {/* Infos */}
          <View style={styles.infoContainer}>
            {date && (
              <Text style={[styles.info, eventPassed && styles.infoPassed]}>
                📅 {formatDate(date, "long")}
                {eventPassed && " (Passé)"}
              </Text>
            )}
            {horaire && (
              <Text style={styles.info}>🕒 {formatHoraire(horaire)}</Text>
            )}
            {lieu && (
              <Text style={styles.info} numberOfLines={1}>
                📍 {lieu}
              </Text>
            )}
            {tarif && <Text style={styles.info}>💶 {tarif}</Text>}
            {catégorie && <Text style={styles.info}>🏷️ {catégorie}</Text>}
          </View>

          {/* Messages d'état */}
          {needsPayment && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⏳ En attente de paiement
              </Text>
            </View>
          )}

          {status === "pending" && paid && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                ⏱️ En attente de modération
              </Text>
            </View>
          )}

          {status === "approved" && (
            <View style={styles.successBox}>
              <Text style={styles.successBoxText}>
                ✅ Publié et visible par tous
              </Text>
            </View>
          )}

          {status === "rejected" && (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>
                ❌ Annonce refusée
              </Text>
            </View>
          )}

          {/* Boutons d'action */}
          <View style={styles.actions}>
            {needsPayment ? (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.payButton]}
                  onPress={() => handlePay(item)}
                >
                  <Text style={styles.actionButtonText}>💳 Payer (1€)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item)}
                >
                  <Text style={styles.actionButtonText}>🗑️</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.viewButton]}
                  onPress={() =>
                    navigation.navigate("EventDetail", { event: item })
                  }
                >
                  <Text style={styles.actionButtonText}>👁️ Voir</Text>
                </TouchableOpacity>

                {canEdit && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.actionButtonText}>✏️ Modifier</Text>
                  </TouchableOpacity>
                )}

                {canDelete && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={styles.actionButtonText}>🗑️ Supprimer</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 8, color: "#666" }}>
          Chargement de vos annonces…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {ads.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>Aucune annonce</Text>
          <Text style={styles.emptyText}>
            Créez votre première annonce depuis l'écran Événements.
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("NewAd")}
          >
            <Text style={styles.createButtonText}>➕ Créer une annonce</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={ads}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

// Composant badge statut
function StatusPill({ status }) {
  let bg = "#ddd";
  let txt = "#333";
  let label = "inconnu";

  switch ((status || "pending").toLowerCase()) {
    case "pending":
      bg = "#FFF4CC";
      txt = "#7a5c00";
      label = "En attente";
      break;
    case "approved":
      bg = "#E6F6E6";
      txt = "#216e39";
      label = "Approuvé";
      break;
    case "rejected":
      bg = "#FDE8E8";
      txt = "#8a1c1c";
      label = "Refusé";
      break;
  }

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: txt }]}>{label}</Text>
    </View>
  );
}

// Composant badge paiement
function PaymentPill({ paid }) {
  const bg = paid ? "#E6F6E6" : "#FFE5E5";
  const txt = paid ? "#216e39" : "#8a1c1c";
  const label = paid ? "✓ Payé" : "✗ Non payé";

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: txt }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transaprent" },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
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
  emptyTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  createButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: "hidden",
  },
  badgeContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    gap: 6,
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#eee",
  },
  noImg: { alignItems: "center", justifyContent: "center" },
  content: {
    padding: 12,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 6, color: "#333" },
  desc: { color: "#555", marginBottom: 8, lineHeight: 20 },
  infoContainer: {
    marginBottom: 8,
  },
  info: { fontSize: 14, color: "#444", marginBottom: 3 },
  infoPassed: {
    color: "#999",
    fontStyle: "italic",
  },
  warningBox: {
    backgroundColor: "#FFF3CD",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  warningText: {
    color: "#856404",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#E3F2FD",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoBoxText: {
    color: "#1565C0",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
  successBox: {
    backgroundColor: "#E6F6E6",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  successBoxText: {
    color: "#216e39",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "#FDE8E8",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorBoxText: {
    color: "#8a1c1c",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: "#007AFF",
  },
  payButton: {
    backgroundColor: "#FF9500",
  },
  editButton: {
    backgroundColor: "#34C759",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
});