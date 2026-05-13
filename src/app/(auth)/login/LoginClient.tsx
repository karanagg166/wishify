"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { signIn, signUp } from "@/lib/auth-client";
import { APP_NAME, APP_DESCRIPTION } from "@/constants/config";
import { ROUTES } from "@/constants/routes";

type View = "landing" | "loading";
type AuthMode = "signin" | "signup";

export default function LoginClient() {
  const router = useRouter();
  const [view, setView] = useState<View>("landing");
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleGoogle() {
    setView("loading");
    try {
      await signIn.social({ provider: "google", callbackURL: ROUTES.HOME });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setView("landing");
    }
  }

  async function handleGuest() {
    setView("loading");
    try {
      await signIn.anonymous();
      router.push(ROUTES.HOME);
    } catch {
      setError("Could not sign in as guest. Please try again.");
      setView("landing");
    }
  }

  async function handleEmailAuth() {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    if (authMode === "signup" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setView("loading");
    setError(null);
    try {
      if (authMode === "signup") {
        await signUp.email({
          email: email.trim(),
          password: password.trim(),
          name: name.trim(),
        });
      } else {
        await signIn.email({
          email: email.trim(),
          password: password.trim(),
        });
      }
      router.push(ROUTES.HOME);
    } catch {
      setError(
        authMode === "signup"
          ? "Sign up failed. Email may already be in use."
          : "Invalid email or password."
      );
      setView("landing");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white overflow-hidden relative">
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-15%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, hsl(267 83% 96%) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, hsl(27 96% 96%) 0%, transparent 70%)",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {view === "loading" ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            <LoadingSpinner />
            <p className="text-gray-500 text-sm">Signing you in…</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "100%",
              maxWidth: 420,
              margin: "0 auto",
              padding: "0 1.25rem",
              position: "relative",
              zIndex: 10,
            }}
          >
            {/* Logo / Brand */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "1.25rem",
                  marginBottom: "1rem",
                  background: "linear-gradient(135deg, #7c3aed, #f97316)",
                  boxShadow: "0 8px 24px rgb(124 58 237 / 0.28)",
                }}
              >
                <span style={{ fontSize: 30 }}>🎉</span>
              </motion.div>

              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  marginBottom: "0.5rem",
                }}
                className="gradient-text"
              >
                {APP_NAME}
              </h1>
              <p style={{ color: "#6b7280", fontSize: "0.9375rem" }}>
                {APP_DESCRIPTION}
              </p>
            </div>

            {/* Auth card */}
            <div className="card" style={{ padding: "1.75rem", borderRadius: "1.25rem" }}>
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "0.625rem",
                      padding: "0.75rem 1rem",
                      marginBottom: "1rem",
                      color: "#dc2626",
                      fontSize: "0.875rem",
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Google */}
                <button
                  id="btn-google-signin"
                  onClick={handleGoogle}
                  className="btn-secondary"
                  style={{
                    width: "100%",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    padding: "0.75rem 1.5rem",
                  }}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                {/* Divider */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "#9ca3af",
                    fontSize: "0.8125rem",
                  }}
                >
                  <hr style={{ flex: 1, border: "none", borderTop: "1px solid #e5e7eb" }} />
                  or continue with email
                  <hr style={{ flex: 1, border: "none", borderTop: "1px solid #e5e7eb" }} />
                </div>

                {/* Email / Password form */}
                {authMode === "signup" && (
                  <input
                    id="email-name-input"
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(null); }}
                    style={{
                      width: "100%",
                      padding: "0.7rem 1rem",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: "0.625rem",
                      fontSize: "0.9375rem",
                      outline: "none",
                      background: "#f9fafb",
                      transition: "border-color 0.2s",
                    }}
                  />
                )}

                <input
                  id="email-input"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  style={{
                    width: "100%",
                    padding: "0.7rem 1rem",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "0.625rem",
                    fontSize: "0.9375rem",
                    outline: "none",
                    background: "#f9fafb",
                    transition: "border-color 0.2s",
                  }}
                />

                <input
                  id="password-input"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  style={{
                    width: "100%",
                    padding: "0.7rem 1rem",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "0.625rem",
                    fontSize: "0.9375rem",
                    outline: "none",
                    background: "#f9fafb",
                    transition: "border-color 0.2s",
                  }}
                />

                <button
                  id="btn-email-signin"
                  onClick={handleEmailAuth}
                  className="btn-primary"
                  style={{ width: "100%", padding: "0.75rem 1.5rem" }}
                >
                  {authMode === "signup" ? "🚀 Create Account" : "📧 Sign In with Email"}
                </button>

                <button
                  id="btn-toggle-auth-mode"
                  onClick={() => {
                    setAuthMode((m) => (m === "signin" ? "signup" : "signin"));
                    setError(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#7c3aed",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    fontWeight: 500,
                    padding: "0.25rem",
                  }}
                >
                  {authMode === "signin"
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>

                {/* Divider */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "#9ca3af",
                    fontSize: "0.8125rem",
                  }}
                >
                  <hr style={{ flex: 1, border: "none", borderTop: "1px solid #e5e7eb" }} />
                  or
                  <hr style={{ flex: 1, border: "none", borderTop: "1px solid #e5e7eb" }} />
                </div>

                {/* Guest */}
                <button
                  id="btn-guest-signin"
                  onClick={handleGuest}
                  className="btn-secondary"
                  style={{ width: "100%", padding: "0.75rem 1.5rem" }}
                >
                  <span>👤</span>
                  Continue as Guest
                </button>
              </div>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "1.25rem",
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  lineHeight: 1.6,
                }}
              >
                By continuing, you agree to our{" "}
                <a href="#" style={{ color: "#7c3aed", textDecoration: "none" }}>
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" style={{ color: "#7c3aed", textDecoration: "none" }}>
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Features strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1.5rem",
                marginTop: "1.75rem",
                color: "#9ca3af",
                fontSize: "0.8125rem",
              }}
            >
              {["🎂 Birthday", "💍 Anniversary", "🎉 Festivals"].map((f) => (
                <span key={f}>{f}</span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function LoadingSpinner() {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "3px solid #ede9fe",
        borderTopColor: "#7c3aed",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}
