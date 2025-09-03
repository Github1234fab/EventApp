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



import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import EventsList from "./components/EventList";
import EventDetail from "./components/EventDetail";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
      </Stack.Navigator>

      {/* ✅ Ton StatusBar global */}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
