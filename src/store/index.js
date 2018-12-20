import Vue from 'vue';
import Vuex from 'vuex';
// import { Toast } from 'buefy/dist/components/toast';
// import Land from '@/util/land';
import countryPointsJson from '@/util/countryPoints.json';
import ui from './ui';
import tronApi from '@/util/tronApi';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ui,
  },
  state: {
    tronWeb: {
      installed: false,
      loggedIn: false
    },
    landArr: [],
    nowGlobal: null
  },
  mutations: {
    setTronWeb(state, tronWebInfo) {
      state.tronWeb = tronWebInfo;
    },
    setLandArr(state, landArr) {
      state.landArr = landArr
      state.landInfoUpdateAt = new Date();
    },
    setNowGlobal(state, nowGlobal) {
      state.nowGlobal = nowGlobal
    },
  },
  actions: {
    getLangArr ({ commit }) {
      const promises = [...Array(40)].map((item, index) => {
        try {
          return tronApi.contract.allOf(index + 1).call()
        } catch (err) {
          console.log(err, 'err')
        }
      })
      try {
        Promise.all(promises).then(resp => {
          console.log(resp)
          commit('setLandArr', resp.map((item, index) => {
            item.code = countryPointsJson[index].code
            item.id = index + 1
            return item
          }));
        })
      } catch (err) {
        console.log(err, 'err')
      }
    },
    getNowGlobal ({commit}) {
      try {
        tronApi.contract.getNowGlobal().call().then(resp => {
          commit('setNowGlobal', resp);
        })
      } catch (err) {
        console.log(err, 'err')
      }
    },
  },
});
