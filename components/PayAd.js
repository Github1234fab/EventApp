// // components/PayAd.js
// import React, { useCallback, useEffect, useState } from "react";
// import { View, Text, Button, ActivityIndicator, Alert } from "react-native";
// import * as WebBrowser from "expo-web-browser";
// import * as Linking from "expo-linking";
// import { doc, onSnapshot } from "firebase/firestore";
// import { db } from "./Firebase"; // Firebase.js est bien dans components/

// const CF_URL = "https://us-central1-bddjson.cloudfunctions.net/createCheckoutSession";

// export default function PayAd({ route, navigation }) {
//   const { submissionId, price } = route.params || {};
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!submissionId) return;
//     const ref = doc(db, "Submissions", submissionId);
//     const unsub = onSnapshot(ref, (snap) => {
//       const data = snap.data();
//       if (data?.paid) {
//         // Redirection vers l'écran de succès au lieu d'une simple Alert
//         navigation.replace("PaymentSuccess", { submissionId });
//       }
//     });
//     return unsub;
//   }, [submissionId, navigation]);

//   const startCheckout = useCallback(async () => {
//     try {
//       if (!submissionId || !price) {
//         Alert.alert("Erreur", "submissionId ou price manquant.");
//         return;
//       }
//       setLoading(true);

//       // Deep link de retour (ex: moncoin://payment-return)
//       const returnUrl = Linking.createURL("payment-return");

//       const res = await fetch(CF_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ submissionId, price, returnUrl }),
//       });
//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(`CF ${res.status}: ${txt}`);
//       }
//       const { url } = await res.json();
//       if (!url) throw new Error("URL Checkout manquante.");

//       // Ouvre Stripe Checkout et attend un éventuel redirect vers returnUrl
//       await WebBrowser.openBrowserAsync(url);

//       // result.type peut être "success" si un redirect a eu lieu, ou "dismiss" si l'utilisateur ferme.
//       // Pas grave: onSnapshot ci-dessous mettra l’écran à jour dès que Firestore passe à paid:true
//     } catch (e) {
//       console.error("[startCheckout]", e);
//       Alert.alert("Erreur paiement", e.message || "Une erreur est survenue.");
//     } finally {
//       setLoading(false);
//     }
//   }, [submissionId, price]);

//   return (
//     <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
//       <Text style={{ fontSize: 18, marginBottom: 16 }}>
//         Payer votre annonce ({(price || 0) / 100} €)
//       </Text>
//       {loading ? (
//         <ActivityIndicator />
//       ) : (
//         <Button title="Continuer vers le paiement" onPress={startCheckout} />
//       )}
//       <Text style={{ marginTop: 12, color: "#666" }}>
//         Vous serez redirigé vers Stripe pour finaliser le paiement.
//       </Text>
//     </View>
//   );
// }



// ************SUPPRESSION DU RETOUR PAYMETNSUCCESS*********************




// components/PayAd.js
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./Firebase";

const CF_URL = "https://us-central1-bddjson.cloudfunctions.net/createCheckoutSession";

export default function PayAd({ route, navigation }) {
  const { submissionId, price } = route.params || {};
  const [loading, setLoading] = useState(false);

  // Écoute le statut de paiement
  useEffect(() => {
    if (!submissionId) return;
    const ref = doc(db, "Submissions", submissionId);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data();
      if (data?.paid) {
        Alert.alert(
          "Paiement confirmé ✅",
          "Votre annonce a été payée avec succès. Elle est maintenant en cours de modération. Vous pouvez la retrouver dans l'onglet 'Annonces' et consulter les détails du paiement dans l'onglet 'Paiements'. ",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("EventsList"),
            },
          ]
        );
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
    <View style={styles.container}>
      <Text style={styles.title}>Finaliser votre annonce</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💳 Montant à payer : <Text style={styles.price}>{(price || 0) / 100}€</Text>
        </Text>
      </View>

      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsTitle}>📋 Après le paiement :</Text>
        <Text style={styles.instructionsText}>
          • Vous serez automatiquement redirigé vers l'application{'\n'}
          • Votre annonce sera en cours de modération{'\n'}
          • Vous pourrez suivre son statut dans "Mes annonces"{'\n'}
          • Les détails du paiement sont disponibles dans votre compte
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          <Button 
            title="Continuer vers le paiement Stripe" 
            onPress={startCheckout} 
          />
          <View style={{ height: 12 }} />
          <Button 
            title="Annuler" 
            onPress={() => navigation.goBack()}
            color="#999"
          />
        </>
      )}

      <Text style={styles.secureText}>🔒 Paiement sécurisé par Stripe</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  infoBox: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    color: "#1565C0",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
  },
  instructionsBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#34C759",
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  instructionsText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  secureText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 13,
  },
});