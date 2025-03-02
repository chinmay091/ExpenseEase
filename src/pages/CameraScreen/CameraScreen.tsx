// CameraScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import Tesseract from 'tesseract.js';

const CameraScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>('');

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    requestCameraPermission();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setImageUri(photo.uri);
      recognizeText(photo.uri);
    }
  };

  const recognizeText = async (uri: string) => {
    if (uri) {
      Tesseract.recognize(
        uri,
        'eng', // Change this to your desired language
        {
          logger: (info) => console.log(info), // Log progress
        },
      )
        .then(({ data: { text } }) => {
          setOcrText(text);
        })
        .catch((error) => {
          console.error('OCR error:', error);
          setOcrText('Error recognizing text');
        });
    }
  };

  if (hasPermission === null) {
    return (
      <View>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={setCameraRef}>
        <View style={styles.buttonContainer}>
          <Button title="Take Picture" onPress={takePicture} />
          {imageUri && <Image source={{ uri: imageUri }} style={styles.capturedImage} />}
          {ocrText ? (
            <Text style={styles.text}>{ocrText}</Text>
          ) : (
            <Text style={styles.text}>No text recognized yet.</Text>
          )}
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  capturedImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
});

export default CameraScreen;
