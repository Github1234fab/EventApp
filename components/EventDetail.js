// // components/EventDetail.js
// import React from "react";
// import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert, Share } from "react-native";
// import { formatDate, formatHoraire, isPastDate } from "../utils/dateFormatter";
// import useFavorites from "./useFavorites";
// import { COLORS, FONTS } from '../Config';

// export default function EventDetail({ route }) {
//   const { event } = route.params;
//   const { isFavorite, toggleFavorite } = useFavorites();
//   const fav = isFavorite?.(event?.id);
//   const eventPassed = isPastDate(event.date);

//   const handleBilletterie = () => {
//     if (!event.lien) {
//       Alert.alert("Pas de lien", "Aucun lien de billetterie disponible pour cet événement.");
//       return;
//     }

//     // Ajouter https:// si manquant
//     let url = event.lien;
//     if (!url.startsWith("http://") && !url.startsWith("https://")) {
//       url = "https://" + url;
//     }

//     Linking.openURL(url).catch(() => {
//       Alert.alert("Erreur", "Impossible d'ouvrir le lien de billetterie.");
//     });
//   };

//   const handleShare = async () => {
//     try {
//       const message = `📅 ${event.titre}\n\n📍 ${event.lieu}\n🗓️ ${formatDate(event.date, "long")}\n${event.horaire ? `🕒 ${formatHoraire(event.horaire)}\n` : ""}${event.tarif ? `💶 ${event.tarif}\n` : ""}\n${event.lien ? `🎟️ ${event.lien}` : ""}`;

//       await Share.share({
//         message: message,
//         title: event.titre,
//       });
//     } catch (error) {
//       console.error("Share error:", error);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
//       {/* Image avec badges */}
//       <View style={styles.imageContainer}>
//         {event.image ? (
//           <Image source={{ uri: event.image }} style={styles.image} />
//         ) : (
//           <View style={[styles.image, styles.noImage]}>
//             <Text style={styles.noImageText}>📷 Pas d'image</Text>
//           </View>
//         )}

//         {/* Badge événement passé */}
//         {eventPassed && (
//           <View style={styles.passedBadge}>
//             <Text style={styles.passedBadgeText}>Événement terminé</Text>
//           </View>
//         )}

//         {/* Boutons flottants */}
//         <View style={styles.floatingButtons}>
//           <TouchableOpacity
//             style={styles.floatingButton}
//             onPress={() => toggleFavorite(event)}
//           >
//             <Text style={styles.floatingButtonIcon}>{fav ? "♥" : "♡"}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.floatingButton} onPress={handleShare}>
//             <Text style={styles.floatingButtonIcon}>↗</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Contenu */}
//       <View style={styles.content}>
//         {/* Catégorie */}
//         {event.catégorie && (
//           <View style={styles.categoryBadge}>
//             <Text style={styles.categoryText}>{event.catégorie}</Text>
//           </View>
//         )}

//         {/* Titre */}
//         <Text style={styles.title}>{event.titre || "Sans titre"}</Text>

//         {/* Informations principales */}
//         <View style={styles.infoSection}>
//           {event.date && (
//             <View style={styles.infoRow}>
//               <View style={styles.iconCircle}>
//                 <Text style={styles.iconText}>📅</Text>
//               </View>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoLabel}>Date</Text>
//                 <Text style={[styles.infoValue, eventPassed && styles.infoValuePassed]}>
//                   {formatDate(event.date, "long")}
//                   {eventPassed && " (Passé)"}
//                 </Text>
//               </View>
//             </View>
//           )}

//           {event.horaire && (
//             <View style={styles.infoRow}>
//               <View style={styles.iconCircle}>
//                 <Text style={styles.iconText}>🕒</Text>
//               </View>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoLabel}>Horaire</Text>
//                 <Text style={styles.infoValue}>{formatHoraire(event.horaire)}</Text>
//               </View>
//             </View>
//           )}

//           {event.lieu && (
//             <View style={styles.infoRow}>
//               <View style={styles.iconCircle}>
//                 <Text style={styles.iconText}>📍</Text>
//               </View>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoLabel}>Lieu</Text>
//                 <Text style={styles.infoValue}>{event.lieu}</Text>
//               </View>
//             </View>
//           )}

