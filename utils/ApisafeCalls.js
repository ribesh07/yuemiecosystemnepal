import { baseUrl } from "./config";
export const getToken = () => {
  return localStorage.getItem("token");
}

export const apiRequest = async (url, tokenReq = true, options = {}) => {
  url = `${baseUrl}${url}`;
  const token = localStorage.getItem("token");
  const method = options.method || "GET";
  const headers = {
    ...(tokenReq && token && { Authorization: `Bearer ${token}` }),
    ...(method !== "GET" && { "Content-Type": "application/json" }),
    ...options.headers,
  };

  let response;
  try {
    const fetchOptions = { ...options, headers };
    if (method === "GET") {
      fetchOptions.cache = "no-store";
    }
    response = await fetch(url, fetchOptions);
  } catch (err) {
    console.log("Network error:", err);
    console.warn(err);
    return {
      success: false,
      message: "Network error or server unreachable.",
    };
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.log("Invalid JSON from server:", e);
    console.warn(e);
    return {
      success: false,
      message: "Server sent invalid JSON.",
    };
  }

  if (data.success || response.ok) {
    return data;
  } else {
    // Log detailed error
    console.log("API error response:", data);
    console.warn(data);
    return data;
  }
};

export const apiPostRequest = async (url, data, tokenReq = true) =>
  apiRequest(url, tokenReq, { method: "POST", body: JSON.stringify(data) });
