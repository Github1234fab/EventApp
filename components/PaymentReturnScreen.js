import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import * as Linking from "expo-linking";
import { useFocusEffect } from "@react-navigation/native";
import { useSubmission } from "../hooks/useSubmission.js";

function getSubmissionIdFromUrl(url) {
  if (!url) return null;
  const parsed = Linking.parse(url);
  const qs = parsed.queryParams || {};
  return qs.submissionId || null;
}

export default function PaymentReturnScreen({ navigation, route }) {
  const [initialUrl, setInitialUrl] = useState(null);

  // ⬇️ récupère l'ID passé par navigate(..., { submissionId })
  const routeSubmissionId = route?.params?.submissionId || null;

  // ⬇️ initialise l’état avec l’ID route si présent
  const [submissionId, setSubmissionId] = useState(routeSubmissionId);

  useEffect(() => {
    (async () => {
      const url = await Linking.getInitialURL();
      if (url) setInitialUrl(url);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const sub = Linking.addEventListener("url", (e) => {
        setInitialUrl(e.url);
      });
      return () => sub.remove();
    }, [])
  );

  // ⬇️ n’écrase l’ID que si l’URL contient quelque chose
  useEffect(() => {
    const idFromUrl = getSubmissionIdFromUrl(initialUrl);
    if (idFromUrl) setSubmissionId(idFromUrl);
  }, [initialUrl]);

  const { data, loading, error, justPaid } = useSubmission(submissionId);

  useEffect(() => {
    if (justPaid) {
      // 👉 déclenche ton action métier ici si besoin
      // Exemple: revenir à la liste d’annonces une fois payé
      // navigation.replace("MyAds");
    }
  }, [justPaid, submissionId, navigation]);

  if (!submissionId) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Identifiant de paiement introuvable. Veuillez réessayer.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ padding: 16 }}>
        <ActivityIndicator />
        <Text>Vérification du paiement en cours…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Erreur: {String(error?.message || error)}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Paiement non confirmé (document introuvable).</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      {data.paid ? (
        <>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            Paiement confirmé ✅
          </Text>
          <Text>
            Montant: {(data.amountTotal ?? 0) / 100} {data.currency?.toUpperCase()}
          </Text>
          <Text>Référence: {data.stripeSessionId}</Text>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            Paiement non confirmé
          </Text>
          <Text>Vous pouvez relancer le paiement depuis votre commande.</Text>
        </>
      )}
    </View>
  );
}
