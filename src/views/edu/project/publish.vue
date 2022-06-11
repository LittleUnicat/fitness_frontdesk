<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublishInfo.cover">
      <div class="main">
        <h2>{{ coursePublishInfo.title }}</h2>
        <p class="gray"><span>共{{ coursePublishInfo.lessonNum }}课时</span></p>
        <p><span>所属分类：{{ coursePublishInfo.subjectLevelOne }} — {{ coursePublishInfo.subjectLevelTwo }}</span></p>
        <p>课程讲师：{{ coursePublishInfo.teacherName }}</p>
        <h3 class="red">￥{{ coursePublishInfo.price }}</h3>
      </div>
    </div>

    <div>
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">发布课程</el-button>
    </div>
  </div>
</template>

<script>
import course from "../../../api/edu/project";
import notification from "../../../api/element/notification";

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      corseId: '',
      coursePublishInfo: {
        id: '',
        title: '',
        cover: '',
        lessonNum: 0,
        description: '',
        subjectLevelOne: '',
        subjectLevelTwo: '',
        teacherName: '',
        price: ''
      },
    }
  },

  created() {
    // 获取路径课程id值
    if (this.$route && this.$route.params.id) {
      this.corseId = this.$route.params.id;
      this.getPublishCourseInfo();
    }
  },

  methods: {
    previous() {
      console.log('previous')
      this.$router.push({path: '/course/chapter/' + this.corseId})
    },

    publish() {
      console.log('publish')
      this.publishCourse();
      this.$router.push({path: '/course/list'})
    },

    getPublishCourseInfo() {
      course.getPublishCourseInfo(this.corseId)
        .then(response => {
          this.coursePublishInfo = response.data.coursePublishInfo;
        }).catch(error => {
          notification.errorNoti(this, "错误", "获取课程信息失败");
      })
    },

    publishCourse(){
      course.publishCourse(this.corseId)
      .then(response => {
        notification.successNoti(this, "成功", "课程发布成功");
      }).catch(error => {
        notification.errorNoti(this, "失败", "发布课程失败");
      })
    }
  }
}
</script>
<style scoped>
.ccInfo {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #DDD;
  margin-bottom: 40px;
  position: relative;
}

.ccInfo img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}

.ccInfo .main {
  margin-left: 520px;
}

.ccInfo .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main h3 {
  left: 540px;
  bottom: 20px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>
