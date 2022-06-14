<template>
  <div id="app">
    <!--查询表单-->
    <el-form
      :inline="true"
      class="demo-form-inline">
      <el-form-item>
        <el-input
          v-model="userQuery.username"
          clearable
          placeholder="用户名"/>
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="userQuery.role"
          clearable
          placeholder="用户身份">
          <el-option
            value="user"
            label="客户"/>
          <el-option
            value="admin"
            label="管理员"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          clearable
          v-model="userQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          clearable
          v-model="userQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      :data="list"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="avatar"
        label="头像"
        align="center"
        width="220">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.avatar" alt="scope.row.title" width="100px">
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        align="center"
        width="220">
      </el-table-column>
      <el-table-column
        prop="role"
        label="身份"
        align="center"
      >
        <template slot-scope="scope">
          {{ judgeRole(scope.row.role) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        label="加入时间"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="280">
        <template
          slot-scope="scope">
          <!-- 修改的路由 -->
          <router-link :to="'/user/edit/'+scope.row.id">
            <el-button
              @click="handleClick(scope.row.id)"
              type="text"
              size="small">
              编辑用户信息
            </el-button>
          </router-link>

          <router-link :to="'/user/project/'+scope.row.id">
            <el-button
              type="text"
              size="small">
              编辑用户课程
            </el-button>
          </router-link>

          <el-button
            @click="removeUserById(scope.row)"
            type="text"
            size="small">
            删除
          </el-button>

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
      @current-change="getList"
    />
  </div>

</template>

<script>
import user from '../../../api/fitness/user'
import notification from '../../../api/element/notification'
import messageBox from "../../../api/element/messageBox";

export default {
  name: "app",
  data() {
    return {
      list: null,
      page: 1,
      limit: 5,
      total: 0,
      userQuery: {
        avatar: '',
        username: '',
        role: '',
        begin: '',
        end: ''
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {

    getList(page = 1) {
      this.page = page;
      user.getUserListPage(this.page, this.limit, this.userQuery)
        .then(response => {
          // 成功，保存数据
          this.list = response.data.rows;
          this.total = response.data.total;
          console.log(this.list);
        })
        .catch(error => {
          // 失败
          console.log(error);
        })
    },

    handleClick(row) {
      console.log(row);
    },

    resetData() {
      this.userQuery = {};
      this.getList();
    },

    removeUserById(row) {
      // 弹出消息框二次确认
      this.$confirm(`删除用户${row.username}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，执行then，即删除用户
        user.deleteUserById(row.id)
          .then(response => {
            notification.successNoti(this, `成功`, `删除${row.username}用户成功`);
            this.getList(this.page);
          })
          .catch(error => {
            notification.errorNoti(this, `失败`, `删除${row.username}用户失败`);
          })
      }).catch(() => {
        notification.infoNoti(this, `取消`, `已取消删除`);
      });


    },

    judgeRole(role) {
      if (role === "admin") return "管理员"
      return "客户"
    }

  },
}

</script>
<style>
</style>
