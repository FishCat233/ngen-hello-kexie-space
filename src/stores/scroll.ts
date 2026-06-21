import { defineStore } from 'pinia'

export const useScrollStore = defineStore('scroll', {
  state: () => ({
    savedScrollY: 0,
    hasVisitedHome: false,
    pendingAnchor: null as string | null,
  }),
})
