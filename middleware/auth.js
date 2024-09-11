export default defineNuxtRouteMiddleware((to, from) => {
  if (typeof window !== "undefined") {
    const cookie = useCookie("jwt_token");
    const loggedIn = !!sessionStorage.getItem("user");
    const userStore = useUserStore();
    if (cookie.value === undefined) {
      if (loggedIn) {
        sessionStorage.removeItem("user");
        userStore.currentUser = null;
      }
      sessionStorage.setItem("redirectAfterLogin", to.fullPath);
      return navigateTo("/login");
    }
  }
});
