import React from 'react';
import { PlaidServiceContextProvider } from './useplaidService'; // Updated to use PlaidService

const HooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PlaidServiceContextProvider>{children}</PlaidServiceContextProvider>;
};

export default HooksProvider;
