import { getNpmAnalyzeRequest } from "../../server/index";
import { defineStore } from "pinia";

interface Istate {
  npmAnalyzeData: any
}

const useNpmAnalyzeStore = defineStore('npmanalyze', {
  state: (): Istate => ({
    npmAnalyzeData: []
  }),
  actions: {
    async getNpmAnalyzeAction() {
      const res = await getNpmAnalyzeRequest()
      this.npmAnalyzeData = res.data.data
      return res.data.data
    }
  }
})

export default useNpmAnalyzeStore