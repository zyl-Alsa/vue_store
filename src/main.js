
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';//导入了Element UI框架的主模块
import 'element-ui/lib/theme-chalk/index.css';//Element UI框架的样式文件
// 将Element UI注册为Vue.js插件,意味着你可以在整个Vue.js应用中使用Element UI的组件和功能，而不需要在每个组件中单独导入或设置。
Vue.use(ElementUI);

// 全局函数及变量
import Global from './Global';
Vue.use(Global);

import Axios from 'axios';
Vue.prototype.$axios = Axios;//将 Axios 添加到 Vue 的原型上，可以在 Vue 实例中的任何地方使用 $axios 来发送请求。

// 全局请求拦截器
Axios.interceptors.request.use(
  // 请求拦截器会在每次请求发送之前被调用，config 参数表示请求的配置对象
  config => {
    // 如果没有错误，直接返回 config 配置对象，这表示不对请求做任何修改，继续发起原始请求。
    return config;
  },
  error => {
    // 跳转error页面
    router.push({ path: "/error" });//如果发生了错误，通过 router.push 方法导航到错误页面
    return Promise.reject(error);//最后使用 Promise.reject(error) 返回一个被拒绝的 Promise，将错误继续传递给后续的请求错误处理函数。
  }
);
// 全局响应拦截器
Axios.interceptors.response.use(
  // 响应拦截器会在每次获取到响应数据后被调用，res 参数表示响应对象
  res => {
    if (res.data.code === "401") {
      // 401表示没有登录
      // 提示没有登录
      Vue.prototype.notifyError(res.data.msg);
      // 修改vuex的showLogin状态,显示登录组件
      store.dispatch("setShowLogin", true);
    }
    if (res.data.code === "500") {
      // 500表示服务器异常
      // 跳转error页面
      router.push({ path: "/error" });
    }
    return res;
  },
  error => {
    // 跳转error页面
    router.push({ path: "/error" });
    return Promise.reject(error);
  }
);

// 全局拦截器,在进入需要用户权限的页面前校验是否已经登录
router.beforeResolve((to, from, next) => {//Vue Router 提供了前置守卫 (beforeResolve)，它会在导航之前被调用，可以用于进行特定的路由权限验证逻辑
  // 前置守卫接受三个参数：to、from 和 next。其中，to 表示即将进入的目标路由对象，from 表示即将离开的当前路由对象，next 是一个函数，用于控制导航的进行
  const loginUser = store.state.user.user;//首先获取了当前登录的用户对象 loginUser，可以通过 Vuex 的 state.user.user 来获取
  // 判断路由是否设置相应校验用户权限
  if (to.meta.requireAuth) {
    if (!loginUser) {
      // 没有登录，显示登录组件
      store.dispatch("setShowLogin", true);
      if (from.name == null) {
        //此时，是在页面没有加载，直接在地址栏输入链接，进入需要登录验证的页面
        next("/");
        return;
      }
      //否则，终止导航，不进行跳转
      next(false);
      return;
    }
  }
  // 如果不需要进行权限验证或者用户已登录，那么继续进行导航，调用 next()。
  next();
});

// 相对时间过滤器,把时间戳转换成时间
// 格式: 2020-02-25 21:43:23
Vue.filter('dateFormat', (dataStr) => {
  var time = new Date(dataStr);
  function timeAdd0 (str) {
    if (str < 10) {
      str = '0' + str;
    }
    return str;
  }
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm) + ':' + timeAdd0(s);
});

//全局组件
import MyMenu from './components/MyMenu';
Vue.component(MyMenu.name, MyMenu);
import MyList from './components/MyList';
Vue.component(MyList.name, MyList);
import MyLogin from './components/MyLogin';
Vue.component(MyLogin.name, MyLogin);
import MyRegister from './components/MyRegister';
Vue.component(MyRegister.name, MyRegister);


// 关闭生产环境的提示信息
Vue.config.productionTip = false;

// 创建一个新的 Vue 实例
new Vue({
  // 注入路由实例
  router,
  // 注入状态管理实例
  store,
  // 定义渲染函数
  render: h => h(App)
}).$mount('#app');
