import $http from '@/plugins/$http'


//提币验证
export function tiBiYanZheng() {
  return $http.get(`/account/withdraws_check`).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}



// 判断是否开通钱包，如果开通返回钱包数据
export function isDeposits(currency) {
  return $http.get(`/account/deposits?currency=${currency}`)
          .then(res => {
            if (res.data.code === 0) return Promise.resolve(res.data)
            else return Promise.reject(res.data)
          })
}

// 申请开通钱包
export function applyaddress(currency) {
  return $http.post(`/account/applyaddress`, {
    currency: currency
  }).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 获取钱包列表
export function getWalletsList() {
  return $http.get('/account/wallets').then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 查询充值、提币详情
export function getDetails({type, id}) {
  let url,urlId
  if (type === 'withdraws') {
    url = 'withdraws_detail'
    urlId = 'withdrawsId'
  }
  if (type === 'deposits') {
    url = 'deposits_detail'
    urlId = 'depositsId'
  }
  return $http.get(`/account/${url}?${urlId}=${id}`).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 获取充值、提币记录
export function getDepositsWithdraws(obj={}) {
  return $http.get('/account/deposits_withdraws', {params: obj}).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}
