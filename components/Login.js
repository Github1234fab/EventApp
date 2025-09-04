// import React, { useState } from "react";
// import { View, TextInput, Button, Text, StyleSheet } from "react-native";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./Firebase";

// export default function Login({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const handleLogin = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigation.navigate("EventsList");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Connexion</Text>
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
//       <Button title="Se connecter" onPress={handleLogin} />
//       <Button title="Pas encore inscrit ? Créer un compte" onPress={() => navigation.navigate("Register")} />
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

// export default function Login({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Connexion</Text>

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

//       {/* ✅ Bouton pour simuler connexion */}
//       <Button
//         title="Se connecter"
//         onPress={() => navigation.navigate("EventsList")}
//       />

//       <Text
//         style={styles.link}
//         onPress={() => navigation.navigate("Register")}
//       >
//         Pas de compte ? Créez-en un
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



//LOGIN AVEC FIREAUTH

// components/Login.js
// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./Firebase";

// export default function Login({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       Alert.alert("Succès", "Connexion réussie !");
//       navigation.navigate("EventsList"); // redirige après login
//     } catch (error) {
//       Alert.alert("Erreur", error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Connexion</Text>
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
//       <Button title="Se connecter" onPress={handleLogin} />
//       <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
//         Pas encore de compte ? S'inscrire
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
// components/Login.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Champs requis", "Email et mot de passe sont obligatoires.");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("Succès", "Connexion réussie !");
      navigation.navigate("EventsList");
    } catch (err) {
      Alert.alert("Erreur", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

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
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title={loading ? "Connexion..." : "Se connecter"} onPress={handleLogin} disabled={loading} />

      <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
        Pas encore de compte ? S'inscrire
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

