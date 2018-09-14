import $http from '@/plugins/$http'

// 快速交易的广告列表
export function getFastAdverts(params) {
  // 购买页面查询卖单，出售页面查询买单
  //params.tradeType = params.tradeType === 'buy' ? 'sell' : 'buy';
  var obj = JSON.stringify(params);
  obj = JSON.parse(obj);
  obj.tradeType = obj.tradeType === 'buy' ? 'sell' : 'buy';

  return $http.get(`shop/usdtlist`,{params: obj})
    .then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

//快速交易的购买
export function fastTradeBuy(data) {
    return $http.post(`/order/usdt_create`, data)
      .then(res => {
      if (res.data.code === 0) return Promise.resolve(res.data)
      else return Promise.reject(res.data)
    })
  }
  