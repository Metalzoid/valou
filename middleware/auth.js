export default defineNuxtRouteMiddleware((to, from) => {
  if (typeof window !== "undefined") {
    const cookie = useCookie("jwt_token");
    const loggedIn = !!sessionStorage.getItem("user");

    if (cookie.value === undefined) {
      if (loggedIn) {
        sessionStorage.removeItem("user");
      }
      sessionStorage.setItem("redirectAfterLogin", to.fullPath);
      return navigateTo("/login");
    }
  }
});
