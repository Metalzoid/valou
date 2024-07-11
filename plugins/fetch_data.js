import { defineNuxtPlugin, useCookie, navigateTo } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  function verify_token() {
    const cookie = useCookie("jwt_token");
    if (cookie.value === undefined) {
      return false;
    }
    return true;
  }

  async function fetch_get_api(path) {
    if (verify_token() === false) {
      await navigateTo("/login");
    } else {
      try {
        const cookie = useCookie("jwt_token");
        const response = await fetch(`http://localhost:3001/${path}`, {
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
    }
  }

  async function fetch_post_api(path, query) {
    if (verify_token() === false) {
      await navigateTo("/login");
    } else {
      try {
        const cookie = useCookie("jwt_token");
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
    }
  }

  return {
    provide: {
      api: {
        get: {
          async availabilities() {
            try {
              const response = await fetch_get_api("availabilities");
              if (response.success) {
                return { success: true, data: response.data };
              }
            } catch (err) {
              return { success: false, err };
            }
          },
          async appointments() {
            try {
              const response = await fetch_get_api("appointments");
              if (response.success) {
                return { success: true, data: response.data };
              }
            } catch (err) {
              return { success: false, err };
            }
          },
          async show_appointment(id) {
            try {
              const response = await fetch_get_api(`appointments/${id}`);
              if (response.success) {
                return { success: true, data: response.data };
              }
            } catch (err) {
              return { success: false, err };
            }
          },
        },
        post: {
          async new_availability(query) {
            try {
              const response = await fetch_post_api("availabilities", query);
              if (response.success) {
                return { success: true, data: response.data };
              }
            } catch (err) {
              return { success: false, err };
            }
          },
        },
      },
    },
  };
});
