// components/Firebase-rendu.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "./Firebase";
import { collection, getDocs } from "firebase/firestore";
import Card from "./Card";
import dayjs from "dayjs";

export default function EventsList({navigation}) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedLieu, setSelectedLieu] = useState("Tous");
  const [selectedDateFilter, setSelectedDateFilter] = useState("Toutes");

  const [categories, setCategories] = useState([]);
  const [lieux, setLieux] = useState([]);

  // 🔹 Charger les événements depuis Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "BDDjson"));
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(eventsData);
        setFilteredEvents(eventsData);

        // Récup catégories uniques
        setCategories([...new Set(eventsData.map((e) => e.catégorie))]);

        // Récup lieux uniques
        setLieux([...new Set(eventsData.map((e) => e.lieu))]);
      } catch (error) {
        console.error("Erreur Firestore :", error);
      }
    };

    fetchEvents();
  }, []);

  // 🔹 Appliquer les filtres
  useEffect(() => {
    let filtered = [...events];

    // Filtre catégorie
    if (selectedCategory !== "Toutes") {
      filtered = filtered.filter((e) => e.catégorie === selectedCategory);
    }

    // Filtre lieu
    if (selectedLieu !== "Tous") {
      filtered = filtered.filter((e) => e.lieu === selectedLieu);
    }

    // Filtre date
    if (selectedDateFilter !== "Toutes") {
      const now = dayjs();

      filtered = filtered.filter((e) => {
        const eventDate = dayjs(e.date);

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
      <Text style={styles.header}>🎭 Liste des évènements :</Text>

      {/* 🔹 Filtres */}
      <View style={styles.filters}>
        {/* Catégorie */}
        <Picker selectedValue={selectedCategory} onValueChange={(itemValue) => setSelectedCategory(itemValue)} style={styles.picker}>
          <Picker.Item label="Toutes catégories" value="Toutes" />
          {categories.map((cat, index) => (
            <Picker.Item key={index} label={cat} value={cat} />
          ))}
        </Picker>

        {/* Lieu */}
        <Picker selectedValue={selectedLieu} onValueChange={(itemValue) => setSelectedLieu(itemValue)} style={styles.picker}>
          <Picker.Item label="Tous lieux" value="Tous" />
          {lieux.map((lieu, index) => (
            <Picker.Item key={index} label={lieu} value={lieu} />
          ))}
        </Picker>

        {/* Date */}
        <Picker selectedValue={selectedDateFilter} onValueChange={(itemValue) => setSelectedDateFilter(itemValue)} style={styles.picker}>
          <Picker.Item label="Toutes dates" value="Toutes" />
          <Picker.Item label="Aujourd'hui" value="Aujourd'hui" />
          <Picker.Item label="Cette semaine" value="Cette semaine" />
          <Picker.Item label="Ce mois" value="Ce mois" />
          <Picker.Item label="Cette année" value="Cette année" />
        </Picker>

        {/* Bouton pour réinitialiser */}
<Button
  title="Réinitialiser les filtres"
  onPress={() => {
    setSelectedCategory("Toutes");
    setSelectedLieu("Tous");
    setSelectedDateFilter("Toutes");
  }}
/>
      </View>

      {/* 🔹 Liste des events */}
      <FlatList
  data={filteredEvents}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <Card
      titre={item.titre}
      tarif={item.tarif}
      image={item.image}
      description={item.description}
      lieu={item.lieu}
      date={item.date}
      event={item} navigation={navigation}// 👈 placé ici
    />
  )}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  filters: {
    marginBottom: 10,
  },
  picker: {
    marginVertical: 5,
    backgroundColor: "#fff",
  },
});
