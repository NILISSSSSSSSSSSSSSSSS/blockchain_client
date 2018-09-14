import axios from 'axios'
import store from '../store/index'
import {url} from '../config/server'
import {getCookie, setCookie, delCookie} from '@/plugins/cookie'
import { Loading } from 'element-ui';
import router from '../router'
const instance = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000
});

let loadingInstance;
//不经过loading的白名单
let whiteList = ['/order/query', '/index/ordersinfo','/shop/convert/'];

instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  let flag = true;
  whiteList.map((item)=>{
    if(config.url.indexOf(item) > -1){
      flag = false
    }
  })
  const token = getCookie('token')
  var reg = /.json/
  if (token && !reg.test(config.url)) {
    config.headers.Authorization = token
  }
  flag && (loadingInstance = Loading.service({fullscreen: true}));
  config.headers['Content-Type'] = 'application/json'
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
  // Do something with response data
  if (response.data.code == 30001) {
    delCookie('token');
    delCookie('loginTime');
    store.commit('setToken', '');
    router.push('/user/login');
    // if(getCookie('token')){
    //   $vm.$message({
    //     message: $vm.$t('common.expire'),
    //     type: 'warning'
    //   })
    // }
  }
  let flag = true;
  whiteList.map((item)=>{
    if(response.config.url.indexOf(item) > -1){
      flag = false
    }
  })
  flag && (loadingInstance.close());
  return response;
}, function (error) {
  
  // Do something with response error
  return Promise.reject(error);
});


export default instance
