export default {
    namespaced: true,
    state: {
       dicData:[]
    },
    mutations: {
       publicData(state,params){
           state.dicData=params
       }
    }
  }
  