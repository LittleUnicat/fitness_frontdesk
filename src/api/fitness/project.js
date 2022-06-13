import request from '@/utils/request'

export default {
  addProject(project) {
    console.log("addProject" + addProject)
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

  deleteProject(courseId) {
    return request({
      url: `/fitness/project/${courseId}`,
      method: 'delete'
    })
  },

  getProjectList() {
    return request({
      url: `/fitness/project/`,
      method: 'get',
    })
  },

  getPriceList() {
    return request({
      url: `/fitness/project/price`,
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

  // getListTeacher() {
  //   return request({
  //     url: '/eduservice/teachers/',
  //     method: 'get'
  //   })
  // },

  getPublishInfo(projectId) {
    return request({
      url: `/fitness/project/getPublishProjectInfo/${projectId}`,
      method: 'get'
    })
  },

  publishProject(projectId) {
    return request({
      url: `/fitness/project/publishProject/${projectId}`,
      method: 'put'
    })
  }
}