//           {event.tarif && (
//             <View style={styles.infoRow}>
//               <View style={styles.iconCircle}>
//                 <Text style={styles.iconText}>💶</Text>
//               </View>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoLabel}>Tarif</Text>
//                 <Text style={styles.infoValue}>{event.tarif}</Text>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* Description */}
//         {event.description && (
//           <View style={styles.descriptionSection}>
//             <Text style={styles.sectionTitle}>À propos</Text>
//             <Text style={styles.description}>{event.description}</Text>
//           </View>
//         )}

//         {/* Bouton billetterie */}
//         {event.lien && (
//           <TouchableOpacity style={styles.billetterieButton} onPress={handleBilletterie}>
//             <Text style={styles.billetterieButtonText}>🎟️ Réserver / Billetterie</Text>
//           </TouchableOpacity>
//         )}

//         {/* Message si événement passé */}
//         {eventPassed && (
//           <View style={styles.warningBox}>
//             <Text style={styles.warningText}>
//               ⚠️ Cet événement est déjà passé
//             </Text>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "transparent",
//   },

//   imageContainer: {
//     position: "relative",
//   },

//   image: {
//     width: "100%",
//     height: 300,
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

//   passedBadge: {
//     position: "absolute",
//     top: 16,
//     left: 16,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },

//   passedBadgeText: {
//     color: COLORS.ctaText,
//     fontSize: 13,
//     fontFamily: FONTS.semiBold,
//   },

//   floatingButtons: {
//     position: "absolute",
//     top: 16,
//     right: 16,
//     gap: 8,
//   },

//   floatingButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: "rgba(255, 255, 255, 0.95)",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },

//   floatingButtonIcon: {
//     fontSize: 24,
//     color: COLORS.cta,  // Votre couleur CTA
//   },

//   content: {
//     padding: 16,
//   },

//   categoryBadge: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.cta,  // Votre couleur CTA
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     marginBottom: 12,
//   },

//   categoryText: {
//     color: COLORS.ctaText,
//     fontSize: 13,
//     fontFamily: FONTS.semiBold,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },

//   title: {
//     fontSize: 28,
//     fontFamily: FONTS.bold,  // Poppins Bold
//     color: COLORS.textDark,
//     marginBottom: 20,
//     lineHeight: 36,
//   },

//   infoSection: {
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },

//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },

//   iconCircle: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: COLORS.lightBg,  // Beige clair
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },

//   iconText: {
//     fontSize: 20,
//   },

//   infoTextContainer: {
//     flex: 1,
//   },

//   infoLabel: {
//     fontSize: 12,
//     color: COLORS.textGray,
//     marginBottom: 2,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//     fontFamily: FONTS.semiBold,
//   },

//   infoValue: {
//     fontSize: 16,
//     color: COLORS.textDark,
//     fontFamily: FONTS.medium,
//   },

//   infoValuePassed: {
//     color: COLORS.textGray,
//     fontStyle: "italic",
//     fontFamily: FONTS.regular,
//   },

//   descriptionSection: {
//     marginBottom: 20,
//   },

//   sectionTitle: {
//     fontSize: 20,
//     fontFamily: FONTS.bold,
//     color: COLORS.text,  // Orange
//     marginBottom: 12,
//   },

//   description: {
//     fontSize: 16,
//     color: COLORS.textDark,
//     lineHeight: 24,
//     fontFamily: FONTS.regular,
//   },

//   billetterieButton: {
//     backgroundColor: COLORS.success,
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },

//   billetterieButtonText: {
//     color: COLORS.ctaText,
//     fontSize: 18,
//     fontFamily: FONTS.bold,
//   },

//   warningBox: {
//     backgroundColor: "#FFF3CD",
//     padding: 12,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: COLORS.warning,
//   },

//   warningText: {
//     color: "#856404",
//     fontSize: 14,
//     fontFamily: FONTS.semiBold,
//     textAlign: "center",
//   },
// });

// import React from "react";
// import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { formatDate, formatHoraire, isPastDate } from "../utils/dateFormatter";
// import { COLORS, FONTS } from '../Config';

// export default function EventDetail({ route, navigation }) {
//   const { event } = route.params;
//   const eventPassed = isPastDate(event.date);

