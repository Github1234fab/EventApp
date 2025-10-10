// // components/EventList.js
// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, StyleSheet, Button } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { db } from "./Firebase";
// import { collection, getDocs } from "firebase/firestore";
// import Card from "./Card";
// import dayjs from "dayjs";
// import { ADMIN_UIDS } from "../App";

// import { signOut } from "firebase/auth";
// import { auth } from "./Firebase";

// console.log("UID courant:", auth.currentUser?.uid);
// console.log("Liste admin:", ADMIN_UIDS);

// export default function EventsList({ navigation }) {
//   const [events, setEvents] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);

//   const [selectedCategory, setSelectedCategory] = useState("Toutes");
//   const [selectedLieu, setSelectedLieu] = useState("Tous");
//   const [selectedDateFilter, setSelectedDateFilter] = useState("Toutes");

//   const [categories, setCategories] = useState([]);
//   const [lieux, setLieux] = useState([]);

//   // 🔹 Charger les événements depuis Firestore
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "BDDjson"));
//         const eventsData = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setEvents(eventsData);
//         setFilteredEvents(eventsData);

//         // ✅ Catégories uniques (on retire null/undefined/"", on trim + tri)
//         const cats = Array.from(
//           new Set(
//             eventsData
//               .map((e) => (e?.catégorie || "").trim())
//               .filter(Boolean)
//           )
//         ).sort((a, b) => a.localeCompare(b));
//         setCategories(cats);

//         // ✅ Lieux uniques (on retire null/undefined/"", on trim + tri)
//         const lieuxUnique = Array.from(
//           new Set(
//             eventsData
//               .map((e) => (e?.lieu || "").trim())
//               .filter(Boolean)
//           )
//         ).sort((a, b) => a.localeCompare(b));
//         setLieux(lieuxUnique);
//       } catch (error) {
//         console.error("Erreur Firestore :", error);
//       }
//     };

//     fetchEvents();
//   }, []);

//   // 🔹 Appliquer les filtres
//   useEffect(() => {
//     let filtered = [...events];

//     // ✅ Filtre catégorie (protégé)
//     if (selectedCategory !== "Toutes") {
//       filtered = filtered.filter(
//         (e) => (e?.catégorie || "").trim() === selectedCategory
//       );
//     }

//     // ✅ Filtre lieu (protégé)
//     if (selectedLieu !== "Tous") {
//       filtered = filtered.filter(
//         (e) => (e?.lieu || "").trim() === selectedLieu
//       );
//     }

//     // ✅ Filtre date (protégé)
//     if (selectedDateFilter !== "Toutes") {
//       const now = dayjs();

//       filtered = filtered.filter((e) => {
//         if (!e?.date) return false;
//         const eventDate = dayjs(e.date);
//         if (!eventDate.isValid()) return false;

//         switch (selectedDateFilter) {
//           case "Aujourd'hui":
//             return eventDate.isSame(now, "day");
//           case "Cette semaine":
//             return eventDate.isSame(now, "week");
//           case "Ce mois":
//             return eventDate.isSame(now, "month");
//           case "Cette année":
//             return eventDate.isSame(now, "year");
//           default:
//             return true;
//         }
//       });
//     }

//     setFilteredEvents(filtered);
//   }, [selectedCategory, selectedLieu, selectedDateFilter, events]);

//   console.log("[EventList] uid:", auth.currentUser?.uid);

//   return (
//     <View style={styles.container}>
//       <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
//         <Button title="Se déconnecter" onPress={() => signOut(auth)} />
//       </View>

//       {/* 🔹 Accès rapide : Nouvelle annonce / Mes annonces */}
//       <View style={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8 }}>
//         <Button
//           title="➕ Créer une annonce"
//           onPress={() => navigation.navigate("NewAd")}
//         />
//         <Button
//           title="📁 Mes annonces"
//           onPress={() => navigation.navigate("MyAds")}
//         />
//       </View>
//       <Button title="❤️ Mes favoris" onPress={() => navigation.navigate("Favorites")} />

