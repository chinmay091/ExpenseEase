import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera'; // Import camera functionality
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Animated, StyleSheet, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const AddTransactionButton: React.FC = () => {
  // Initialize state with null, but expect it to later hold a boolean
  const [hasCameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const navigation = useNavigation();

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
    if (status === 'granted') {
      navigation.navigate('CameraScreen'); // Replace this with your camera functionality
    } else {
      console.log('Camera permission not granted');
    }
  };

  const toggleMenu = () => {
    setIsChecked(!isChecked);
    Animated.timing(animation, {
      toValue: isChecked ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const iconStyle = (index: number) => {
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -60 * (index + 1)],
    });
    const opacity = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return {
      transform: [{ translateY }],
      opacity,
    };
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={toggleMenu}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      {isChecked && (
        <>
          <Animated.View style={[styles.iconContainer, iconStyle(0)]}>
            <TouchableOpacity onPress={requestCameraPermission}>
              <View style={styles.iconBackground}>
                <FontAwesome5 name="camera" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[styles.iconContainer, iconStyle(1)]}>
            <TouchableOpacity onPress={() => navigation.navigate('AddTransaction')}>
              <View style={styles.iconBackground}>
                <FontAwesome5 name="keyboard" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#40E0D0',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 24,
    color: '#FFF',
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    backgroundColor: '#40BEBE',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddTransactionButton;
