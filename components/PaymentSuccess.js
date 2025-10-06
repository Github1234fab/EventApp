// components/PaymentSuccess.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking } from "react-native";
import { db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import { formatDate } from "../utils/dateFormatter";
import dayjs from "dayjs";

export default function PaymentSuccess({ route, navigation }) {
  const { submissionId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [adData, setAdData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!submissionId) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "Submissions", submissionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAdData(data);
          
          // Extraire les infos de paiement
          setPaymentData({
            paid: data.paid || false,
            paidAt: data.paidAt,
            amountTotal: data.amountTotal || 0,
            currency: data.currency || "eur",
            customerEmail: data.customerEmail || "",
            stripeSessionId: data.stripeSessionId || "",
            paymentIntent: data.paymentIntent || "",
          });
        }
      } catch (error) {
        console.error("[PaymentSuccess] error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [submissionId]);

  const handleEmailReceipt = () => {
    if (!paymentData?.customerEmail) {
      Alert.alert(
        "Email non disponible",
        "Aucune adresse email associée à ce paiement. Vérifiez votre compte Stripe."
      );
      return;
    }

    Alert.alert(
      "Reçu par email",
      `Un reçu sera automatiquement envoyé par Stripe à ${paymentData.customerEmail}`,
      [{ text: "OK" }]
    );
  };

  const handleViewStripeDashboard = () => {
    if (!paymentData?.stripeSessionId) return;
    
    // Lien Stripe Dashboard (mode test ou live selon votre config)
    const url = `https://dashboard.stripe.com/test/payments/${paymentData.paymentIntent}`;
    
    Alert.alert(
      "Accès administrateur",
      "Ce lien est réservé aux administrateurs Stripe.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Ouvrir", onPress: () => Linking.openURL(url) },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#34C759" />
        <Text style={styles.loaderText}>Chargement des détails...</Text>
      </View>
    );
  }

  if (!paymentData?.paid) {
    return (
      <View style={styles.container}>
        <View style={styles.errorBox}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Paiement non confirmé</Text>
          <Text style={styles.errorText}>
            Le paiement n'a pas encore été validé. Veuillez patienter quelques instants.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("MyAds")}
          >
            <Text style={styles.buttonText}>Voir mes annonces</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const amount = ((paymentData.amountTotal || 0) / 100).toFixed(2);
  const paidDate = paymentData.paidAt?.toDate
    ? dayjs(paymentData.paidAt.toDate()).format("DD/MM/YYYY [à] HH[h]mm")
    : "Date inconnue";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Header */}
      <View style={styles.successHeader}>
        <View style={styles.successIconContainer}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Paiement réussi !</Text>
        <Text style={styles.successSubtitle}>
          Votre annonce est en cours de modération
        </Text>
      </View>

      {/* Annonce Details */}
      {adData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Votre annonce</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Titre</Text>
            <Text style={styles.infoValue}>{adData.titre || "Sans titre"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lieu</Text>
            <Text style={styles.infoValue}>{adData.lieu || "—"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {adData.date ? formatDate(adData.date, "long") : "—"}
            </Text>
          </View>
        </View>
      )}

      {/* Payment Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Détails du paiement</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Montant</Text>
          <Text style={[styles.infoValue, styles.amount]}>
            {amount} {paymentData.currency.toUpperCase()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date de paiement</Text>
          <Text style={styles.infoValue}>{paidDate}</Text>
        </View>

        {paymentData.customerEmail && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{paymentData.customerEmail}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID Transaction</Text>
          <Text style={styles.infoValueSmall} numberOfLines={1}>
            {paymentData.stripeSessionId || "—"}
          </Text>
        </View>
      </View>

      {/* Next Steps */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Prochaines étapes</Text>
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Votre annonce est en cours de modération par notre équipe
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Une fois validée, elle sera visible publiquement
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Vous pouvez suivre son statut dans "Mes annonces"
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {paymentData.customerEmail && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleEmailReceipt}
          >
            <Text style={styles.secondaryButtonText}>📧 Reçu par email</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MyAds")}
        >
          <Text style={styles.buttonText}>Voir mes annonces</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.tertiaryButton]}
          onPress={() => navigation.navigate("EventsList")}
        >
          <Text style={styles.tertiaryButtonText}>Retour aux événements</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loaderText: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },
  errorBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  errorText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  successHeader: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 20,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#34C759",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  infoValueSmall: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
    flex: 2,
    textAlign: "right",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34C759",
  },
  stepContainer: {
    gap: 12,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    paddingTop: 4,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  tertiaryButton: {
    backgroundColor: "transparent",
  },
  tertiaryButtonText: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "500",
  },
});