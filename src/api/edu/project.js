import request from '@/utils/request'

export default {
  addProject(project) {
    return request({
      url: "/fitness/project/",
      method: 'post',
      data: project
    })
  },

  getProject(pid) {
    console.log("pid:" + pid)
    return request({
      url: `/fitness/project/${pid}`,
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
      url: `/fitness/project/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  updateProject(project) {
    return request({
      url: "/fitness/project/",
      method: 'put',
      data: project
    })
  },

  getListTeacher() {
    return request({
      url: '/eduservice/teachers/',
      method: 'get'
    })
  },

  getPublishCourseInfo(courseId) {
    return request({
      url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
      method: 'get'
    })
  },

  publishCourse(courseId) {
    return request({
      url: `/eduservice/course/publishCourse/${courseId}`,
      method: 'put'
    })
  }
}
