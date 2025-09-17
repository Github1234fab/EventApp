
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "./Firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Compat API ImagePicker (anciennes/nouvelles constantes)
const mediaTypesCompat =
  (ImagePicker?.MediaType && ImagePicker.MediaType.Images) ||
  (ImagePicker?.MediaTypeOptions && ImagePicker.MediaTypeOptions.Images);

// --- Helper: convertir file:// → Blob via XHR (fiable avec Expo/Hermes/Android)
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
  const [date, setDate] = useState(""); // ex: 2025-09-20
  const [horaire, setHoraire] = useState(""); // ex: 18:00 - 22:00
  const [tarif, setTarif] = useState("");
  const [categorie, setCategorie] = useState(""); // orthographe libre
  const [lien, setLien] = useState(""); // billetterie

  const [imageUri, setImageUri] = useState(null);
  const [imageMeta, setImageMeta] = useState(null); // { mimeType, fileName, ... }
  const [sending, setSending] = useState(false);

  const pickImage = async () => {
    try {
      // 1) Permission
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        return Alert.alert(
          "Permission requise",
          "Autorise l’accès à ta galerie pour choisir une image.",
          [
            { text: "Annuler", style: "cancel" },
            { text: "Ouvrir les réglages", onPress: () => Linking.openSettings() },
          ]
        );
      }

      // 2) Galerie
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypesCompat,
        allowsEditing: false,
        quality: 0.9,
      });

      // 3) Annulé ?
      if (result.canceled) {
        console.log("[ImagePicker] canceled by user");
        return;
      }

      // 4) Asset choisi
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
      Alert.alert("Erreur", "Impossible d’ouvrir la galerie.");
    }
  };

  // --- Upload (XHR -> Blob -> uploadBytes)
  const uploadImageAndGetURL = async (uri, uid) => {
    try {
      // Déduire extension + contentType
      const cleanUri = (uri || "").split("?")[0];
      const m = cleanUri.match(/\.([a-zA-Z0-9]+)$/);
      const extFromUri = (m ? m[1] : "").toLowerCase();
      const ext =
        imageMeta?.fileName?.split(".").pop()?.toLowerCase() || extFromUri || "jpg";

      const contentType =
        imageMeta?.mimeType ||
        (ext === "png"
          ? "image/png"
          : ext === "webp"
          ? "image/webp"
          : "image/jpeg");

      // file:// → Blob
      const blob = await uriToBlobXHR(uri);

      // Chemin/nom de fichier dans Storage (règles: match /ads/{uid}/**)
      const filename = imageMeta?.fileName || `${Date.now()}.${ext}`;
      const path = `ads/${uid}/${filename}`;
      const storageRef = ref(storage, path);

      // Upload
      await uploadBytes(storageRef, blob, { contentType });

      // Optionnel: libérer le blob si dispo
      try {
        blob.close && blob.close();
      } catch {}

      // URL publique
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (e) {
      console.error(
        "[Storage upload] code:",
        e?.code,
        "message:",
        e?.message,
        "serverResponse:",
        e?.customData?.serverResponse
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

      // Envoi dans la collection de soumissions (modération)
      const docRef = await addDoc(collection(db, "Submissions"), {
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
        status: "pending",
        paid: false,                 // 👈 suivi paiement
        createdAt: serverTimestamp(),
      });

      // 🧭 Redirige vers l’écran de paiement (1,99 €)
      // (modif principale)
      Alert.alert("Soumission créée", "Procède au paiement pour finaliser.");
      navigation.navigate("PayAd", {
        submissionId: docRef.id,
        price: 199, // centimes = 1,99 €
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

      <TextInput
        style={styles.input}
        placeholder="Titre *"
        value={titre}
        onChangeText={setTitre}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Lieu *"
        value={lieu}
        onChangeText={setLieu}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD) *"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Horaire (ex: 18:00 - 22:00)"
        value={horaire}
        onChangeText={setHoraire}
      />
      <TextInput
        style={styles.input}
        placeholder="Tarif (ex: 2 euros)"
        value={tarif}
        onChangeText={setTarif}
      />
      <TextInput
        style={styles.input}
        placeholder="Catégorie (ex: Cinema)"
        value={categorie}
        onChangeText={setCategorie}
      />
      <TextInput
        style={styles.input}
        placeholder="Lien billetterie"
        value={lien}
        onChangeText={setLien}
      />

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      ) : null}
      <Button
        title={imageUri ? "Changer l'image" : "Choisir une image"}
        onPress={pickImage}
      />

      <View style={{ height: 12 }} />
      <Button
        title={sending ? "Envoi..." : "Envoyer l'annonce"}
        onPress={onSubmit}
        disabled={sending}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  preview: { width: "100%", height: 180, borderRadius: 10, marginBottom: 10 },
});
