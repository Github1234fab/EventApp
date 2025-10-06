// components/MyPayments.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Linking } from "react-native";
import { auth, db } from "./Firebase";
import { collection, query, where, orderBy, onSnapshot,  doc, getDoc } from "firebase/firestore";
import dayjs from "dayjs";

export default function MyPayments({ navigation }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // ✅ Changé orderBy de "paidAt" à "createdAt" pour éviter l'erreur d'index
    const q = query(
      collection(db, "Submissions"),
      where("userId", "==", user.uid),
      where("paid", "==", true),
      orderBy("createdAt", "desc") // ← Correction ici
    );

    const unsub = onSnapshot(
        q,
        (snap) => {
          const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setPayments(data);
          setLoading(false);
        },
        (err) => {
          console.error("[MyPayments] error:", err);
          // Supprimer l'Alert.alert ici pour éviter l'alerte
          // Laisser juste le console.error pour le debug
          setLoading(false);
        }
      );
    return () => unsub();
  }, []);

  const handleRequestReceipt = (item) => {
    if (!item.customerEmail) {
      Alert.alert(
        "Reçu non disponible",
        "Aucune adresse email associée à ce paiement."
      );
      return;
    }

    Alert.alert(
      "Reçu par email",
      `Un reçu a été automatiquement envoyé par Stripe à l'adresse ${item.customerEmail} lors du paiement.\n\nVous pouvez également consulter vos transactions dans votre compte Stripe.`,
      [{ text: "OK" }]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Besoin d'aide ?",
      "Pour toute question concernant vos paiements, contactez-nous à support@votre-app.com",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Envoyer un email",
          onPress: () => Linking.openURL("mailto:support@votre-app.com"),
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const paidDate = item.paidAt?.toDate
      ? dayjs(item.paidAt.toDate()).format("DD MMMM YYYY à HH[h]mm")
      : item.createdAt?.toDate
      ? dayjs(item.createdAt.toDate()).format("DD MMMM YYYY à HH[h]mm")
      : "Date inconnue";
    const amount = ((item.amountTotal || 100) / 100).toFixed(2);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.title} numberOfLines={2}>
              {item.titre || "Sans titre"}
            </Text>
            <Text style={styles.date}>{paidDate}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Montant payé</Text>
          <Text style={styles.amount}>{amount}€</Text>
        </View>

        {item.customerEmail && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value} numberOfLines={1}>
              {item.customerEmail}
            </Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Statut annonce</Text>
          <Text style={styles.value}>
            {item.status === "pending" && "⏱️ En modération"}
            {item.status === "approved" && "✅ Publiée"}
            {item.status === "rejected" && "❌ Refusée"}
          </Text>
        </View>

        {item.stripeSessionId && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>ID Transaction</Text>
            <Text style={styles.transactionId} numberOfLines={1}>
              {item.stripeSessionId.substring(0, 24)}...
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleRequestReceipt(item)}
          >
            <Text style={styles.buttonText}>📧 Reçu par email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate("EventDetail", { event: item })}
          >
            <Text style={styles.secondaryButtonText}>👁️ Voir l'annonce</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#34C759" />
        <Text style={styles.loaderText}>Chargement de vos paiements...</Text>
      </View>
    );
  }

  if (payments.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>💳</Text>
        <Text style={styles.emptyTitle}>Aucun paiement</Text>
        <Text style={styles.emptyText}>
          Vous n'avez pas encore effectué de paiement pour vos annonces.
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("NewAd")}
        >
          <Text style={styles.createButtonText}>Créer une annonce</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💳 Mes paiements</Text>
        <Text style={styles.headerSubtitle}>
          {payments.length} paiement{payments.length > 1 ? "s" : ""} effectué{payments.length > 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
          <Text style={styles.supportButtonText}>❓ Besoin d'aide ?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9f9f9" },
  loaderText: { marginTop: 8, color: "#666" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#333" },
  emptyText: { fontSize: 15, color: "#666", textAlign: "center", marginBottom: 24, lineHeight: 22 },
  createButton: { backgroundColor: "#007AFF", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  createButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  header: { backgroundColor: "#fff", padding: 16, borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: "#666" },
  listContent: { padding: 12, paddingBottom: 80 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  successIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#34C759", justifyContent: "center", alignItems: "center", marginRight: 12 },
  successIconText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  headerContent: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
  date: { fontSize: 13, color: "#999" },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 12 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, alignItems: "center" },
  label: { fontSize: 13, color: "#999", fontWeight: "600" },
  value: { fontSize: 13, color: "#333", fontWeight: "500", flex: 1, textAlign: "right" },
  amount: { fontSize: 18, fontWeight: "bold", color: "#34C759" },
  transactionId: { fontSize: 11, color: "#666", fontFamily: "monospace", flex: 1, textAlign: "right" },
  actions: { flexDirection: "row", marginTop: 12, gap: 8 },
  button: { flex: 1, backgroundColor: "#007AFF", paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  secondaryButton: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#007AFF" },
  secondaryButtonText: { color: "#007AFF", fontSize: 14, fontWeight: "600" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", padding: 16, borderTopWidth: 1, borderTopColor: "#e0e0e0" },
  supportButton: { backgroundColor: "#f0f0f0", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  supportButtonText: { color: "#666", fontSize: 14, fontWeight: "600" },
});