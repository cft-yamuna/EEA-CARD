import { LockKeyhole, UserRound } from "lucide-react";
import { FormEvent, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { StatusBanner } from "../components/StatusBanner";

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps): ReactElement {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.endsWith("@craftech360.com")) {
      setError("Access Denied. Use your @craftech360.com email address.");
      return;
    }

    setError("");
    onLogin(normalizedEmail);
    navigate("/dashboard");
  }

  return (
    <main className="auth-screen">
      <div className="auth-orb auth-orb-top-left" aria-hidden="true" />
      <div className="auth-orb auth-orb-top-right" aria-hidden="true" />
      <div className="auth-orb auth-orb-top-front" aria-hidden="true" />
      <div className="auth-orb auth-orb-bottom-left" aria-hidden="true" />
      <div className="auth-orb auth-orb-bottom-dot" aria-hidden="true" />

      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-tabs" aria-label="Authentication mode">
          <button className="auth-tab auth-tab-active" type="button">
            Login
          </button>
        </div>

        <h1 className="visually-hidden" id="login-title">
          Craftech 360 Card Capture Login
        </h1>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>User Email</span>
            <div className="input-wrap">
              <UserRound aria-hidden="true" size={18} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@craftech360.com"
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="field">
            <span>Password</span>
            <div className="input-wrap">
              <LockKeyhole aria-hidden="true" size={18} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {error ? <StatusBanner kind="error" message={error} /> : null}

          <button className="button button-primary auth-submit" type="submit">
            Login
          </button>
        </form>
      </section>
    </main>
  );
}
