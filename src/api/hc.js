import $http from '@/plugins/$http'

// 获取文章列表
export function getArticleList({lang='cn', pageSize=20, pageType='', tags=[]}) {
  let url
  if (tags.length > 0) {
    let tagStr = ''
    tags.forEach(item => {
      tagStr += `&tags=${item}`
    })
    url = `/article/list?pageSize=${pageSize}&lang=${lang}${tagStr}`
  } else {
    url = `/article/list?pageSize=${pageSize}&lang=${lang}`
  }
  if (pageType) url += `&pageType=${pageType}`
  return $http.get(url).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 获取文章详情
export function getArticleDetail({lang='cn', id}) {
  return $http.get(`/article/detail?articleId=${id}&lang=${lang}`).then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}

// 获取官方社群列表
export function getContact() {
  return $http.get('/sysconf/contact').then(res => {
    if (res.data.code === 0) return Promise.resolve(res.data)
    else return Promise.reject(res.data)
  })
}