//   return (
//     <ScrollView style={styles.container}>
//       {/* Image avec badge et boutons flottants */}
//       <View style={styles.imageContainer}>
//         {event.image ? (
//           <Image source={{ uri: event.image }} style={styles.image} />
//         ) : (
//           <View style={[styles.image, styles.noImage]}>
//             <Ionicons name="image-outline" size={80} color={COLORS.text} style={{ opacity: 0.3 }} />
//           </View>
//         )}

//         {/* Badge événement passé */}
//         {eventPassed && (
//           <View style={styles.passedBadge}>
//             <Text style={styles.passedBadgeText}>Terminé</Text>
//           </View>
//         )}

//         {/* Boutons flottants (favoris, partage, etc.) */}
//         <View style={styles.floatingButtons}>
//           <TouchableOpacity style={styles.floatingButton}>
//             <Ionicons name="heart-outline" size={24} color={COLORS.cta} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.floatingButton}>
//             <Ionicons name="share-outline" size={24} color={COLORS.cta} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Contenu */}
//       <View style={styles.content}>
//         {/* Badge catégorie */}
//         {event.catégorie && (
//           <View style={styles.categoryBadge}>
//             <Text style={styles.categoryText}>{event.catégorie}</Text>
//           </View>
//         )}

//         {/* Titre */}
//         <Text style={styles.title}>{event.titre || "Sans titre"}</Text>

//         {/* Informations principales */}
//         <View style={styles.infoSection}>
//           {/* Date */}
//           {event.date && (
//             <View style={styles.infoRow}>
//               <View style={styles.iconCircle}>
//                 <Ionicons name="calendar" size={22} color={COLORS.cta} />
//               </View>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoLabel}>Date</Text>
//                 <Text style={[styles.infoValue, eventPassed && styles.infoValuePassed]}>
//                   {formatDate(event.date, "calendar")}
//                 </Text>
//               </View>
//             </View>
//           )}

//           {/* Horaire */}
//           {event.horaire && (
//             <View style={styles.infoRow}>
//               <View style={styles.iconCircle}>
//                 <Ionicons name="time" size={22} color={COLORS.cta} />
//               </View>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoLabel}>Horaire</Text>
//                 <Text style={styles.infoValue}>{formatHoraire(event.horaire)}</Text>
//               </View>
//             </View>
//           )}

//           {/* Lieu */}
//           {event.lieu && (
//             <View style={styles.infoRow}>
//               <View style={styles.iconCircle}>
//                 <Ionicons name="location" size={22} color={COLORS.cta} />
//               </View>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoLabel}>Lieu</Text>
//                 <Text style={styles.infoValue}>{event.lieu}</Text>
//               </View>
//             </View>
//           )}

//           {/* Tarif */}
//           {event.tarif && (
//             <View style={[styles.infoRow, { marginBottom: 0 }]}>
//               <View style={styles.iconCircle}>
//                 <MaterialCommunityIcons name="currency-eur" size={22} color={COLORS.cta} />
//               </View>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoLabel}>Tarif</Text>
//                 <Text style={styles.infoValue}>{event.tarif}</Text>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* Description */}
//         {event.description && (
//           <View style={styles.descriptionSection}>
//             <Text style={styles.sectionTitle}>Description</Text>
//             <Text style={styles.description}>{event.description}</Text>
//           </View>
//         )}

//         {/* Lien billetterie */}
//         {event.lienBilletterie && !eventPassed && (
//           <TouchableOpacity style={styles.billetterieButton}>
//             <Ionicons name="ticket" size={20} color={COLORS.ctaText} style={{ marginRight: 8 }} />
//             <Text style={styles.billetterieButtonText}>Réserver des billets</Text>
//           </TouchableOpacity>
//         )}

//         {/* Avertissement événement passé */}
//         {eventPassed && (
//           <View style={styles.warningBox}>
//             <Text style={styles.warningText}>
//               Cet événement est terminé
//             </Text>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "transparent",
//   },

//   imageContainer: {
//     position: "relative",
//   },

//   image: {
//     width: "100%",
//     height: 300,
//     backgroundColor: COLORS.lightBg,
//   },

