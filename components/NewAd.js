import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ScrollView, Linking, TouchableOpacity, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db, storage } from "./Firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");

// Listes prédéfinies
const CATEGORIES = ["Animation", "Atelier", "Autre", "Brocante", "Café Philo", "Cinéma", "Conférence", "Concert", "Danse", "Exposition", "Festival", "Lecture", "Marché", "Restaurant", "Soirée", "Sport", "Théâtre"];

const LIEUX = [
  "Aveize",
  "Brignais",
  "Brindas",
  "Brussieu",
  "Bessenay",
  "Chaponost",
  "Chazelles-sur-Lyon",
  "Chaussan",
  "Chevinay",
  "Coise",
  "Craponne",
  "Courzieu",
  "Duerne",
  "Francheville",
  "Grézieu-la-Varenne",
  "Grézieu-le-Marché",
  "L'Arbresle",
  "Larajasse",
  "Lentilly",
  "Messimy",
  "Mornant",
  "Montromant",
  "Orliénas",
  "Pollionnay",
  "Pomeys",
  "Riverie",
  "Rontalon",
  "Saint-Bel",
  "Saint-Didier-sous-Riverie",
  "Saint-Genis-les-Ollières",
  "Saint-Laurent-d'Agny",
  "Saint-Laurent-de-Chamousset",
  "Saint-Martin-en-Haut",
  "Saint-Pierre-la-Palud",
  "Saint-Symphorien-sur-Coise",
  "Sainte-Catherine",
  "Sainte-Consorce",
  "Sainte-Foy-l'Argentière",
  "Sainte-Foy-lès-Lyon",
  "Soucieu-en-Jarrest",
  "Sourcieux-les-Mines",
  "Taluyers",
  "Thurins",
  "Vaugneray",
  "Vourles",
  "Yzeron",
  "autres",
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
  const [lien, setLien] = useState("");

  const [imageUri, setImageUri] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [sending, setSending] = useState(false);

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

    // 👇 Correction ici : gérer les cas vide, "0", ou nombre
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
        lien,
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
      <Text style={styles.h1}>Nouvelle annonce</Text>

      {/* Mention légale */}
      <Text style={styles.legalNotice}>
        <Text style={{ fontWeight: "bold" }}>Important :</Text> Vérifiez bien toutes vos informations avant de payer. Une fois le paiement effectué, vous ne pourrez plus modifier votre annonce. Seule notre équipe de modération pourra la modifier si elle ne respecte pas nos conditions de publication.
        Le paiement ne sera pas remboursé en cas de modification ou de rejet justifié.
      </Text>

      <TextInput style={styles.input} placeholder="Titre *" value={titre} onChangeText={setTitre} />

      <TextInput style={[styles.input, { height: 100 }]} placeholder="Description" value={description} onChangeText={setDescription} multiline />

      {/* Picker Catégorie */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Catégorie *</Text>
        <Picker selectedValue={categorie} onValueChange={(itemValue) => setCategorie(itemValue)} style={styles.picker}>
          <Picker.Item label="Sélectionnez une catégorie" value="" />
          {CATEGORIES.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      {/* Picker Lieu */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Lieu *</Text>
        <Picker selectedValue={lieu} onValueChange={(itemValue) => setLieu(itemValue)} style={styles.picker}>
          <Picker.Item label="Sélectionnez un lieu" value="" />
          {LIEUX.map((l) => (
            <Picker.Item key={l} label={l} value={l} />
          ))}
        </Picker>
      </View>

      {/* Si "Autre" sélectionné pour le lieu */}
      {lieu === "Autre" && <TextInput style={styles.input} placeholder="Précisez le lieu *" value={lieuAutre} onChangeText={setLieuAutre} />}

      {/* DatePicker pour la date */}
      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Date de l'événement *</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>{dayjs(date).format("dddd D MMMM YYYY")}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && <DateTimePicker value={date} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={onDateChange} locale="fr-FR" minimumDate={new Date()} />}

      {showDatePicker && Platform.OS === "ios" && <Button title="✓ Confirmer" onPress={() => setShowDatePicker(false)} />}

      {/* Picker Horaire */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Horaire</Text>
        <Picker selectedValue={horaire} onValueChange={(itemValue) => setHoraire(itemValue)} style={styles.picker}>
          <Picker.Item label="Sélectionnez un horaire" value="" />
          {HORAIRES.map((h) => (
            <Picker.Item key={h} label={h} value={h} />
          ))}
        </Picker>
      </View>

      {/* Si "Personnalisé" sélectionné pour l'horaire */}
      {horaire === "Personnalisé" && <TextInput style={styles.input} placeholder="Horaire personnalisé (ex: 18:00 - 22:00)" value={horairePersonnalise} onChangeText={setHorairePersonnalise} />}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tarif de l'événement</Text>
        <View style={styles.priceInputContainer}>
          <TextInput style={styles.priceInput} placeholder="0" value={tarif} onChangeText={setTarif} keyboardType="numeric" />
          <Text style={styles.currencyLabel}>€</Text>
        </View>
        <Text style={styles.helperText}>Laissez vide ou mettez 0 pour "Gratuit"</Text>
      </View>

      <TextInput style={styles.input} placeholder="Lien billetterie" value={lien} onChangeText={setLien} />

      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
      <Button title={imageUri ? "Changer l'image" : "Choisir une image"} onPress={pickImage} />
      <View style={{ height: 12 }} />
      <Button title={sending ? "Envoi..." : "Envoyer l'annonce"} onPress={onSubmit} disabled={sending} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#F0F8FF",
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  legalNotice: {
    fontSize: 12,
    color: "#666",
    marginVertical: 12,
    padding: 10,
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    textAlign: "center",
    lineHeight: 18,
  },
  inputContainer: {
    marginBottom: 10,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingRight: 12,
  },
  priceInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  currencyLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
});
