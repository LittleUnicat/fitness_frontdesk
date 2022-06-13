import request from '@/utils/request'

export default {

  getTeacherList() {
    return request({
      // url: '/table/list',
      url: `/eduservice/teachers/`,
      method: 'get'
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

  deleteTeacherById(teacherId){
    return request({
      url: `/eduservice/teachers/${teacherId}`,
      method: 'delete'
    })
  },

  addTeacher(teacher){
    return request({
      url: `/eduservice/teachers/`,
      method: 'post',
      data: teacher
    })
  },

  getTeacherInfo(id){
    return request({
      url: `/eduservice/teachers/${id}`,
      method: 'get'
    })
  },

  updateTeacher(teacher){
      return request({
        url: `/eduservice/teachers/`,
        method: 'put',
        data: teacher
      })
  }
}
