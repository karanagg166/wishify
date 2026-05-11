"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import { MAX_UPLOAD_SIZE_MB } from "@/constants/config";

interface ProfileSetupSheetProps {
  open: boolean;
}

export function ProfileSetupSheet({ open }: ProfileSetupSheetProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
      setError(`File size must be under ${MAX_UPLOAD_SIZE_MB} MB`);
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setError(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!f?.type.startsWith("image/")) return;
    if (f.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
      setError(`File size must be under ${MAX_UPLOAD_SIZE_MB} MB`);
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setError(null);
  }, []);

  const handleSave = async () => {
    if (!name.trim()) { setError("Please enter your name"); return; }
    setSaving(true);
    try {
      let imageUrl: string | undefined;

      if (file) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        imageUrl = data.url;
      }

      await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), image: imageUrl }),
      });

      router.push(ROUTES.HOME);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(4px)", zIndex: 40,
            }}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              background: "#fff", borderRadius: "1.5rem 1.5rem 0 0",
              padding: "2rem 1.5rem 3rem",
              zIndex: 50, maxWidth: 480, margin: "0 auto",
            }}
          >
            {/* Handle bar */}
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 1.5rem" }} />

            <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.375rem" }}>
              Set up your profile
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.75rem" }}>
              Your name and photo will appear on every greeting card you create.
            </p>

            {/* Avatar Upload */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                id="avatar-drop-zone"
                style={{
                  width: 96, height: 96, borderRadius: "50%",
                  border: "2.5px dashed #d1d5db",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", overflow: "hidden", position: "relative",
                  background: "#f9fafb", transition: "border-color 0.2s",
                }}
              >
                {previewUrl ? (
                  <Image src={previewUrl} alt="Avatar preview" fill style={{ objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 32 }}>📷</span>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
                id="avatar-file-input"
              />
              <button
                onClick={() => fileRef.current?.click()}
                style={{ marginTop: "0.625rem", fontSize: "0.8125rem", color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
              >
                {previewUrl ? "Change photo" : "Upload photo"}
              </button>
            </div>

            {/* Name input */}
            <label style={{ display: "block", marginBottom: "1.25rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151", display: "block", marginBottom: "0.375rem" }}>
                Your name
              </span>
              <input
                id="profile-name-input"
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                style={{
                  width: "100%", padding: "0.75rem 1rem",
                  border: error && !name.trim() ? "1.5px solid #f87171" : "1.5px solid #e5e7eb",
                  borderRadius: "0.75rem", fontSize: "1rem",
                  outline: "none", transition: "border-color 0.2s",
                  background: "#f9fafb",
                }}
              />
            </label>

            {error && (
              <p style={{ color: "#dc2626", fontSize: "0.8125rem", marginBottom: "1rem", marginTop: "-0.75rem" }}>
                {error}
              </p>
            )}

            <button
              id="profile-save-btn"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
              style={{ width: "100%", padding: "1rem" }}
            >
              {saving ? "Saving…" : "Continue to Wishify 🎉"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
