<template>

  <div class="dashboard-container">
    <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>
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
</style>
