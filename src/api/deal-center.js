import $http from '@/plugins/$http'

// 获取数据统计
export function getStatistics() {
  return $http.get('/account/statistics').then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}
