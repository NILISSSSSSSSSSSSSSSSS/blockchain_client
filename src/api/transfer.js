import $http from '@/plugins/$http'

// 获取地址关联的用户信息
export function getUname(data) {
  return $http.post(`/transfer/relevance_new`, data)
    .then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 获取地址关联的用户信息
export function getTranInfo() {
  return $http.get(`/transfer/option_list`)
    .then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

//提交转账申请
export function transfer(data) {
  return $http.post(`/transfer/submit_new`, data)
    .then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

//获取转账交易记录
export function record(params) {
  return $http.get(`/transfer/record`, {params: params})
    .then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

