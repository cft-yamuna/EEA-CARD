import { Images, LogOut, Upload } from "lucide-react";
import { ChangeEvent, useMemo, useRef, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { CameraCapture } from "../components/CameraCapture";
import { ImagePreview } from "../components/ImagePreview";
import { StatusBanner } from "../components/StatusBanner";
import { uploadImage, type ImageSource } from "../lib/imageStorage";
import { hasSupabaseConfig } from "../lib/supabaseConfig";

interface DashboardPageProps {
  userEmail: string;
  onSignOut: () => void;
}

interface PendingImage {
  source: ImageSource;
  file: File;
  previewUrl: string;
}

export function DashboardPage({ userEmail, onSignOut }: DashboardPageProps): ReactElement {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error" | "info"; message: string } | null>(
    hasSupabaseConfig()
      ? null
      : {
          kind: "info",
          message: "Supabase placeholders are ready in src/lib/supabaseConfig.ts.",
        },
  );

  const previewMode = useMemo(() => {
    return pendingImage?.source === "camera" ? "capture" : "upload";
  }, [pendingImage?.source]);

  function handleCapture(file: File, previewUrl: string): void {
    setPendingImage({ source: "camera", file, previewUrl });
    setStatus(null);
  }

  function handleUploadClick(): void {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus({ kind: "error", message: "Select a valid image file." });
      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPendingImage({ source: "device", file, previewUrl });
    setStatus(null);
    event.target.value = "";
  }

  function clearPendingImage(): void {
    if (pendingImage?.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(pendingImage.previewUrl);
    }
    setPendingImage(null);
  }

  async function handleConfirm(): Promise<void> {
    if (!pendingImage) {
      return;
    }

    setIsUploading(true);
    setStatus({ kind: "info", message: "Uploading image..." });

    try {
      await uploadImage({
        file: pendingImage.file,
        source: pendingImage.source,
        userEmail,
      });
      clearPendingImage();
      setStatus({ kind: "success", message: "Image uploaded successfully." });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  function handleSignOut(): void {
    onSignOut();
    navigate("/");
  }

  return (
    <main className="app-shell capture-shell">
      <nav className="capture-top-actions" aria-label="Capture actions">
        <button
          className="icon-button"
          type="button"
          onClick={() => navigate("/gallery")}
          aria-label="View cards"
          title="View cards"
        >
          <Images aria-hidden="true" size={20} />
        </button>
        <button className="icon-button" type="button" onClick={handleSignOut} aria-label="Sign out" title="Sign out">
          <LogOut aria-hidden="true" size={20} />
        </button>
      </nav>

      {status ? <StatusBanner kind={status.kind} message={status.message} /> : null}

      {pendingImage ? (
        <ImagePreview
          imageUrl={pendingImage.previewUrl}
          mode={previewMode}
          isUploading={isUploading}
          onCancel={clearPendingImage}
          onConfirm={handleConfirm}
        />
      ) : (
        <section className="native-action-stack" aria-label="Capture or upload image">
          <CameraCapture onCapture={handleCapture} />
          <section className="upload-panel" aria-label="Upload image">
            <input
              ref={fileInputRef}
              className="visually-hidden"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button className="button button-secondary button-full" type="button" onClick={handleUploadClick}>
              <Upload aria-hidden="true" size={19} />
              <span>Upload</span>
            </button>
          </section>
        </section>
      )}
    </main>
  );
}
