import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    tabsHeight: 0,
    pageHeight: 0
  }),
  getters: {},
  actions: {},
});
