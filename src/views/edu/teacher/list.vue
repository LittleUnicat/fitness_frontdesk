<template>
  <div id="app">
    <!--查询表单-->
    <el-form
      :inline="true"
      class="demo-form-inline">
      <el-form-item>
        <el-input
          v-model="teacherQuery.name"
          clearable
          placeholder="讲师名"/>
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="teacherQuery.level"
          clearable
          placeholder="讲师等级">
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

      <el-form-item label="添加时间">
        <el-date-picker
          clearable
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          clearable
          v-model="teacherQuery.end"
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
        prop="name"
        label="姓名"
        align="center"
        width="220">
      </el-table-column>
      <el-table-column
        prop="career"
        label="职业"
        align="center"
        width="220">
      </el-table-column>
      <el-table-column
        prop="level"
        label="等级"
        align="center"
      >
        <template slot-scope="scope">
          LV{{ scope.row.level }}
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
        width="180">
        <template
          slot-scope="scope">
          <!-- 修改的路由 -->
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button
              @click="handleClick(scope.row.id)"
              type="text"
              size="small">
              编辑
            </el-button>
          </router-link>

          <el-button
            @click="removeTeacherById(scope.row)"
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
import teacher from '../../../api/edu/teacher'
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
      teacherQuery: {}
    }
  },
  created() {
    this.getList();
  },
  methods: {

    getList(page = 1) {
      this.page = page;
      teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
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
      this.teacherQuery = {};
      this.getList();
    },

    removeTeacherById(row) {
      // 弹出消息框二次确认
      this.$confirm(`删除教师${row.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，执行then，即删除教师
        teacher.deleteTeacherById(row.id)
          .then(response => {
            notification.successNoti(this, `成功`, `删除${row.name}讲师成功`);
            this.getList(this.page);
          })
          .catch(error => {
            notification.errorNoti(this, `失败`, `删除${row.name}讲师失败`);
          })
      }).catch(() => {
        notification.infoNoti(this, `取消`, `已取消删除`);
      });


    }

  },
}

</script>
<style>
</style>
