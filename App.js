// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';


// // Import du composant personnalisé

// import FirebaseRendu from "./components/Firebase-rendu.js";

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Hello word because of you</Text>

//       <FirebaseRendu />

//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


//CODE OK
// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";
// import * as React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import EventsList from "./components/EventList";
// import EventDetail from "./components/EventDetail";
// import Login from "./components/Login";
// import Register from "./components/Register";

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//       { <Stack.Screen name="Login" component={Login} options={{ title: "Connexion" }} /> }
//       { <Stack.Screen name="Register" component={Register} options={{ title: "Créer un compte" }} /> }
//         <Stack.Screen
//           name="EventsList"
//           component={EventsList}
//           options={{ title: "Événements" }}
//         />
//         <Stack.Screen
//           name="EventDetail"
//           component={EventDetail}
//           options={{ title: "Détail" }}
//         />
//       </Stack.Navigator>

//       {/* ✅ Ton StatusBar global */}
//       <StatusBar style="auto" />
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });


// App.JS avec garde de route


import { StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import EventsList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import { auth } from "./components/Firebase"; // 👈 ton auth Firebase
import { onAuthStateChanged } from "firebase/auth";

import NewAd from "./components/NewAd";
import MyAds from "./components/MyAds";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 👀 Écoute l'état de connexion de Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // fin du chargement
    });

    return unsubscribe; // cleanup listener
  }, []);

  if (loading) {
    // Petit loader pendant qu’on vérifie l’état
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
     <Stack.Navigator>
  {user ? (
    // ✅ Utilisateur connecté : accès aux écrans privés
    <>
      <Stack.Screen
        name="EventsList"
        component={EventsList}
        options={{ title: "Événements" }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{ title: "Détail" }}
      />
      <Stack.Screen
        name="NewAd"
        component={NewAd}
        options={{ title: "Nouvelle annonce" }}
      />
      <Stack.Screen
        name="MyAds"
        component={MyAds}
        options={{ title: "Mes annonces" }}
      />
    </>
  ) : (
    // 🚫 Pas connecté : uniquement Login / Register
    <>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: "Connexion" }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ title: "Créer un compte" }}
      />
    </>
  )}
</Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
