export const getApiBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

  // // Trim any whitespace
  url = url.trim();

  // // Remove trailing slashes
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  // // Ensure the /api/v1 suffix exists if it's pointing to the root domain
  // if (!url.endsWith('/api/v1')) {
  //   url += '/api/v1';
  // }

  return url;
};

export const API_BASE_URL = getApiBaseUrl();
