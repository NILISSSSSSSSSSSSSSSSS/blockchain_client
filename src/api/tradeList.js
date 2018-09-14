import $http from '@/plugins/$http'

// 获取广告列表
export function getAdverts(params) {
  // 购买页面查询卖单，出售页面查询买单
  //params.tradeType = params.tradeType === 'buy' ? 'sell' : 'buy';
  var obj = JSON.stringify(params);
  obj = JSON.parse(obj);
  obj.tradeType = obj.tradeType === 'buy' ? 'sell' : 'buy';

  return $http.get(`/shop/pubList`,{params: obj})
    .then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}
