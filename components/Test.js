import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';

export default function MonComposant() {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Salut les cocossote</Text>
    <TouchableOpacity style={styles.button}>   <Text style={styles.text}>Bonjour React Native !</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      padding:20,
      backgroundColor: '#eee',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    button: {
      backgroundColor: '#4CAF50',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8
    },
    text: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold'
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold'
    }
  });
  
