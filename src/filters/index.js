import Vue from 'vue'
import {Format} from '../plugins/dateFormat'

Vue.filter('payTypeFilter', function(value) {
  if (value === 'alipay') {
    return '支付宝'
  } else if (value === 'paypal') {
    return 'paypal'
  } else if (value === 'wechat') {
    return '微信支付'
  } else if (value === 'unionpay') {
    return '银联支付'
  }
  return 'Undefined'
})

Date.prototype.Format = Format;
Vue.filter('datetimeFormat', function(date){
  return new Date(date).Format("yyyy-MM-dd hh:mm")
})

Vue.filter('dateFormat', function(date){
  return new Date(date).Format("yyyy-MM-dd")
})

Vue.filter('tradeText', function(trade) {
  if (trade === 'buy') return '购买'
  if (trade === 'sell') return '出售'
  return 'Undefined'
})
