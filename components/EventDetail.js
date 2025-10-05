// components/EventDetail.js
import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert, Share } from "react-native";
import { formatDate, formatHoraire, isPastDate } from "../utils/dateFormatter";
import useFavorites from "./useFavorites";

export default function EventDetail({ route }) {
  const { event } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite?.(event?.id);
  const eventPassed = isPastDate(event.date);

  const handleBilletterie = () => {
    if (!event.lien) {
      Alert.alert("Pas de lien", "Aucun lien de billetterie disponible pour cet événement.");
      return;
    }

    // Ajouter https:// si manquant
    let url = event.lien;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    Linking.openURL(url).catch(() => {
      Alert.alert("Erreur", "Impossible d'ouvrir le lien de billetterie.");
    });
  };

  const handleShare = async () => {
    try {
      const message = `📅 ${event.titre}\n\n📍 ${event.lieu}\n🗓️ ${formatDate(event.date, "long")}\n${event.horaire ? `🕒 ${formatHoraire(event.horaire)}\n` : ""}${event.tarif ? `💶 ${event.tarif}\n` : ""}\n${event.lien ? `🎟️ ${event.lien}` : ""}`;

      await Share.share({
        message: message,
        title: event.titre,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Image avec badges */}
      <View style={styles.imageContainer}>
        {event.image ? (
          <Image source={{ uri: event.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Text style={styles.noImageText}>📷 Pas d'image</Text>
          </View>
        )}

        {/* Badge événement passé */}
        {eventPassed && (
          <View style={styles.passedBadge}>
            <Text style={styles.passedBadgeText}>Événement terminé</Text>
          </View>
        )}

        {/* Boutons flottants */}
        <View style={styles.floatingButtons}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => toggleFavorite(event)}
          >
            <Text style={styles.floatingButtonIcon}>{fav ? "♥" : "♡"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.floatingButton} onPress={handleShare}>
            <Text style={styles.floatingButtonIcon}>↗</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        {/* Catégorie */}
        {event.catégorie && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.catégorie}</Text>
          </View>
        )}

        {/* Titre */}
        <Text style={styles.title}>{event.titre || "Sans titre"}</Text>

        {/* Informations principales */}
        <View style={styles.infoSection}>
          {event.date && (
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>📅</Text>
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={[styles.infoValue, eventPassed && styles.infoValuePassed]}>
                  {formatDate(event.date, "long")}
                  {eventPassed && " (Passé)"}
                </Text>
              </View>
            </View>
          )}

          {event.horaire && (
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>🕒</Text>
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Horaire</Text>
                <Text style={styles.infoValue}>{formatHoraire(event.horaire)}</Text>
              </View>
            </View>
          )}

          {event.lieu && (
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>📍</Text>
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Lieu</Text>
                <Text style={styles.infoValue}>{event.lieu}</Text>
              </View>
            </View>
          )}

          {event.tarif && (
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>💶</Text>
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
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
        )}

        {/* Bouton billetterie */}
        {event.lien && (
          <TouchableOpacity style={styles.billetterieButton} onPress={handleBilletterie}>
            <Text style={styles.billetterieButtonText}>🎟️ Réserver / Billetterie</Text>
          </TouchableOpacity>
        )}

        {/* Message si événement passé */}
        {eventPassed && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Cet événement est déjà passé
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
    backgroundColor: "#f9f9f9",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#e0e0e0",
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    fontSize: 48,
    opacity: 0.3,
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
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingButtonIcon: {
    fontSize: 24,
    color: "#e0245e",
  },
  content: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    lineHeight: 36,
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  infoValuePassed: {
    color: "#999",
    fontStyle: "italic",
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  billetterieButton: {
    backgroundColor: "#34C759",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  billetterieButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  warningBox: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});