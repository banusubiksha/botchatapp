import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import ChatScreen from './src/ChatScreen';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <ChatScreen />
    </SafeAreaView>
  );
};

export default App;
