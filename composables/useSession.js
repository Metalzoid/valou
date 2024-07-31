import { useCookie } from "#app";
import nuxtStorage from "nuxt-storage";

export default function useSession() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  let tokenExpirationTimer = null;

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ user: { email, password } }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const userJson = await response.json();
      nuxtStorage.localStorage.setData("user", userJson.status.data, 30, "m");
      const authHeader = response.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        const now = new Date();
        const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
        const tokenExpiry = new Date(now.getTime() + thirtyMinutes);
        const cookie = useCookie("jwt_token", {
          expires: tokenExpiry,
          path: "/",
          sameSite: "Strict", // Configure as needed
          // secure: process.env.NODE_ENV === "production", // Use only in production
        });
        cookie.value = token;
        setTokenExpirationTimer(tokenExpiry);
        return { success: true, token };
      } else {
        console.error("Authorization header is missing in the response.");
        return { success: false };
      }
    } catch (error) {
      console.error("There was a problem with the login request:", error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    const cookie = useCookie("jwt_token");
    if (cookie.value != undefined) {
      try {
        const response = await fetch(`${apiBase}/logout`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: cookie.value,
          },
        });
        if (response.ok) {
          cookie.value = null;
          nuxtStorage.localStorage.removeItem("user");
          // clearTokenExpirationTimer();
          return { success: true };
        }
      } catch (error) {
        console.error("There was a problem with the logout request:", error);
        return { success: false, error };
      }
    }
  };

  function setTokenExpirationTimer(tokenExpiry) {
    clearTokenExpirationTimer();
    tokenExpirationTimer = setTimeout(() => {
      const cookie = useCookie("jwt_token", {
        expires: tokenExpiry,
      });
    }, tokenExpiry);
  }

  function clearTokenExpirationTimer() {
    if (tokenExpirationTimer) {
      clearTimeout(tokenExpirationTimer);
      tokenExpirationTimer = null;
    }
  }

  return {
    login,
    logout,
  };
}
