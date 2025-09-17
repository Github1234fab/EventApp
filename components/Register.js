// import React, { useState } from "react";
// import { View, TextInput, Button, Text, StyleSheet } from "react-native";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./Firebase";

// export default function Register({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const handleRegister = async () => {
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       navigation.navigate("EventsList"); // redirige après succès
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Créer un compte</Text>
//       {error && <Text style={{ color: "red" }}>{error}</Text>}
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Mot de passe"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Button title="S'inscrire" onPress={handleRegister} />
//       <Button title="Déjà un compte ? Se connecter" onPress={() => navigation.navigate("Login")} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
// });



//MOCK
// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet } from "react-native";

// export default function Register({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Créer un compte</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Mot de passe"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       {/* ✅ Bouton pour simuler inscription */}
//       <Button
//         title="Créer mon compte"
//         onPress={() => navigation.navigate("EventsList")}
//       />

//       <Text
//         style={styles.link}
//         onPress={() => navigation.navigate("Login")}
//       >
//         Déjà un compte ? Connectez-vous
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
//   link: { marginTop: 15, textAlign: "center", color: "blue" },
// });


//REGISTER AVEC FIREAUTH
// components/Register.js
// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./Firebase";

// export default function Register({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = async () => {
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       Alert.alert("Succès", "Compte créé !");
//       navigation.navigate("EventsList"); // redirige après inscription
//     } catch (error) {
//       Alert.alert("Erreur", error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Créer un compte</Text>
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Mot de passe"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         style={styles.input}
//       />
//       <Button title="S'inscrire" onPress={handleRegister} />
//       <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
//         Déjà un compte ? Se connecter
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
//   link: { marginTop: 15, color: "blue", textAlign: "center" },
// });



// BETA
// components/Register.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Champs requis", "Email et mot de passe sont obligatoires.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Mot de passe trop court", "Minimum 6 caractères.");
      return;
    }
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("Succès", "Compte créé !");
      navigation.navigate("EventList"); // redirection après inscription
    } catch (err) {
      Alert.alert("Erreur", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe (min 6)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title={loading ? "Création..." : "S'inscrire"} onPress={handleRegister} disabled={loading} />

      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Déjà un compte ? Se connecter
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 12, borderRadius: 6 },
  link: { marginTop: 14, textAlign: "center", color: "blue" },
});
