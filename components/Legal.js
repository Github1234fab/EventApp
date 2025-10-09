// components/Legal.js
import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";

export default function Legal() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Conditions Générales d'Utilisation</Text>
      <Text style={styles.date}>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Contenu des annonces</Text>
        <Text style={styles.text}>
          En publiant une annonce sur notre plateforme, vous vous engagez à respecter les règles suivantes :
        </Text>
        <Text style={styles.bulletPoint}>• Les images doivent être libres de droits ou dont vous détenez les droits d'utilisation</Text>
        <Text style={styles.bulletPoint}>• Aucun contenu à caractère pornographique, violent ou choquant</Text>
        <Text style={styles.bulletPoint}>• Aucune insulte, propos haineux ou discriminatoires</Text>
        <Text style={styles.bulletPoint}>• Aucun contenu incitant à la haine raciale, religieuse ou à caractère discriminatoire</Text>
        <Text style={styles.bulletPoint}>• Les informations doivent être exactes et non trompeuses</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Modération</Text>
        <Text style={styles.text}>
          Toutes les annonces sont soumises à une modération avant publication. Nous nous réservons le droit de refuser ou supprimer toute annonce ne respectant pas ces conditions, sans remboursement.
        </Text>
        <Text style={styles.text}>
          Notre équipe peut modifier votre annonce si elle ne respecte pas nos conditions, afin de la rendre conforme.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Paiement</Text>
        <Text style={styles.text}>
          Le paiement de 1€ par annonce est définitif et non remboursable, sauf en cas d'erreur technique de notre part. Ce montant couvre les frais de modération et d'hébergement.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Protection des données (RGPD)</Text>
        <Text style={styles.text}>
          Conformément au Règlement Général sur la Protection des Données (RGPD), nous collectons et traitons vos données personnelles pour :
        </Text>
        <Text style={styles.bulletPoint}>• La création et gestion de votre compte</Text>
        <Text style={styles.bulletPoint}>• Le traitement de vos paiements via Stripe</Text>
        <Text style={styles.bulletPoint}>• L'affichage de vos annonces publiques</Text>
        
        <Text style={styles.subtitle}>Données collectées :</Text>
        <Text style={styles.bulletPoint}>• Email (pour l'authentification et le contact)</Text>
        <Text style={styles.bulletPoint}>• Informations de paiement (traitées par Stripe)</Text>
        <Text style={styles.bulletPoint}>• Contenu des annonces (titre, description, images, lieu, date)</Text>
        
        <Text style={styles.subtitle}>Vos droits :</Text>
        <Text style={styles.bulletPoint}>• Droit d'accès à vos données</Text>
        <Text style={styles.bulletPoint}>• Droit de rectification</Text>
        <Text style={styles.bulletPoint}>• Droit à l'effacement (droit à l'oubli)</Text>
        <Text style={styles.bulletPoint}>• Droit d'opposition au traitement</Text>
        <Text style={styles.bulletPoint}>• Droit à la portabilité des données</Text>
        
        <Text style={styles.text}>
          Pour exercer vos droits, contactez-nous à : support@votre-app.com
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Conservation des données</Text>
        <Text style={styles.text}>
          Vos données sont conservées pendant la durée de vie de votre compte et 3 ans après la suppression pour des raisons légales et comptables.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Propriété intellectuelle</Text>
        <Text style={styles.text}>
          Vous conservez tous les droits sur le contenu que vous publiez. Vous nous accordez une licence d'utilisation pour afficher vos annonces sur notre plateforme.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Responsabilité</Text>
        <Text style={styles.text}>
          Nous ne sommes pas responsables du contenu des annonces publiées par les utilisateurs. Chaque annonceur est responsable de la véracité et de la légalité de son contenu.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Contact</Text>
        <Text style={styles.text}>
          Pour toute question concernant ces conditions ou vos données personnelles :
        </Text>
        <Text style={styles.text}>Email : support@votre-app.com</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          En utilisant notre application, vous acceptez ces conditions générales d'utilisation et notre politique de confidentialité.
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 6,
    paddingLeft: 8,
  },
  footer: {
    backgroundColor: "#FFF3CD",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
    textAlign: "center",
    fontWeight: "500",
  },
});