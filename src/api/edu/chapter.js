import request from '@/utils/request'

export default {
  getChapterVideo(courseId) {
    return request({
      url: `/eduservice/chapter/getChapterVideo/${courseId}`,
      method: 'get'
    })
  },

  addChapter(chapter) {
    return request({
      url: `/eduservice/chapter/`,
      method: 'post',
      data: chapter
    })
  },

  updateChapter(chapter) {
    return request({
      url: `/eduservice/chapter/`,
      method: 'put',
      data: chapter
    })
  },

  deleteChapter(chapterId) {
    return request({
      url: `/eduservice/chapter/${chapterId}`,
      method: 'delete'
    })
  },

  getChapter(chapterId) {
    return request({
      url: `/eduservice/chapter/${chapterId}`,
      method: 'get'
    })
  },

}
