import request from '@/utils/request'

export default {
  addUser(userInfo) {
    return request({
      url: "/serviceFitness/user",
      method: 'post',
      data: userInfo
    })
  },

  getCourse(courseId) {
    return request({
      url: `/eduservice/course/${courseId}`,
      method: 'get',
    })
  },

  deleteCourse(courseId) {
    return request({
      url: `/eduservice/course/${courseId}`,
      method: 'delete'
    })
  },

  getCourseList() {
    return request({
      url: `/eduservice/course/`,
      method: 'get',
    })
  },

  getPageList(page, limit, searchObj) {
    return request({
      url: `/eduservice/course/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  updateCourse(courseInfo) {
    return request({
      url: "/eduservice/course/",
      method: 'put',
      data: courseInfo
    })
  },

  getListTeacher() {
    return request({
      url: '/eduservice/teachers/',
      method: 'get'
    })
  },

  getPublishCourseInfo(courseId){
    return request({
      url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
      method: 'get'
    })
  },

  publishCourse(courseId){
    return request({
      url: `/eduservice/course/publishCourse/${courseId}`,
      method: 'put'
    })
  }
}
