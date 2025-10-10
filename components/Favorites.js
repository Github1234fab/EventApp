// components/Favorites.js
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from "./Card";
import { COLORS, FONTS } from '../Config';

export default function Favorites({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Charger les favoris au montage et lors du focus
  useEffect(() => {
    loadFavorites();

    // Écouter le focus de l'écran pour recharger les favoris
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem('favorites');
      if (favoritesData) {
        const favArray = JSON.parse(favoritesData);
        setFavorites(favArray);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <Ionicons name="heart-outline" size={64} color={COLORS.cta} style={{ marginBottom: 16 }} />
        <Text style={styles.loaderText}>Chargement de vos favoris...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-dislike-outline" size={80} color={COLORS.textGray} style={{ marginBottom: 16 }} />
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptyText}>
            Tapez sur le cœur ❤️ d'un événement pour l'ajouter à vos favoris.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate("EventsList")}
          >
            <Ionicons name="search" size={20} color={COLORS.ctaText} style={{ marginRight: 8 }} />
            <Text style={styles.exploreButtonText}>
              Explorer les événements
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              {/* <Ionicons name="heart" size={24} color="#e74c3c" style={{ marginRight: 8 }} /> */}
              <View>
                {/* <Text style={styles.headerTitle}>Mes favoris</Text> */}
                <Text style={styles.headerSubtitle}>
                  {favorites.length} événement{favorites.length > 1 ? "s" : ""} sauvegardé{favorites.length > 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          </View>
          <FlatList
            data={favorites}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            renderItem={({ item }) => (
              <Card event={item} navigation={navigation} />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.cta]}
                tintColor={COLORS.cta}
              />
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  loaderText: {
    marginTop: 8,
    color: COLORS.textGray,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  header: {
    backgroundColor: COLORS.lightBg,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textGray,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 8,
    color: COLORS.textDark,
  },
  emptyText: {
    color: COLORS.textGray,
    fontFamily: FONTS.regular,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    fontSize: 15,
  },
  exploreButton: {
    backgroundColor: COLORS.cta,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  exploreButtonText: {
    color: COLORS.ctaText,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  listContent: {
    paddingBottom: 24,
  },
});