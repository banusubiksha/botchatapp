import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const HomeScreen = () => {
  const formData = useSelector((state: RootState) => state.form.formData);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (formData.name) {
      setShowWelcome(false); // Hide welcome message after saving information
    }
  }, [formData]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {showWelcome ? (
          <Text style={styles.title}>Welcome! Please Go to Chat and save your information.</Text>
        ) : (
          <View>
            <Text style={styles.title}>Saved Information:</Text>
            <View style={styles.card}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.info}>{formData.name}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Qualification:</Text>
              <Text style={styles.info}>{formData.qualification}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.info}>{formData.phone}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.info}>{formData.dob}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>About:</Text>
              <Text style={styles.info}>{formData.about}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Skills:</Text>
              <Text style={styles.info}>{formData.skills}</Text>
            </View>
            {formData.document && (
              <View style={styles.card}>
                <Text style={styles.label}>Document:</Text>
                <Text style={styles.info}>{formData.document}</Text>
              </View>
            )}
              {formData.profilePhoto ? (
        <View style={styles.card}>
          <Text style={styles.label}>Profile Photo:</Text>
          <Text style={styles.info}>{formData.profilePhoto.split('/').pop()}</Text>
        </View>
      ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f5',
  },
  content: {
    paddingBottom: 80, // Adjust this value to prevent overlap with the bottom navigation bar
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});

export default HomeScreen;
