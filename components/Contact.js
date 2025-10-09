// components/Contact.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import { auth } from "./Firebase";

export default function Contact() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendEmail = () => {
    const user = auth.currentUser;
    
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Champs requis", "Veuillez remplir l'objet et le message.");
      return;
    }

    const email = "support@votre-app.com";
    const userEmail = user?.email || "";
    const body = `Message de : ${userEmail}\n\n${message}`;
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert(
        "Erreur",
        "Impossible d'ouvrir l'application email. Envoyez-nous un email à : support@votre-app.com"
      );
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>✉️</Text>
        <Text style={styles.title}>Nous contacter</Text>
        <Text style={styles.subtitle}>
          Une question ? Un problème ? Écrivez-nous !
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📧 Email</Text>
        <Text style={styles.infoText}>support@votre-app.com</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formTitle}>Envoyez-nous un message</Text>
        
        <Text style={styles.label}>Objet</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Question sur mon annonce"
          value={subject}
          onChangeText={setSubject}
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Décrivez votre demande..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={6}
        />

        {auth.currentUser?.email && (
          <Text style={styles.helperText}>
            Votre email : {auth.currentUser.email}
          </Text>
        )}

        <TouchableOpacity style={styles.sendButton} onPress={handleSendEmail}>
          <Text style={styles.sendButtonText}>📧 Envoyer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.faqSection}>
        <Text style={styles.faqTitle}>Questions fréquentes</Text>
        
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>💳 Comment modifier mon annonce ?</Text>
          <Text style={styles.faqAnswer}>
            Une fois payée, votre annonce ne peut être modifiée que par notre équipe. Contactez-nous avec les modifications souhaitées.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>⏱️ Combien de temps pour la validation ?</Text>
          <Text style={styles.faqAnswer}>
            Nos modérateurs valident les annonces sous 24-48h maximum après paiement.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>💰 Puis-je être remboursé ?</Text>
          <Text style={styles.faqAnswer}>
            Les paiements ne sont pas remboursables, sauf en cas d'erreur technique de notre part.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>🔒 Mes données sont-elles sécurisées ?</Text>
          <Text style={styles.faqAnswer}>
            Oui, nous respectons le RGPD. Consultez nos CGU pour plus de détails sur la protection de vos données.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Nous répondons généralement sous 24-48 heures
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565C0",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: "#1976D2",
    fontWeight: "500",
  },
  formSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 13,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  faqSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  footer: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#856404",
    textAlign: "center",
  },
});