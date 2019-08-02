import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import util from '@/utils/utils'

export default new Vuex.Store({
  state: {
    openId: '',
    user_info: {},
  },

  // 对state中的变量进行操作的方法，请勿在外部直接对state中的变量进行赋值
  mutations: {
    setOpenId(state, info) {
      state.openId = info;
    },

    setUserInfo(state, info) {
      let old_user_info = {};
      if(state.user_info){
        old_user_info = util.assign(old_user_info, state.user_info);
      }
      state.user_info = util.assign(old_user_info, info);
    },
  }
})
