<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="二级分类">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>


      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce class="tinymce-container" :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
          :action="OSS_PATH+'/course/uploadCover'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import course from "../../../api/edu/course";
import notification from "../../../api/element/notification";
import teacher from "../../../api/edu/teacher";
import subject from "../../../api/edu/subject";
import Tinymce from "../../../components/Tinymce"

export default {

  components: {Tinymce},

  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      BASE_API: process.env.BASE_API, // 接口API地址
      OSS_PATH: process.env.OSS_PATH,
      courseId: '',
      courseInfo: {
        title: '',
        subjectId: '',
        subjectParentId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: 'https://unicat.oss-cn-beijing.aliyuncs.com/course/cover/default.jpg',
        price: 0,
      },
      teacherList: [],
      subjectNestedList: [],
      subSubjectList: []
    }
  },

  watch: {
    $route(to, from) {
      console.log('watch $route');
      this.init();
    }
  },

  created() {
    this.getListTeacher();
    this.initSubjectList();

    // 可能使chapter退回来的数据，回显
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getCourseInfo();
    }
  },

  methods: {

    next() {
      console.log('next');
      this.saveBtnDisabled = true;
      if (!this.courseInfo.id) {
        this.saveData();
      } else {
        this.updateData();
      }
    },

    // 保存
    saveData() {
      course.addCourse(this.courseInfo).then(response => {
        notification.successNoti(this, "成功", "添加课程成功")
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({path: '/course/chapter/' + response.data.courseId})
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },

    // 更新
    updateData() {
      course.updateCourse(this.courseInfo).then(response => {
        notification.successNoti(this, "成功", "更新课程成功")
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({path: '/course/chapter/' + this.courseId})
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },

    getListTeacher() {
      course.getListTeacher()
        .then(response => {
          this.teacherList = response.data.items;
        }).catch(error => {
        notification.errorNoti(this, "获取讲师列表失败", error);
      })
    },

    subjectLevelOneChanged(value) {
      console.log(value)
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        if (this.subjectNestedList[i].id === value) {
          this.subSubjectList = this.subjectNestedList[i].children;
          this.courseInfo.subjectId = '';
        }
      }
    },

    initSubjectList() {
      subject.getNestedTreeList().then(response => {
        this.subjectNestedList = response.data.subjectList;
      })
    },

    handleAvatarSuccess(res, file) {
      console.log(res)// 上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseInfo.cover = res.data.url
    },

    handleAvatarError(){
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

    getCourseInfo() {
      course.getCourse(this.courseId)
        .then(response => {
          this.courseInfo = response.data.course;

          subject.getNestedTreeList()
            .then(response => {
              this.subjectNestedList = response.data.subjectList;
              for (var i = 0; i < this.subjectNestedList.length; i++) {
                var oneSubject = this.subjectNestedList[i];
                if (this.courseInfo.subjectParentId === oneSubject.id) {
                  this.subSubjectList = oneSubject.children;
                  console.log("children:" + this.subSubjectList);
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
