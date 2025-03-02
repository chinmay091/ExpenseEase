import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import { signUp, signInWithGoogle } from '../../services/auth';
import { useNavigation } from '@react-navigation/native';
import { StackRouteParamList } from '../../routes/StackRoutes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AntDesign } from '@expo/vector-icons';

const SignUpScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigation = useNavigation<NativeStackNavigationProp<StackRouteParamList>>();

  // Password strength logic
  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return 'Weak';
    if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) return 'Moderate';
    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) return 'Strong';
    return 'Weak';
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (getPasswordStrength(password) === 'Weak') {
      Alert.alert('Error', 'Password is too weak. Use a stronger password.');
      return;
    }

    try {
      await signUp(name, email, password);
      Alert.alert('Success', 'User registered successfully!');
      navigation.navigate('signIn');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      Alert.alert('Success', 'Signed in with Google!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/adaptive-icon.png')} style={styles.logo} />
      <Text style={styles.title}>Sign Up</Text>

      <TextInput style={styles.input} placeholder="Nickname" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Text style={styles.passwordStrength}>{password ? `Strength: ${getPasswordStrength(password)}` : ''}</Text>
      <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <AntDesign name="google" size={24} color="white" />
        <Text style={styles.googleButtonText}>Sign Up with Google</Text>
      </TouchableOpacity>

      <View style={styles.signInContainer}>
        <Text style={styles.text}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('signIn')}>
          <Text style={styles.link}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 200, height: 200, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10, paddingHorizontal: 10 },
  passwordStrength: { fontSize: 14, color: '#555', alignSelf: 'flex-start', marginBottom: 10 },
  signupButton: { width: '100%', backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  signupButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  googleButton: { width: '100%', backgroundColor: '#DB4437', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 8, marginTop: 10 },
  googleButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  signInContainer: { flexDirection: 'row', marginTop: 20 },
  text: { fontSize: 16 },
  link: { fontSize: 16, color: 'blue', marginLeft: 5 },
});

export default SignUpScreen;
