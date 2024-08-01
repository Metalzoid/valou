export default defineNuxtRouteMiddleware((to, from) => {
  if (typeof window !== "undefined") {
    const cookie = useCookie("jwt_token");
    const loggedIn = !!localStorage.getItem("user");

    if (cookie.value === undefined) {
      if (loggedIn) {
        localStorage.removeItem("user");
      }
      localStorage.setItem("redirectAfterLogin", to.fullPath);
      return navigateTo("/login");
    }
  }
});