//   noImage: {
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   passedBadge: {
//     position: "absolute",
//     top: 16,
//     left: 16,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },

//   passedBadgeText: {
//     color: COLORS.ctaText,
//     fontSize: 13,
//     fontFamily: FONTS.semiBold,
//   },

//   floatingButtons: {
//     position: "absolute",
//     top: 16,
//     right: 16,
//     gap: 8,
//   },

//   floatingButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: "rgba(255, 255, 255, 0.95)",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },

//   content: {
//     padding: 16,
//   },

//   categoryBadge: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.cta,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     marginBottom: 12,
//   },

//   categoryText: {
//     color: COLORS.ctaText,
//     fontSize: 13,
//     fontFamily: FONTS.semiBold,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },

//   title: {
//     fontSize: 28,
//     fontFamily: FONTS.bold,
//     color: COLORS.textDark,
//     marginBottom: 20,
//     lineHeight: 36,
//   },

//   infoSection: {
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },

//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },

//   iconCircle: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: COLORS.lightBg,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },

//   infoTextContainer: {
//     flex: 1,
//   },

//   infoLabel: {
//     fontSize: 12,
//     color: COLORS.textGray,
//     marginBottom: 2,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//     fontFamily: FONTS.semiBold,
//   },

//   infoValue: {
//     fontSize: 16,
//     color: COLORS.textDark,
//     fontFamily: FONTS.medium,
//   },

//   infoValuePassed: {
//     color: COLORS.textGray,
//     fontStyle: "italic",
//     fontFamily: FONTS.regular,
//   },

//   descriptionSection: {
//     marginBottom: 20,
//   },

//   sectionTitle: {
//     fontSize: 20,
//     fontFamily: FONTS.bold,
//     color: COLORS.text,
//     marginBottom: 12,
//   },

//   description: {
//     fontSize: 16,
//     color: COLORS.textDark,
//     lineHeight: 24,
//     fontFamily: FONTS.regular,
//   },

//   billetterieButton: {
//     backgroundColor: COLORS.success,
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },

//   billetterieButtonText: {
//     color: COLORS.ctaText,
//     fontSize: 18,
//     fontFamily: FONTS.bold,
//   },

//   warningBox: {
//     backgroundColor: "#FFF3CD",
//     padding: 12,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: COLORS.warning,
//   },

//   warningText: {
//     color: "#856404",
//     fontSize: 14,
//     fontFamily: FONTS.semiBold,
//     textAlign: "center",
//   },
// });

// import React from "react";
// import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Platform } from "react-native";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { formatDate, formatHoraire, isPastDate } from "../utils/dateFormatter";
// import { COLORS, FONTS } from "../Config";

// export default function EventDetail({ route, navigation }) {
//   const { event } = route.params;
//   const eventPassed = isPastDate(event.date);

//   // Fonction pour ouvrir Google Maps avec l'adresse
//   const openMaps = () => {
//     if (!event.lieu) return;
//     const address = encodeURIComponent(event.lieu);
//     let url;
//     if (Platform.OS === "ios") {
//       url = `http://maps.apple.com/?q=${address}`; // ou maps:// si tu veux forcer Apple Maps
//     } else {
//       url = `geo:0,0?q=${address}`;
//     }
//     Linking.openURL(url).catch(() => {
//       Alert.alert("Erreur", "Impossible d'ouvrir les cartes");
//     });
//   };

//   // Fonction pour ouvrir un lien externe
//   const openLink = (url, errorMessage) => {
//     if (!url) return;

//     Linking.canOpenURL(url)
//       .then((supported) => {
//         if (supported) {
//           Linking.openURL(url);
//         } else {
//           Alert.alert("Erreur", errorMessage || "Impossible d'ouvrir le lien");
//         }
//       })
//       .catch(() => {
//         Alert.alert("Erreur", errorMessage || "Impossible d'ouvrir le lien");
//       });
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* Image avec badge et boutons flottants */}
//       <View style={styles.imageContainer}>
//         {event.image ? (
//           <Image source={{ uri: event.image }} style={styles.image} />
//         ) : (
//           <View style={[styles.image, styles.noImage]}>
//             <Ionicons name="image-outline" size={80} color={COLORS.text} style={{ opacity: 0.3 }} />
//           </View>
//         )}

