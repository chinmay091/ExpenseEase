import {
  Inter_300Light,
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import React, { useEffect } from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from 'styled-components/native';
import { TransactionProvider } from './src/contexts/TransactionContext';
import { AppContextProvider } from './src/contexts/AppContext';
import { AuthProvider } from './src/contexts/AuthContext';  
import HooksProvider from './src/hooks/index';
import Routes from './src/routes';
import dark from './src/theme/dark';
import light from './src/theme/light';
import './src/services/firebaseConfig'; 

moment.locale('en');

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });

  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? dark : light;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppContextProvider>
          <TransactionProvider>
            <HooksProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                  <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar style="light" backgroundColor={theme.colors.primary} />
                    <Routes />
                    <Toast />
                  </SafeAreaView>
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </HooksProvider>
          </TransactionProvider>
        </AppContextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
