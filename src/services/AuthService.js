import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

// E-mail/Senha
export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export async function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Google
const provider = new GoogleAuthProvider();
export async function loginWithGoogle() {
  return signInWithPopup(auth, provider);
}

// Logout
export async function logout() {
  return signOut(auth);
}

export function getCurrentUser() {
  return auth.currentUser;
}