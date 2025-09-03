import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

// 🔹 On simplifie les props : on ne prend plus chaque champ séparément
export default function Card({ navigation, event }) {
  return (
    <View style={styles.card}>
      {event.image ? (
        <Image source={{ uri: event.image }} style={styles.image} />
      ) : (
        <Text style={{ fontStyle: "italic" }}>📷 Pas d’image</Text>
      )}
      <Text style={styles.title}>{event.titre}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.info}>📍 {event.lieu}</Text>
      <Text style={styles.info}>📅 {event.date}</Text>
      <Text style={styles.info}>💶 {event.tarif}</Text>

      {/* Bouton vers la vue détaillée */}
      <TouchableOpacity
        onPress={() => navigation.navigate("EventDetail", { event })} // ✅ On passe l’objet entier
      >
        <Text style={styles.link}>➡️ Voir plus</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    // Ombre web
    boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
    // Ombre mobile
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
  link: {
    marginTop: 10,
    fontSize: 16,
    color: "#007bff",
    fontWeight: "bold",
    textAlign: "right",
  },
});



// components/Card.js
// import React from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

// export default function Card({ event, navigation }) {
//   return (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => navigation.navigate("EventDetail", { event })} // ✅ envoi de l’event complet
//     >
//       {event.image ? (
//         <Image source={{ uri: event.image }} style={styles.image} />
//       ) : (
//         <Text style={{ fontStyle: "italic" }}>📷 Pas d’image</Text>
//       )}

//       <Text style={styles.title}>{event.titre}</Text>
//       <Text>📍 {event.lieu}</Text>
//       <Text>📅 {event.date}</Text>
//       <Text>💶 {event.tarif}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     padding: 16,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 12,
//     boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
//   },
//   image: { width: "100%", height: 150, borderRadius: 8, marginBottom: 10 },
//   title: { fontWeight: "bold", fontSize: 18, marginBottom: 6 },
// });




