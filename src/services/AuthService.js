import { useAuth } from "vue-clerk";

let authState = null;

export function initializeAuth() {
  if (!authState) {
    const auth = useAuth();
    authState = {
      isLoaded: auth.isLoaded,
      isSignedIn: auth.isSignedIn,
      userId: auth.userId,
    };
  }
  return authState;
}

export function getAuthState() {
  return authState;
}