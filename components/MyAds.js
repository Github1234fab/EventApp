// components/MyAds.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { auth, db } from "./Firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default function MyAds() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const run = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(
        collection(db, "Submissions"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    run();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Mes annonces</Text>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.titre}</Text>
            <Text>{item.date} • {item.lieu}</Text>
            <Text style={{ marginTop: 4 }}>Statut : {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 16 }}>Aucune annonce pour le moment.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16, paddingHorizontal: 16 },
  h1: { fontSize: 20, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 10, boxShadow: "0px 2px 6px rgba(0,0,0,0.1)" },
  title: { fontWeight: "bold", fontSize: 16 },
});
