import { useCookie } from "#app";
import nuxtStorage from "nuxt-storage";

export default function useLogout() {
  const logout = async () => {
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
  return {
    logout,
  };
}
