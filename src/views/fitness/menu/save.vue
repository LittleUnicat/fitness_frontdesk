<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a @click="getTemplate">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :disabled="importBtnDisabled"
          :limit="limitNum"
          :action="BASE_API+'/fitness/menu/addMenu'"
          name="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import subject from "../../../api/fitness/menu";
import notification from "../../../api/element/notification";

export default {
  name: "save",

  data() {
    return {
      fileList: [{
        name: '',
        url: ''
      }],
      limitNum: 1,
      importBtnDisabled: false,
      loading: false,
      fileUploadBtnText: "上传到服务器",
      BASE_API: process.env.BASE_API, // 接口API地址
      OSS_PATH: process.env.OSS_PATH,
    };
  },
  methods: {
    // 获取模板数据
    getTemplate() {
      subject.getTemplate()
        .then(response => {
          window.location.href = response.data.url;
          notification.successNoti(this, "成功", "获取模板成功");
        }).catch(error => {
        notification.errorNoti(this, "错误", "获取模板失败");
      })
    },

    submitUpload() {
      this.importBtnDisabled = true;
      this.loading = true;
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    uploadSuccess() {
      this.importBtnDisabled = false;
      this.loading = false;
      notification.successNoti(this, "成功", "上传文件成功")
    },
    uploadError() {
      this.importBtnDisabled = false;
      this.loading = false;
      notification.errorNoti(this, "失败", "上传文件失败")
    }

  }

}
</script>

<style scoped>

</style>