//       {ADMIN_UIDS?.includes(auth.currentUser?.uid) && (
//         <View style={{ paddingHorizontal: 16, paddingTop: 4 }}>
//           <Button
//             title="🛡️ Modération"
//             onPress={() => navigation.navigate("AdminModeration")}
//           />
//         </View>
//       )}

//       <Text style={styles.header}>🎭 Liste des évènements :</Text>

//       {/* 🔹 Filtres */}
//       <View style={styles.filters}>
//         {/* Catégorie */}
//         <Picker
//           selectedValue={selectedCategory}
//           onValueChange={(itemValue) => setSelectedCategory(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Toutes catégories" value="Toutes" />
//           {categories.map((cat, index) => (
//             <Picker.Item key={index} label={cat} value={cat} />
//           ))}
//         </Picker>

//         {/* Lieu */}
//         <Picker
//           selectedValue={selectedLieu}
//           onValueChange={(itemValue) => setSelectedLieu(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Tous lieux" value="Tous" />
//           {lieux.map((lieu, index) => (
//             <Picker.Item key={index} label={lieu} value={lieu} />
//           ))}
//         </Picker>

//         {/* Date */}
//         <Picker
//           selectedValue={selectedDateFilter}
//           onValueChange={(itemValue) => setSelectedDateFilter(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Toutes dates" value="Toutes" />
//           <Picker.Item label="Aujourd'hui" value="Aujourd'hui" />
//           <Picker.Item label="Cette semaine" value="Cette semaine" />
//           <Picker.Item label="Ce mois" value="Ce mois" />
//           <Picker.Item label="Cette année" value="Cette année" />
//         </Picker>

//         {/* Bouton pour réinitialiser */}
//         <Button
//           title="Réinitialiser les filtres"
//           onPress={() => {
//             setSelectedCategory("Toutes");
//             setSelectedLieu("Tous");
//             setSelectedDateFilter("Toutes");
//           }}
//         />
//       </View>

//       {/* 🔹 Liste des events */}
//       <FlatList
//         data={filteredEvents}
//         keyExtractor={(item) => item.id?.toString?.() ?? String(item.id)}
//         renderItem={({ item }) => (
//           <Card event={item} navigation={navigation} />
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 40,
//     backgroundColor: "#f9f9f9",
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   filters: {
//     marginBottom: 10,
//   },
//   picker: {
//     marginVertical: 5,
//     backgroundColor: "#fff",
//   },
// });

//******************************* */ NOUVEL UI  ***************************************

//components/EventList.js

// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { db } from "./Firebase";
// import { collection, getDocs } from "firebase/firestore";
// import Card from "./Card";
// import dayjs from "dayjs";
// import { ADMIN_UIDS } from "../App";

// import { signOut } from "firebase/auth";
// import { auth } from "./Firebase";

// console.log("UID courant:", auth.currentUser?.uid);
// console.log("Liste admin:", ADMIN_UIDS);

// export default function EventsList({ navigation }) {
//   const [events, setEvents] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);

//   const [selectedCategory, setSelectedCategory] = useState("Toutes");
//   const [selectedLieu, setSelectedLieu] = useState("Tous");
//   const [selectedDateFilter, setSelectedDateFilter] = useState("Toutes");

//   const [categories, setCategories] = useState([]);
//   const [lieux, setLieux] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);

//   // 🔹 Charger les événements depuis Firestore
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "Submissions"));
//         const eventsData = querySnapshot.docs
//           .map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }))
//           // ✅ Afficher uniquement les annonces payées et approuvées
//           .filter((event) => event.paid === true && event.status === "approved");

//         setEvents(eventsData);
//         setFilteredEvents(eventsData);

