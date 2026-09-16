const PRODUCT_IMAGE_FALLBACKS = {
  "vegetable-seeds": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
  "organic-fertilizers": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
  "crop-protection": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
  "farming-tools": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=600&auto=format&fit=crop&q=80",
  irrigation: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=80",
  "organic-bio": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
};

const DEFAULT_PRODUCT_IMAGE = PRODUCT_IMAGE_FALLBACKS["vegetable-seeds"];
const LEGACY_PLACEHOLDER_IMAGE_IDS = [
  "1585314062340-f1a5a7c9328d",
  "1585336261022-680e295ce3fe",
];

export function getProductImage(product, size = 600) {
  const hasLegacyPlaceholder = LEGACY_PLACEHOLDER_IMAGE_IDS.some((imageId) =>
    product?.image_url?.includes(imageId)
  );
  const image = !hasLegacyPlaceholder && product?.image_url
    ? product.image_url
    : PRODUCT_IMAGE_FALLBACKS[product?.category] || DEFAULT_PRODUCT_IMAGE;
  return image.replace(/([?&])w=\d+/, `$1w=${size}`);
}

export function getProductImageFallback(product, size = 600) {
  return getProductImage({ ...product, image_url: "", category: product?.category }, size);
}
