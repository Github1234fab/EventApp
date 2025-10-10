import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Image, Alert, ScrollView, Linking, TouchableOpacity, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db, storage } from "./Firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COLORS, FONTS } from "../Config";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");

// Listes prédéfinies
const CATEGORIES = ["Animation", "Atelier", "Autre", "Brocante", "Café Philo", "Cinéma", "Conférence", "Concert", "Danse", "Exposition", "Festival", "Lecture", "Marché", "Restaurant", "Soirée", "Sport", "Théâtre"];

const LIEUX = [
  "Aveize", "Brignais", "Brindas", "Brussieu", "Bessenay", "Chaponost", "Chazelles-sur-Lyon", "Chaussan", "Chevinay", "Coise", "Craponne", "Courzieu", "Duerne", "Francheville", "Grézieu-la-Varenne", "Grézieu-le-Marché", "L'Arbresle", "Larajasse", "Lentilly", "Messimy", "Mornant", "Montromant", "Orliénas", "Pollionnay", "Pomeys", "Riverie", "Rontalon", "Saint-Bel", "Saint-Didier-sous-Riverie", "Saint-Genis-les-Ollières", "Saint-Laurent-d'Agny", "Saint-Laurent-de-Chamousset", "Saint-Martin-en-Haut", "Saint-Pierre-la-Palud", "Saint-Symphorien-sur-Coise", "Sainte-Catherine", "Sainte-Consorce", "Sainte-Foy-l'Argentière", "Sainte-Foy-lès-Lyon", "Soucieu-en-Jarrest", "Sourcieux-les-Mines", "Taluyers", "Thurins", "Vaugneray", "Vourles", "Yzeron", "Autre",
];

const HORAIRES = ["Toute la journée", "08h00 - 12h00", "09h00 - 18h00", "10h00 - 19h00", "14h00 - 18h00", "18h00 - 22h00", "19h00 - 23h00", "20h00 - 00h00", "Personnalisé"];

// Compat API ImagePicker
const mediaTypesCompat = (ImagePicker?.MediaType && ImagePicker.MediaType.Images) || (ImagePicker?.MediaTypeOptions && ImagePicker.MediaTypeOptions.Images);

// Helper: convertir file:// → Blob via XHR
const uriToBlobXHR = (uri) =>
  new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new TypeError("Network request failed"));
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    } catch (e) {
      reject(e);
    }
  });

