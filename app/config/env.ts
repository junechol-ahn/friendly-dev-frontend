const apiUrl = import.meta.env.VITE_API_URL;
const strapiUrl = import.meta.env.VITE_STRAPI_URL;


if (!apiUrl) {
  throw new Error("VITE_API_URL 환경변수가 필요합니다.");
}
if (!strapiUrl) {
  throw new Error("VITE_STRAPI_URL 환경변수가 필요합니다.");
}

export const env = {
  apiUrl,
  strapiUrl,
};