import { Maximize2, RefreshCw, X } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderBar } from "../components/HeaderBar";
import { StatusBanner } from "../components/StatusBanner";
import { listImages, type StoredImage } from "../lib/imageStorage";
import { hasSupabaseConfig } from "../lib/supabaseConfig";

export function GalleryPage(): ReactElement {
  const navigate = useNavigate();
  const [images, setImages] = useState<StoredImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<StoredImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadImages(): Promise<void> {
    setIsLoading(true);
    setError("");

    try {
      const nextImages = await listImages();
      setImages(nextImages);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Images could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setError("Supabase is not configured yet. Add credentials in src/lib/supabaseConfig.ts.");
      setIsLoading(false);
      return;
    }

    void loadImages();
  }, []);

  return (
    <main className="app-shell">
      <HeaderBar
        title="Cards"
        subtitle="Newest uploads first"
        onBack={() => navigate("/dashboard")}
      />

      {error ? <StatusBanner kind="error" message={error} /> : null}

      <div className="gallery-toolbar">
        <span>{images.length} images</span>
        <button className="icon-button" type="button" onClick={loadImages} aria-label="Refresh gallery">
          <RefreshCw aria-hidden="true" size={19} />
        </button>
      </div>

      {isLoading ? (
        <div className="empty-state">Loading images...</div>
      ) : images.length === 0 ? (
        <div className="empty-state">No uploaded cards yet.</div>
      ) : (
        <section className="gallery-grid" aria-label="Uploaded card images">
          {images.map((image) => (
            <button
              className="image-card"
              key={image.path}
              type="button"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.url} alt={image.name} loading="lazy" />
              <span className="image-card-meta">
                <span>{image.source}</span>
                <Maximize2 aria-hidden="true" size={15} />
              </span>
            </button>
          ))}
        </section>
      )}

      {selectedImage ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedImage(null)}>
          <section
            className="image-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Large image preview"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="icon-button modal-close"
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Close preview"
            >
              <X aria-hidden="true" size={20} />
            </button>
            <img src={selectedImage.url} alt={selectedImage.name} />
          </section>
        </div>
      ) : null}
    </main>
  );
}
