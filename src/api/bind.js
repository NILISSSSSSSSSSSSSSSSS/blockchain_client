import $http from '@/plugins/$http'

// 获取更换邮箱或手机的验证码
export function changeBindCode(data) {
  return $http.post('/validation/change_send', data).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 验证码是否正确
export function verifyCode(data) {
  return $http.post('/validation/change_verify', data).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 提交更换的请求
export function changeBind(data) {
  return $http.post('/validation/change_submit', data).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 二步验证解绑发送短信
export function unbindMsg(data) {
  return $http.post('/validation/unbind_send', data).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 二步验证解绑请求
export function unbind(data) {
  return $http.post('/validation/unbind_twophase', data).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 修改密码请求验证码
export function changepwMsg(data) {
  return $http.post('/users/passwd_send', data).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 修改密码提交
export function changepw(data) {
  return $http.patch('/users/passwd', data).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

//获取邮箱绑定的验证码
export function bindEmailMsg(data) {
  return $http.post('/users/email', data).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

//邮箱绑定
export function bindEmail(data) {
  return $http.post('/users/bind_email', data).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}





