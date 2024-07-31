export default defineNuxtRouteMiddleware((to, from) => {
  const loggedIn = !!localStorage.getItem("user");

  if (!loggedIn) {
    localStorage.setItem("redirectAfterLogin", to.fullPath);
    return navigateTo("/login");
  }
});
