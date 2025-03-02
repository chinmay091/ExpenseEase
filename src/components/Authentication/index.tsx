// src/components/Authentication/index.tsx
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useCallback, useEffect, useState } from 'react';
import Text from '../Text';
import { AuthButton, Container, SpashImage } from './styles';
import { useAuth } from '../../contexts/AuthContext';

export type AuthenticateProps = {
  children: React.ReactNode;
};

const AuthenticationProvider: React.FC<AuthenticateProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAuthenticated, setAuthenticated] = useState(false);

  const authenticate = async () => {
    const authTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (!authTypes) return true;

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock your app',
      });
      return result.success;
    } catch (error) {
      return false;
    }
  };

  const authenticationRoutine = useCallback(async () => {
    if (user) {
      const isAuthenticated = __DEV__ || (await authenticate());
      setAuthenticated(isAuthenticated);
    }
  }, [user]);

  useEffect(() => {
    if (!loading) {
      authenticationRoutine();
    }
  }, [authenticationRoutine, loading]);

  if (loading) return null;

  return user && isAuthenticated ? (
    <>{children}</>
  ) : (
    <Container>
      <SpashImage source={require('../../assets/splash.png')} />
      <AuthButton onPress={authenticationRoutine}>
        <Text variant="title">Use phone password</Text>
      </AuthButton>
    </Container>
  );
};

export default AuthenticationProvider;
