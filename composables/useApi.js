import { useCookie } from "#app";
import nuxtStorage from "nuxt-storage";

export default function useApi() {
  let tokenExpirationTimer = null;
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  const cookie = useCookie("jwt_token");

  const setTokenExpirationTimer = (tokenExpiry) => {
    clearTokenExpirationTimer();
    tokenExpirationTimer = setTimeout(() => {
      const cookie = useCookie("jwt_token", {
        expires: tokenExpiry,
      });
    }, tokenExpiry);
  };

  const clearTokenExpirationTimer = () => {
    if (tokenExpirationTimer) {
      clearTimeout(tokenExpirationTimer);
      tokenExpirationTimer = null;
    }
  };

  const verify_token = () => {
    const cookie = useCookie("jwt_token");
    if (cookie.value === undefined) {
      return false;
    }
    return true;
  };

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
      const serialized_response = await response.json();

      if (!response.ok) {
        throw new Error(
          serialized_response.message ||
            serialized_response.error ||
            "An unknown error occurred"
        );
      }

      nuxtStorage.localStorage.setData(
        "user",
        serialized_response.data,
        60,
        "m"
      );
      const authHeader = response.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        const now = new Date();
        const minutes = 60 * 60 * 1000; // 30 minutes in milliseconds
        const tokenExpiry = new Date(now.getTime() + minutes);
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
        return { success: false };
      }
    } catch (error) {
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
            Authorization: `Bearer ${cookie.value}`,
          },
        });

        if (response.ok) {
          cookie.value = null;
          nuxtStorage.localStorage.removeItem("user");
          clearTokenExpirationTimer();
          return { success: true };
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.message || errorData.error || "An unknown error occurred"
          );
        }
      } catch (error) {
        console.error("There was a problem with the logout request:", error);
        return { success: false, error };
      }
    }
  };

  const register = async (
    email,
    password,
    firstname,
    lastname,
    role,
    company
  ) => {
    try {
      const config = useRuntimeConfig();
      const response = await fetch(`${apiBase}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          APIKEY: config.public.ADMIN_API_KEY,
        },
        body: JSON.stringify({
          user: { email, password, firstname, lastname, role, company },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || "An unknown error occurred"
        );
      } else {
        const successData = await response.json();
        console.log(successData.message);
      }

      // Handle success response here
    } catch (error) {
      console.error(
        "There was a problem with the signup request:",
        error.message
      );
      return { success: false, error: error.message };
    }
  };

  const getData = async (path) => {
    if (verify_token()) {
      try {
        const response = await fetch(`${apiBase}/${path}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${cookie.value}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          return { success: true, data };
        } else {
          return { success: false, data };
        }
      } catch (err) {
        return { success: false, err };
      }
    } else {
      return {
        success: false,
        message: "You need to be authentificated to perform fetch.",
      };
    }
  };

  const postData = async (path, query) => {
    if (!verify_token()) {
      return {
        success: false,
        message: "You need to be authenticated to perform this action.",
      };
    }

    try {
      const response = await fetch(`${apiBase}/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cookie.value}`,
        },
        body: JSON.stringify(query),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, data };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateData = async (path, query) => {
    if (!verify_token()) {
      return {
        success: false,
        message: "You need to be authenticated to perform this action.",
      };
    }

    try {
      const response = await fetch(`${apiBase}/${path}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cookie.value}`,
        },
        body: JSON.stringify(query),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, data };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteData = async (path) => {
    if (!verify_token()) {
      return {
        success: false,
        message: "You need to be authenticated to perform this action.",
      };
    }

    try {
      const response = await fetch(`${apiBase}/${path}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cookie.value}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, data };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getUserByID = async (id) => {
    if (!verify_token()) {
      return {
        success: false,
        message: "You need to be authenticated to perform this action.",
      };
    }
    try {
      const response = await fetch(`${apiBase}/user_search?user_id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cookie.value}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, data };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    login,
    logout,
    register,
    getData,
    postData,
    updateData,
    deleteData,
    getUserByID,
  };
}