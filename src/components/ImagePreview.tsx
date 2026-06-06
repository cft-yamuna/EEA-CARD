import { Check, RotateCcw, X } from "lucide-react";
import type { ReactElement } from "react";

interface ImagePreviewProps {
  imageUrl: string;
  mode: "capture" | "upload";
  isUploading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ImagePreview({
  imageUrl,
  mode,
  isUploading,
  onCancel,
  onConfirm,
}: ImagePreviewProps): ReactElement {
  const cancelLabel = mode === "capture" ? "Retake" : "Cancel";
  const CancelIcon = mode === "capture" ? RotateCcw : X;

  return (
    <section className="preview-panel" aria-label="Image preview">
      <div className="preview-frame">
        <img src={imageUrl} alt="Selected card preview" />
      </div>
      <div className="action-row two-up">
        <button className="button button-secondary" type="button" onClick={onCancel} disabled={isUploading}>
          <CancelIcon aria-hidden="true" size={19} />
          <span>{cancelLabel}</span>
        </button>
        <button className="button button-primary" type="button" onClick={onConfirm} disabled={isUploading}>
          <Check aria-hidden="true" size={19} />
          <span>{isUploading ? "Uploading..." : "Confirm"}</span>
        </button>
      </div>
    </section>
  );
}
