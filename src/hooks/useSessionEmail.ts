import { useCallback, useState } from "react";

const SESSION_EMAIL_KEY = "craftech360.session.email";

export function useSessionEmail(): {
  email: string;
  setEmail: (email: string) => void;
  clearEmail: () => void;
} {
  const [email, setEmailState] = useState(() => {
    return window.localStorage.getItem(SESSION_EMAIL_KEY) ?? "";
  });

  const setEmail = useCallback((nextEmail: string) => {
    window.localStorage.setItem(SESSION_EMAIL_KEY, nextEmail);
    setEmailState(nextEmail);
  }, []);

  const clearEmail = useCallback(() => {
    window.localStorage.removeItem(SESSION_EMAIL_KEY);
    setEmailState("");
  }, []);

  return { email, setEmail, clearEmail };
}
