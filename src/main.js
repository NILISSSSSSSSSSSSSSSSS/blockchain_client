// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
//import messages from './lang/index'
import VueClipboard from 'vue-clipboard2'
import store from './store'
import VueQrcode from 'qrcode.vue'
import Layout from 'components/layout'
import sha1 from 'sha1'
import $http from './plugins/$http'
import axios from 'axios'
import moment from 'moment'
import NProgress from 'nprogress'
import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';
import 'nprogress/nprogress.css'
import './filters'
import {url} from './config/server'
import {getCookie, setCookie, delCookie} from '@/plugins/cookie'
import {Loading, Notification } from 'element-ui'
import {fromNow, format} from 'tools.js'
import { getUrl} from '@/common/util.js'
import {checkParam, checkSubmit} from '@/directives/formValiate'
Vue.use(checkParam)
Vue.use(checkSubmit)

Vue.component('icon', Icon)
Vue.component('qrcode', VueQrcode)
Vue.component('layout', Layout)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(VueI18n)
Vue.use(VueClipboard)


//多语言
const loadedLanguages = [''] // our default language that is prelaoded



// 配置全局moment格式化
moment.prototype.format_locals = {'en': "DD-MM-YYYY HH:mm", 'zh-cn': "YYYY-MM-DD HH:mm"};
moment.prototype._format = function () {
  return this.format(this.format_locals[this.locale()] || undefined);
};
moment.locale('zh-cn');

Vue.prototype.sha1 = sha1
Vue.prototype.$http = $http
Vue.prototype.$moment = moment

const isDebug_mode = process.env.NODE_ENV !== 'production';
Vue.config.debug = isDebug_mode;
Vue.config.devtools = isDebug_mode;
Vue.config.productionTip = isDebug_mode;
Vue.config.silent = !isDebug_mode;

Vue.prototype.serverIP = url;
Vue.prototype.getCookie = getCookie;
Vue.prototype.setCookie = setCookie;
Vue.prototype.delCookie = delCookie;
Vue.prototype.fromNow = fromNow
Vue.prototype.format = format
Vue.prototype.getUrl = getUrl

Vue.config.productionTip = false

//配置桌面通知
var myNotification = window.Notification || window.mozNotification || window.webkitNotification;
if(myNotification){
  myNotification.requestPermission(function(status){
    Vue.prototype.Notification = function(title, options){
      console.log(options)
      new myNotification(title, options)
    }
  })
}

//页面加载进度条配置
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(transition => {
  NProgress.done();
});

// 多语言配置项
function lang () {
  // 将选择的语言存在localStorage中
  let t = window.localStorage.getItem('language')
  console.log('```````'+t)
  if (t) return t
  // 默认中文
  else return 'cn'
}

const language = lang()

// 自定义 window 的 lang 属性
window.lang = lang()
// 创建一个 i18n 实例
const i18n = new VueI18n({
  //locale: language,
  // fallbackLocale: language,
  //messages
})
function getLang(){
    
    $http.get(`/common?isPubAdvertise=true`).then(res=>{
   
      res = res.data;
      localStorage.officialCurrency = res.data.officialCurrency;
      var langList = res.data.lang;
      let lang = localStorage.language?localStorage.language: 'cn';
      var i,filePath;
      var len = langList.length;
      for( i = 0; i < len; i++){
        if(lang == langList[i]._id){
          filePath = langList[i].jsonFilePath;
          //开发环境获取语言文件
          console.log(process.env.NODE_ENV)
          if(process.env.NODE_ENV == 'development'){
            if(lang == "en"){
              filePath = 'https://doc-1256300176.cos.ap-hongkong.myqcloud.com/en1.json'
            }else{
              filePath = 'https://doc-1256300176.cos.ap-hongkong.myqcloud.com/cn1.json'
            }
          }
        }
      }
      loadLanguageAsync(lang, filePath);
    }).catch(err => {
      Notification.warning({title: 'server connect error', message: '连接错误'})
    })
}
function setI18nLanguage (lang) {
  i18n.locale = lang
  $http.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}
function loadLanguageAsync (lang, filePath) {
  if (i18n.locale !== lang) {
        $http.get(filePath).then(res => {

          console.log(res);
          localStorage.language = lang;
          i18n.setLocaleMessage(lang, res.data)
          setI18nLanguage(lang);
          window.$vm = new Vue({
            i18n,
            el: '#app',
            router,
            store,
            data: {
              eventHub: new Vue(),//用于事件分发
              updateLang: new Vue(),//用于通知语言更新
              updateAvatar: new Vue(),//通知header头像更新
            },
            components: { App },
            template: '<App/>'
          })
        })

    return Promise.resolve(setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
}
function usdtConfig(){
  var url=getUrl();
  url.includes('geccex.com') ? localStorage.setItem("configFiatBi", "W") :  localStorage.setItem("configFiatBi", "USDT");
}
usdtConfig();
getLang();



/* eslint-disable no-new */

