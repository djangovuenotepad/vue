import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'default-passive-events'

// 导入全局样式
import './assets/css/global.css'

//导入svg图标
import './assets/fonts/iconfont.js'

//手动导入element-ui
import ElementUI, { Message, MessageBox, Notification, Loading} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)


//全局挂在element-ui消息提示组件
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
Vue.prototype.$loading = Loading
Vue.prototype.$confirm = MessageBox.confirm

//处理shell颜色代码
import AnsiUp from 'ansi_up'
Vue.prototype.$ansi_up = AnsiUp

//md5引入
import md5 from 'js-md5'
Vue.prototype.$md5 = md5

//表格数据导出excel依赖
import filesaver from 'file-saver'
import xlsx from 'xlsx'
Vue.prototype.$filesaver = filesaver
Vue.prototype.$xlsx = xlsx


//导入vue-json-viewer
import JSONView from 'vue-json-viewer'
Vue.use(JSONView)

//复制粘贴插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)


// 配置axios
import axios from 'axios'
Vue.prototype.$http = axios

//配置请求拦截器
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.localStorage.getItem('opsUItoken')
  return config
})

//配置响应拦截器
axios.interceptors.response.use(
  response => {
      // console.log(response)
      if (response.data.code === 4003) {
          Message.error('token已过期请重新登录')
          window.localStorage.removeItem('opsUItoken')
          router.push('/login')
              // router.push({ path: '/login'})
              // router.replace({ path: '/login' })
          return
      }
      return response
  },
  error => {
      if (error.response.status === 403){
        console.log(error.response.data)
        Message.error('token已过期请重新登录')
        window.localStorage.removeItem('opsUItoken')
          router.push('/login')
          return
      }
      console.log(error)
      Promise.reject(error)
  }
)





Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
