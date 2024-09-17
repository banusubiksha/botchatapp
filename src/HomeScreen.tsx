// HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const HomeScreen = () => {
  const formData = useSelector((state: RootState) => state.form.formData);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Information:</Text>
      <Text>Name: {formData.name}</Text>
      <Text>Qualification: {formData.qualification}</Text>
      <Text>Phone: {formData.phone}</Text>
      <Text>Date of Birth: {formData.dob}</Text>
      <Text>About: {formData.about}</Text>
      <Text>Skills: {formData.skills}</Text>
      {formData.profilePhoto ? (
        <Image source={{ uri: formData.profilePhoto }} style={styles.image} />
      ) : null}
      {/* {formData.document ? (
        <Text>Document: {FormData.document}</Text>
      ) : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
    borderColor: '#000',
    borderWidth: 1,
  },
});

export default HomeScreen;