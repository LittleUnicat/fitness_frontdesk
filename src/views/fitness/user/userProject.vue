<template>

  <div class="app-container">

    <h2 style="text-align: center;">用户参与项目</h2>

    <el-button type="text" @click="openAddChapterDialog">添加项目</el-button>

    <el-table
      :data="userProjectVoList.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
      element-loading-text="数据加载中"
      fit
      highlight-current-row>
      <el-table-column
        type="index"
        label="序号"
        align="center">
      </el-table-column>
      <el-table-column
        align="center"
        label="项目名称"
        prop="title">
      </el-table-column>
      <el-table-column label="封面" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.cover" alt="scope.row.title" width="150px">
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="价格"
        prop="price">
        <template slot-scope="scope">
          {{ scope.row.price }}元
        </template>
      </el-table-column>

      <el-table-column
        align="center">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            @click="handleEdit(scope.$index, scope.row)">Edit-->
          <!--          </el-button>-->
          <el-button
            size="mini"
            type="danger"

            @click="handleDelete(scope.row)">Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="back">返回用户列表</el-button>
    </div>


    <!-- 添加和修改活动表单 -->
    <el-dialog width="80vw" :visible.sync="dialogChapterFormVisible" title='添加活动'>

      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row
        row-class-name="myClassList">

        <el-table-column
          label="序号"
          width="70"
          align="center">
          <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column label="课程信息" width="400" align="center">
          <template slot-scope="scope">
            <div class="info">
              <div class="pic">
                <img :src="scope.row.cover" alt="scope.row.title" width="150px">
              </div>
              <div class="title">
                <a href="">{{ scope.row.title }}</a>
              </div>
            </div>

          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.gmtCreate.substr(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.gmtModified.substr(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column label="价格" width="100" align="center">
          <template slot-scope="scope">
            {{
              Number(scope.row.price) === 0 ? '免费' :
                '¥' + scope.row.price.toFixed(2)
            }}
          </template>
        </el-table-column>
        <!--        <el-table-column prop="buyCount" label="付费学员" width="100" align="center">-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ scope.row.buyCount }}人-->
        <!--          </template>-->
        <!--        </el-table-column>-->

        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <!--            <router-link :to="'/project/info/'+scope.row.id">-->

            <el-button type="text" size="mini" icon="el-icon-edit" @click="addUserProject(scope.row)">添加该课程</el-button>
            <!--            </router-link>-->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchData"
      />
    </el-dialog>

  </div>
</template>

<script>
import chapter from "../../../api/fitness/chapter";
import notification from "../../../api/element/notification";
import messageBox from "../../../api/element/messageBox";
import video from "../../../api/fitness/video";
import project from "../../../api/fitness/project";
import userproject from "../../../api/user/userproject";

const defaultVideoForm = {
  id: '',
  projectId: '',
  chapterId: '',
  title: '',
  sort: 0,
  isFree: 0,
}

export default {


  data() {
    return {
      // ==================== 活动 ====================
      saveBtnDisabled: false, // 保存按钮是否禁用
      userProjectVoList: [{
        id: '',
        title: '',
        price: '',
        cover: '',
        description: ''
      }],
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 6, // 每页记录数
      userId: '',
      dialogChapterFormVisible: false,
      dialogTitleSwitch: true,
      chapter: {
        id: '',
        projectId: '',
        title: '',
        sort: 0
      },
      // ==================== 小节 ====================
      saveVideoBtnDisabled: false, // 项目按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapterId: '', // 课时所在的活动id
      search: ''
    }
  },

  created() {
    if (this.$route.params && this.$route.params.id) {
      this.userId = this.$route.params.id;
      this.getUserInfoList();
    }


  },

  methods: {

    back() {
      this.$router.push({path: '/user/table/'});
    },

    getUserInfoList() {
      console.log("uid:" + this.userId)
      chapter.getUserInfoList(this.userId)
        .then(response => {
          this.userProjectVoList = response.data.userProjectVoList;
        }).catch(error => {
        notification.errorNoti(this, '获取用户项目信息失败', error);
      })
    },

    addUserProject(project) {
      userproject.addUser(this.userId, project.id)
        .then(response => {
          notification.successNoti(this, "成功", `添加${project.title}成功`);
          this.getUserInfoList();
        }).catch(error => {
        notification.errorNoti(this, "失败", `添加${project.title}失败`)
      })
    },


    /* ================== 项目添加 ================== */


    fetchData(page = 1) { // 调用api层获取数据库中的数据
      console.log(this.searchObj);
      // 当点击分页组件的切换按钮的时候，会传输一个当前页码的参数page
      // 解决分页无效问题
      this.page = page
      this.listLoading = true
      project.getPageList(this.page, this.limit, this.searchObj).then(response => {
        // debugger 设置断点调试
        if (response.success === true) {
          this.list = response.data.rows
          this.total = response.data.total
        }
        this.listLoading = false
      })
    },

    // 新增活动,通过弹窗添加
    openAddChapterDialog() {
      this.dialogChapterFormVisible = true;

      this.fetchData();
    },

    handleDelete(row) {
      console.log(row)
      this.$confirm(`将要删除项目${row.title}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userproject.deleteUserProject(row.id)
          .then(res => {
            notification.successNoti(this, "成功", `删除${row.title}成功`);
            this.getUserInfoList()
          }).catch(err => {
          notification.errorNoti(this, "失败", `删除${row.title}失败`)
        })
      })
    }
  }
}
</script>

<style scoped>
.projectList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.projectList li {
  position: relative;
}

.projectList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}

.projectList .acts {
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