//         // ✅ Catégories uniques (on retire null/undefined/"", on trim + tri)
//         const cats = Array.from(new Set(eventsData.map((e) => (e?.catégorie || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
//         setCategories(cats);

//         // ✅ Lieux uniques (on retire null/undefined/"", on trim + tri)
//         const lieuxUnique = Array.from(new Set(eventsData.map((e) => (e?.lieu || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
//         setLieux(lieuxUnique);
//       } catch (error) {
//         console.error("Erreur Firestore :", error);
//       }
//     };

//     fetchEvents();
//   }, []);

//   // 🔹 Appliquer les filtres
//   useEffect(() => {
//     let filtered = [...events];

//     // ✅ Filtre catégorie (protégé)
//     if (selectedCategory !== "Toutes") {
//       filtered = filtered.filter((e) => (e?.catégorie || "").trim() === selectedCategory);
//     }

//     // ✅ Filtre lieu (protégé)
//     if (selectedLieu !== "Tous") {
//       filtered = filtered.filter((e) => (e?.lieu || "").trim() === selectedLieu);
//     }

//     // ✅ Filtre date (protégé)
//     if (selectedDateFilter !== "Toutes") {
//       const now = dayjs();

//       filtered = filtered.filter((e) => {
//         if (!e?.date) return false;
//         const eventDate = dayjs(e.date);
//         if (!eventDate.isValid()) return false;

//         switch (selectedDateFilter) {
//           case "Aujourd'hui":
//             return eventDate.isSame(now, "day");
//           case "Cette semaine":
//             return eventDate.isSame(now, "week");
//           case "Ce mois":
//             return eventDate.isSame(now, "month");
//           case "Cette année":
//             return eventDate.isSame(now, "year");
//           default:
//             return true;
//         }
//       });
//     }

//     setFilteredEvents(filtered);
//   }, [selectedCategory, selectedLieu, selectedDateFilter, events]);

//   console.log("[EventList] uid:", auth.currentUser?.uid);

//   return (
//     <View style={styles.container}>
//       {/* 🔹 Barre d'actions compacte */}
//       <View style={styles.topBar}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
//           <TouchableOpacity style={styles.compactButton} onPress={() => navigation.navigate("NewAd")}>
//             <Text style={styles.buttonText}>➕ Créer</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.compactButton} onPress={() => navigation.navigate("MyAds")}>
//             <Text style={styles.buttonText}>📁 Mes annonces</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.compactButton} onPress={() => navigation.navigate("MyPayments")}>
//             <Text style={styles.buttonText}>💳 Paiements</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.compactButton} onPress={() => navigation.navigate("Favorites")}>
//             <Text style={styles.buttonText}>❤️ Favoris</Text>
//           </TouchableOpacity>

//           {ADMIN_UIDS?.includes(auth.currentUser?.uid) && (
//             <TouchableOpacity style={styles.compactButton} onPress={() => navigation.navigate("AdminModeration")}>
//               <Text style={styles.buttonText}>🛡️ Admin</Text>
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity style={[styles.compactButton, styles.logoutButton]} onPress={() => signOut(auth)}>
//             <Text style={styles.buttonText}>🚪 Déco</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </View>

//       {/* 🔹 Header avec bouton filtres */}
//       <View style={styles.headerContainer}>
//         <Text style={styles.header}>🎭 Évènements</Text>
//         <TouchableOpacity style={styles.filterToggle} onPress={() => setShowFilters(!showFilters)}>
//           <Text style={styles.filterToggleText}>{showFilters ? "✕ Fermer" : "🔍 Filtres"}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* 🔹 Filtres (affichés conditionnellement) */}
//       {showFilters && (
//         <View style={styles.filters}>
//           <Picker selectedValue={selectedCategory} onValueChange={(itemValue) => setSelectedCategory(itemValue)} style={styles.picker}>
//             <Picker.Item label="Toutes catégories" value="Toutes" />
//             {categories.map((cat, index) => (
//               <Picker.Item key={index} label={cat} value={cat} />
//             ))}
//           </Picker>

