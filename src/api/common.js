import $http from '@/plugins/$http'
import store from '../store'

export function getOrdersInfo(init) {
  return $http.post('/index/ordersinfo').then(res => {
    if (res.data.code === 0) {
      const ms = res.data.data.time
      let oldMs
      if (init) oldMs = 0
      else oldMs = ms - 1000 * store.getters.common.lampRefresh
      let list = res.data.data.list.filter(item => {
        return item.time >= oldMs && item.time <= ms
      })
      list.sort(function(x1, x2) {
        return x1.time - x2.time
      })
      console.log(list)
      return Promise.resolve(list)
    } else return Promise.reject(res.data)
  })
}
