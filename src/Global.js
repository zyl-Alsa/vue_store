

// 定义并导出一个 Vue 插件
exports.install = function (Vue) {
  // Vue.prototype.$target 用于存储后端 API 的地址
  Vue.prototype.$target = "http://101.132.181.9:3000/"; // 线上后端地址
  // Vue.prototype.$target = "http://localhost:3000/"; // 本地后端地址
  
  // 封装提示成功的弹出框
  Vue.prototype.notifySucceed = function (msg) {
    // 使用 Vue 的 $notify 方法显示通知弹出框
    this.$notify({
      title: "成功", // 弹出框标题为 "成功"
      message: msg, // 弹出框内容为传入的 msg 参数
      type: "success", // 弹出框类型为 "success"，表示成功消息
      offset: 100 // 弹出框距离顶部的偏移量为 100 像素
    });
  };
  
  // 封装提示失败的弹出框
  Vue.prototype.notifyError = function (msg) {
    // 使用 Vue 的 $notify.error 方法显示错误弹出框
    this.$notify.error({
      title: "错误", // 弹出框标题为 "错误"
      message: msg, // 弹出框内容为传入的 msg 参数
      offset: 100 // 弹出框距离顶部的偏移量为 100 像素
    });
  };
}