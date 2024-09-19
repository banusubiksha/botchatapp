import * as React from 'react';
import { View, Text, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChatScreen from './src/ChatScreen';
import LoginScreen from './src/LoginScreen';
import SignupScreen from './src/SignupScreen';
import HomeScreen from './src/HomeScreen';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './src/reducers';
import SplashScreen from './src/SplashScreen';
import HelpScreen from './src/HelpScreen';

const store = createStore(rootReducer);

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

// Animated Tab Icon for Bottom Navigation
const AnimatedTabBarIcon = ({ focused, icon }) => {
  const animationValue = React.useRef(new Animated.Value(focused ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animationValue, {
      toValue: focused ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  const scale = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2], // Scale up the icon when focused
  });

  const color = focused ? '#ffffff' : '#B8C0CC'; // Change color based on focus

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Icon name={icon} size={24} color={color} />
    </Animated.View>
  );
};

// Bottom Tab Navigator
const TabNavigator: React.FC = () => (
  <Tab.Navigator
    initialRouteName="Home"
    activeColor="#ffffff"
    inactiveColor="#B8C0CC"
    barStyle={{
      backgroundColor: '#1e1e2d',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: 'hidden',
      marginHorizontal: 16,
      position: 'absolute',
    }}
    labeled={false}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        let iconName = '';

        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Chat':
            iconName = 'chat';
            break;
          case 'Help':
            iconName = 'help';
            break;
        }

        return <AnimatedTabBarIcon focused={focused} icon={iconName} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Chat" component={ChatScreen} />
    <Tab.Screen name="Help" component={HelpScreen} />
  </Tab.Navigator>
);

// Stack Navigator
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
          >
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name='Splash' component={SplashScreen}/>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />

              <Stack.Screen name="Home" component={TabNavigator} />
            </Stack.Navigator>
          </KeyboardAvoidingView>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};




export default App;
