<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新项目</h2>

    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写项目基本信息"/>
      <el-step title="创建项目大纲"/>
      <el-step title="发布项目"/>
    </el-steps>

    <div class="ccInfo">
      <img :src="projectPublishInfo.cover">
      <div class="main">
        <h2>{{ projectPublishInfo.title }}</h2>
<!--        <p class="gray"><span>共{{ projectPublishInfo.lessonNum }}课时</span></p>-->
        <p><span>所属分类：{{ projectPublishInfo.menuFirstId }} — {{ projectPublishInfo.subjectLevelTwo }}</span></p>
<!--        <p>项目讲师：{{ projectPublishInfo.teacherName }}</p>-->
        <h3 class="red">￥{{ projectPublishInfo.price }}</h3>
      </div>
    </div>

    <div>
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">发布项目</el-button>
    </div>
  </div>
</template>

<script>
import project from "../../../api/edu/project";
import notification from "../../../api/element/notification";

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      projectId: '',
      projectPublishInfo: {
        id: '',
        title: '',
        cover: '',
        description: '',
        menuFirstTitle: '',
        menuSecondTitle: '',
        price: ''
      },
    }
  },

  created() {
    // 获取路径项目id值
    if (this.$route && this.$route.params.id) {
      this.corseId = this.$route.params.id;
      this.getPublishProjectInfo();
    }
  },

  methods: {
    previous() {
      console.log('previous')
      this.$router.push({path: '/project/chapter/' + this.corseId})
    },

    publish() {
      console.log('publish')
      this.publishProject();
      this.$router.push({path: '/project/list'})
    },

    getPublishProjectInfo() {
      project.getPublishInfo(this.corseId)
        .then(response => {
          this.projectPublishInfo = response.data.projectPublishInfo;
        }).catch(error => {
          notification.errorNoti(this, "错误", "获取项目信息失败");
      })
    },

    publishProject(){
      project.publishProject(this.corseId)
      .then(response => {
        notification.successNoti(this, "成功", "项目发布成功");
      }).catch(error => {
        notification.errorNoti(this, "失败", "发布项目失败");
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
