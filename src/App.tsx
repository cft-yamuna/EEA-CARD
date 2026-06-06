import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import { DashboardPage } from "./pages/DashboardPage";
import { GalleryPage } from "./pages/GalleryPage";
import { LoginPage } from "./pages/LoginPage";
import { useSessionEmail } from "./hooks/useSessionEmail";

export function App(): ReactElement {
  const { email, setEmail, clearEmail } = useSessionEmail();

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={setEmail} />} />
      <Route
        path="/dashboard"
        element={
          email ? (
            <DashboardPage userEmail={email} onSignOut={clearEmail} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/gallery"
        element={email ? <GalleryPage /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to={email ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}
