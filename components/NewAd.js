// components/NewAd.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ScrollView, Linking, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "./Firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";


const mediaTypesCompat =
  (ImagePicker?.MediaType && ImagePicker.MediaType.Images) ||
  (ImagePicker?.MediaTypeOptions && ImagePicker.MediaTypeOptions.Images);

export default function NewAd({ navigation }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [lieu, setLieu] = useState("");
  const [date, setDate] = useState("");          // ex: 2025-09-20
  const [horaire, setHoraire] = useState("");    // ex: 18:00 - 22:00
  const [tarif, setTarif] = useState("");
  const [categorie, setCategorie] = useState(""); // orthographe libre
  const [lien, setLien] = useState("");          // billetterie
  const [imageUri, setImageUri] = useState(null);
  const [sending, setSending] = useState(false);

  const pickImage = async () => {
    try {
      // 1) Demander la permission (Android/iOS)
      const { status, granted, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        // Permission refusée → expliquer et proposer d'ouvrir les réglages
        return Alert.alert(
          "Permission requise",
          "Autorise l’accès à ta galerie pour choisir une image.",
          [
            { text: "Annuler", style: "cancel" },
            { text: "Ouvrir les réglages", onPress: () => Linking.openSettings() },
          ]
        );
      }
  
      // 2) Ouvrir la galerie
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypesCompat,
        allowsEditing: false,
        quality: 0.9,
        // base64: false, // pas nécessaire
        // exif: false,   // pas nécessaire
      });
  
      // 3) Gérer le cas annulé
      if (result.canceled) {
        console.log("[ImagePicker] canceled by user");
        return;
      }
  
      // 4) Récupérer l’URI local
      const asset = result.assets && result.assets[0];
      if (!asset?.uri) {
        Alert.alert("Erreur", "Aucune image sélectionnée.");
        return;
      }
  
      console.log("[ImagePicker] selected:", asset);
      setImageUri(asset.uri);
    } catch (e) {
      console.error("[ImagePicker] error:", e);
      Alert.alert("Erreur", "Impossible d’ouvrir la galerie.");
    }
  };

  const uploadImageAndGetURL = async (uri, uid) => {
    try {
      const cleanUri = (uri || "").split("?")[0];
      const m = cleanUri.match(/\.([a-zA-Z0-9]+)$/);
      const ext = (m ? m[1] : "jpg").toLowerCase();
      const contentType =
        ext === "png" ? "image/png" :
        ext === "webp" ? "image/webp" :
        "image/jpeg";
  
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const path = `ads/${uid}/${Date.now()}.${ext}`;
      const storageRef = ref(storage, path);
  
      // <-- clé : on envoie un data URL
      const dataUrl = `data:${contentType};base64,${base64}`;
      await uploadString(storageRef, dataUrl, "data_url");
  
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (e) {
      console.error(
        "[Storage upload] code:", e?.code,
        "message:", e?.message,
        "serverResponse:", e?.customData?.serverResponse
      );
      throw e;
    }
  };


  const onSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Non connecté", "Connecte-toi pour publier une annonce.");
      return;
    }
    if (!titre || !date || !lieu) {
      Alert.alert("Champs requis", "Titre, date et lieu sont obligatoires.");
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

      // On envoie dans une collection de "soumissions" pour modération
      await addDoc(collection(db, "Submissions"), {
        userId: user.uid,
        titre,
        description,
        lieu,
        date,
        horaire,
        tarif,
        catégorie: categorie,
        lien,
        image: imageURL,
        status: "pending",            // 👈 pour modération
        createdAt: serverTimestamp(),
      });

      Alert.alert("Envoyé", "Ton annonce a été envoyée pour validation.");
      // reset simple
      setTitre(""); setDescription(""); setLieu(""); setDate("");
      setHoraire(""); setTarif(""); setCategorie(""); setLien(""); setImageUri(null);

      navigation.goBack();
    } catch (e) {
      Alert.alert("Erreur", e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView
    contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
    style={{ flex: 1, backgroundColor: "#f9f9f9" }}
  >
      <Text style={styles.h1}>Nouvelle annonce</Text>

      <TextInput style={styles.input} placeholder="Titre *" value={titre} onChangeText={setTitre} />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput style={styles.input} placeholder="Lieu *" value={lieu} onChangeText={setLieu} />
      <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD) *" value={date} onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="Horaire (ex: 18:00 - 22:00)" value={horaire} onChangeText={setHoraire} />
      <TextInput style={styles.input} placeholder="Tarif (ex: 2 euros)" value={tarif} onChangeText={setTarif} />
      <TextInput style={styles.input} placeholder="Catégorie (ex: Cinema)" value={categorie} onChangeText={setCategorie} />
      <TextInput style={styles.input} placeholder="Lien billetterie" value={lien} onChangeText={setLien} />

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      ) : (
        <View style={{ marginBottom: 8 }} />
      )}
      <Button title={imageUri ? "Changer l'image" : "Choisir une image"} onPress={pickImage} />

      <View style={{ height: 12 }} />
      <Button title={sending ? "Envoi..." : "Envoyer l'annonce"} onPress={onSubmit} disabled={sending} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  h1: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: "#fff" },
  preview: { width: "100%", height: 180, borderRadius: 10, marginBottom: 10 },
});


