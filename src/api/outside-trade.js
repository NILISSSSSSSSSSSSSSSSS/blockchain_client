import $http from '@/plugins/$http'


// 获取广告基础数据
export function getAdvertsBasic(params) {
  // 购买页面查询卖单，出售页面查询买单
  //params.tradeType = params.tradeType === 'buy' ? 'sell' : 'buy';
  var obj = JSON.stringify(params);
  obj = JSON.parse(obj);
  obj.tradeType = obj.tradeType === 'buy' ? 'sell' : 'buy';
  return $http.get(`/shop/basic`,{params: obj})
    .then(res => {
      if (res.data.code === 0) return Promise.resolve(res.data)
      else return Promise.reject(res.data)
    })
}

// 获取广告详情(私有接口)
export function getAdvertsDetails(id) {
  return $http.get(`/shop/detail/${id}`).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

//编辑页面广告详情
export function getEditAdvertsDetails(id) {
  var params= {isEditPage: true}
  return $http.get(`/shop/detail/${id}`, {params: params}).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 获取广告详情(公共接口)
export function getAdvertsDetails_pub(id) {
  return $http.post(`/shop/pubDetail/` ,{advertid: id}).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 创建交易
export function createTrade(usdt, advertiseId, payType, convertTo, convertAmount) {
  let url;
  let data = {
    advertiseId: advertiseId,
    convertTo: convertTo,
    convertAmount: Number(convertAmount)
  }
  if(usdt){
    url = '/order/create_usdt'
  }else{
    url = '/order/create'
    data.payType = payType
  }
  return $http.post(url, data).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 获取交易详情
export function getTradeDetails(orderCode, type='orderCode') {
  return $http.get(`/order/detail?${type}=${orderCode}`).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 更新交易进度
export function orderUpdate(orderCode, op, remark=null) {
  let data = {
    orderCode: orderCode,
    op: op,
  }
  if(remark !== null){
    data.remark = remark
  }
  return $http.post('/order/update', data).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 数字币和法币相互转换
export function convert({id, amount, convertTo}) {
  return $http.post(`/shop/convert/${id}`, {
    amount: amount,
    convertTo: convertTo
  }).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

//申诉接口
export function appeal(data) {
  return $http.post(`/order/appeal`, data).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}
