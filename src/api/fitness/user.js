import request from '@/utils/request'

export default {

  getAllUser() {
    return request({
      url: `/fitness/`,
      method: 'get',
    })
  },

  getRandom4User(num) {
    return request({
      url: `/fitness/getRandom4User/${num}`,
      method: 'get',
    })
  },

  getUserListPage(current, limit, userQuery) {
    return request({
      // url: '/table/list',
      url: `/fitness/pageCondition/${current}/${limit}`,
      method: 'post',
      data: userQuery
    })
  },

  deleteUserById(userId) {
    return request({
      url: `/fitness/userInfo/${userId}`,
      method: 'delete'
    })
  },

  addUser(user) {
    return request({
      url: `/fitness/userInfo/`,
      method: 'post',
      data: user
    })
  },

  getUserInfo(id) {
    return request({
      url: `/fitness/userInfo/${id}`,
      method: 'get'
    })
  },

  updateUser(user) {
    return request({
      url: `/fitness/userInfo`,
      method: 'put',
      data: user
    })
  }
}
