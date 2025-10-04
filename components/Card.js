

// import React from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
// import useFavorites from "./useFavorites";

// // 🔹 On simplifie les props : on ne prend plus chaque champ séparément
// export default function Card({ navigation, event }) {
//   // ✅ Ajout favoris
//   const { isFavorite, toggleFavorite } = useFavorites();
//   const fav = isFavorite?.(event?.id);

//   return (
//     <View style={styles.card}>
//       {/* ❤️ Bouton favori */}
//       <TouchableOpacity
//         style={styles.heart}
//         onPress={() => toggleFavorite(event)}
//         hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//       >
//         <Text style={[styles.heartText, fav && styles.heartActive]}>
//           {fav ? "♥" : "♡"}
//         </Text>
//       </TouchableOpacity>

//       {event.image ? (
//         <Image source={{ uri: event.image }} style={styles.image} />
//       ) : (
//         <Text style={{ fontStyle: "italic" }}>📷 Pas d’image</Text>
//       )}
//       <Text style={styles.title}>{event.titre}</Text>
//       <Text style={styles.description}>{event.description}</Text>
//       <Text style={styles.info}>📍 {event.lieu}</Text>
//       <Text style={styles.info}>📅 {event.date}</Text>
//       <Text style={styles.info}>💶 {event.tarif}</Text>

//       {/* Bouton vers la vue détaillée */}
//       <TouchableOpacity
//         onPress={() => navigation.navigate("EventDetail", { event })} // ✅ On passe l’objet entier
//       >
//         <Text style={styles.link}>➡️ Voir plus</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     padding: 16,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 12,
//     // Ombre web
//     boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
//     // Ombre mobile
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//     elevation: 3,
//     // ✅ nécessaire pour positionner le cœur
//     position: "relative",
//   },
//   // ✅ Ajouts pour le cœur
//   heart: {
//     position: "absolute",
//     top: 8,
//     right: 10,
//     zIndex: 2,
//   },
//   heartText: {
//     fontSize: 22,
//     color: "#999",
//   },
//   heartActive: {
//     color: "#e0245e",
//   },

//   image: {
//     width: "100%",
//     height: 180,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 6,
//   },
//   description: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 8,
//   },
//   info: {
//     fontSize: 14,
//     marginBottom: 4,
//   },
//   link: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#007bff",
//     fontWeight: "bold",
//     textAlign: "right",
//   },
// });



// components/Card.js
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { formatDate, formatHoraire, isPastDate } from "../utils/dateFormatter";

export default function Card({ event, navigation }) {
  const eventPassed = isPastDate(event.date);

  return (
    <TouchableOpacity
      style={[styles.card, eventPassed && styles.cardPassed]}
      onPress={() => navigation.navigate("EventDetail", { event })}
      activeOpacity={0.7}
    >
      {/* Badge si événement passé */}
      {eventPassed && (
        <View style={styles.passedBadge}>
          <Text style={styles.passedBadgeText}>Terminé</Text>
        </View>
      )}

      {/* Image */}
      {event.image ? (
        <Image source={{ uri: event.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>📷</Text>
        </View>
      )}

      {/* Contenu */}
      <View style={styles.content}>
        {/* Titre */}
        <Text style={styles.title} numberOfLines={2}>
          {event.titre || "Sans titre"}
        </Text>

        {/* Date formatée en français */}
        {event.date && (
          <View style={styles.infoRow}>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.infoText}>
              {formatDate(event.date, "calendar")}
            </Text>
          </View>
        )}

        {/* Horaire */}
        {event.horaire && (
          <View style={styles.infoRow}>
            <Text style={styles.icon}>🕒</Text>
            <Text style={styles.infoText}>
              {formatHoraire(event.horaire)}
            </Text>
          </View>
        )}

        {/* Lieu */}
        {event.lieu && (
          <View style={styles.infoRow}>
            <Text style={styles.icon}>📍</Text>
            <Text style={styles.infoText} numberOfLines={1}>
              {event.lieu}
            </Text>
          </View>
        )}

        {/* Tarif */}
        {event.tarif && (
          <View style={styles.infoRow}>
            <Text style={styles.icon}>💶</Text>
            <Text style={styles.infoText}>{event.tarif}</Text>
          </View>
        )}

        {/* Catégorie */}
        {event.catégorie && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.catégorie}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardPassed: {
    opacity: 0.6,
  },
  passedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  passedBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: "#f0f0f0",
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    fontSize: 48,
    opacity: 0.3,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
    width: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#007AFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});