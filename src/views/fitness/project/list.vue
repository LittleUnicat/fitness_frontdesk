<template>
  <div id="app">
    <!--查询表单-->
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="searchObj.menuFirstId"
          placeholder="请选择一级分类"
          @change="menuLevelOneChanged">
          <el-option
            v-for="menu in menuNestedList"
            :key="menu.id"
            :label="menu.title"
            :value="menu.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="searchObj.menuSecondId" placeholder="请选择二级分类">
          <el-option
            v-for="menu in subMenuList"
            :key="menu.id"
            :label="menu.title"
            :value="menu.id"/>
        </el-select>
      </el-form-item>

      <!-- 标题 -->
      <el-form-item>
        <el-input v-model="searchObj.title" placeholder="项目标题"/>
      </el-form-item>
      <!-- 讲师 -->
      <el-form-item>
        <el-select
          v-model="searchObj.price"
          placeholder="请选择价格">
          <el-option
            v-for="price in priceList"
            :key="price"
            :label="price"
            :value="priceFree(price)"/>
        </el-select>

      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
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

      <el-table-column label="课程信息" width="470" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.cover" alt="scope.row.title" width="150px">
            </div>
            <div class="title">
              <a href="">{{ scope.row.title }}</a>
<!--              <p>{{ scope.row.buyCount }}人购买</p>-->
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
      <el-table-column prop="buyCount" label="付费学员" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.buyCount }}人
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <router-link :to="'/project/info/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
          </router-link>
          <router-link :to="'/project/chapter/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteCourse(scope.row)">删除课程信息
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
      @current-change="fetchData"
    />

  </div>

</template>
<script>
import project from "../../../api/fitness/project";
import teacher from "../../../api/fitness/user";
import menu from "../../../api/fitness/menu";
import notification from "../../../api/element/notification";

export default {

  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 6, // 每页记录数
      searchObj: {
        menuFirstId: '',
        menuSecondId: '',
        title: '',
        price: ''
      }, // 查询条件
      priceList: [], // 价格列表
      menuNestedList: [], // 一级分类列表
      subMenuList: [] // 二级分类列表,
    }
  },

  created() { // 当页面加载时获取数据
    this.fetchData()
    // 初始化分类列表
    this.initMenuList()
    // 获取讲师列表
    this.initPriceList()
  },

  methods: {
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

    initPriceList() {
      project.getPriceList()
        .then(response => {
          this.priceList = response.data.priceList;
        }).catch(error => {
        console.log(error)
      })
    },

    priceFree(price) {
      if (price === 0) return "免费";
      return price;
    },

    initMenuList() {
      menu.getNestedTreeList()
        .then(response => {
          this.menuNestedList = response.data.subjectList;
        }).catch(error => {
        console.log(error)
      })
    },

    menuLevelOneChanged(value) {
      for (let i = 0; i < this.menuNestedList.length; i++) {
        if (this.menuNestedList[i].id === value) {
          this.subMenuList = this.menuNestedList[i].children
          this.searchObj.menuSecondId = ''
        }
      }
    },

    resetData() {
      this.searchObj = {}
      this.subSubjectList = [] // 二级分类列表
      this.fetchData()
    },
  }
}
</script>
<style>
</style>
