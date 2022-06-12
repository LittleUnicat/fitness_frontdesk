import request from '@/utils/request'

export default {

  addVideo(video) {
    return request({
      url: `/fitness/video/`,
      method: 'post',
      data: video
    })
  },

  updateVideo(video) {
    return request({
      url: `/fitness/video/`,
      method: 'put',
      data: video
    })
  },

  deleteVideo(videoId) {
    return request({
      url: `/fitness/video/${videoId}`,
      method: 'delete'
    })
  },

  getVideo(videoId) {
    return request({
      url: `/fitness/video/${videoId}`,
      method: 'get'
    })
  },

}
