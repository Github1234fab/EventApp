

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
// import React from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
// import { formatDate, formatHoraire, isPastDate } from "../utils/dateFormatter";
// import { BlurView } from "expo-blur";

// export default function Card({ event, navigation }) {
//   const eventPassed = isPastDate(event.date);

//   return (
//     <TouchableOpacity
//       style={[styles.card, eventPassed && styles.cardPassed]}
//       onPress={() => navigation.navigate("EventDetail", { event })}
//       activeOpacity={0.7}
//     >
//       {/* Badge si événement passé */}
//       {eventPassed && (
//         <View style={styles.passedBadge}>
//           <Text style={styles.passedBadgeText}>Terminé</Text>
//         </View>
//       )}

//       {/* Image */}
//       {event.image ? (
//         <Image source={{ uri: event.image }} style={styles.image} />
//       ) : (
//         <View style={[styles.image, styles.noImage]}>
//           <Text style={styles.noImageText}>📷</Text>
//         </View>
//       )}

//       {/* Contenu */}
//       <View style={styles.content}>
//         {/* Titre */}
//         <Text style={styles.title} numberOfLines={2}>
//           {event.titre || "Sans titre"}
//         </Text>

//         {/* Date formatée en français */}
//         {event.date && (
//           <View style={styles.infoRow}>
//             <Text style={styles.icon}>📅</Text>
//             <Text style={styles.infoText}>
//               {formatDate(event.date, "calendar")}
//             </Text>
//           </View>
//         )}

//         {/* Horaire */}
//         {event.horaire && (
//           <View style={styles.infoRow}>
//             <Text style={styles.icon}>🕒</Text>
//             <Text style={styles.infoText}>
//               {formatHoraire(event.horaire)}
//             </Text>
//           </View>
//         )}

//         {/* Lieu */}
//         {event.lieu && (
//           <View style={styles.infoRow}>
//             <Text style={styles.icon}>📍</Text>
//             <Text style={styles.infoText} numberOfLines={1}>
//               {event.lieu}
//             </Text>
//           </View>
//         )}

//         {/* Tarif */}
//         {event.tarif && (
//           <View style={styles.infoRow}>
//             <Text style={styles.icon}>💶</Text>
//             <Text style={styles.infoText}>{event.tarif}</Text>
//           </View>
//         )}

