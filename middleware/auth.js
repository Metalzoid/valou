export default defineNuxtRouteMiddleware(async (to, from) => {
  if (typeof window !== "undefined") {
    const cookie = useCookie("jwt_token");
    const loggedIn = !!sessionStorage.getItem("user");
    const userStore = useUserStore();
    const { getData } = useApi();
    if (cookie.value === undefined) {
      if (loggedIn) {
        userStore.currentUser = null;
      }
      sessionStorage.setItem("redirectAfterLogin", to.fullPath);
      return navigateTo("/login");
    } else {
      const response = await getData("login");
      sessionStorage.setItem(
        "user",
        JSON.stringify(response.data.data),
        60,
        "m"
      );
      userStore.setUser(response.data.data);
    }
  }
});
