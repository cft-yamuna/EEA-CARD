import { ArrowLeft, Images, LogOut } from "lucide-react";
import type { ReactElement } from "react";

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onGallery?: () => void;
  onSignOut?: () => void;
}

export function HeaderBar({
  title,
  subtitle,
  onBack,
  onGallery,
  onSignOut,
}: HeaderBarProps): ReactElement {
  return (
    <header className="header-bar">
      <div className="header-copy">
        <span className="eyebrow">Craftech 360</span>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <nav className="header-actions" aria-label="Page actions">
        {onBack ? (
          <button className="icon-button" type="button" onClick={onBack} aria-label="Back">
            <ArrowLeft aria-hidden="true" size={20} />
          </button>
        ) : null}
        {onGallery ? (
          <button
            className="icon-button"
            type="button"
            onClick={onGallery}
            aria-label="View cards"
            title="View cards"
          >
            <Images aria-hidden="true" size={20} />
          </button>
        ) : null}
        {onSignOut ? (
          <button className="icon-button" type="button" onClick={onSignOut} aria-label="Sign out">
            <LogOut aria-hidden="true" size={20} />
          </button>
        ) : null}
      </nav>
    </header>
  );
}
