import $http from '@/plugins/$http'

// 获取历史
export function getRecord({page, count}) {
  return $http.post('/qh/record', {page, count})
    .then(res => {
      if (res.data.code === 0) return Promise.resolve(res.data)
      else return Promise.reject(res.data)
    })
}

// 获取余额等信息
export function getBase() {
  return $http.post('/qh/base')
    .then(res => {
      if (res.data.code === 0) return Promise.resolve(res.data)
      else return Promise.reject(res.data)
    })
}

//获取是否是会员
export function membercheck() {
  return $http.get('/qh/membercheck')
    .then(res => {
      if (res.data.code === 0) return Promise.resolve(res.data)
      else return Promise.reject(res.data)
    })
}

// 划账 
export function transfer({ amount, remark="" }) {
  return $http.post('/qh/rj', {amount, remark})
    .then(res => {
      if (res.data.code === 0) return Promise.resolve(res.data)
      else return Promise.reject(res.data)
    })
}

export function qhEnter() {
  return $http.get('/qh/enter')
    .then(res => {
      if (res.data.code === 0) return Promise.resolve(res.data)
      else return Promise.reject(res.data)
    })
}

// 积分转换
export function transQH({ isToQH, fromAmount }) {
  return $http.post('/qh/trans', { isToQH, fromAmount })
    .then(res => {
      if (res.data.code === 0) return Promise.resolve(res.data)
      else return Promise.reject(res.data)
    })
}
