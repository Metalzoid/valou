import { defineStore } from "pinia";

export const useAllDatasStore = defineStore("allDatas", {
  state: () => ({
    allDatas: null,
  }),
  actions: {
    // async loadDatas() {
    //   if (typeof window !== "undefined") {
    //     const storedData = sessionStorage.getItem("allDatas");
    //     if (storedData) {
    //       this.allDatas = JSON.parse(storedData);
    //     } else {
    //       await this.updateDatas();
    //     }
    //   }
    // },

    // async updateDatas() {
    //   const { getData } = useApi();
    //   const response = await getData("user_datas");
    //   if (response.success && typeof window !== "undefined") {
    //     this.allDatas = response.data.data;
    //     sessionStorage.setItem("allDatas", JSON.stringify(this.allDatas));
    //   }
    // },

    saveDatas(data: any) {
      this.allDatas = data;
    },
  },
});
