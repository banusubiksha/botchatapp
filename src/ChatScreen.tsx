import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet, Alert, TouchableOpacity, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import CustomButton from './CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNFS from 'react-native-fs';
import { useDispatch } from 'react-redux';
import axios from 'axios'; // Import axios for making API calls

type FormDataKey = keyof typeof FormData;

const ChatScreen = () => {
  const dispatch = useDispatch(); 

  const [step, setStep] = useState(0);
  const [showButtonForStep, setShowButtonForStep] = useState<number | null>(null);

  const [showEditOptions, setShowEditOptions] = useState(true);

  const shakeAnimation = useRef(new Animated.Value(0)).current; 
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState<FormDataKey | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    phone: '',
    dob: '',
    about: '',
    skills: '',
    profilePhoto: '',
    document: '',
  });
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Welcome! Please tell me your name.' }
  ]);
  const [showButtons, setShowButtons] = useState(true); // State to control button visibility

  const chatSteps = [
    { type: 'text', prompt: 'Welcome! Please tell me your name.', key: 'name' },
    { 
      type: 'menu', 
      prompt: 'What is your qualification?', 
      key: 'qualification',
      options: ['B.Tech', 'B.E', 'B.Sc', 'M.Tech', 'M.Sc']
    },
    { 
      type: 'text', 
      prompt: 'Enter your phone number.', 
      key: 'phone', 
      validation: (value: string) => /^\d{10}$/.test(value)
    },
    { type: 'date', prompt: 'Enter your date of birth.', key: 'dob' },
    { type: 'text', prompt: 'Tell me a bit about yourself.', key: 'about' },
    { type: 'text', prompt: 'What are your skills?', key: 'skills' },
    { type: 'image', prompt: 'Please upload a profile photo', key: 'profilePhoto' },
    { type: 'document', prompt: 'Please upload a document (PDF only)', key: 'document' },
    { type: 'final', prompt: 'Thank you! You can now review and save your information.' }
  ];

  const shakeInputContainer = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10, // Move 10px to the right
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10, // Move 10px to the left
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10, // Move back to the right
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0, // Move back to the original position
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNextStep = (response: string) => {
    if (response.trim() === '') {
      setError('Please fill the field.');
      shakeInputContainer();
      setTimeout(() => setError(null), 2000);
      return;
    }
  
    const key = chatSteps[step].key as FormDataKey;
  
    // If the input validation fails, show error
    if (chatSteps[step].validation && !chatSteps[step].validation(response)) {
      setError('Invalid input, please try again.');
      shakeInputContainer();
      setTimeout(() => setError(null), 2000);
      return;
    }
  
    // Update the formData with the new input
    setFormData((prevFormData: any) => ({ ...prevFormData, [key]: response }));
    setInputValue('');
  
    // Update the messages with the user's response
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', text: response }
    ]);
  
    // Check if the app is in editing mode
    if (isEditing) {
      // Exit editing mode and directly go back to review screen
      setIsEditing(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: 'You can now review and save your information.' }
      ]);
      
      // Go back to the review step (where the user can save or continue editing)
      setStep(chatSteps.findIndex(step => step.type === 'final'));
      setShowButtonForStep(null);
    } else {
      // If not editing, continue to the next step in the flow
      if (step < chatSteps.length - 1) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'bot', text: chatSteps[step + 1].prompt }
        ]);
        setStep(step + 1);
        if (chatSteps[step + 1].type === 'menu') {
          setShowButtons(true);
          setShowButtonForStep(step + 1); // Show buttons
        } else {
          setShowButtons(false);
           setShowButtonForStep(null); // Hide buttons
        }
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'bot', text: 'All set! You can now review and save your information.' }
        ]);
        setStep(chatSteps.findIndex(step => step.type === 'final'));
        setShowButtons(false);
      }
    }
  };
  
  
  

  const handleImagePick = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      if (result) {
        const base64String = await RNFS.readFile(result.uri, 'base64');
        setFormData((prevFormData: any) => ({ ...prevFormData, profilePhoto: base64String }));
        handleNextStep(result.name || ''); 
      }
    } catch (err) {
      console.error('Image picking error: ', err);
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      if (result) {
        const fileName = result.name || result.uri.split('/').pop();
        setFormData((prevFormData: any) => ({ ...prevFormData, document: result.uri }));
        handleNextStep(fileName || ''); 
      }
    } catch (err) {
      console.error('Document picking error: ', err);
    }
  };

  const handleEdit = () => {
    setMessages([
      ...messages,
      { type: 'bot', text: 'Which field would you like to edit?' },
    ]);
    setIsEditing(true);
    setShowButtons(false);
    setStep(chatSteps.findIndex(step => step.type==='text'));
  };
  const handleEditField = (field: FormDataKey) => {
    setEditField(field); // Set the field being edited
    setIsEditing(true);  // Enable edit mode
  
    // Find the step index for the selected field
    const stepIndex = chatSteps.findIndex((step) => step.key === field);
    
    // Set the current step to the one corresponding to the field being edited
    setStep(stepIndex);
  
    // Update the conversation messages to prompt the user for the specific field
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'bot', text: `You are editing your ${field}. ${chatSteps[stepIndex].prompt}` }
    ]);
  
    setShowButtons(false); 
    setShowEditOptions(false); // Hide buttons while editing
    
  };

  
  

  const handleSaveInformation = async () => {
    try {
      await axios.post('http://192.168.1.4:3000/auth/save-user-data', formData);
      
      Alert.alert('Success', 'Your details are saved successfully.');
      setMessages([
        ...messages,
        { type: 'bot', text: 'Information saved!' }
      ]);
      setIsEditing(false);
      setStep(chatSteps.findIndex(step => step.type === 'final'));
    } catch (error) {
      console.error('Error saving user data: ', error);
      Alert.alert('Error', 'There was an error saving your information. Please try again.');
    }
  };

  const renderEditOptions = () => {
    return showEditOptions ? ( // Use the state variable to control visibility
      <View style={styles.editOptionsContainer}>
        {Object.keys(formData).map((key) => (
          <CustomButton
            key={key}
            title={`Edit ${key.charAt(0).toUpperCase() + key.slice(1)}`}
            onPress={() => handleEditField(key as FormDataKey)}
          />
        ))}
        <CustomButton title="Save Information" onPress={handleSaveInformation} />
      </View>
    ) : null;
  };
  

  const renderInputField = () => {
    const currentStep = chatSteps[step];

    if (!currentStep) return null;

    switch (currentStep.type) {
      case 'text':
        return (
          <Animated.View style={styles.inputContainer}>
            <TextInput
              placeholder={error || "Type your response..."}
              style={[
                styles.input, 
                error ? styles.inputError : null
              ]}
              onSubmitEditing={(e) => handleNextStep(e.nativeEvent.text)}
              value={inputValue}
              onChangeText={setInputValue}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity style={styles.sendButton} onPress={() => handleNextStep(inputValue)}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </Animated.View>
        );
        case 'date':
          const today = new Date();
          // Calculate the date 18 years ago
          const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        
          return (
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.sendButtonText}>
                  {selectedDate ? selectedDate.toDateString() : 'Select Date of Birth'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display="default"
                  maximumDate={eighteenYearsAgo} // Restrict to dates before 18 years ago
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      setSelectedDate(date);
                      handleNextStep(date.toDateString());
                    }
                  }}
                />
              )}
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          );
        
      case 'menu':
        return showButtons ? (
          <View style={styles.buttonContainer}>
            {currentStep.options?.map((option, index) => (
              <CustomButton key={index} title={option} onPress={() => {
                handleNextStep(option);
                setShowButtons(false); // Hide buttons after selection
              }} />
            ))}
          </View>
        ) : <View style={styles.buttonContainer}>
        {currentStep.options?.map((option, index) => (
          <CustomButton key={index} title={option} onPress={() => {
            handleNextStep(option);
            setShowButtons(false); // Hide buttons after selection
          }} />
        ))}
      </View>;
      case 'image':
        return (
          <View style={styles.buttonContainer}>
            <CustomButton title="Upload Image" onPress={handleImagePick} />
          </View>
        );
      case 'document':
        return (
          <View style={styles.buttonContainer}>
            <CustomButton title="Upload Document" onPress={handleDocumentPick} />
          </View>
        );
      case 'final':
        return !isEditing ? (
          <View style={styles.finalReviewContainer}>
            <Text style={styles.finalReviewText}>Name: {formData.name}</Text>
            <Text style={styles.finalReviewText}>Qualification: {formData.qualification}</Text>
            <Text style={styles.finalReviewText}>Phone: {formData.phone}</Text>
            <Text style={styles.finalReviewText}>Date of Birth: {formData.dob}</Text>
            <Text style={styles.finalReviewText}>About: {formData.about}</Text>
            <Text style={styles.finalReviewText}>Skills: {formData.skills}</Text>
            {formData.profilePhoto ? (
              <Image source={{ uri: formData.profilePhoto }} style={styles.image} />
            ) : null}
            <CustomButton title="Edit Information" onPress={handleEdit} />
            <CustomButton title="Save Information" onPress={handleSaveInformation} />
          </View>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }} // Adjust padding to accommodate the fixed input container and buttons
      >
        {/* Chat messages rendering */}
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              msg.type === 'bot' ? styles.botMessage : styles.userMessage,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
        
        {/* Render edit options if in editing mode */}
        {isEditing && (
          <View style={styles.editOptionsContainer}>
            {renderEditOptions()}
          </View>
        )}
      </ScrollView>
  
      {/* Fixed input container */}
      <View style={[styles.inputContainer, { position: 'absolute', bottom: 0, width: '100%' }]}>
        {renderInputField()}
      </View>
    </KeyboardAvoidingView>
  );
  
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f5', 
  },
  messageContainer: {
    marginVertical: 5,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
    shadowColor: '#df2f2f', // Subtle shadow for better contrast
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  scrollViewContainer: {
    paddingBottom: 20,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  botMessage: {
    backgroundColor: '#e1e1e6', 
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
    shadowColor: '#000', // Subtle shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  userMessage: {
    backgroundColor: '#d1ffd3', 
    alignSelf: 'flex-end',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#000', 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 40,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 42,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
  },
  sendButton: {
    marginLeft: 10,
    padding: 12,
    backgroundColor: '#0b0b0b', 
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Center the buttons
    marginVertical: 100,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: '#090909',
    borderRadius: 8,
    alignItems: 'center',
  },
  finalReviewContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  finalReviewText: {
    fontSize: 16,
    marginVertical: 3,
    color: '#333', 
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
  editOptionsContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginVertical: 10,
  },
});

export default ChatScreen;