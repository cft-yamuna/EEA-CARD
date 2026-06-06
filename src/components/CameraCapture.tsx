import { Camera } from "lucide-react";
import { type ChangeEvent, useRef, useState, type ReactElement } from "react";
import { StatusBanner } from "./StatusBanner";

interface CameraCaptureProps {
  onCapture: (file: File, previewUrl: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps): ReactElement {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [cameraError, setCameraError] = useState("");

  function openNativeCamera(): void {
    setCameraError("");
    inputRef.current?.click();
  }

  function handleCameraChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setCameraError("Select a valid image file.");
      return;
    }

    onCapture(file, URL.createObjectURL(file));
  }

  return (
    <section className="capture-panel native-camera-panel" aria-label="Camera capture">
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
        capture="environment"
        onChange={handleCameraChange}
      />

      {cameraError ? <StatusBanner kind="error" message={cameraError} /> : null}

      <button className="button button-primary button-full native-camera-button" type="button" onClick={openNativeCamera}>
        <Camera aria-hidden="true" size={22} />
        <span>Capture</span>
      </button>
    </section>
  );
}
