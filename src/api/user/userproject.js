import request from '@/utils/request'

export default {
  addUser(userId, projectId) {
    return request({
      url: "/fitness/userProject/",
      method: 'post',
      data: {
        userId,
        projectId
      }
    })
  },

  deleteUserProject(projectId){
    return request({
      url: "/fitness/userProject/",
      method: 'delete',
      data: projectId
    })
  },
}
