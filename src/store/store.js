import { defineStore } from "pinia";

export const useList = defineStore("List", {
  state: () => ({
    routerlist: [
      {
        to: "/",
        title: "首页",
      },
    ],
  }),

  getters: {},

  actions: {},
});

export let useNormalcrawler_config = defineStore("Normalcrawler_config", {
  state: () => ({
    Normalcrawler_config: { value: null },
  }),

  getters: {},

  actions: {},
});
