import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SplashScreenProps {
  navigation: any; // Replace with actual navigation prop type if using navigation
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const textArray = 'Welcome to Legal123 App!'.split('');

  useEffect(() => {
    // Start the animation
    Animated.timing(animatedValue, {
      toValue: textArray.length,
      duration: textArray.length * 100, // Adjust the speed of the animation
      useNativeDriver: true,
    }).start();

    // Navigate to the Login screen after a delay
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Use the correct name of the screen
    }, (textArray.length * 100) + 1000); // Adjust delay to finish animation

    return () => clearTimeout(timer);
  }, [animatedValue, textArray, navigation]);

  const renderAnimatedText = () => {
    return textArray.map((letter, index) => {
      const opacity = animatedValue.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });

      return (
        <Animated.Text key={index} style={[styles.text, { opacity }]}>
          {letter}
        </Animated.Text>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../src/assets/logo.png')} style={styles.logo} />

      <View style={styles.textContainer}>
        {renderAnimatedText()}
      </View>
      <Icon name="check-circle" size={30} color="#000" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Adjust background color as needed
  },
  logo: {
    width: 200, // Adjust width as needed
    height: 200, // Adjust height as needed
    marginBottom: 20, // Adjust margin as needed
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333', // Adjust text color as needed
    fontFamily: 'CustomFont', // Replace with your custom font name
  },
  icon: {
    marginTop: 20, // Adjust margin as needed
  },
});

export default SplashScreen;



