import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Theme from '../constants/Theme';

const ChatScreens = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEXORA</Text>
      <Text style={styles.text}>Bem-vindo ao futuro do chat.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Theme.colors.primary,
    letterSpacing: 4,
    marginBottom: 10,
  },
  text: {
    color: Theme.colors.text,
    fontSize: 16,
    letterSpacing: 1,
  }
});

export default ChatScreens;
