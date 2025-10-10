// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, ActivityIndicator, View } from "react-native";
// import * as React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
// import EventsList from "./components/EventList";
// import EventDetail from "./components/EventDetail";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import { auth } from "./components/Firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { LinearGradient } from "expo-linear-gradient";

// import PayAd from "./components/PayAd";
// import NewAd from "./components/NewAd";
// import MyAds from "./components/MyAds";
// import Favorites from "./components/Favorites";
// import AdminModeration from "./components/AdminModeration";
// import EditAd from "./components/EditAd";
// import PaymentSuccess from "./components/PaymentSuccess";
// import Legal from "./components/Legal";
// import Contact from "./components/Contact";
// import AdminPayments from "./components/AdminPayments";

// const Stack = createStackNavigator();

// export default function App() {
//   const [user, setUser] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);

//   // ✅ useFonts doit être DANS le composant
//   const [fontsLoaded] = useFonts({
//     Poppins_400Regular,
//     Poppins_500Medium,
//     Poppins_600SemiBold,
//     Poppins_700Bold,
//   });

//   React.useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // Attendre que les fonts ET l'auth soient chargés
//   if (!fontsLoaded || loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#B6620B" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {user ? (
//           <>
//             <Stack.Screen
//               name="EventsList"
//               component={EventsList}
//               options={{
//                 title: "Événements",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//             <Stack.Screen
//               name="EventDetail"
//               component={EventDetail}
//               options={{
//                 title: "Détail",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//             <Stack.Screen
//               name="NewAd"
//               component={NewAd}
//               options={{
//                 title: "Nouvelle annonce",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//             <Stack.Screen
//               name="Favorites"
//               component={Favorites}
//               options={{
//                 title: "Mes favoris",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//             <Stack.Screen
//               name="MyAds"
//               component={MyAds}
//               options={{
//                 title: "Mes annonces",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//             <Stack.Screen
//               name="PayAd"
//               component={PayAd}
//               options={{
//                 title: "Payer votre annonce",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//             <Stack.Screen
//               name="AdminModeration"
//               component={AdminModeration}
//               options={{
//                 title: "🛡️ Modération",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//             <Stack.Screen
//               name="EditAd"
//               component={EditAd}
//               options={{
//                 title: "✏️ Modifier l'annonce",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//             <Stack.Screen
//               name="MyPayments"
//               component={PaymentSuccess}
//               options={{
//                 title: "💳 Paiements",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//             <Stack.Screen
//               name="Legal"
//               component={Legal}
//               options={{
//                 title: "CGU & RGPD",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//             <Stack.Screen
//               name="Contact"
//               component={Contact}
//               options={{
//                 title: "Contact",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//             <Stack.Screen
//               name="AdminPayments"
//               component={AdminPayments}
//               options={{
//                 title: "💰 Statistiques",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//           </>
//         ) : (
//           <>
//             <Stack.Screen
//               name="Login"
//               component={Login}
//               options={{
//                 title: "Connexion",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//             <Stack.Screen
//               name="Register"
//               component={Register}
//               options={{
//                 title: "Créer un compte",
//                 headerStyle: { backgroundColor: '#FFF8F0' },
//                 headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', color: '#BC6409' },
//               }}
//             />
//           </>
//         )}
//       </Stack.Navigator>
//       <StatusBar style="auto" />
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     background: '#FFFFFF',
//   },
// });

import { Image } from "react-native";
import logoPoilu from "./assets/Poilu_chair_Mobile_Transparent_V2.png";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import * as React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import EventsList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import { auth } from "./components/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import PayAd from "./components/PayAd";
import NewAd from "./components/NewAd";
import MyAds from "./components/MyAds";
import Favorites from "./components/Favorites";
import AdminModeration from "./components/AdminModeration";
import EditAd from "./components/EditAd";
import PaymentSuccess from "./components/PaymentSuccess";
import Legal from "./components/Legal";
import Contact from "./components/Contact";
import AdminPayments from "./components/AdminPayments";

function LogoHeaderRight() {
  return (
    <Image
      source={logoPoilu}
      style={{
        width: 80, // ajuste selon ton logo
        height: 100,
        resizeMode: "contain",
        marginRight: 0,
        marginBottom: 10,
      }}
    />
  );
}

const Stack = createStackNavigator();

// 👇 thème nav avec fond transparent, pour voir le gradient
const TransparentNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

export default function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#B6620B" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {/* <LinearGradient colors={["#FFF4E8", "#F0C08B", "#CC8E4A"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /> */}
        <LinearGradient 
  colors={["#FFFBF5", "#FFF8F0", "#FFE8D6", "#F5D4B8"]} 
  locations={[0, 0.3, 0.7, 1]}
  start={{ x: 0, y: 0 }} 
  end={{ x: 1, y: 1 }} 
  style={StyleSheet.absoluteFill} 
/>



        <SafeAreaView style={styles.content} edges={["top", "right", "bottom", "left"]}>
          <NavigationContainer theme={TransparentNavTheme}>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: "transparent",
                  elevation: 0, // supprime la shadow Android
                  shadowOpacity: 0, // supprime la shadow iOS
                },
                headerTitleStyle: {
                  fontFamily: "Poppins_600SemiBold",
                  color: "#2B2B2B",
                },
                headerRight: () => <LogoHeaderRight />, // 👉 bien ici
              }}
            >
              {user ? (
                <>
                  <Stack.Screen name="EventsList" component={EventsList} options={{ title: "Événements" }} />
                  <Stack.Screen name="EventDetail" component={EventDetail} options={{ title: "Détail" }} />
                  <Stack.Screen name="NewAd" component={NewAd} options={{ title: "Créer" }} />
                  <Stack.Screen name="Favorites" component={Favorites} options={{ title: "Mes favoris" }} />
                  <Stack.Screen name="MyAds" component={MyAds} options={{ title: "Mes annonces" }} />
                  <Stack.Screen name="PayAd" component={PayAd} options={{ title: "Payer votre annonce" }} />
                  <Stack.Screen name="AdminModeration" component={AdminModeration} options={{ title: "🛡️ Modération" }} />
                  <Stack.Screen name="EditAd" component={EditAd} options={{ title: "Modifier l'annonce" }} />
                  <Stack.Screen name="MyPayments" component={PaymentSuccess} options={{ title: "Mes Paiements" }} />
                  <Stack.Screen name="Legal" component={Legal} options={{ title: "CGU & RGPD" }} />
                  <Stack.Screen name="Contact" component={Contact} options={{ title: "Contact" }} />
                  <Stack.Screen name="AdminPayments" component={AdminPayments} options={{ title: "Statistiques" }} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Login" component={Login} options={{ title: "Connexion" }} />
                  <Stack.Screen name="Register" component={Register} options={{ title: "Créer un compte" }} />
                </>
              )}
            </Stack.Navigator>
            <StatusBar style="dark" />
          </NavigationContainer>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 }, // conteneur racine
  content: { flex: 1, backgroundColor: "transparent" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // ✅ en RN c'est backgroundColor
  },
});
