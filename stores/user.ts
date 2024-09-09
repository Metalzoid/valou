import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null,
  }),
  actions: {
    setUser(user: any) {
      this.currentUser = user;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    },
    loadUserFromSession() {
      if (typeof window !== "undefined") {
        const userData = sessionStorage.getItem("user");
        if (userData) {
          try {
            this.currentUser = JSON.parse(userData);
          } catch (error) {
            console.error(
              "Erreur lors de la récupération de l'utilisateur :",
              error
            );
          }
        }
      }
    },
  },
});
