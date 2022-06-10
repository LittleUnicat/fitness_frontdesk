<template>
  <div class="app-container">
    <el-form
      label-width="120px">
      <!--讲师名称-->
      <el-form-item
        label="讲师名称">
        <el-input
          v-model="teacher.name"/>
      </el-form-item>

      <!--讲师排序-->
      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          label-width="100"
          :min="0"/>
      </el-form-item>

      <!--讲师头衔/等级-->
      <el-form-item
        label="讲师头衔">
        <el-select
          v-model="teacher.level"
          clearable
          placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option
            :value="1"
            label="LV1"/>
          <el-option
            :value="2"
            label="LV2"/>
          <el-option
            :value="3"
            label="LV3"/>
          <el-option
            :value="4"
            label="LV4"/>
          <el-option
            :value="5"
            label="LV5"/>
          <el-option
            :value="6"
            label="LV6"/>
        </el-select>
      </el-form-item>

      <!--讲师资历/career-->
      <el-form-item
        label="讲师资历">
        <el-input
          v-model="teacher.career"/>
      </el-form-item>

      <!--讲师简介-->
      <el-form-item
        label="讲师简介">
        <el-input
          placeholder="这家伙很懒，什么都没有留下..."
          v-model="teacher.intro"
          :rows="10"
          type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO  -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
          v-show：是否显示上传组件
          :key：类似于id，如果一个页面多个图片上传控件，可以做区分
          :url：后台上传的url地址
          @close：关闭上传组件
          @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss/headimg'"
          field="file"
          @close="closeBox"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <!--保存按钮-->
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate">
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from "../../../api/edu/teacher";
import notification from "../../../api/element/notification";
import ImageCropper from '../../../components/ImageCropper'
import PanThumb from '../../../components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },

  data() {
    return {
      teacher: {
        name: '',
        intro: '',
        sort: 0,
        level: null,
        career: '',
        avatar: ''
      },
      saveBtnDisabled: false,     // 保存按钮当前是否可点击（防止多次操作）
      imagecropperShow: false,    // 默认是否打开文件上传弹弹窗
      imagecropperKey: 0,         // 上传组件id
      BASE_API: process.env.BASE_API, // 接口API地址
    }
  },
  created() { // 页面渲染之前进行
    console.log("created");
    this.init();
  },

  watch: {
    $route(to, from) {  // 当路由发生变化的时候执行方法
      console.log('watch $route')
      this.init()
    }
  },

  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {  // 有id，做修改操作
        const id = this.$route.params.id;
        this.getInfo(id);
      } else {  // 无id，清空teacher数据做添加操作
        this.teacher = {};
      }
    },

    saveOrUpdate() {
      this.saveBtnDisabled = true;

      // 有id则更新
      if (this.teacher.id) {
        this.updateTeacherInfo();
      } else {  //无则添加
        this.saveTeacher();
      }

      this.saveBtnDisabled = false;
    },

    // 保存
    saveTeacher() {
      teacherApi.addTeacher(this.teacher)
        .then(response => { // 添加成功
          // 提示信息
          notification.successNoti(this, "成功", `添加${this.teacher.name}教师成功`);
          // 回到列表页面，使用路由跳转
          this.$router.push({path: '/teacher/table'})
        }).catch(error => {
        notification.errorNoti(this, "失败", "添加失败");
      }).catch(error => {
        this.$message.error(error);
      })
    },

    // 修改时获取用户原数据并保存
    getInfo(id) {
      teacherApi.getTeacherInfo(id)
        .then(response => {
          this.teacher = response.data.teacher;
        }).catch(error => {
        this.$message.error(error);
      })
    },

    // 更新数据
    updateTeacherInfo() {
      teacherApi.updateTeacher(this.teacher)
        .then(response => { // 添加成功
          // 提示信息
          notification.successNoti(this, "成功", `修改${this.teacher.name}教师成功`);
          // 回到列表页面，使用路由跳转
          this.$router.push({path: '/teacher/table'})
        }).catch(error => {
        notification.errorNoti(this, "失败", "修改失败");
      }).catch(error => {
        this.$message.error(error);
      })
    },

    // 文件上传：关闭弹窗
    closeBox(){
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 文件上传：上传成功返回url
    cropSuccess(data){
      // 返回图片地址
      this.teacher.avatar = data.url;
      // 关弹窗
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    }
  }

}
</script>
