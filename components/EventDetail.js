import React from "react";
import { View, Text, Image, Button, ScrollView, Linking } from "react-native";

export default function EventDetail({ route }) {
  const { event } = route.params;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9", padding: 16 }} contentContainerStyle={{ paddingBottom: 40 }}>
      {event.image && (
        <Image
          source={{ uri: event.image }}
          style={{ width: "100%", height: 200, borderRadius: 12 }}
        />
      )}

      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}>
        {event.titre}
      </Text>

      <Text style={{ fontSize: 16, marginTop: 8 }}>📍 {event.lieu}</Text>
      <Text style={{ fontSize: 16 }}>📅 {event.date}</Text>
      <Text style={{ fontSize: 16 }}>🕒 {event.horaire}</Text>
      <Text style={{ fontSize: 16 }}>💶 {event.tarif}</Text>
      <Text style={{ fontSize: 16, marginTop: 16 }}>{event.description}</Text>

      <View style={{ marginTop: 20 }}>
        <Button
          title="🎟️ Billetterie"
          onPress={() => Linking.openURL(event.lien)}
        />
      </View>
    </ScrollView>
  );
}
