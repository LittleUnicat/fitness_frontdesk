export default {

  /**
   *
   * @param that 页面对象
   * @param title 标题
   * @param message 消息
   */
  successNoti(that, title, message) {
    that.$notify.success({
      title: title,
      message: message,
      type: "success"
    });
  },

  /**
   *
   * @param that 页面对象
   * @param title 标题
   * @param message 消息
   */
  waringNoti(that, title, message) {
    that.$notify.warning({
      title: title,
      message: message
    });
  },

  /**
   *
   * @param that 页面对象
   * @param title 标题
   * @param message 消息
   */
  infoNoti(that, title, message) {
    that.$notify.info({
      title: title,
      message: message
    });
  },

  /**
   *
   * @param that 页面对象
   * @param title 标题
   * @param message 消息
   */
  errorNoti(that, title, message) {
    that.$notify.error({
      title: title,
      message: message
    });
  }

}
