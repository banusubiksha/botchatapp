// HelpScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this matches your installed icon library

// Define types for the button data
interface ButtonData {
  name: string;
  icon: string;
}

// Define button data
const buttons: ButtonData[] = [
  { name: 'Get Your Advocate', icon: 'gavel' },
  { name: 'Family Counselling', icon: 'family-restroom' }, // Updated icon name if needed
  { name: 'Matrimonial Counselling', icon: 'people' }, // Updated icon name if needed
  { name: 'Document Translation', icon: 'translate' },
  { name: 'Property Verification', icon: 'location-city' },
  { name: 'Online Consultation', icon: 'videocam' },
  { name: 'Drafting', icon: 'description' },
  { name: 'Templates', icon: 'folder' }, // Added Templates button
];

const HelpScreen: React.FC = () => {
  // Function to handle button press
  const handlePress = (event: GestureResponderEvent) => {
    // Handle button press logic here
    console.log('Button pressed');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {buttons.map((button, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={handlePress}>
            <Icon name={button.icon} size={30} color="#000" style={styles.icon} />
            <Text style={styles.buttonText}>{button.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#000',
  },
  icon: {
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default HelpScreen;
