export const getSessionToken = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("token");
};

export const clearSessionAuth = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("token");
  window.dispatchEvent(new CustomEvent("auth-change"));
};

export const isAuthenticatedClient = async () => {
  const token = getSessionToken();
  if (!token) return false;

  try {
    const response = await fetch("/api/auth/verify", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      clearSessionAuth();
      return false;
    }

    const data = await response.json();
    if (!data?.valid) {
      clearSessionAuth();
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

