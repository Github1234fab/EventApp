import { StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import EventsList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import { auth } from "./components/Firebase";
import { onAuthStateChanged } from "firebase/auth";

import PayAd from "./components/PayAd";
import NewAd from "./components/NewAd";
import MyAds from "./components/MyAds";
import Favorites from "./components/Favorites";
import AdminModeration from "./components/AdminModeration";
import EditAd from "./components/EditAd"; // Admin uniquement
import MyPayments from "./components/PaymentSuccess"; // 👈 Ajout

const Stack = createStackNavigator();

// 👈 Liste des UIDs admins - remplacez par vos vrais UIDs Firebase
export const ADMIN_UIDS = [
  "VOTRE_UID_FIREBASE_ICI", // 👈 Mettez votre UID ici
  // "autre_uid_admin",
];

export default function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
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
          <>
            <Stack.Screen name="EventsList" component={EventsList} options={{ title: "Événements" }} />
            <Stack.Screen name="EventDetail" component={EventDetail} options={{ title: "Détail" }} />
            <Stack.Screen name="NewAd" component={NewAd} options={{ title: "Nouvelle annonce" }} />
            <Stack.Screen name="Favorites" component={Favorites} options={{ title: "Mes favoris" }} />
            <Stack.Screen name="MyAds" component={MyAds} options={{ title: "Mes annonces" }} />
            <Stack.Screen name="PayAd" component={PayAd} options={{ title: "Payer votre annonce" }} />
            <Stack.Screen name="AdminModeration" component={AdminModeration} options={{ title: "🛡️ Modération" }} />
            <Stack.Screen name="EditAd" component={EditAd} options={{ title: "✏️ Modifier l'annonce" }} />
            <Stack.Screen name="MyPayments" component={MyPayments} options={{ title: "💳 Paiements" }} />
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
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
