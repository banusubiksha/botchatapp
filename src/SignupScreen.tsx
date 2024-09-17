import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, ScrollView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'; 
import CheckBox from '@react-native-community/checkbox';



// Function to split text into an array of letters
const splitTextIntoLetters = (text: string) => text.split('');

// Function to create animations for each letter
const createAnimations = (text: string) => {
  return splitTextIntoLetters(text).map((_, index) => {
    const animation = new Animated.Value(-3000); // Start position above the screen
    Animated.timing(animation, {
      toValue: 0, // End position
      duration: 1500,
      delay: index * 100, // Staggered delay
      useNativeDriver: true,
    }).start();
    return animation;
  });
};

// Function to generate a random CAPTCHA code of a given length
const generateCaptcha = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    captcha += characters[randomIndex];
  }
  return captcha;
};

// Validation functions
const isValidName = (name: string) => name.trim().length > 0;
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhoneNumber = (phoneNumber: string) => /^\d{10}$/.test(phoneNumber);
const isValidPassword = (password: string) => password.length >= 6;
const doPasswordsMatch = (password: string, confirmPassword: string) => password === confirmPassword;

// Function to determine password strength
const getPasswordStrength = (password: string) => {
  if (!password) return 'Weak';
  const strength = [
    /[a-z]/, // Lowercase letters
    /[A-Z]/, // Uppercase letters
    /\d/, // Numbers
    /[@$!%*?&]/, // Special characters
  ].filter(pattern => pattern.test(password)).length;

  return strength === 4 ? 'Strong' : strength === 3 ? 'Moderate' : 'Weak';
};

interface MyButtonProps {
  onPress: () => void;
  title: string;
}

