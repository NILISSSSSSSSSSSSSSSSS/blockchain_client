import $http from '@/plugins/$http'

// 获取刊登广告的一些数据
export function getPreset({tradeType='buy', currency='BTC', fiatCurrency='CNY'}) {
  return $http.get(`/shop/preset?tradeType=${tradeType}&currency=${currency}&fiatCurrency=${fiatCurrency}`)
    .then(res => {
      if (res.data.code === 0) return Promise.resolve(res.data)
      else return Promise.reject(res.data)
    })
}

// 获取法币和数字币列表
export function getCommon(isPubAdvertise='no') {
  return $http.get(`/common?isPubAdvertise=${isPubAdvertise}`).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}
