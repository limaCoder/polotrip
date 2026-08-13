import { env } from "@/env";

const R2_CONTENT_BUCKET = env.R2_CONTENT_BUCKET_NAME;
const R2_PUBLIC_BASE_URL = env.R2_PUBLIC_BASE_URL.replace(/\/$/, "");
const trailingSlashRegex = /\/$/;

function getR2PublicUrl(path: string) {
  return `${R2_PUBLIC_BASE_URL}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

function getR2ObjectPath(publicUrl: string) {
  try {
    const url = new URL(publicUrl);
    const baseUrl = new URL(`${R2_PUBLIC_BASE_URL}/`);
    const basePath = baseUrl.pathname.replace(trailingSlashRegex, "");
    if (
      url.origin !== baseUrl.origin ||
      !url.pathname.startsWith(`${basePath}/`)
    )
      return null;
    return decodeURIComponent(url.pathname.slice(basePath.length + 1));
  } catch {
    return null;
  }
}

export { getR2ObjectPath, getR2PublicUrl, R2_CONTENT_BUCKET };
