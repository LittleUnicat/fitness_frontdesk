import request from '@/utils/request'

export default {
  getChapterVideo(projectId) {
    return request({
      url: `/fitness/chapter/getChapterVideo/${projectId}`,
      method: 'get'
    })
  },

  addChapter(chapter) {
    return request({
      url: `/fitness/chapter/`,
      method: 'post',
      data: chapter
    })
  },

  updateChapter(chapter) {
    return request({
      url: `/fitness/chapter/`,
      method: 'put',
      data: chapter
    })
  },

  deleteChapter(chapterId) {
    return request({
      url: `/fitness/chapter/${chapterId}`,
      method: 'delete'
    })
  },

  getChapter(chapterId) {
    return request({
      url: `/fitness/chapter/${chapterId}`,
      method: 'get'
    })
  },

}
