import $http from '@/plugins/$http'

export function getDetail () {
  return $http.get('/users/detail').then(res=>{
    //Promise.resolve(res.data);
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

export function editAvatar (data, option) {
  return $http.post(`/users/avatar`, data, option).then(res=>{
    //Promise.resolve(res.data);
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

export function editName (data) {
  return $http.put(`/users/edit`, data).then(res=>{
    //Promise.resolve(res.data);
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

//修改个人信息统一接口
export function edit (data, option) {
  return $http.post(`/users/edit`, data, option).then(res=>{
    //Promise.resolve(res.data);
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

//验证码登录
export function yanZhengMa_login (data) {
  return $http.post(`/users/authcode_signin`, data).then(res=>{
    //Promise.resolve(res.data);
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}


export function phoneVerifyCode (data) {
  return $http.post(`/users/phone`, data).then(res=>{
    //Promise.resolve(res.data);
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

export function phoneVerify (data) {
  return $http.post(`/users/verify_phone`, data).then(res=>{
    //Promise.resolve(res.data);
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

export function twoVerifyCode (data) {
  return $http.post(`/users/phone`, data).then(res=>{
    //Promise.resolve(res.data);
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

export function twoVerify (data) {
  return $http.post(`/users/avatar`, data).then(res=>{
    //Promise.resolve(res.data);
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

//登录接口
export function login (data) {
  return $http.post(`/users/signin`, data).then(res=>{
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

//根据IP获取当前所在的地区
export function region (data) {
  return $http.post(`/index/ipinfo`, data).then(res=>{
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

//提交设置消息提醒
export function notify (data) {
  return $http.post(`/users/msgswitch`, data).then(res=>{
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}