export default function NewAd({ navigation }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [lieu, setLieu] = useState("");
  const [lieuAutre, setLieuAutre] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [horaire, setHoraire] = useState("");
  const [horairePersonnalise, setHorairePersonnalise] = useState("");
  const [tarif, setTarif] = useState("");
  const [categorie, setCategorie] = useState("");
  const [contact, setContact] = useState("");
  const [lien, setLien] = useState("https://");
  const [lienAnnonceur, setLienAnnonceur] = useState("https://www."); // 👈 Pré-rempli

  const [imageUri, setImageUri] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [sending, setSending] = useState(false);

  // Pré-remplir le contact avec l'email du user
  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email) {
      setContact(user.email);
    }
  }, []);

  const pickImage = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        return Alert.alert("Permission requise", "Autorise l'accès à ta galerie pour choisir une image.", [
          { text: "Annuler", style: "cancel" },
          { text: "Ouvrir les réglages", onPress: () => Linking.openSettings() },
        ]);
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypesCompat,
        allowsEditing: false,
        quality: 0.9,
      });

      if (result.canceled) {
        console.log("[ImagePicker] canceled by user");
        return;
      }

      const asset = result.assets && result.assets[0];
      if (!asset?.uri) {
        Alert.alert("Erreur", "Aucune image sélectionnée.");
        return;
      }

      console.log("[ImagePicker] selected:", asset);
      setImageUri(asset.uri);
      setImageMeta({
        mimeType: asset.mimeType || null,
        fileName: asset.fileName || null,
      });
    } catch (e) {
      console.error("[ImagePicker] error:", e);
      Alert.alert("Erreur", "Impossible d'ouvrir la galerie.");
    }
  };

  const uploadImageAndGetURL = async (uri, uid) => {
    try {
      const cleanUri = (uri || "").split("?")[0];
      const m = cleanUri.match(/\.([a-zA-Z0-9]+)$/);
      const extFromUri = (m ? m[1] : "").toLowerCase();
      const ext = imageMeta?.fileName?.split(".").pop()?.toLowerCase() || extFromUri || "jpg";

      const contentType = imageMeta?.mimeType || (ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg");

      const blob = await uriToBlobXHR(uri);

      const filename = imageMeta?.fileName || `${Date.now()}.${ext}`;
      const path = `ads/${uid}/${filename}`;
      const storageRef = ref(storage, path);

      await uploadBytes(storageRef, blob, { contentType });

      try {
        blob.close && blob.close();
      } catch {}

      const url = await getDownloadURL(storageRef);
      return url;
    } catch (e) {
      console.error("[Storage upload] code:", e?.code, "message:", e?.message, "serverResponse:", e?.customData?.serverResponse);
      throw e;
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Non connecté", "Connecte-toi pour publier une annonce.");
      return;
    }
    
    const lieuFinal = lieu === "Autre" ? lieuAutre : lieu;
    const horaireFinal = horaire === "Personnalisé" ? horairePersonnalise : horaire;
    const tarifFinal = !tarif || tarif.trim() === "" || tarif === "0" ? "Gratuit" : `${tarif}€`;
    
    if (!titre || !date || !lieuFinal) {
      Alert.alert("Champs requis", "Titre, date et lieu sont obligatoires.");
      return;
    }
    
    if (!categorie) {
      Alert.alert("Catégorie requise", "Veuillez sélectionner une catégorie.");
      return;
    }

    try {
      setSending(true);
      let imageURL = "";

      if (imageUri) {
        console.log("[NewAd] uploading image:", imageUri);
        imageURL = await uploadImageAndGetURL(imageUri, user.uid);
        console.log("[NewAd] image uploaded:", imageURL);
      }

      const dateFormatted = dayjs(date).format("YYYY-MM-DD");

      const docRef = await addDoc(collection(db, "Submissions"), {
        userId: user.uid,
        titre,
        description,
        lieu: lieuFinal,
        date: dateFormatted,
        horaire: horaireFinal,
        tarif: tarifFinal,
        catégorie: categorie,
        contact: contact || user.email,
        lienBilletterie: lien && lien !== "https://" ? lien : "", // 👈 Envoyer vide si non rempli
        lienAnnonceur: lienAnnonceur && lienAnnonceur !== "https://www." ? lienAnnonceur : "", // 👈 Envoyer vide si non rempli
        image: imageURL,
        status: "pending",
        paid: false,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Soumission créée", "Procède au paiement pour finaliser.");
      navigation.navigate("PayAd", {
        submissionId: docRef.id,
        price: 100,
      });
    } catch (e) {
      Alert.alert("Erreur", e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
      <Text style={styles.h1}>Nouvelle Annonce</Text>

      <Text style={styles.legalNotice}>
        <Text style={{ fontWeight: "bold" }}>Important :</Text> Vérifiez bien toutes vos informations avant de payer. 
        Une fois le paiement effectué, vous ne pourrez plus modifier votre annonce. 
        Seule notre équipe pourra la modifier si elle ne respecte pas nos conditions de publication. 
        Le paiement ne sera pas remboursé en cas de modification ou de rejet justifié.
      </Text>

      <TextInput 
        style={styles.input} 
        placeholder="Titre *" 
        value={titre} 
        onChangeText={setTitre}
        placeholderTextColor={COLORS.textGray}
      />
      
      <TextInput 
        style={[styles.input, { height: 100 }]} 
        placeholder="Description" 
        value={description} 
        onChangeText={setDescription} 
        multiline
        placeholderTextColor={COLORS.textGray}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Catégorie *</Text>
        <Picker
          selectedValue={categorie}
          onValueChange={(itemValue) => setCategorie(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionnez une catégorie" value="" />
          {CATEGORIES.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Lieu *</Text>
        <Picker
          selectedValue={lieu}
          onValueChange={(itemValue) => setLieu(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionnez un lieu" value="" />
          {LIEUX.map((l) => (
            <Picker.Item key={l} label={l} value={l} />
          ))}
        </Picker>
      </View>

      {lieu === "Autre" && (
        <TextInput
          style={styles.input}
          placeholder="Précisez le lieu *"
          value={lieuAutre}
          onChangeText={setLieuAutre}
          placeholderTextColor={COLORS.textGray}
        />
      )}

      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Date de l'événement *</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {dayjs(date).format("dddd D MMMM YYYY")}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          locale="fr-FR"
          minimumDate={new Date()}
        />
      )}

      {showDatePicker && Platform.OS === "ios" && (
        <TouchableOpacity style={styles.buttons} onPress={() => setShowDatePicker(false)}>
          <Text style={styles.buttonText}>✓ Confirmer</Text>
        </TouchableOpacity>
      )}

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Horaire</Text>
        <Picker
          selectedValue={horaire}
          onValueChange={(itemValue) => setHoraire(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionnez un horaire" value="" />
          {HORAIRES.map((h) => (
            <Picker.Item key={h} label={h} value={h} />
          ))}
        </Picker>
      </View>

      {horaire === "Personnalisé" && (
        <TextInput
          style={styles.input}
          placeholder="Horaire personnalisé (ex: 18:00 - 22:00)"
          value={horairePersonnalise}
          onChangeText={setHorairePersonnalise}
          placeholderTextColor={COLORS.textGray}
        />
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tarif de l'événement</Text>
        <Text style={styles.helperText}>Laissez vide ou mettez 0 pour "Gratuit"</Text>
        <View style={styles.priceInputContainer}>
          <TextInput
            style={styles.priceInput}
            placeholder="0"
            value={tarif}
            onChangeText={setTarif}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textGray}
          />
          <Text style={styles.currencyLabel}>€</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contact annonceur</Text>
        <Text style={styles.helperText}>Email ou téléphone pour vous contacter</Text>
        <TextInput
          style={styles.input}
          placeholder={auth.currentUser?.email || "Email ou téléphone"}
          value={contact}
          onChangeText={setContact}
          keyboardType="email-address"
          placeholderTextColor={COLORS.textGray}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Lien billetterie (optionnel)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://exemple-billetterie.com"
          value={lien}
          onChangeText={(text) => {
            // Empêche de supprimer "https://"
            if (text.startsWith("https://")) {
              setLien(text);
            } else if (text.length === 0) {
              setLien("https://");
            }
          }}
          onFocus={() => {
            // Place le curseur après "https://" au focus
            if (lien === "https://") {
              // Le curseur sera à la fin automatiquement
            }
          }}
          keyboardType="url"
          autoCapitalize="none"
          placeholderTextColor={COLORS.textGray}
        />
        <Text style={styles.helperText}>
          Ex: https://fnacspectacles.com ou https://ticketmaster.fr
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Site web de l'annonceur (optionnel)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://www.mon-site.com"
          value={lienAnnonceur}
          onChangeText={(text) => {
            // Empêche de supprimer "https://www."
            if (text.startsWith("https://www.")) {
              setLienAnnonceur(text);
            } else if (text.length === 0) {
              setLienAnnonceur("https://www.");
            }
          }}
          onFocus={() => {
            // Place le curseur après "https://www." au focus
            if (lienAnnonceur === "https://www.") {
              // Le curseur sera à la fin automatiquement
            }
          }}
          keyboardType="url"
          autoCapitalize="none"
          placeholderTextColor={COLORS.textGray}
        />
        <Text style={styles.helperText}>
          Ex: https://www.facebook.com/monepage ou https://www.mon-site.fr
        </Text>
      </View>

      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}

      <TouchableOpacity 
        style={styles.buttons} 
        onPress={pickImage}
      >
        <Text style={styles.buttonText}>
          {imageUri ? "Changer l'image" : "Choisir une image"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 12 }} />

      <TouchableOpacity 
        style={[styles.buttons, sending && styles.buttonDisabled]} 
        onPress={onSubmit}
        disabled={sending}
      >
        <Text style={styles.buttonText}>
          {sending ? "Envoi..." : "Envoyer l'annonce"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { 
    fontSize: 22, 
    fontFamily: FONTS.bold,
    marginBottom: 12, 
    textAlign: "center",
    color: COLORS.text,
  },
  
  input: { 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 10, 
    backgroundColor: COLORS.background,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.textDark,
  },
  
  pickerContainer: { 
    marginBottom: 10 
  },
  
  label: { 
    fontSize: 14, 
    fontFamily: FONTS.semiBold,
    marginBottom: 6, 
    color: COLORS.text,
  },
  
  picker: { 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: 8, 
    backgroundColor: COLORS.background,
    fontFamily: FONTS.regular,
  },
  
  datePickerContainer: { 
    marginBottom: 10 
  },
  
  dateButton: { 
    borderWidth: 1, 
    borderColor: COLORS.cta,
    borderRadius: 8, 
    padding: 14, 
    backgroundColor: COLORS.lightBg,
    alignItems: "center" 
  },
  
  dateButtonText: { 
    fontSize: 16, 
    color: COLORS.cta,
    fontFamily: FONTS.semiBold,
  },
  
  inputContainer: { 
    marginBottom: 10 
  },
  
  priceInputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: 8, 
    backgroundColor: COLORS.background, 
    paddingRight: 12 
  },
  
  priceInput: { 
    flex: 1, 
    padding: 10, 
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textDark,
  },
  
  currencyLabel: { 
    fontSize: 18, 
    fontFamily: FONTS.bold,
    color: COLORS.textGray,
  },
  
  helperText: { 
    fontSize: 12, 
    color: COLORS.textGray, 
    marginTop: 4, 
    fontFamily: FONTS.regular,
    fontStyle: "italic" 
  },
  
  preview: { 
    width: "100%", 
    height: 180, 
    borderRadius: 10, 
    marginBottom: 10 
  },
  
  legalNotice: { 
    fontSize: 12, 
    color: COLORS.ctaText, 
    marginVertical: 12, 
    padding: 10, 
    backgroundColor: COLORS.ctaSecondary,
    borderRadius: 8, 
    textAlign: "center", 
    lineHeight: 18,
    fontFamily: FONTS.regular,
  },

  buttons: {
    backgroundColor: COLORS.cta,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  buttonText: {
    color: COLORS.ctaText,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },

  buttonDisabled: {
    backgroundColor: COLORS.textGray,
    opacity: 0.6,
  },
});