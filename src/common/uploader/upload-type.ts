export const UPLOAD_TYPE = {
  RESTAURANT_BANNER: '/restaurant-banner/',
  MENU: '/menu/',
} as const;
type UploadType = (typeof UPLOAD_TYPE)[keyof typeof UPLOAD_TYPE];
