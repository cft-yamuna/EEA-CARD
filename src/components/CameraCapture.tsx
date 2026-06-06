import { Camera, SwitchCamera } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { StatusBanner } from "./StatusBanner";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps): ReactElement {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState("");
  const [isStarting, setIsStarting] = useState(true);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setIsStarting(true);
    setCameraError("");
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: cameraFacing },
          width: { ideal: 1080 },
          height: { ideal: 1920 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {
          // Some mobile browsers reject play() while still showing the live stream.
          // Treat that as non-fatal once the stream is attached.
        });
      }
      setCameraError("");
    } catch {
      setCameraError("Camera access is unavailable. Check browser permissions and try again.");
    } finally {
      setIsStarting(false);
    }
  }, [cameraFacing, stopCamera]);

  useEffect(() => {
    void startCamera();
    return stopCamera;
  }, [startCamera, stopCamera]);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError("The camera is still starting. Please try again in a moment.");
      return;
    }

    const frameRect = video.parentElement?.getBoundingClientRect();
    const frameAspect =
      frameRect && frameRect.width > 0 && frameRect.height > 0 ? frameRect.width / frameRect.height : 3 / 4;
    const videoAspect = video.videoWidth / video.videoHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = video.videoWidth;
    let sourceHeight = video.videoHeight;

    if (videoAspect > frameAspect) {
      sourceWidth = video.videoHeight * frameAspect;
      sourceX = (video.videoWidth - sourceWidth) / 2;
    } else {
      sourceHeight = video.videoWidth / frameAspect;
      sourceY = (video.videoHeight - sourceHeight) / 2;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sourceWidth);
    canvas.height = Math.round(sourceHeight);
    const context = canvas.getContext("2d");
    if (context) {
      if (cameraFacing === "user") {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }
      context.drawImage(
        video,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    }
    onCapture(canvas.toDataURL("image/jpeg", 0.92));
  }, [cameraFacing, onCapture]);

  function switchCamera(): void {
    setCameraFacing((currentFacing) => (currentFacing === "environment" ? "user" : "environment"));
  }

  return (
    <section className="capture-panel" aria-label="Camera capture">
      <div className="camera-frame">
        <video
          ref={videoRef}
          className={`camera-video ${cameraFacing === "user" ? "camera-video-front" : ""}`}
          playsInline
          muted
          autoPlay
          onLoadedMetadata={() => setCameraError("")}
        />
        {isStarting ? <div className="camera-overlay">Starting camera...</div> : null}
        <div className="camera-badge">{cameraFacing === "environment" ? "Back camera" : "Front camera"}</div>
      </div>

      {cameraError ? <StatusBanner kind="error" message={cameraError} /> : null}

      <div className="action-row">
        <button className="button button-primary" type="button" onClick={captureFrame}>
          <Camera aria-hidden="true" size={19} />
          <span>Capture</span>
        </button>
        <button
          className="icon-button camera-switch-button"
          type="button"
          onClick={switchCamera}
          aria-label="Switch camera"
          title="Switch camera"
        >
          <SwitchCamera aria-hidden="true" size={20} />
        </button>
      </div>
    </section>
  );
}
