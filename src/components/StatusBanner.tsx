import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ReactElement } from "react";

type StatusKind = "info" | "success" | "error";

interface StatusBannerProps {
  kind?: StatusKind;
  message: string;
}

const icons = {
  info: Info,
  success: CheckCircle2,
  error: AlertCircle,
};

export function StatusBanner({ kind = "info", message }: StatusBannerProps): ReactElement {
  const Icon = icons[kind];

  return (
    <div className={`status status-${kind}`} role={kind === "error" ? "alert" : "status"}>
      <Icon aria-hidden="true" size={18} />
      <span>{message}</span>
    </div>
  );
}
