export function resolveImageUrl(imageUrl?: string | null, fallback = "/no-image.png") {
  const value = String(imageUrl || "").trim();
  if (!value) return fallback;
  if (/^https?:\/\//i.test(value) || /^data:/i.test(value)) return value;

  const normalized = value.replace(/\\/g, "/");
  const uploadsIndex = normalized.indexOf("/uploads/");
  if (uploadsIndex >= 0) {
    return normalized.slice(uploadsIndex);
  }

  if (normalized.startsWith("uploads/")) {
    return `/${normalized}`;
  }

  const filesystemMatch = normalized.match(/\/var\/www\/yuemi\/(uploads\/.+)$/i);
  if (filesystemMatch?.[1]) {
    return `/${filesystemMatch[1]}`;
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
