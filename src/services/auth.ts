import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// Firestore collection name
const USERS_COLLECTION = 'users';

// Register with email and password
export const signUp = async (name: string, email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update displayName in Firebase Authentication
  await updateProfile(user, { displayName: name });

  // Store user details in Firestore
  await saveUserToFirestore(user, name);

  return user;
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Google Sign-In
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if user already exists in Firestore
  const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
  if (!userDoc.exists()) {
    // If user doesn't exist, save them and set displayName
    await saveUserToFirestore(user, user.displayName || 'Google User');

    // Update displayName in Firebase Authentication (if not set)
    if (!user.displayName) {
      await updateProfile(user, { displayName: 'Google User' });
    }
  }

  return user;
};

// Store user details in Firestore
const saveUserToFirestore = async (user: User, name: string) => {
  await setDoc(doc(db, USERS_COLLECTION, user.uid), {
    name,
    email: user.email,
    authMethod: user.providerData[0].providerId,
    createdAt: new Date().toISOString(),
  });
};

// Sign out
export const logOut = async () => {
  await signOut(auth);
};
