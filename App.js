import { StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// ⬇️ AJOUT
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

// Nécessaire pour finaliser correctement openAuthSessionAsync (iOS surtout)
WebBrowser.maybeCompleteAuthSession();

import EventsList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import { auth } from "./components/Firebase";
import { onAuthStateChanged } from "firebase/auth";

import { ADMIN_UIDS } from "./constants/roles";
import PayAd from "./components/PayAd";
import PaymentReturnScreen from "./components/PaymentReturnScreen"; // ⬅️ AJOUT

import NewAd from "./components/NewAd";
import MyAds from "./components/MyAds";
import Favorites from "./components/Favorites";

const Stack = createStackNavigator();

// ⬇️ Configuration deep link
const linking = {
  prefixes: [Linking.createURL("/"), "monprojet://"], // ⚠️ ton scheme dans app.json
  config: {
    screens: {
      PaymentReturn: "payment-return", // ⬅️ route deep link
    },
  },
};

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
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="EventsList" component={EventsList} options={{ title: "Événements" }} />
            <Stack.Screen name="EventDetail" component={EventDetail} options={{ title: "Détail" }} />
            <Stack.Screen name="NewAd" component={NewAd} options={{ title: "Nouvelle annonce" }} />
            <Stack.Screen name="Favorites" component={Favorites} options={{ title: "Mes favoris" }} />
            <Stack.Screen name="MyAds" component={MyAds} options={{ title: "Mes annonces" }} />
            <Stack.Screen name="PayAd" component={PayAd} options={{ title: "Payer votre annonce" }} />

            {/* ⬇️ Écran cible du deep link */}
            <Stack.Screen name="PaymentReturn" component={PaymentReturnScreen} options={{ title: "Retour paiement" }} />
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