//           <Picker selectedValue={selectedLieu} onValueChange={(itemValue) => setSelectedLieu(itemValue)} style={styles.picker}>
//             <Picker.Item label="Tous lieux" value="Tous" />
//             {lieux.map((lieu, index) => (
//               <Picker.Item key={index} label={lieu} value={lieu} />
//             ))}
//           </Picker>

//           <Picker selectedValue={selectedDateFilter} onValueChange={(itemValue) => setSelectedDateFilter(itemValue)} style={styles.picker}>
//             <Picker.Item label="Toutes dates" value="Toutes" />
//             <Picker.Item label="Aujourd'hui" value="Aujourd'hui" />
//             <Picker.Item label="Cette semaine" value="Cette semaine" />
//             <Picker.Item label="Ce mois" value="Ce mois" />
//             <Picker.Item label="Cette année" value="Cette année" />
//           </Picker>

//           <TouchableOpacity
//             style={styles.resetButton}
//             onPress={() => {
//               setSelectedCategory("Toutes");
//               setSelectedLieu("Tous");
//               setSelectedDateFilter("Toutes");
//             }}
//           >
//             <Text style={styles.resetButtonText}>↻ Réinitialiser</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* 🔹 Liste des events */}
//       <FlatList data={filteredEvents} keyExtractor={(item) => item.id?.toString?.() ?? String(item.id)} renderItem={({ item }) => <Card event={item} navigation={navigation} />} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 40,
//     backgroundColor: "#f9f9f9",
//   },
//   topBar: {
//     backgroundColor: "#fff",
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   actionsRow: {
//     flexDirection: "row",
//     paddingHorizontal: 12,
//     gap: 8,
//   },
//   compactButton: {
//     backgroundColor: "#007AFF",
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logoutButton: {
//     backgroundColor: "#FF3B30",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   headerContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   filterToggle: {
//     backgroundColor: "#34C759",
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   filterToggleText: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   filters: {
//     backgroundColor: "#fff",
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   picker: {
//     marginVertical: 4,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 8,
//   },
//   resetButton: {
//     backgroundColor: "#FF9500",
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginTop: 8,
//     alignItems: "center",
//   },
//   resetButtonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });

//******************************* */ AVEC BARRE NAV + POUR CONTACT ...  ***************************************

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db, auth } from "./Firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Card from "./Card";
import dayjs from "dayjs";
import { ADMIN_UIDS, COLORS, FONTS } from "../Config";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

export default function EventsList({ navigation }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedLieu, setSelectedLieu] = useState("Tous");
  const [selectedDateFilter, setSelectedDateFilter] = useState("Toutes");
  const [categories, setCategories] = useState([]);
  const [lieux, setLieux] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const isAdmin = currentUser?.uid ? ADMIN_UIDS.includes(currentUser.uid) : false;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Submissions"));
        const eventsData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((event) => event.paid === true && event.status === "approved")
          .filter((event) => {
            if (!event.date) return true;
            const eventDate = dayjs(event.date);
            return eventDate.isAfter(dayjs(), "day") || eventDate.isSame(dayjs(), "day");
          })
          .sort((a, b) => {
            if (!a.date) return 1;
            if (!b.date) return -1;
            return dayjs(a.date).diff(dayjs(b.date));
          });

        setEvents(eventsData);
        setFilteredEvents(eventsData);

        const cats = Array.from(new Set(eventsData.map((e) => (e?.catégorie || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
        setCategories(cats);

        const lieuxUnique = Array.from(new Set(eventsData.map((e) => (e?.lieu || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
        setLieux(lieuxUnique);
      } catch (error) {
        console.error("Erreur Firestore :", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...events];
    if (selectedCategory !== "Toutes") {
      filtered = filtered.filter((e) => (e?.catégorie || "").trim() === selectedCategory);
    }
    if (selectedLieu !== "Tous") {
      filtered = filtered.filter((e) => (e?.lieu || "").trim() === selectedLieu);
    }
    if (selectedDateFilter !== "Toutes") {
      const now = dayjs();
      filtered = filtered.filter((e) => {
        if (!e?.date) return false;
        const eventDate = dayjs(e.date);
        if (!eventDate.isValid()) return false;
        switch (selectedDateFilter) {
          case "Aujourd'hui":
            return eventDate.isSame(now, "day");
          case "Cette semaine":
            return eventDate.isSame(now, "week");
          case "Ce mois":
            return eventDate.isSame(now, "month");
          case "Cette année":
            return eventDate.isSame(now, "year");
          default:
            return true;
        }
      });
    }
    setFilteredEvents(filtered);
  }, [selectedCategory, selectedLieu, selectedDateFilter, events]);

  return (
    <View style={styles.container}>
      {/* Barre supérieure avec boutons d'actions */}
      <View style={styles.topBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
          <TouchableOpacity style={styles.compactButton} onPress={() => navigation.navigate("NewAd")}>
            <Text style={styles.buttonText}> Créer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.compactButton} onPress={() => navigation.navigate("MyAds")}>
            <Text style={styles.buttonText}> Mes Annonces</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.compactButton} onPress={() => navigation.navigate("MyPayments")}>
            <Text style={styles.buttonText}> Paiements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.compactButton} onPress={() => navigation.navigate("Favorites")}>
            <Text style={styles.buttonText}> Favoris</Text>
          </TouchableOpacity>

          {isAdmin && (
            <>
              <TouchableOpacity style={styles.compactButton} onPress={() => navigation.navigate("AdminModeration")}>
                <Text style={styles.buttonText}> Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.compactButton} onPress={() => navigation.navigate("AdminPayments")}>
                <Text style={styles.buttonText}> Stats</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={() => signOut(auth)}>
            <Text style={styles.buttonText}> Déconnexion</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* En-tête avec titre et bouton filtres */}
      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }} />
        <BlurView intensity={50} tint="light" style={styles.blurButton}>
          <TouchableOpacity style={styles.filterToggle} onPress={() => setShowFilters(!showFilters)}>
            {showFilters ? (
              <View style={styles.filterButtonContent}>
                <Ionicons name="close" size={16} color={COLORS.ctaText} />
                <Text style={styles.filterToggleText}>Fermer</Text>
              </View>
            ) : (
              <View style={styles.filterButtonContent}>
                <Ionicons name="search" size={16} color={COLORS.ctaText} />
                <Text style={styles.filterToggleText}>Filtres</Text>
              </View>
            )}
          </TouchableOpacity>
        </BlurView>
      </View>
      {/* Zone des filtres */}
      {showFilters && (
        <View style={styles.filters}>
          <Text style={styles.filterLabel}>Catégorie</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={selectedCategory} onValueChange={(itemValue) => setSelectedCategory(itemValue)} style={styles.picker}>
              <Picker.Item label="Toutes catégories" value="Toutes" />
              {categories.map((cat, index) => (
                <Picker.Item key={index} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          <Text style={styles.filterLabel}>Lieu</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={selectedLieu} onValueChange={(itemValue) => setSelectedLieu(itemValue)} style={styles.picker}>
              <Picker.Item label="Tous lieux" value="Tous" />
              {lieux.map((lieu, index) => (
                <Picker.Item key={index} label={lieu} value={lieu} />
              ))}
            </Picker>
          </View>

          <Text style={styles.filterLabel}>Date</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={selectedDateFilter} onValueChange={(itemValue) => setSelectedDateFilter(itemValue)} style={styles.picker}>
              <Picker.Item label="Toutes dates" value="Toutes" />
              <Picker.Item label="Aujourd'hui" value="Aujourd'hui" />
              <Picker.Item label="Cette semaine" value="Cette semaine" />
              <Picker.Item label="Ce mois" value="Ce mois" />
              <Picker.Item label="Cette année" value="Cette année" />
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSelectedCategory("Toutes");
              setSelectedLieu("Tous");
              setSelectedDateFilter("Toutes");
            }}
          >
            <Text style={styles.resetButtonText}>↻ Réinitialiser les filtres</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Liste des événements */}
      <FlatList data={filteredEvents} keyExtractor={(item) => item.id?.toString?.() ?? String(item.id)} renderItem={({ item }) => <Card event={item} navigation={navigation} />} contentContainerStyle={styles.listContent} />

      {/* Bouton flottant menu + */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setShowMenu(true)}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal menu */}
      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Menu</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                navigation.navigate("Contact");
              }}
            >
              <Text style={styles.menuIcon}>✉️</Text>
              <Text style={styles.menuText}>Nous écrire</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                navigation.navigate("Legal");
              }}
            >
              <Text style={styles.menuIcon}>📄</Text>
              <Text style={styles.menuText}>CGU & RGPD</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemClose]} onPress={() => setShowMenu(false)}>
              <View style={styles.crossContainer}>
                <Text style={styles.menuIconCross}>✕</Text>
              </View>
              <Text style={styles.menuText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    background: "linear-gradient(to right, #ff7e5f, #feb47b)",
  },

  // Barre supérieure
  topBar: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    borderTopWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionsRow: {
    paddingHorizontal: 12,
    gap: 10,
    alignItems: "center",
  },
  compactButton: {
    backgroundColor: COLORS.cta, // caramel doux
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: "rgba(0,0,0,0.1)", // ombre légère, soft
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutButton: {
    backgroundColor: COLORS.danger, // rouge doux
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    fontFamily: FONTS.medium,
    color: COLORS.ctaText,
    fontSize: 12,
    fontWeight: "600",
  },

  // En-tête
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "transparent",
    flexDirection: "row-reverse",
  },
  // header: {
  //   fontSize: 26,
  //   fontWeight: 'bold',
  //   color: COLORS.text,
  // },
  blurButton: {
    borderRadius: 10,
    overflow: "hidden", // important pour que le flou reste dans la forme
    alignSelf: "flex-end",
    marginRight: 16,
  },
  filterToggle: {
    backgroundColor: COLORS.ctaSecondary,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterToggleText: {
    fontFamily: FONTS.medium,
    color: COLORS.ctaText,
    fontSize: 12,
    fontWeight: "600",
  },

  // Filtres
  filters: {
    padding: 16,
    backgroundColor: COLORS.lightBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 8,
  },
  pickerWrapper: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginBottom: 8,
  },
  picker: {
    height: 50,
    color: COLORS.textDark,
  },
  resetButton: {
    backgroundColor: COLORS.cta,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  resetButtonText: {
    color: COLORS.ctaText,
    fontWeight: "600",
    fontSize: 15,
  },

  // Liste
  listContent: {
    paddingBottom: 80,
  },

  // Bouton flottant
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 32,
    backgroundColor: COLORS.ctaSecondary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  floatingButtonText: {
    color: COLORS.ctaText,
    fontSize: 26,
    fontWeight: "bold",
    lineHeight: 40,
  },

  // Modal menu
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 8,
    width: "85%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  menuTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center", // 👈 Gardez seulement un
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  menuItemClose: {
    borderBottomWidth: 0,
    backgroundColor: COLORS.lightBg,
    borderRadius: 8,
    marginTop: 8,
  },

  // Container rond pour la croix
  crossContainer: {
    width: 34,
    height: 34,
    borderRadius: 50,
    backgroundColor: COLORS.danger, // Rouge
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    
  },

  menuIconCross: {
    fontSize: 16,
    color: COLORS.ctaText,
    fontFamily: FONTS.bold,
   
  },
  menuIcon: {
    marginRight: 12,
    fontSize: 20,
  },
});
