import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // This adds space below each button
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default CustomButton;
