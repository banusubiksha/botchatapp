import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import CustomButton from './CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';


type FormDataKey = keyof typeof FormData;

const ChatScreen = () => {
  const [step, setStep] = useState(0);
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
    about: '',
    skills: '',
    profilePhoto: '',
    document: '',
  });
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Welcome! Please tell me your name.' }
  ]);

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
    { type: 'date', prompt: 'Enter your date of birth.', key: 'dob' }, // New date of birth step
    { type: 'text', prompt: 'Tell me a bit about yourself.', key: 'about' },
    { type: 'text', prompt: 'What are your skills?', key: 'skills' },
    { type: 'image', prompt: 'Please upload a profile photo', key: 'profilePhoto' },
    { type: 'document', prompt: 'Please upload a document (PDF only)', key: 'document' },
    { type: 'final', prompt: 'Thank you! You can now review and save your information.' }
  ];

  const handleNextStep = (response: string) => {
    if (response.trim() === '') {
      setError('Please fill the field.');
      setTimeout(() => setError(null), 2000); // Hide error message after 2 seconds
      return;
    }
  
    const key = chatSteps[step].key as FormDataKey;
  
    if (chatSteps[step].validation && !chatSteps[step].validation(response)) {
      setError('Invalid input, please try again.');
      setTimeout(() => setError(null), 2000); // Hide error message after 2 seconds
      return;
    }
  
    // Proceed with normal processing of valid input
    setFormData(prevFormData => ({ ...prevFormData, [key]: response }));
    setInputValue(''); // Clear the input field after submission
  
    let newMessages = [...messages, { type: 'user', text: response }];
  
    if (step < chatSteps.length - 1) {
      newMessages = [...newMessages, { type: 'bot', text: chatSteps[step + 1].prompt }];
      setStep(step + 1);
    } else {
      newMessages = [...newMessages, { type: 'bot', text: 'All set! You can now review and save your information.' }];
      setStep(step + 1);
    }
  
    setMessages(newMessages);
  };
  

  const handleImagePick = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      if (result) {
        const fileName = result.name || result.uri.split('/').pop();
        setFormData(prevFormData => ({ ...prevFormData, profilePhoto: result.uri }));
        handleNextStep(fileName || ''); 
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
        setFormData(prevFormData => ({ ...prevFormData, document: result.uri }));
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
  };

  const handleEditField = (field: FormDataKey) => {
    setEditField(field);
    setIsEditing(false);
    const stepIndex = chatSteps.findIndex(step => step.key === field);
    setStep(stepIndex);
    setMessages([
      ...messages,
      { type: 'bot', text: chatSteps[stepIndex].prompt }
    ]);
  };

  const handleSaveInformation = () => {
    Alert.alert('Success', 'Your details are saved successfully.');
    setMessages([
      ...messages,
      { type: 'bot', text: 'Information saved!' }
    ]);
    setIsEditing(false);
    setStep(chatSteps.findIndex(step => step.type === 'final'));
  };

  const renderEditOptions = () => {
    return (
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
    );
  };

  const renderInputField = () => {
    const currentStep = chatSteps[step];

    if (!currentStep) return null;

    switch (currentStep.type) {
      case 'text':
        return (
          <View style={styles.inputContainer}>
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
          </View>
        );
        case 'date':
      return (
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.sendButtonText}>
              {selectedDate ? selectedDate.toDateString() : 'Select Date of Birth'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
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
        return (
          <View style={styles.buttonContainer}>
            {currentStep.options?.map((option, index) => (
              <CustomButton key={index} title={option} onPress={() => handleNextStep(option)} />
            ))}
          </View>
        );
      case 'image':
        return <CustomButton title="Upload Photo" onPress={handleImagePick} />;
      case 'document':
        return <CustomButton title="Upload Document" onPress={handleDocumentPick} />;
      case 'final':
        return (
          <View style={styles.finalReviewContainer}>
            <Text style={styles.finalReviewText}>Name: {formData.name}</Text>
            <Text style={styles.finalReviewText}>Qualification: {formData.qualification}</Text>
            <Text style={styles.finalReviewText}>Phone: {formData.phone}</Text>
            <Text style={styles.finalReviewText}>About: {formData.about}</Text>
            <Text style={styles.finalReviewText}>Skills: {formData.skills}</Text>
            {formData.profilePhoto ? (
              <Image source={{ uri: formData.profilePhoto }} style={styles.image} />
            ) : null}
            {formData.document ? <Text style={styles.finalReviewText}>Document: Uploaded</Text> : null}
            <CustomButton title="Edit Information" onPress={handleEdit} />
            <CustomButton title="Save Information" onPress={handleSaveInformation} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={[
              styles.message, 
              msg.type === 'user' ? styles.userMessage : 
              msg.type === 'error' ? styles.errorMessage : 
              styles.botMessage
            ]}>
            <Text style={msg.type === 'error' ? styles.errorMessageText : styles.messageText}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      {isEditing ? renderEditOptions() : renderInputField()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    marginVertical: 4,
    padding: 8,
    borderRadius: 55,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#000000', 
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#000000', 
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom:10,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    flex: 1,
    height:40,
    borderColor: '#ccc', 
    borderWidth: 1,
    borderRadius: 40,
    padding: 10,
    color: '#000000', 
    backgroundColor: '#ffffff', 
  },
 
  sendButton: {
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 8,
  },
  finalReviewContainer: {
    marginTop: 20,
  },
  finalReviewText: {
    marginBottom: 8,
    color: '#000000', 
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
    borderColor: '#000000', 
    borderWidth: 1,
  },
  errorMessageText: {
    color: 'red',
  },
  editOptionsContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 16,
    
  },
  messageText: {
    color: '#fff', 
    fontSize:13,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    position: 'absolute',
    bottom: -20, // Adjust based on your layout
    left: 0,
    fontSize: 12,
  },
  datePickerButton: {
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
 
});

export default ChatScreen;
