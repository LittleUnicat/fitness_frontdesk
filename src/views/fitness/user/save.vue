<template>
  <div class="app-container">
    <el-form
      label-width="120px"
      :model="user"
      status-icon
      :rules="rules"
      ref="ruleForm">
      <!--用户名称-->
      <el-form-item
        label="用户名">
        <el-input
          v-model="user.username"/>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input type="password" v-model="user.checkPassword"></el-input>
      </el-form-item>


      <el-form-item
        label="用户身份">
        <el-select
          v-model="user.role"
          clearable
          placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option
            value="user"
            label="客户"/>
          <el-option
            value="admin"
            label="管理员"/>
        </el-select>
      </el-form-item>


      <!-- 用户头像 -->
      <el-form-item label="用户头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="user.avatar"/>
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
          :url="BASE_API+'/fitnessOss/headimg'"
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
import userApi from "../../../api/fitness/user";
import notification from "../../../api/element/notification";
import ImageCropper from '../../../components/ImageCropper'
import PanThumb from '../../../components/PanThumb'
import {getToken} from '../../../utils/auth'
import {logout} from "../../../api/login";
import messageBox from "../../../api/element/messageBox";

export default {
  components: {ImageCropper, PanThumb},

  data() {


    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.user.checkPassword !== '') {
          this.$refs.ruleForm.validateField('checkPassword');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.user.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      user: {
        id: '',
        username: '',
        password: '',
        checkPassword: '',
        role: '',
        avatar: ''
      },
      saveBtnDisabled: false,     // 保存按钮当前是否可点击（防止多次操作）
      imagecropperShow: false,    // 默认是否打开文件上传弹弹窗
      imagecropperKey: 0,         // 上传组件id
      BASE_API: process.env.BASE_API, // 接口API地址


      rules: {
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPassword: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      }
    }

  },
  created() { // 页面渲染之前进行
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
      } else {  // 无id，清空user数据做添加操作
        this.user = {};
      }
    },

    submitForm(formName) {
      console.log("submitForm")
      this.$refs[formName].validate((valid) => {
        console.log("valid:" + valid)
        if (valid) {
          this.doSaveOrUpdate();
        } else {
          notification.errorNoti(this, "保存失败", "表单有误，请检查表单")
          this.saveBtnDisabled = false;
        }
      });

    },

    saveOrUpdate() {

      this.saveBtnDisabled = true;

      this.submitForm('ruleForm');

      this.saveBtnDisabled = false;
    },

    doSaveOrUpdate() {
      console.log("doSaveOrUpdate")
      // 有id则更新
      if (this.user.id) {
        console.log("updateUserInfo")
        this.updateUserInfo();
      } else {  //无则添加
        this.saveUser();
      }
    },

    // 保存
    saveUser() {
      userApi.addUser(this.user)
        .then(response => { // 添加成功
          // 提示信息
          notification.successNoti(this, "成功", `添加${this.user.username}用户成功`);
          // 回到列表页面，使用路由跳转
          this.$router.push({path: '/user/table'})
        }).catch(error => {
        notification.errorNoti(this, "失败", "添加失败");
      }).catch(error => {
        this.$message.error(error);
      })
    },

    // 修改时获取用户原数据并保存
    getInfo(id) {
      userApi.getUserInfo(id)
        .then(response => {
          this.user = response.data.user;
        }).catch(error => {
        this.$message.error(error);
      })
    },

    // 更新数据
    updateUserInfo() {
      if (this.user.id === getToken()) {
        this.$confirm("继续操作将登出，是否确认？", "修改用户为当前登录用户", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doUpdateUserInfo().then(() => {
            this.$message({
              type: 'success',
              message: '成功'
            });
          }).catch(res => {
            this.$message({
              type: "error",
              message: "未知错误"
            })
          })
        }).catch(() => {
        })

      } else {
        this.doUpdateUserInfo().then(() => {
          this.$message({
            type: 'success',
            message: '成功'
          });
        }).catch(res => {
          this.$message({
            type: "error",
            message: "未知错误"
          })
        })
      }

    },

    doUpdateUserInfo() {
      userApi.updateUser(this.user)
        .then(response => { // 添加成功
          // 提示信息
          notification.successNoti(this, "成功", `修改${this.user.username}用户成功`);
          if (this.user.id === getToken()) {
            // 自己的账户被修改的时候重新登陆
            this.$store.dispatch('LogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          }
          // 回到列表页面，使用路由跳转
          this.$router.push({path: '/user/table'})
        }).catch(error => {
        notification.errorNoti(this, "失败", "修改失败");
      }).catch(error => {
        this.$message.error(error);
      })
    },

    // 文件上传：关闭弹窗
    closeBox() {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 文件上传：上传成功返回url
    cropSuccess(data) {
      // 返回图片地址
      this.user.avatar = data.url;
      // 关弹窗
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },


  }

}
</script>
