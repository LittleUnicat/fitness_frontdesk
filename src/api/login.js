import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/fitness/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  console.log("token" + token)
  return request({
    url: '/fitness/userInfo',
    method: 'get',
    params: {token}
  })
}

export function logout() {
  return request({
    url: '/fitness/logout',
    method: 'post'
  })
}
