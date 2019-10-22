export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    msgNum:0,
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateMsgNum (state, msgNum) {
      state.msgNum = msgNum
    }
  }
}