const MyButton: React.FC<MyButtonProps> = ({ onPress, title }) => {
  const [buttonPressed, setButtonPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.button, buttonPressed && styles.buttonPressed]}
      onPressIn={() => setButtonPressed(true)} // Set pressed state on press
      onPressOut={() => setButtonPressed(false)} // Reset pressed state on release
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const text = "Sign Up";
  const animations = useState(createAnimations(text))[0];
  const [salutation, setSalutation] = useState(''); // State for salutation
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha(4));
  const [enteredCaptcha, setEnteredCaptcha] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [salutationError, setSalutationError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('Weak'); // New state for password strength

  useEffect(() => {
    // Refresh CAPTCHA when the component mounts
    setCaptcha(generateCaptcha(4));
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha(4));
  };

  const handleCaptchaChange = (text: string) => {
    setEnteredCaptcha(text);
  };

  const handleSignup = async () => {
    let valid = true;

    if (!isValidName(name)) {
     setNameError('Please enter a valid name.');
     valid = false;
    } else {
      setNameError('');
    }

    if (!salutation) {
     setSalutationError('Please select a salutation.');
      valid = false;
    } else {
      setSalutationError('');
    }

    if (!acceptTerms) {
      Alert.alert('You must accept the terms and conditions to proceed.');
      return;
    }

    if (!isValidEmail(email)) {
     setEmailError('Please enter a valid email.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneNumberError('Please enter a valid phone number (10 digits).');
      valid = false;
    } else {
      setPhoneNumberError('');
    }

    if (!isValidPassword(password)) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!doPasswordsMatch(password, confirmPassword)) {
      setConfirmPasswordError('Passwords do not match.');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (enteredCaptcha !== captcha) {
      Alert.alert('CAPTCHA does not match.');
      refreshCaptcha();
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch('http://192.168.1.4:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salutation,
          name,
          email,
          phoneNumber,
          dateOfBirth,
          address,
          password,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert(result.message);
        navigation.replace('Login');
      } else {
        Alert.alert(result.error);
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      Alert.alert('An error occurred. Please try again.');
    }
  };


  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(currentDate);
    }
  };

  // Set maximum date to January 1, 2006
  const maximumDate = new Date(2006, 0, 1);

  // Update password strength whenever password changes
  useEffect(() => {
    setPasswordStrength(getPasswordStrength(password));
  }, [password]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        {splitTextIntoLetters(text).map((letter, index) => (
          <Animated.Text
            key={index}
            style={[styles.title, {
              transform: [{ translateY: animations[index] }],
            }]}
          >
            {letter}
          </Animated.Text>
        ))}
      </View>
      
      <View style={styles.inputContainer}>
        {salutationError ? <Text style={styles.errorText}>{salutationError}</Text> : null}
        <View style={styles.inputWrapper}>
          <Icon name="home" size={30} color="#000" style={styles.icon} />
          <Picker
            selectedValue={salutation}
            onValueChange={(itemValue) => setSalutation(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Mr" value="Mr" />
            <Picker.Item label="Mrs" value="Mrs" />
            <Picker.Item label="Miss" value="Miss" />
          </Picker>
          {salutationError ? <Text style={styles.errorText}></Text> : null}
        </View>
      </View>
    
      <View style={styles.inputContainer}>
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        <View style={styles.inputWrapper}>
          <Icon name="user" size={30} color="#000" style={styles.icon} />
          <TextInput 
            style={[styles.input, nameError ? styles.inputError : {}]} 
            placeholder="Name" 
            placeholderTextColor="#000" 
            value={name}
            onChangeText={setName}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <View style={styles.inputWrapper}>
          <Icon name="envelope" size={30} color="#000" style={styles.icon} />
          <TextInput 
            style={[styles.input, emailError ? styles.inputError : {}]} 
            placeholder="Email" 
            placeholderTextColor="#000" 
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}
        <View style={styles.inputWrapper}>
          <Icon name="phone" size={30} color="#000" style={styles.icon} />
          <TextInput 
            style={[styles.input, phoneNumberError ? styles.inputError : {}]} 
            placeholder="Phone Number" 
            placeholderTextColor="#000" 
            value={phoneNumber}
            keyboardType="numeric"
            onChangeText={setPhoneNumber}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateOfBirth}
            mode="date"
            display="default"
            maximumDate={maximumDate}
            onChange={onChangeDate}
          />
        )}
        <View style={styles.inputWrapper}>
          <Icon name="calendar" size={20} color="#000" style={styles.icon} />
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.datePickerText}>
            {dateOfBirth.getFullYear() === 1970 ? 'Select Date' : dateOfBirth.toDateString()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Icon name="home" size={30} color="#000" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Address" 
            placeholderTextColor="#000" 
            value={address}
            onChangeText={setAddress}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <View style={styles.inputWrapper}>
          <Icon name="lock" size={30} color="#000" style={styles.icon} />
          <TextInput 
            style={[styles.input, passwordError ? styles.inputError : {}]} 
            placeholder="Password" 
            placeholderTextColor="#000" 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Text
    style={[
      styles.passwordStrength,
      passwordStrength === 'Weak' && styles.passwordStrengthWeak,
      passwordStrength === 'Moderate' && styles.passwordStrengthModerate,
      passwordStrength === 'Strong' && styles.passwordStrengthStrong
    ]}
  >
    Strength: {passwordStrength}
  </Text>
      </View>
      <View style={styles.inputContainer}>
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        <View style={styles.inputWrapper}>
          <Icon name="lock" size={30} color="#000" style={styles.icon} />
          <TextInput 
            style={[styles.input, confirmPasswordError ? styles.inputError : {}]} 
            placeholder="Confirm Password" 
            placeholderTextColor="#000" 
            secureTextEntry 
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput 
            style={styles.input} 
            placeholder="Enter CAPTCHA" 
            placeholderTextColor="#000000" 
            value={enteredCaptcha}
            onChangeText={handleCaptchaChange}
          />
          <Text style={styles.captchaText}>{captcha}</Text>
          <TouchableOpacity onPress={refreshCaptcha} style={styles.refreshButton}>
            <Icon name="refresh" size={30} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.checkboxContainer}>
          <CheckBox value={acceptTerms} onValueChange={setAcceptTerms} />
          <Text>I accept the terms and conditions</Text>
        </View>
      <MyButton onPress={handleSignup} title="Sign Up" />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor:'#f7f5f5'
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, // Set border width for all sides
    borderColor: '#2e2d2d', // Set the border color
    borderRadius: 4, 
  },
  input: {
    backgroundColor: '#f7f5f5',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: '#000000',
    fontSize: 15,
    flex:1,
    width:'100%'
  },
  inputError: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, // Set border width for all sides
    borderColor: '#f80808', // Set the border color
    borderRadius: 4, 

  },
  button: {
    backgroundColor: '#050505',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#dddfdd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  datePicker: {
    flex: 1,
    justifyContent: 'center',
  },
  datePickerText: {
    color: '#000000',
    fontSize: 16,
  },
  refreshButton: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  captchaText: {
    position: 'absolute',
    right: 60,
    top: 15,
    color: '#060606',
    fontSize:20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000',
  },
  loginText: {
    color: '#0a0b0a',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  icon: {
    marginRight: 10,
   
    marginLeft:10,
  },
  picker: {
    flex: 1,
    height: 40,
    borderColor: '#0b0b0b',
    borderBottomWidth: 1,
    color: '#000',
  },
  passwordStrength: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333', // Default color
  },
  passwordStrengthWeak: {
    color: 'red', // Weak strength color
  },
  passwordStrengthModerate: {
    color: 'orange', // Moderate strength color
  },
  passwordStrengthStrong: {
    color: 'green', // Strong strength color
  },
  
});

export default SignupScreen;