//         {/* Badge événement passé */}
//         {eventPassed && (
//           <View style={styles.passedBadge}>
//             <Text style={styles.passedBadgeText}>Terminé</Text>
//           </View>
//         )}

//         {/* Boutons flottants (favoris, partage, etc.) */}
//         <View style={styles.floatingButtons}>
//           <TouchableOpacity style={styles.floatingButton}>
//             <Ionicons name="heart-outline" size={24} color={COLORS.cta} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.floatingButton}>
//             <Ionicons name="share-outline" size={24} color={COLORS.cta} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Contenu */}
//       <View style={styles.content}>
//         {/* Badge catégorie */}
//         {event.catégorie && (
//           <View style={styles.categoryBadge}>
//             <Text style={styles.categoryText}>{event.catégorie}</Text>
//           </View>
//         )}

//         {/* Titre */}
//         <Text style={styles.title}>{event.titre || "Sans titre"}</Text>

//         {/* Informations principales */}
//         <View style={styles.infoSection}>
//           {/* Date */}
//           {event.date && (
//             <View style={styles.infoRow}>
//               <View style={styles.iconCircle}>
//                 <Ionicons name="calendar" size={22} color={COLORS.ctaText} />
//               </View>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoLabel}>Date</Text>
//                 <Text style={[styles.infoValue, eventPassed && styles.infoValuePassed]}>{formatDate(event.date, "calendar")}</Text>
//               </View>
//             </View>
//           )}

//           {/* Horaire */}
//           {event.horaire && (
//             <View style={styles.infoRow}>
//               <View style={styles.iconCircle}>
//                 <Ionicons name="time" size={22} color={COLORS.ctaText} />
//               </View>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoLabel}>Horaire</Text>
//                 <Text style={styles.infoValue}>{formatHoraire(event.horaire)}</Text>
//               </View>
//             </View>
//           )}

//           {/* Lieu - Cliquable pour ouvrir Maps */}
//           {event.lieu && (
//             <TouchableOpacity style={styles.infoRow} onPress={openMaps}>
//               <View style={styles.iconCircle}>
//                 <Ionicons name="location" size={22} color={COLORS.ctaText} />
//               </View>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoLabel}>Lieu</Text>
//                 <Text style={[styles.infoValue, styles.linkText]}>{event.lieu}</Text>
//               </View>
//               <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
//             </TouchableOpacity>
//           )}

//           {/* Tarif */}
//           {event.tarif && (
//             <View style={[styles.infoRow, { marginBottom: 0 }]}>
//               <View style={styles.iconCircle}>
//                 <MaterialCommunityIcons name="currency-eur" size={22} color={COLORS.ctaText} />
//               </View>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoLabel}>Tarif</Text>
//                 <Text style={styles.infoValue}>{event.tarif}</Text>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* Description */}
//         {event.description && (
//           <View style={styles.descriptionSection}>
//             <Text style={styles.sectionTitle}>Description</Text>
//             <Text style={styles.description}>{event.description}</Text>
//           </View>
//         )}

//         {/* Lien billetterie */}
//         {event.lienBilletterie && !eventPassed && (
//           <TouchableOpacity style={styles.billetterieButton} onPress={() => openLink(event.lienBilletterie, "Impossible d'ouvrir le lien de billetterie")}>
//             <Ionicons name="ticket" size={20} color={COLORS.ctaText} style={{ marginRight: 8 }} />
//             <Text style={styles.billetterieButtonText}>Réserver des billets</Text>
//             <Ionicons name="open-outline" size={25} color={COLORS.ctaText} style={{ marginLeft: 8, marginBottom: 7 }} />
//           </TouchableOpacity>
//         )}

//         {/* Lien annonceur */}
//         {event.lienAnnonceur && (
//           <TouchableOpacity style={styles.annonceurButton} onPress={() => openLink(event.lienAnnonceur, "Impossible d'ouvrir le site de l'annonceur")}>
//             {/* <Ionicons name="globe-outline" size={20} color={COLORS.ctaText} style={{ marginRight: 8, marginBottom: 5 }} /> */}
//             <Text style={styles.annonceurButtonText}>Visiter le site de l'annonceur</Text>
//             <Ionicons name="open-outline" size={25} color={COLORS.ctaText} style={{ marginLeft: 8, marginBottom: 7 }} />
//           </TouchableOpacity>
//         )}

