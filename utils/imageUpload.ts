import path from "path";

export const UPLOAD_BASE_DIR =
  process.env.UPLOAD_DIR || "/var/www/yuemi/uploads";

export const GET_UPLOAD_BASE_DIR =
  process.env.GET_UPLOAD_BASE_DIR || "/var/www/yuemi";

export function getProductImageDir(productCode: string) {
  return path.join(
    UPLOAD_BASE_DIR,
    "products",
    productCode,
    "images"
  );
}

export function urlToFilePath(imageUrl: string) {
  return path.join(
    UPLOAD_BASE_DIR,
    imageUrl.replace(/^\/uploads\//, "")
  );
}

export function getPublicImageUrl(
  productCode: string,
  fileName: string
) {
  return `/uploads/products/${productCode}/images/${fileName}`;
}
