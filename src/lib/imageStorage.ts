import { SUPABASE_STORAGE_BUCKET, getSupabaseClient } from "./supabaseConfig";

export type ImageSource = "camera" | "device";

export interface StoredImage {
  id: string;
  name: string;
  path: string;
  url: string;
  uploadedAt: string;
  source: ImageSource | "unknown";
  size?: number;
  contentType?: string;
}

function extensionFromFile(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension && extension.length <= 5) {
    return extension;
  }

  return file.type.split("/").pop() || "jpg";
}

function buildStoragePath(file: File, source: ImageSource): string {
  const id = crypto.randomUUID();
  const extension = extensionFromFile(file);
  return `${source}-${Date.now()}-${id}.${extension}`;
}

function sourceFromPath(path: string): StoredImage["source"] {
  if (path.startsWith("camera-")) {
    return "camera";
  }

  if (path.startsWith("device-")) {
    return "device";
  }

  return "unknown";
}

export async function uploadImage({
  file,
  source,
  userEmail,
}: {
  file: File;
  source: ImageSource;
  userEmail: string;
}): Promise<StoredImage> {
  const supabase = getSupabaseClient();
  const path = buildStoragePath(file, source);

  const { data, error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type || "image/jpeg",
      upsert: false,
      metadata: {
        source,
        uploadedBy: userEmail,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data: publicUrl } = supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return {
    id: data.id ?? data.path,
    name: file.name,
    path: data.path,
    url: publicUrl.publicUrl,
    uploadedAt: new Date().toISOString(),
    source,
    size: file.size,
    contentType: file.type,
  };
}

export async function listImages(): Promise<StoredImage[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? [])
    .filter((item) => item.id)
    .map((item) => {
      const { data: publicUrl } = supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .getPublicUrl(item.name);

      return {
        id: item.id ?? item.name,
        name: item.name,
        path: item.name,
        url: publicUrl.publicUrl,
        uploadedAt: item.created_at ?? item.updated_at ?? "",
        source: sourceFromPath(item.name),
        size: item.metadata?.size,
        contentType: item.metadata?.mimetype,
      };
    })
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}
