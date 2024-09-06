import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState<null | User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const signMeIn = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/plus.login");
    signInWithRedirect(auth, provider);
  };

  const signMeOut = () => {
    signOut(auth).then(() => {
      setUser(null);
      navigate("/");
    });
  };

  useEffect(() => {
    // Listening for auth state changes.
    onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setUser(user);
        //   navigate("/konfigurieren");
        console.log(location);
      }
      setIsLoading(false);
    });
  }, []);

  return { user, isLoading, signIn: signMeIn, signOut: signMeOut };
};
