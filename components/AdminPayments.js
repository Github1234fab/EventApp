// components/AdminPayments.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ADMIN_UIDS, COLORS, FONTS } from '../Config';

export default function AdminPayments({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Vérification admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const isAdmin = currentUser?.uid ? ADMIN_UIDS.includes(currentUser.uid) : false;

  // Protection : accès refusé si pas admin
  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>❌ Accès refusé</Text>
        <Text style={styles.errorText}>Vous n'avez pas les droits d'administrateur.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Statistiques des Paiements</Text>
      <Text style={styles.subtitle}>Cette fonctionnalité sera développée prochainement.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.danger,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textGray,
    textAlign: 'center',
  },
});