<template>

  <div class="app-container">

    <h2 style="text-align: center;">添加新项目</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写项目基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-button type="text" @click="openAddChapterDialog">添加项目</el-button>


    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
                <el-button type="text" @click="openAddVideoDialog(chapter.id)">添加课时</el-button>
                <el-button style="" type="text" @click="openUpdateChapterDialog(chapter.id)">编辑</el-button>
                <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                <el-button type="text" @click="openUpdateVideoDialog(video.id)">编辑</el-button>
                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" v-bind:title="dialogTitleSwitch?'添加章节':'编辑章节'">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateChapter">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
<!--        <el-form-item label="上传视频">-->
<!--          &lt;!&ndash; TODO &ndash;&gt;-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>


    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
import chapter from "../../../api/edu/chapter";
import notification from "../../../api/element/notification";
import messageBox from "../../../api/element/messageBox";
import video from "../../../api/edu/video";

const defaultVideoForm = {
  id: '',
  courseId: '',
  chapterId: '',
  title: '',
  sort: 0,
  isFree: 0,
  videoSourceId: ''
}

export default {


  data() {
    return {
      // ==================== 章节 ====================
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterVideoList: [],
      courseId: '',
      dialogChapterFormVisible: false,
      dialogTitleSwitch: true,
      chapter: {
        id: '',
        courseId: '',
        title: '',
        sort: 0
      },
      // ==================== 小节 ====================
      saveVideoBtnDisabled: false, // 项目按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapterId: '', // 课时所在的章节id
      video: {}
    }
  },

  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getChapterVideoList();
    }
  },

  methods: {
    previous() {
      this.$router.push({path: '/course/info/' + this.courseId});
    },

    next() {
      this.$router.push({path: '/course/publish/' + this.courseId});
    },

    getChapterVideoList() {
      chapter.getChapterVideo(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.allChapterVideo;
        }).catch(error => {
        notification.errorNoti(this, '获取章节小节信息失败', error);
      })
    },


    /* ================== 项目操作 ================== */

    // 新增章节,通过弹窗添加
    openAddChapterDialog() {
      // 点击添加需要先清空chapter中内容
      this.chapter.title = '';
      this.chapter.sort = 0;
      // 弹出弹窗
      this.dialogTitleSwitch = true;
      this.dialogChapterFormVisible = true;
    },

    //修改章节,弹框回显数据
    openUpdateChapterDialog(chapterId) {
      // 调用接口获取点击的章节信息
      chapter.getChapter(chapterId)
        .then(response => {
          this.chapter = response.data.chapter;
        })
      // 弹窗
      this.dialogTitleSwitch = false;
      this.dialogChapterFormVisible = true;
    },


    saveOrUpdateChapter() {
      // 设置章节对应的课程id为当前页面课程的id
      this.chapter.courseId = this.courseId;

      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter();
      }
      // 清空
      this.chapter = {};
    },

    addChapter() {
      chapter.addChapter(this.chapter)
        .then(response => {
          // 关闭弹窗
          this.dialogChapterFormVisible = false;
          // 提示
          notification.successNoti(this, "成功", "添加章节成功");
          // 刷新页面
          this.getChapterVideoList();
        })
    },

    updateChapter() {
      chapter.updateChapter(this.chapter)
        .then(response => {
          this.dialogChapterFormVisible = false;
          notification.successNoti(this, "成功", "修改章节成功");
          this.getChapterVideoList();
        })
    },

    deleteChapter(chapterId) {
      this.$confirm('确认删除该章节?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.deleteChapter(chapterId)
          .then(response => {
            notification.successNoti(this, "成功", "删除章节成功");
            this.getChapterVideoList();
          }).catch(error => {
          notification.errorNoti(this, "失败", error.message);
        })
      }).catch(() => {
        notification.infoNoti(this, "取消", "已取消删除");
      });
    },

    /* ================== 小节操作 ================== */

    openAddVideoDialog(chapterId) {
      // 清空
      this.video = JSON.parse(JSON.stringify(defaultVideoForm));

      // 补全数据值
      this.video.courseId = this.courseId;
      this.video.chapterId = chapterId;

      this.dialogVideoFormVisible = true;
    },

    openUpdateVideoDialog(videoId) {
      video.getVideo(videoId)
        .then(response => {
          this.video = response.data.video;
          this.dialogVideoFormVisible = true;
        }).catch(error => {
        notification.errorNoti(this, "失败", "获取小节数据失败");
      })
    },

    saveOrUpdateVideo() {
      if (!this.video.id) {
        // 添加
        video.addVideo(this.video)
          .then(response => {
            this.dialogVideoFormVisible = false;
            notification.successNoti(this, "成功", "添加小节成功");
            this.getChapterVideoList();
          })
      } else {
        video.updateVideo(this.video)
          .then(response => {
            this.dialogVideoFormVisible = false;
            notification.successNoti(this, "成功", "更新小节成功");
            this.getChapterVideoList();
          })
      }
      // 表单还原
      this.video = JSON.parse(JSON.stringify(defaultVideoForm));

    },

    deleteVideo(videoId) {

      this.$confirm('确认删除该小节?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        video.deleteVideo(videoId)
          .then(response => {
            notification.successNoti(this, "成功", "删除小节成功");
            this.getChapterVideoList();
          }).catch(error => {
          notification.errorNoti(this, "失败", error.message);
        })
      }).catch(() => {
        notification.infoNoti(this, "取消", "已取消删除");
      });
    }
  }
}
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chanpterList li {
  position: relative;
}

.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}

.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>
