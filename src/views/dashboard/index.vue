<template>


  <div class="dashboard-container">

    <el-page-header @back="console.log('done')" content="详情页面">
    </el-page-header>

    <div style="margin-bottom: 50px">
      <el-carousel :interval="4000" type="card" height="300px">
        <el-carousel-item v-for="item in list" :key="item.id">
          <img :src="item.cover" :alt="item.title">
          <h3 style="color: white">{{ item.title }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>


    <p class="myWord">
      <b>核心用户</b>
    </p>
    <div>
      <el-row class="mycard">
        <el-col :span="4" v-for="(user, index) in userList" :key="user.id" :offset="index > 0 ? 2 : 0">

          <router-link :to="'/user/project/'+user.id">

            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <img :src=user.avatar
                   class="image"
                   fit="cover">
              <div style="padding: 14px;">
              <span>
                {{ user.username }}
              </span>
                <div class="bottom clearfix">

                  <el-tag
                    :key="user.role === 'admin' ? '管理员' : '客户' "
                    :type=getTagType(user.role)>
                    {{ user.role === 'admin' ? '管理员' : '客户' }}
                  </el-tag>
                </div>
              </div>
            </el-card>

          </router-link>


        </el-col>
      </el-row>
    </div>

    <div>
      <div
        style="{
        height: 100%;
        width: 100%;
        margin-top: 50px;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
      >
        已经到底啦，再怎么拉也没有了(っ °Д °;)っ
      </div>
    </div>

  </div>


</template>


<script>
import {mapGetters} from 'vuex'
import project from "../../api/fitness/project";
import user from "../../api/fitness/user";

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  data() {

    return {
      listLoading: true, // 是否显示loading信息
      list: [{
        id: '',
        title: '',
        cover: '',
        price: '',
      }], // 数据列表
      userList: [{
        username: '',
        avatar: '',
        role: ''
      }],
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 6, // 每页记录数
      searchObj: {
        menuFirstId: '',
        menuSecondId: '',
        title: '',
        price: ''
      }, // 查询条件
      currentDate: new Date()
    };
  },

  created() {
    this.fetchData();
    this.getUserList();
  },

  methods: {

    fetchData() { // 调用api层获取数据库中的数据
      this.listLoading = true
      project.getProjectList().then(response => {
        // debugger 设置断点调试
        if (response.success === true) {
          this.list = response.data.projects
        }
        this.listLoading = false
      })
    },

    getUserList() {
      user.getRandom4User(4)
        .then(response => {
          // 成功，保存数据
          this.userList = response.data.items;
        })
        .catch(error => {
          // 失败
          console.log(error);
        })
    },

    getTagType(role) {
      if (role === 'admin') return 'success'
      return ''
    }


  }
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.box-card {
  padding-left: 20px
}

.box {
  display: inline-block;
  vertical-align: top;
  padding-top: 20px;
  padding-left: 30px;
}

.title {
  font-size: 20px;
  color: rgb(144, 147, 153);
}

.count {
  font-size: 20px;
  margin-top: 20px
}


/deep/ .el-card__header {
  background-color: rgb(242, 246, 252) !important;
}

.head {
  font-size: 20px;
  font-weight: 700;
  color: rgb(96, 98, 102);
}

.footer ul {
  list-style: none;
  display: flex;
}

.footer ul li {
  flex: 1;
  padding: 5px 10px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.mycard {
  display: flex;
  justify-content: center;
}

.myWord {
  font-family: "PingFang SC", serif;
  font-size: 30px;
  color: gold;
  margin: 30px;
}
</style>

