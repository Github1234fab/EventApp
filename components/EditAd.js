// components/EditAd.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Image, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "./Firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

export default function EditAd({ route, navigation }) {
  const { submissionId } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [lieu, setLieu] = useState("");
  const [date, setDate] = useState("");
  const [horaire, setHoraire] = useState("");
  const [tarif, setTarif] = useState("");
  const [categorie, setCategorie] = useState("");
  const [lien, setLien] = useState("");

  const [originalImageURL, setOriginalImageURL] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

  // Charger l'annonce existante
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const docRef = doc(db, "Submissions", submissionId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          Alert.alert("Erreur", "Annonce introuvable.");
          navigation.goBack();
          return;
        }

        const data = docSnap.data();
        setTitre(data.titre || "");
        setDescription(data.description || "");
        setLieu(data.lieu || "");
        setDate(data.date || "");
        setHoraire(data.horaire || "");
        setTarif(data.tarif || "");
        setCategorie(data.catégorie || "");
        setLien(data.lien || "");
        setOriginalImageURL(data.image || "");

        setLoading(false);
      } catch (e) {
        console.error("[EditAd] fetch error:", e);
        Alert.alert("Erreur", "Impossible de charger l'annonce.");
        navigation.goBack();
      }
    };

    fetchAd();
  }, [submissionId]);

  const pickImage = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission requise", "Autorise l'accès à la galerie.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypesCompat,
        allowsEditing: false,
        quality: 0.9,
      });

      if (result.canceled) return;

      const asset = result.assets && result.assets[0];
      if (!asset?.uri) {
        Alert.alert("Erreur", "Aucune image sélectionnée.");
        return;
      }

      setImageUri(asset.uri);
      setImageMeta({
        mimeType: asset.mimeType || null,
        fileName: asset.fileName || null,
      });
      setImageChanged(true);
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
      console.error("[Storage upload] error:", e);
      throw e;
    }
  };

  const onSave = async () => {
    if (!titre || !date || !lieu) {
      Alert.alert("Champs requis", "Titre, date et lieu sont obligatoires.");
      return;
    }

    try {
      setSaving(true);
      let imageURL = originalImageURL;

      // Upload nouvelle image si changée
      if (imageChanged && imageUri) {
        console.log("[EditAd] uploading new image:", imageUri);
        imageURL = await uploadImageAndGetURL(imageUri, "admin-edit");
        console.log("[EditAd] new image uploaded:", imageURL);
      }

      // Mettre à jour l'annonce
      await updateDoc(doc(db, "Submissions", submissionId), {
        titre,
        description,
        lieu,
        date,
        horaire,
        tarif,
        catégorie: categorie,
        lien,
        image: imageURL,
        editedByAdmin: true,
        editedAt: serverTimestamp(),
      });

      Alert.alert(
        "✅ Modifications enregistrées",
        "L'annonce a été mise à jour avec succès.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (e) {
      console.error("[EditAd] save error:", e);
      Alert.alert("Erreur", e.message);
    } finally {
      setSaving(false);
    }
  };

  const onSaveAndApprove = async () => {
    Alert.alert(
      "Sauvegarder et approuver ?",
      "Les modifications seront enregistrées et l'annonce sera immédiatement publiée.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            if (!titre || !date || !lieu) {
              Alert.alert("Champs requis", "Titre, date et lieu sont obligatoires.");
              return;
            }

            try {
              setSaving(true);
              let imageURL = originalImageURL;

              if (imageChanged && imageUri) {
                imageURL = await uploadImageAndGetURL(imageUri, "admin-edit");
              }

              await updateDoc(doc(db, "Submissions", submissionId), {
                titre,
                description,
                lieu,
                date,
                horaire,
                tarif,
                catégorie: categorie,
                lien,
                image: imageURL,
                status: "approved",
                editedByAdmin: true,
                moderatedAt: serverTimestamp(),
              });

              Alert.alert(
                "✅ Annonce publiée",
                "Les modifications ont été enregistrées et l'annonce est maintenant visible.",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (e) {
              console.error("[EditAd] save+approve error:", e);
              Alert.alert("Erreur", e.message);
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 8, color: "#666" }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
      <Text style={styles.h1}>✏️ Modifier l'annonce</Text>

      <Text style={styles.notice}>
        🛡️ Mode administrateur : vous pouvez modifier tous les champs de cette annonce.
      </Text>

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

      {/* Affichage image */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      ) : originalImageURL ? (
        <Image source={{ uri: originalImageURL }} style={styles.preview} />
      ) : (
        <View style={[styles.preview, styles.noImage]}>
          <Text style={{ color: "#999" }}>📷 Aucune image</Text>
        </View>
      )}

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {imageUri || originalImageURL ? "📷 Changer l'image" : "📷 Ajouter une image"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />

      {/* Boutons d'action */}
      <TouchableOpacity
        style={[styles.button, styles.saveButton, saving && styles.disabledButton]}
        onPress={onSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>{saving ? "Enregistrement..." : "💾 Enregistrer"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.approveButton, saving && styles.disabledButton]}
        onPress={onSaveAndApprove}
        disabled={saving}
      >
        <Text style={styles.buttonText}>{saving ? "Enregistrement..." : "✅ Enregistrer et Approuver"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}
        disabled={saving}
      >
        <Text style={styles.buttonText}>↩️ Annuler</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  h1: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  notice: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: "#1565C0",
    fontSize: 13,
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
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  approveButton: {
    backgroundColor: "#34C759",
  },
  cancelButton: {
    backgroundColor: "#8E8E93",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});