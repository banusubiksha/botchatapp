import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const UploadProfilePhotoScreen: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: ['image/*'], //image files
      });

      if (res && res.length > 0) {
        const file = res[0];
        
        // Create a FormData object to handle the file upload
        const formData = new FormData();
        formData.append('profilePhoto', {
          uri: file.uri,
          type: file.type || 'image/jpeg', //Use a default type if type is null
          name: file.name || 'profile-photo.jpg', //Use a default name if name is null
        } as any); 

        // upload the file to your server
        //await fetch('YOUR_API_ENDPOINT', {
        //  method: 'POST',
        //  body: formData,
        // });

        setProfilePhoto(file.uri);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('DocumentPicker Error: ', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      {profilePhoto ? (
        <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholder}>
          <Button title="Pick an image" onPress={pickDocument} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UploadProfilePhotoScreen;
