import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Connect from '../pages/Connect';
import Connections from '../pages/Connections';
import History from '../pages/History';
import Home from '../pages/Home';
import Transactions from '../pages/Transactions';
import ManualConnect from '../pages/ManualConnect';
import AddTransactionScreen from '../pages/AddTransactionScreen/AddTransactionScreen';
import CameraScreen from '../pages/CameraScreen/CameraScreen';
import { useAuth } from '../contexts/AuthContext';
import SignInScreen from '../pages/SignUp/SignInScreen';
import SignUpScreen from '../pages/SignUp/SignUpScreen';

export type StackRouteParamList = {
  home: undefined;
  connections: undefined;
  connect: { updateItemId?: string };
  manualConnect: undefined;
  transactions: undefined;
  history: undefined;
  signIn: undefined;
  signUp: undefined;
};

const { Screen, Navigator, Group } = createNativeStackNavigator<StackRouteParamList>();

const StackRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // Show loading spinner or splash screen

  return (
    <Navigator initialRouteName={user ? 'home' : 'signUp'}>
      {/* Authenticated Routes */}
      {user ? (
        <Group screenOptions={{ headerShown: false }}>
          <Screen name="home" component={Home} />
          <Screen name="connections" component={Connections} />
          <Screen name="connect" component={Connect} />
          <Screen name="manualConnect" component={ManualConnect} />
          <Screen name="transactions" component={Transactions} />
          <Screen name="history" component={History} />
          <Screen name="AddTransaction" component={AddTransactionScreen} />
          <Screen name="CameraScreen" component={CameraScreen} />
        </Group>
      ) : (
        <Group screenOptions={{ headerShown: false }}>
          <Screen name="signIn" component={SignInScreen} />
          <Screen name="signUp" component={SignUpScreen} />
        </Group>
      )}
    </Navigator>
  );
};

export default StackRoutes;
