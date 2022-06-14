export default {

  /**
   *
   * @param that 页面对象
   * @param message 提示消息
   * @param title 提示标题
   * @param fun 点击确定后的执行函数
   */
  messageBox(that, message, title, fun) {
    that.$confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      fun.then(() => {
        that.$message({
          type: 'success',
          message: '成功'
        });
      }).catch(res => {
        that.$message({
          type: "error",
          message: "未知错误"
        })
      })
    }).catch(() => {
      that.$message({
        type: 'info',
        message: '已取消'
      });
    })
  }
}