//         {/* Avertissement événement passé */}
//         {eventPassed && (
//           <View style={styles.warningBox}>
//             <Text style={styles.warningText}>Cet événement est terminé</Text>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// }




import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Platform, Share } from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate, formatHoraire, isPastDate } from "../utils/dateFormatter";
import { COLORS, FONTS } from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EventDetail({ route, navigation }) {
  const { event } = route.params;
  const eventPassed = isPastDate(event.date);
  const [isFavorite, setIsFavorite] = useState(false);

  // Charger le statut favori au montage
  useEffect(() => {
    loadFavoriteStatus();
  }, []);

  // Charger depuis AsyncStorage
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
  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favArray = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        // Retirer des favoris
        favArray = favArray.filter(fav => fav.id !== event.id);
        setIsFavorite(false);
        Alert.alert('Retiré des favoris', `${event.titre} a été retiré de vos favoris`);
      } else {
        // Ajouter aux favoris
        favArray.push(event);
        setIsFavorite(true);
        Alert.alert('Ajouté aux favoris', `${event.titre} a été ajouté à vos favoris`);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favArray));
    } catch (error) {
      console.error('Erreur sauvegarde favoris:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder');
    }
  };

  // Partager l'événement
  const shareEvent = async () => {
    try {
      const message = `🎭 ${event.titre}\n\n` +
        `📅 ${formatDate(event.date, "calendar")}\n` +
        `📍 ${event.lieu}\n` +
        (event.description ? `\n${event.description}\n` : '') +
        (event.lienBilletterie ? `\n🎟️ Billetterie: ${event.lienBilletterie}` : '');

      const result = await Share.share({
        message: message,
        title: event.titre,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Partagé via:', result.activityType);
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager');
    }
  };

  // Fonction pour ouvrir Google Maps avec l'adresse
  const openMaps = () => {
    if (!event.lieu) return;
    const address = encodeURIComponent(event.lieu);
    let url;
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?q=${address}`; // ou maps:// si tu veux forcer Apple Maps
    } else {
      url = `geo:0,0?q=${address}`;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert("Erreur", "Impossible d'ouvrir les cartes");
    });
  };

  
  // Fonction pour ouvrir un lien externe
  const openLink = (url, errorMessage) => {
    if (!url) return;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Erreur", errorMessage || "Impossible d'ouvrir le lien");
      }
    }).catch(() => {
      Alert.alert("Erreur", errorMessage || "Impossible d'ouvrir le lien");
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image avec badge et boutons flottants */}
      <View style={styles.imageContainer}>
        {event.image ? (
          <Image source={{ uri: event.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Ionicons name="image-outline" size={80} color={COLORS.text} style={{ opacity: 0.3 }} />
          </View>
        )}

        {/* Badge événement passé */}
        {eventPassed && (
          <View style={styles.passedBadge}>
            <Text style={styles.passedBadgeText}>Terminé</Text>
          </View>
        )}

        {/* Boutons flottants (favoris, partage, etc.) */}
        <View style={styles.floatingButtons}>
          <TouchableOpacity 
            style={styles.floatingButton}
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#e74c3c" : COLORS.cta} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.floatingButton}
            onPress={shareEvent}
          >
            <Ionicons name="share-outline" size={24} color={COLORS.ctaText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        {/* Badge catégorie */}
        {event.catégorie && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.catégorie}</Text>
          </View>
        )}

        {/* Titre */}
        <Text style={styles.title}>{event.titre || "Sans titre"}</Text>

        {/* Informations principales */}
        <View style={styles.infoSection}>
          {/* Date */}
          {event.date && (
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="calendar" size={22} color={COLORS.ctaText} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={[styles.infoValue, eventPassed && styles.infoValuePassed]}>
                  {formatDate(event.date, "calendar")}
                </Text>
              </View>
            </View>
          )}

          {/* Horaire */}
          {event.horaire && (
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="time" size={22} color={COLORS.ctaText} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Horaire</Text>
                <Text style={styles.infoValue}>{formatHoraire(event.horaire)}</Text>
              </View>
            </View>
          )}

          {/* Lieu - Cliquable pour ouvrir Maps */}
          {event.lieu && (
            <TouchableOpacity style={styles.infoRow} onPress={openMaps}>
              <View style={styles.iconCircle}>
                <Ionicons name="location" size={22} color={COLORS.ctaText} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Lieu</Text>
                <Text style={[styles.infoValue, styles.linkText]}>{event.lieu}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
            </TouchableOpacity>
          )}

          {/* Tarif */}
          {event.tarif && (
            <View style={[styles.infoRow, { marginBottom: 0 }]}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="currency-eur" size={22} color={COLORS.ctaText} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Tarif</Text>
                <Text style={styles.infoValue}>{event.tarif}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Description */}
        {event.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
        )}

        {/* Lien billetterie */}
        {event.lienBilletterie && !eventPassed && (
          <TouchableOpacity 
            style={styles.billetterieButton}
            onPress={() => openLink(event.lienBilletterie, "Impossible d'ouvrir le lien de billetterie")}
          >
            <Ionicons name="ticket" size={20} color={COLORS.ctaText} style={{ marginRight: 8 }} />
            <Text style={styles.billetterieButtonText}>Réserver des billets</Text>
            <Ionicons name="open-outline" size={22} color={COLORS.ctaText} style={{ marginLeft: 8, marginBottom: 7 }} />
          </TouchableOpacity>
        )}

        {/* Lien annonceur */}
        {event.lienAnnonceur && (
          <TouchableOpacity 
            style={styles.annonceurButton}
            onPress={() => openLink(event.lienAnnonceur, "Impossible d'ouvrir le site de l'annonceur")}
          >
            <Ionicons name="globe-outline" size={20} color={COLORS.cta} style={{ marginRight: 8 }} />
            <Text style={styles.annonceurButtonText}>Visiter le site de l'annonceur</Text>
            <Ionicons name="open-outline" size={22} color={COLORS.ctaText} style={{ marginLeft: 8, marginBottom: 7 }} />
          </TouchableOpacity>
        )}

        {/* Avertissement événement passé */}
        {eventPassed && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Cet événement est terminé
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}



















const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: "95%",
    margin: "auto",
    height: 300,
    backgroundColor: COLORS.lightBg,
    borderRadius: 16,
    marginTop: 10,
  },

  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },

  passedBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  passedBadgeText: {
    color: COLORS.ctaText,
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },

  floatingButtons: {
    position: "absolute",
    top: 16,
    right: 16,
    gap: 8,
  },

  floatingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  content: {
    padding: 16,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.ctaSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },

  categoryText: {
    color: COLORS.ctaText,
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.ctaText,
    marginBottom: 20,
    lineHeight: 36,
    backgroundColor: COLORS.ctaHover,
    padding: 10,
    borderRadius: 12,
  },

  infoSection: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cta,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    color: COLORS.ctaText,
  },

  infoTextContainer: {
    flex: 1,
    
  },

  infoLabel: {
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 0,
    textTransform: "uppercase",
    letterSpacing: 0,
    fontFamily: FONTS.semiBold,
  },

  infoValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontFamily: FONTS.medium,
    marginTop: -7,
  },

  linkText: {
    color: COLORS.cta,
    textDecorationLine: "underline",
  },

  infoValuePassed: {
    color: COLORS.textGray,
    fontStyle: "italic",
    fontFamily: FONTS.regular,
  },

  descriptionSection: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 12,
  },

  description: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    fontSize: 13,
    fontFamily: FONTS.medium,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },

  billetterieButton: {
    backgroundColor: COLORS.cta,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
   
  },

  billetterieButtonText: {

    color: COLORS.ctaText,
    fontSize: 14,
    fontFamily: FONTS.bold,
    
  },

  annonceurButton: {
    backgroundColor: COLORS.cta,
    borderWidth: 0,
    borderColor: COLORS.cta,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },

  annonceurButtonText: {
    color: COLORS.ctaText,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },

  warningBox: {
    backgroundColor: COLORS.cta,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },

  warningText: {
    color: "#856404",
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    textAlign: "center",
  },
});
