import { useCookie } from "#app";
import nuxtStorage from "nuxt-storage";

export default function useLogin() {
  let tokenExpirationTimer = null;
  const login = async (email, password) => {
    try {
      const response = await fetch("https://datescalendar.fr/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ user: { email, password } }),
      });
      const serialized_response = await response.json();

      if (!response.ok) {
        throw new Error(
          serialized_response.message ||
            serialized_response.error ||
            "An unknown error occurred"
        );
      } else {
        console.log(serialized_response.message);
      }

      nuxtStorage.localStorage.setData(
        "user",
        serialized_response.data,
        30,
        "m"
      );
      const authHeader = response.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        const now = new Date();
        const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
        const tokenExpiry = new Date(now.getTime() + thirtyMinutes);
        const cookie = useCookie("jwt_token", {
          expires: tokenExpiry,
          path: "/",
          sameSite: "Strict",
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
  };
}
