import { createStore } from 'vuex'
import taskStore from './modules/task-store'


const store = createStore({
  strict: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    taskStore,

  },
})

export default store
