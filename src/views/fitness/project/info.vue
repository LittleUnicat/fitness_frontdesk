<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新项目</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写项目基本信息"/>
      <el-step title="创建项目大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="项目标题">
        <el-input v-model="projectInfo.title" placeholder=" 示例：肌肉狂暴训练！！我的手臂要爆炸啦！！"/>
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="项目类别">
        <el-select
          v-model="projectInfo.menuFirstId"
          placeholder="一级分类"
          @change="menuLevelOneChanged">
          <el-option
            v-for="menu in menuNestedList"
            :key="menu.id"
            :label="menu.title"
            :value="menu.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select
          v-model="projectInfo.menuSecondId"
          placeholder="二级分类">
          <el-option
            v-for="menu in subMenuList"
            :key="menu.id"
            :label="menu.title"
            :value="menu.id"/>
        </el-select>
      </el-form-item>


      <!--      &lt;!&ndash; 课程讲师 &ndash;&gt;-->
      <!--      <el-form-item label="项目价格">-->
      <!--        <el-select-->
      <!--          v-model="projectInfo.price"-->
      <!--          placeholder="请选择">-->
      <!--          <el-option-->
      <!--            v-for="teacher in teacherList"-->
      <!--            :key="teacher.id"-->
      <!--            :label="teacher.name"-->
      <!--            :value="teacher.id"/>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->

      <el-form-item label="项目章节">
        <el-input-number :min="0" v-model="projectInfo.buyCount" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <el-form-item label="项目价格">
        <el-input-number :min="0" v-model="projectInfo.price" controls-position="right" placeholder="免费项目请设置为0元"/>
        元
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="项目简介">
        <tinymce class="tinymce-container" :height="300" v-model="projectInfo.description"/>
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="项目封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
          :action="OSS_PATH+'/project/uploadCover'"
          class="avatar-uploader">
          <img :src="projectInfo.cover">
        </el-upload>

      </el-form-item>


      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import project from "../../../api/fitness/project";
import notification from "../../../api/element/notification";
import user from "../../../api/fitness/user";
import menu from "../../../api/fitness/menu";
import Tinymce from "../../../components/Tinymce"

export default {

  components: {Tinymce},

  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      BASE_API: process.env.BASE_API, // 接口API地址
      OSS_PATH: process.env.OSS_PATH,
      projectId: '',
      projectInfo: {
        id: '',
        title: '',
        menuSecondId: '',
        menuFirstId: '',
        buyCount: 0,
        status: '',
        description: '',
        cover: 'https://unicat.oss-cn-beijing.aliyuncs.com/fitness/default.png',
        price: 0,
      },
      priceList: [],
      menuNestedList: [],
      subMenuList: []
    }
  },

  watch: {
    $route(to, from) {
      console.log('watch $route');
      this.init();
    }
  },

  created() {
    // this.getListTeacher();
    this.initMenuList();

    // 可能使chapter退回来的数据，回显
    if (this.$route.params && this.$route.params.id) {
      this.projectId = this.$route.params.id;
      this.getProjectInfo();
    }
  },

  methods: {

    next() {
      this.saveBtnDisabled = true;
      if (!this.projectInfo.id) {
        this.saveData();
      } else {
        this.updateData();
        this.saveBtnDisabled = false;
      }
      this.saveBtnDisabled = false;
    },

    // 保存
    saveData() {
      project.addProject(this.projectInfo).then(response => {
        notification.successNoti(this, "成功", "添加课程成功")
        return response// 将响应结果传递给then
      }).then(response => {
        console.log(response.data.projectId)
        this.$router.push({path: '/project/chapter/' + response.data.projectId})
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },

    // 更新
    updateData() {
      project.updateProject(this.projectInfo).then(response => {
        notification.successNoti(this, "成功", "更新项目成功")
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({path: '/project/chapter/' + this.projectId})
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },

    // getListTeacher() {
    //   course.getListTeacher()
    //     .then(response => {
    //       this.teacherList = response.data.items;
    //     }).catch(error => {
    //     notification.errorNoti(this, "获取讲师列表失败", error);
    //   })
    // },

    menuLevelOneChanged(value) {
      for (let i = 0; i < this.menuNestedList.length; i++) {
        if (this.menuNestedList[i].id === value) {
          this.subMenuList = this.menuNestedList[i].children;
          this.projectInfo.menuSecondId = '';
        }
      }
    },

    initMenuList() {
      menu.getNestedTreeList().then(response => {
        this.menuNestedList = response.data.subjectList;
      }).catch(error => {
        notification.errorNoti(this, "获取下拉列表失败", error);
      })
    },

    handleAvatarSuccess(res, file) {
      console.log(res)// 上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      this.projectInfo.cover = res.data.url
    },

    handleAvatarError() {
      notification.errorNoti(this, "失败", "上传课程封面失败");
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    getProjectInfo() {
      project.getProject(this.projectId)
        .then(response => {
          this.projectInfo = response.data.project;

          menu.getNestedTreeList()
            .then(response => {
              this.menuNestedList = response.data.subjectList;
              for (var i = 0; i < this.menuNestedList.length; i++) {
                var menuFirst = this.menuNestedList[i];
                if (this.projectInfo.menuFirstId === menuFirst.id) {
                  this.subMenuList = menuFirst.children;
                }
              }
            })

        }).catch(error => {
        notification.errorNoti(this, "回显数据失败", error);
      })
    },

  }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
