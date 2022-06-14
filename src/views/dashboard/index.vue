<template>


  <div class="dashboard-container">
    <div style="margin-bottom: 50px">
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="item in 6" :key="item">
          <h3 class="medium">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div>
      <el-row class="mycard">
        <el-col :span="6" v-for="(o, index) in 3" :key="o" :offset="index > 0 ? 2 : 0">
          <el-card shadow="hover" :body-style="{ padding: '0px' }">
            <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                 class="image">
            <div style="padding: 14px;">
              <span>好吃的汉堡</span>
              <div class="bottom clearfix">
                <time class="time">{{ currentDate }}</time>
                <el-button type="text" class="button">操作按钮</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div>
      <div class="dashboard-text">name:{{ name }}</div>
      <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>
    </div>

    <div>
      <el-backtop target=".page-component__scroll .el-scrollbar__wrap" :bottom="40">
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
      </el-backtop>
    </div>

  </div>


</template>


<script>
import {mapGetters} from 'vuex'

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
      currentDate: new Date()
    };
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
</style>

