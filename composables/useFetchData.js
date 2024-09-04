import { useCookie } from "#app";

export default function useFetchData() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  const verify_token = () => {
    const cookie = useCookie("jwt_token");
    if (cookie.value === undefined) {
      return false;
    }
    return true;
  };

  const cookie = useCookie("jwt_token");

  const get = async (path) => {
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

        if (response.ok) {
          const data = await response.json();
          return { success: true, data };
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

  const post = async (path, query) => {
    if (verify_token()) {
      try {
        const response = await fetch(`http://localhost:3001/${path}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${cookie.value}`,
          },
          body: JSON.stringify(query),
        });

        if (response.ok) {
          const data = await response.json();
          return { success: true, data };
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

  return {
    get,
    post,
  };
}
