import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import { signIn, signInWithGoogle } from '../../services/auth';
import { useNavigation } from '@react-navigation/native';
import { StackRouteParamList } from '../../routes/StackRoutes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AntDesign } from '@expo/vector-icons'; // For Google icon

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<NativeStackNavigationProp<StackRouteParamList>>();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await signIn(email, password);
      Alert.alert('Success', 'Signed in successfully!');
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
      <Text style={styles.title}>Sign In</Text>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <AntDesign name="google" size={24} color="white" />
        <Text style={styles.googleButtonText}>Sign In with Google</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.text}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('signUp')}>
          <Text style={styles.link}>Sign Up</Text>
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
  signInButton: { width: '100%', backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  signInButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  googleButton: { width: '100%', backgroundColor: '#DB4437', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 8, marginTop: 10 },
  googleButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  signUpContainer: { flexDirection: 'row', marginTop: 20 },
  text: { fontSize: 16 },
  link: { fontSize: 16, color: 'blue', marginLeft: 5 },
});

export default SignInScreen;
