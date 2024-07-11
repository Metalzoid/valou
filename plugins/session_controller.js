import { defineNuxtPlugin, useCookie, navigateTo } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  let tokenExpirationTimer = null;

  function clearTokenExpirationTimer() {
    if (tokenExpirationTimer) {
      clearTimeout(tokenExpirationTimer);
      tokenExpirationTimer = null;
    }
  }

  function setTokenExpirationTimer(tokenExpiry) {
    clearTokenExpirationTimer();
    tokenExpirationTimer = setTimeout(() => {
      const cookie = useCookie("jwt_token", {
        expires: tokenExpiry,
      });
    }, tokenExpiry);
  }

  nuxtApp.provide("session", {
    async login(email, password) {
      try {
        const response = await fetch("http://localhost:3001/login", {
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

        const authHeader = response.headers.get("Authorization");
        if (authHeader) {
          const token = authHeader.split(" ")[1];
          const now = new Date();
          const thirtyMinutes = 30 * 60 * 1000; // 30 minutes en millisecondes
          const tokenExpiry = new Date(now.getTime() + thirtyMinutes); // 30 minutes en millisecondes
          const cookie = useCookie("jwt_token", {
            expires: tokenExpiry,
            path: "/",
            sameSite: "Strict", // Configurez comme nécessaire
            // secure: process.env.NODE_ENV === "production", // Utiliser uniquement en production
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
    },
    async logout() {
      const cookie = useCookie("jwt_token");
      if (cookie.value != undefined) {
        try {
          const response = await fetch("http://localhost:3001/logout", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: cookie.value,
            },
          });
          if (response.ok) {
            cookie.value = null;
            clearTokenExpirationTimer();
            return { success: true };
          }
        } catch (error) {
          console.error("There was a problem with the logout request:", error);
          return { success: false, error };
        }
      }
    },
    async redirect_to_login() {
      const cookie = useCookie("jwt_token");
      if (cookie.value === undefined) {
        await navigateTo("/login");
      }
    },
  });
});
