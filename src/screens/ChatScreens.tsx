import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatScreens = () => {
  return (
    <View style={styles.container}>
      <Text>Chat Screens</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreens;
