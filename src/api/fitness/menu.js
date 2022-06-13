import request from '@/utils/request'

export default {
  addSubject(file) {
    return request({
      url: "/eduservice/subject/addSubject",
      method: 'post',
      data: file
    })
  },

  getTemplate() {
    return request({
      url: "/eduoss/fileoss/subjectTemplate",
      method: 'get'
    })
  },

  getNestedTreeList() {
    return request({
      url: "/fitness/menu/",
      method: 'get'
    })
  }
}