//         {/* Catégorie */}
//         {event.catégorie && (
//           <View style={styles.categoryBadge}>
//             <Text style={styles.categoryText}>{event.catégorie}</Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#ffffff",
//     borderRadius: 12,
//     marginHorizontal: 12,
//     marginVertical: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: "hidden",
//   },
//   cardPassed: {
//     opacity: 0.6,
//   },
//   passedBadge: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     zIndex: 10,
//   },
//   passedBadgeText: {
//     color: "#fff",
//     fontSize: 11,
//     fontWeight: "bold",
//   },
//   image: {
//     width: "100%",
//     height: 180,
//     backgroundColor: "#f0f0f0",
//   },
//   noImage: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noImageText: {
//     fontSize: 48,
//     opacity: 0.3,
//   },
//   content: {
//     padding: 12,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 8,
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   icon: {
//     fontSize: 14,
//     marginRight: 6,
//     width: 20,
//   },
//   infoText: {
//     fontSize: 14,
//     color: "#555",
//     flex: 1,
//   },
//   categoryBadge: {
//     alignSelf: "flex-start",
//     backgroundColor: "#007AFF",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginTop: 8,
//   },
//   categoryText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "600",
//   },
// });




// import React from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
// import { formatDate, formatHoraire, isPastDate } from "../utils/dateFormatter";
// import { COLORS, FONTS } from '../Config';

// export default function Card({ event, navigation }) {
//   const eventPassed = isPastDate(event.date);

//   return (
//     <TouchableOpacity
//       style={[styles.card, eventPassed && styles.cardPassed]}
//       onPress={() => navigation.navigate("EventDetail", { event })}
//       activeOpacity={0.7}
//     >
//       {/* Badge si événement passé */}
//       {eventPassed && (
//         <View style={styles.passedBadge}>
//           <Text style={styles.passedBadgeText}>Terminé</Text>
//         </View>
//       )}

//       {/* Image */}
//       {event.image ? (
//         <Image source={{ uri: event.image }} style={styles.image} />
//       ) : (
//         <View style={[styles.image, styles.noImage]}>
//           <Text style={styles.noImageText}>📷</Text>
//         </View>
//       )}

//       {/* Contenu */}
//       <View style={styles.content}>
//         {/* Titre */}
//         <Text style={styles.title} numberOfLines={2}>
//           {event.titre || "Sans titre"}
//         </Text>

//         {/* Date formatée en français */}
//         {event.date && (
//           <View style={styles.infoRow}>
//             <Text style={styles.icon}>📅</Text>
//             <Text style={styles.infoText}>
//               {formatDate(event.date, "calendar")}
//             </Text>
//           </View>
//         )}

//         {/* Horaire */}
//         {event.horaire && (
//           <View style={styles.infoRow}>
//             <Text style={styles.icon}>🕒</Text>
//             <Text style={styles.infoText}>
//               {formatHoraire(event.horaire)}
//             </Text>
//           </View>
//         )}

//         {/* Lieu */}
//         {event.lieu && (
//           <View style={styles.infoRow}>
//             <Text style={styles.icon}>📍</Text>
//             <Text style={styles.infoText} numberOfLines={1}>
//               {event.lieu}
//             </Text>
//           </View>
//         )}

//         {/* Tarif */}
//         {event.tarif && (
//           <View style={styles.infoRow}>
//             <Text style={styles.icon}>💶</Text>
//             <Text style={styles.infoText}>{event.tarif}</Text>
//           </View>
//         )}

//         {/* Catégorie */}
//         {event.catégorie && (
//           <View style={styles.categoryBadge}>
//             <Text style={styles.categoryText}>{event.catégorie}</Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     marginHorizontal: 12,
//     marginVertical: 8,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: "hidden",
//   },
//   cardPassed: {
//     opacity: 0.6,
//   },
//   passedBadge: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     backgroundColor: "rgba(0, 0, 0, 0.75)",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 12,
//     zIndex: 10,
//   },
//   passedBadgeText: {
//     color: COLORS.ctaText,
//     fontSize: 11,
//     fontFamily: FONTS.semiBold,
//   },
//   image: {
//     width: "100%",
//     height: 180,
//     backgroundColor: COLORS.lightBg,
//   },
//   noImage: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noImageText: {
//     fontSize: 48,
//     opacity: 0.3,
//   },
//   content: {
//     padding: 12,
//   },
//   title: {
//     fontSize: 18,
//     fontFamily: FONTS.bold,
//     color: COLORS.textDark,
//     marginBottom: 8,
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   icon: {
//     fontSize: 14,
//     marginRight: 6,
//     width: 20,
//   },
//   infoText: {
//     fontSize: 14,
//     fontFamily: FONTS.regular,
//     color: COLORS.text,
//     flex: 1,
//   },
//   categoryBadge: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.cta,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 12,
//     marginTop: 8,
//   },
//   categoryText: {
//     color: COLORS.ctaText,
//     fontSize: 12,
//     fontFamily: FONTS.semiBold,
//   },
// });









// import React from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
// import { formatDate, formatHoraire, isPastDate } from "../utils/dateFormatter";
// import { COLORS, FONTS } from '../Config';

// export default function Card({ event, navigation }) {
//   const eventPassed = isPastDate(event.date);

//   return (
//     <TouchableOpacity
//       style={[styles.card, eventPassed && styles.cardPassed]}
//       onPress={() => navigation.navigate("EventDetail", { event })}
//       activeOpacity={0.7}
//     >
//       {/* Badge si événement passé */}
//       {eventPassed && (
//         <View style={styles.passedBadge}>
//           <Text style={styles.passedBadgeText}>Terminé</Text>
//         </View>
//       )}

//       {/* Layout horizontal : Image à gauche + Contenu à droite */}
//       <View style={styles.horizontalLayout}>
//         {/* Image à gauche (40% de la largeur) */}
//         {event.image ? (
//           <Image source={{ uri: event.image }} style={styles.image} />
//         ) : (
//           <View style={[styles.image, styles.noImage]}>
//             <Text style={styles.noImageText}>🎭</Text>
//           </View>
//         )}

//         {/* Contenu à droite (60% de la largeur) */}
//         <View style={styles.content}>
//           {/* Titre */}
//           <Text style={styles.title} numberOfLines={2}>
//             {event.titre || "Sans titre"}
//           </Text>

//           {/* Informations compactes */}
//           <View style={styles.infoContainer}>
//             {/* Date */}
//             {event.date && (
//               <View style={styles.infoRow}>
//                 <Text style={styles.icon}>📅</Text>
//                 <Text style={styles.infoText} numberOfLines={1}>
//                   {formatDate(event.date, "compact")}
//                 </Text>
//               </View>
//             )}

//             {/* Horaire */}
//             {event.horaire && (
//               <View style={styles.infoRow}>
//                 <Text style={styles.icon}>🕒</Text>
//                 <Text style={styles.infoText} numberOfLines={1}>
//                   {formatHoraire(event.horaire)}
//                 </Text>
//               </View>
//             )}

//             {/* Lieu */}
//             {event.lieu && (
//               <View style={styles.infoRow}>
//                 <Text style={styles.icon}>📍</Text>
//                 <Text style={styles.infoText} numberOfLines={1}>
//                   {event.lieu}
//                 </Text>
//               </View>
//             )}

//             {/* Tarif */}
//             {event.tarif && (
//               <View style={styles.infoRow}>
//                 <Text style={styles.icon}>💶</Text>
//                 <Text style={styles.infoText} numberOfLines={1}>
//                   {event.tarif}
//                 </Text>
//               </View>
//             )}
//           </View>

//           {/* Catégorie en bas */}
//           {event.catégorie && (
//             <View style={styles.categoryBadge}>
//               <Text style={styles.categoryText} numberOfLines={1}>
//                 {event.catégorie}
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     marginHorizontal: 12,
//     marginVertical: 6,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: "hidden",
//     height: 200, // Hauteur fixe pour format 16/9 compact
//   },
  
//   cardPassed: {
//     opacity: 0.6,
//   },
  
//   passedBadge: {
//     position: "absolute",
//     top: 8,
//     left: 8,
//     backgroundColor: "rgba(0, 0, 0, 0.75)",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 10,
//     zIndex: 10,
//   },
  
//   passedBadgeText: {
//     color: COLORS.ctaText,
//     fontSize: 10,
//     fontFamily: FONTS.semiBold,
//   },
  
//   // Layout horizontal
//   horizontalLayout: {
//     flexDirection: "row",
//     height: "100%",
//   },
  
//   // Image à gauche (40%)
//   image: {
//     width: "40%",
//     height: "100%",
//     backgroundColor: COLORS.lightBg,
//   },
  
//   noImage: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
  
//   noImageText: {
//     fontSize: 32,
//     opacity: 0.3,
//   },
  
//   // Contenu à droite (60%)
//   content: {
//     flex: 1,
//     padding: 12,
//     justifyContent: "space-between",
//   },
  
//   title: {
//     fontSize: 16,
//     fontFamily: FONTS.bold,
//     color: COLORS.textDark,
//     marginBottom: 6,
//     lineHeight: 20,
//   },
  
//   infoContainer: {
//     flex: 1,
//     justifyContent: "center",
//   },
  
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 3,
//   },
  
//   icon: {
//     fontSize: 12,
//     marginRight: 4,
//     width: 16,
//   },
  
//   infoText: {
//     fontSize: 12,
//     fontFamily: FONTS.regular,
//     color: COLORS.text,
//     flex: 1,
//   },
  
//   categoryBadge: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.cta,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//     marginTop: 4,
//     maxWidth: "100%",
//   },
  
//   categoryText: {
//     color: COLORS.ctaText,
//     fontSize: 10,
//     fontFamily: FONTS.semiBold,
//   },
// });












import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Share } from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate, formatHoraire, isPastDate } from "../utils/dateFormatter";
import { COLORS, FONTS } from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Card({ event, navigation }) {
  const eventPassed = isPastDate(event.date);
  const [isFavorite, setIsFavorite] = useState(false);

  // Charger le statut favori au montage
  useEffect(() => {
    loadFavoriteStatus();
  }, []);

  const loadFavoriteStatus = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const favArray = JSON.parse(favorites);
        const isFav = favArray.some(fav => fav.id === event.id);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
    }
  };

  // Toggle favori
  const toggleFavorite = async (e) => {
    e.stopPropagation(); // Empêche d'ouvrir le détail
    
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favArray = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favArray = favArray.filter(fav => fav.id !== event.id);
        setIsFavorite(false);
      } else {
        favArray.push(event);
        setIsFavorite(true);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favArray));
    } catch (error) {
      console.error('Erreur sauvegarde favoris:', error);
    }
  };

  // Partager l'événement
  const shareEvent = async (e) => {
    e.stopPropagation(); // Empêche d'ouvrir le détail
    
    try {
      const message = `🎭 ${event.titre}\n\n` +
        `📅 ${formatDate(event.date, "calendar")}\n` +
        `📍 ${event.lieu}\n` +
        (event.description ? `\n${event.description}\n` : '') +
        (event.lienBilletterie ? `\n🎟️ Billetterie: ${event.lienBilletterie}` : '');

      await Share.share({
        message: message,
        title: event.titre,
      });
    } catch (error) {
      console.error('Erreur partage:', error);
    }
  };

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

      {/* Layout horizontal : Image à gauche + Contenu à droite */}
      <View style={styles.horizontalLayout}>
        {/* Image à gauche (40% de la largeur) avec boutons flottants */}
        <View style={styles.imageContainer}>
          {event.image ? (
            <Image source={{ uri: event.image }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.noImage]}>
              <Ionicons name="image-outline" size={40} color={COLORS.text} style={{ opacity: 0.3 }} />
            </View>
          )}

          {/* Boutons flottants favoris et partage sur l'image */}
          <View style={styles.floatingButtons}>
            <TouchableOpacity 
              style={styles.floatingButton}
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={18} 
                color={isFavorite ? "#e74c3c" : COLORS.ctaText} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.floatingButton}
              onPress={shareEvent}
            >
              <Ionicons name="share-outline" size={18} color={COLORS.ctaText} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenu à droite (60% de la largeur) */}
        <View style={styles.content}>
          {/* Titre */}
          <Text style={styles.title} numberOfLines={2}>
            {event.titre || "Sans titre"}
          </Text>

          {/* Informations compactes */}
          <View style={styles.infoContainer}>
            {/* Date */}
            {event.date && (
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.text} style={styles.iconStyle} />
                <Text style={styles.infoText} numberOfLines={1}>
                  {formatDate(event.date, "compact")}
                </Text>
              </View>
            )}

            {/* Horaire */}
            {event.horaire && (
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={14} color={COLORS.text} style={styles.iconStyle} />
                <Text style={styles.infoText} numberOfLines={1}>
                  {formatHoraire(event.horaire)}
                </Text>
              </View>
            )}

            {/* Lieu */}
            {event.lieu && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color={COLORS.text} style={styles.iconStyle} />
                <Text style={styles.infoText} numberOfLines={1}>
                  {event.lieu}
                </Text>
              </View>
            )}

            {/* Tarif */}
            {event.tarif && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="currency-eur" size={14} color={COLORS.text} style={styles.iconStyle} />
                <Text style={styles.infoText} numberOfLines={1}>
                  {event.tarif}
                </Text>
              </View>
            )}
          </View>

          {/* Bas de la carte : Catégorie + Icône "Voir plus" */}
          <View style={styles.bottomRow}>
            {/* Catégorie */}
            {event.catégorie && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText} numberOfLines={1}>
                  {event.catégorie}
                </Text>
              </View>
            )}

            {/* Icône "Voir plus" */}
            <View style={styles.viewMoreContainer}>
              <Text style={styles.viewMoreText}>Voir</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.cta} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    height: 220,
  },
  
  cardPassed: {
    opacity: 0.6,
  },
  
  passedBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 10,
  },
  
  passedBadgeText: {
    color: COLORS.ctaText,
    fontSize: 10,
    fontFamily: FONTS.semiBold,
  },

  // Boutons flottants favoris et partage (sur l'image)
  floatingButtons: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 10,
    flexDirection: 'row',
    gap: 6,
  },

  floatingButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  
  horizontalLayout: {
    flexDirection: "row",
    height: "100%",
  },

  imageContainer: {
    width: "40%",
    height: "100%",
    position: 'relative',
  },
  
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.lightBg,
  },
  
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.lightBg,
  },
  
  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  
  title: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
    marginBottom: 6,
    lineHeight: 20,
  },
  
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  
  iconStyle: {
    marginRight: 6,
    width: 18,
  },
  
  infoText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    flex: 1,
  },

  // Bas de la carte : Catégorie + "Voir plus"
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  
  categoryBadge: {
    backgroundColor: COLORS.cta,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    maxWidth: "60%",
  },
  
  categoryText: {
    color: COLORS.ctaText,
    fontSize: 10,
    fontFamily: FONTS.semiBold,
  },

  // Indicateur "Voir plus"
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  viewMoreText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.cta,
  },
});