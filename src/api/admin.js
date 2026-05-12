// 定义函数封装接口调用
import service from '@/utils/request'

export function login(data) {
  // 请求的是/user/login后端接口
  return service.post('/user/login', data)
}
export function categoryTree() {
  return service.get('/knowledge/category/tree')
}
// 知识文章列表获取
export function articlePage(params) {
  return service.get('/knowledge/article/page', { params })
}
// 上传图片
export function uploadFile(file, businessInfo) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', businessInfo.businessType)
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', businessInfo.businessField)
  // 不手动设置 Content-Type，让 axios 自动处理，
  // 这样就不会覆盖请求拦截器中设置的 Authorization header
  return service.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function createArticle(data) {
  return service.post('/knowledge/article', data)
}

export function getArticleDetail(id) {
  return service.get(`/knowledge/article/${id}`)
}

export function updateArticle(id, data) {
  return service.put(`/knowledge/article/${id}`, data)
}

export function changeArticleStatus(id, data) {
  return service.put(`/knowledge/article/${id}/status`, data)
}

export function deleteArticle(id) {
  return service.delete(`/knowledge/article/${id}`)
}

export function getConsultationPage(params) {
  return service.get('/psychological-chat/sessions', { params })
}

export function getSessionDetail(sessionId) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getEmotionPage(params) {
  return service.get('/emotion-diary/admin/page', { params })
}

export function deleteEmotion(id) {
  return service.delete(`/emotion-diary/admin/${id}`)
}

export function getAnalyticsOverview() {
  return service.get(`/data-analytics/overview`)
}
// 让后端知道退出登入
export function logout() {
  return service.post('/user/logout')
}
