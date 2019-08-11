import Vue from 'vue'
import App from './App'
import config from './utils/config';

//过滤log
if(!config.debug){
    console.log = function(){};
}

Vue.config.productionTip = false
App.mpType = 'app'

wx.cloud.init({
    traceUser: true
})

const app = new Vue(App)
app.$mount()


