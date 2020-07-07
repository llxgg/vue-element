import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";

Vue.prototype.$axios = axios;
let token ;
axios.defaults.baseURL = 'https://app.zhiwuxuanlv.com';
axios.defaults.headers.common['token'] = token;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   console.log(config);
//   console.log(localStorage.getItem('token'))
//   if(localStorage.getItem('token')){
//     token = localStorage.getItem('token');
//     config.headers.common['token'] = token;
//   }else{
//     router.push('./login');
//   }
//   return config;
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error);
// });

// 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//    //console.log(response);
//   if(response.data.code !== 200){
//     Vue.prototype.$message({
//         showClose: true,
//         message: response.data.msg,
//         type: 'error',
//         center: true
//     });
//   }
//   return response;
// }, function (error) {
//   // 对响应错误做点什么
//   router.push('./login');
//   Vue.prototype.$message({
//     showClose: true,
//     message: '网络故障,请重新登录!',
//     type: 'error',
//     center: true
//   });
//   return Promise.reject(error);
// });

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});

//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     const role = localStorage.getItem('ms_username');
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     } else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//         }
//     }
// })


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')