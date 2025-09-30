// // components/PaymentReturnScreen.js
// import React, { useEffect, useState } from "react";
// import { View, Text, ActivityIndicator } from "react-native";
// import { doc, onSnapshot } from "firebase/firestore";
// import { db } from "./Firebase"; // même chemin que dans PayAd.js

// export default function PaymentReturnScreen({ route, navigation }) {
//   const submissionId = route?.params?.submissionId || null;

//   const [loading, setLoading] = useState(!!submissionId);
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   // 👂 Écoute Firestore uniquement si on a un ID
//   useEffect(() => {
//     if (!submissionId) {
//       setLoading(false);
//       setData(null);
//       return;
//     }
//     setLoading(true);
//     let unsub = () => {};
//     try {
//       const ref = doc(db, "Submissions", submissionId);
//       unsub = onSnapshot(
//         ref,
//         (snap) => {
//           setData(snap.exists() ? snap.data() : null);
//           setLoading(false);
//         },
//         (e) => {
//           setError(e);
//           setLoading(false);
//         }
//       );
//     } catch (e) {
//       setError(e);
//       setLoading(false);
//     }
//     return () => unsub && unsub();
//   }, [submissionId]);

//   // 🔁 Redirection automatique quand payé
//   useEffect(() => {
//     if (data?.paid === true) {
//       navigation.replace("MyAds"); // adapte la cible si besoin
//     }
//   }, [data?.paid, navigation]);

//   // --- rendu minimal, 3 états: pas d'ID / loading / data ---
//   if (!submissionId) {
//     return (
//       <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
//         <Text>Identifiant de paiement introuvable. Veuillez réessayer.</Text>
//       </View>
//     );
//   }

//   if (loading) {
//     return (
//       <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
//         <ActivityIndicator />
//         <Text>Vérification du paiement en cours…</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
//         <Text>Erreur: {String(error?.message || error)}</Text>
//       </View>
//     );
//   }

//   if (!data) {
//     return (
//       <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
//         <Text>Paiement non confirmé (document introuvable).</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
//       {data.paid ? (
//         <>
//           <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
//             Paiement confirmé ✅
//           </Text>
//           {typeof data.amountTotal === "number" && (
//             <Text>
//               Montant: {(data.amountTotal / 100).toFixed(2)}{" "}
//               {(data.currency || "eur").toUpperCase()}
//             </Text>
//           )}
//           {data.stripeSessionId && <Text>Référence: {data.stripeSessionId}</Text>}
//         </>
//       ) : (
//         <>
//           <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
//             Paiement non confirmé
//           </Text>
//           <Text>Vous pouvez relancer le paiement depuis votre commande.</Text>
//         </>
//       )}
//     </View>
//   );
// }
