// CODE OK
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

//       {/*  Ton StatusBar global */}
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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++=

// import AdminModeration from "./components/AdminModeration";
// import Favorites from "./components/Favorites";

// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, ActivityIndicator, View } from "react-native";
// import * as React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import EventsList from "./components/EventList";
// import EventDetail from "./components/EventDetail";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import { auth } from "./components/Firebase"; //  ton auth Firebase
// import { onAuthStateChanged } from "firebase/auth";
// import { ADMIN_UIDS } from "./constants/roles";
// import { StripeProvider } from "@stripe/stripe-react-native";
// import PayAd from "./components/PayAd";

// import NewAd from "./components/NewAd";
// import MyAds from "./components/MyAds";

// const Stack = createStackNavigator();

// export default function App() {
//   const [user, setUser] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);

//   React.useEffect(() => {
//     //  Écoute l'état de connexion de Firebase
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false); // fin du chargement
//     });

//     return unsubscribe; // cleanup listener
//   }, []);

//   if (loading) {
//     // Petit loader pendant qu’on vérifie l’état
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     // <NavigationContainer>
//       // <StripeProvider publishableKey="pk_test_51S5psMDBuXX0ycFTvuNbB9cy7gmprLxgw9QR03OkTqQP6BHGI9JYTTK2sGdb3GdgpJLDzdI7FIPFtaeixAv2AxHF00dpZv70VU">
//         <NavigationContainer>
//      <Stack.Navigator>
//   {user ? (
//     //  Utilisateur connecté : accès aux écrans privés
//     <>
//     <Stack.Screen name="Favorites" component={Favorites} options={{ title: "Mes favoris" }} />

//       <Stack.Screen
//         name="EventsList"
//         component={EventsList}
//         options={{ title: "Événements" }}
//       />
//       <Stack.Screen
//         name="EventDetail"
//         component={EventDetail}
//         options={{ title: "Détail" }}
//       />
//         <Stack.Screen name="PayAd" component={PayAd} options={{ title: "Paiement" }} />
//       <Stack.Screen
//         name="NewAd"
//         component={NewAd}
//         options={{ title: "Nouvelle annonce" }}
//       />
//       <Stack.Screen
//         name="MyAds"
//         component={MyAds}
//         options={{ title: "Mes annonces" }}
//       />
//  {ADMIN_UIDS.includes(user?.uid) && (
//       <Stack.Screen
//         name="AdminModeration"
//         component={AdminModeration}
//         options={{ title: "Modération" }}
//       />
//     )}

//     </>
//   ) : (
//     //  Pas connecté : uniquement Login / Register
//     <>
//       <Stack.Screen
//         name="Login"
//         component={Login}
//         options={{ title: "Connexion" }}
//       />
//       <Stack.Screen
//         name="Register"
//         component={Register}
//         options={{ title: "Créer un compte" }}
//       />
//     </>
//   )}
// </Stack.Navigator>

//       <StatusBar style="auto" />
//     </NavigationContainer>
//     // </StripeProvider>
//   );
// }

// const styles = StyleSheet.create({
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });






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

import { ADMIN_UIDS } from "./constants/roles";
import PayAd from "./components/PayAd";

import NewAd from "./components/NewAd";
import MyAds from "./components/MyAds";
import Favorites from "./components/Favorites";

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
    // <StripeProvider publishableKey="pk_test_51S5psMDBuXX0ycFTvuNbB9cy7gmprLxgw9QR03OkTqQP6BHGI9JYTTK2sGdb3GdgpJLDzdI7FIPFtaeixAv2AxHF00dpZv70VU">
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen name="EventsList" component={EventsList} options={{ title: "Événements" }} />
              <Stack.Screen name="EventDetail" component={EventDetail} options={{ title: "Détail" }} />
              <Stack.Screen name="NewAd" component={NewAd} options={{ title: "Nouvelle annonce" }} />
              <Stack.Screen name="Favorites" component={Favorites} options={{ title: "Mes favoris" }} />
              <Stack.Screen name="MyAds" component={MyAds} options={{ title: "Mes annonces" }} />
              <Stack.Screen name="PayAd" component={PayAd} options={{ title: "Payer votre annonce" }} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} options={{ title: "Connexion" }} />
              <Stack.Screen name="Register" component={Register} options={{ title: "Créer un compte" }} />
            </>
          )}
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    // </StripeProvider>
  );
  
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});