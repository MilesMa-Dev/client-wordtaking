import Vue from 'vue'
import App from './App'
import config from './utils/config';

Vue.config.productionTip = false
App.mpType = 'app'

wx.cloud.init({
    traceUser: true
})

//过滤log
if(!config.debug){
    console.log = function(){};
}

const app = new Vue(App)
app.$mount()


