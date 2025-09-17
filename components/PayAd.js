// components/PayAd.js
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./Firebase"; // Firebase.js est bien dans components/

const CF_URL = "https://us-central1-bddjson.cloudfunctions.net/createCheckoutSession";

export default function PayAd({ route, navigation }) {
  const { submissionId, price } = route.params || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!submissionId) return;
    const ref = doc(db, "Submissions", submissionId);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data();
      if (data?.paid) {
        Alert.alert("Paiement confirmé ✅", "Votre annonce est maintenant payée.");
        navigation.goBack(); // ou navigation.replace("MyAds")
      }
    });
    return unsub;
  }, [submissionId, navigation]);

  const startCheckout = useCallback(async () => {
    try {
      if (!submissionId || !price) {
        Alert.alert("Erreur", "submissionId ou price manquant.");
        return;
      }
      setLoading(true);

      const returnUrl = Linking.createURL("payment-return");

      const res = await fetch(CF_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, price, returnUrl }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`CF ${res.status}: ${txt}`);
      }
      const { url } = await res.json();
      if (!url) throw new Error("URL Checkout manquante.");

      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      console.error("[startCheckout]", e);
      Alert.alert("Erreur paiement", e.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }, [submissionId, price]);

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>
        Payer votre annonce ({(price || 0) / 100} €)
      </Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Continuer vers le paiement" onPress={startCheckout} />
      )}
      <Text style={{ marginTop: 12, color: "#666" }}>
        Vous serez redirigé vers Stripe pour finaliser le paiement.
      </Text>
    </View>
  );
}
