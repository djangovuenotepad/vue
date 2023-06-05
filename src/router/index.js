import Vue from 'vue'
import VueRouter from 'vue-router'

//手动导入Message
import {
  Message
} from 'element-ui'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'


//域名管理组件
import DomainInfo from '../components/domain_management/DomainInfoV2.vue'
import SSLManagement from '../components/domain_management/SSLManagement.vue'
import SourceStationInfo from '../components/domain_management/SourceStationInfo.vue'
import OperateHistory from '../components/domain_management/OperateHistory.vue'

//运维工具组件
import Logs from '../components/devops/logs.vue'
import Cloud from '../components/devops/cloud.vue'
import Otp from '../components/devops/otp.vue'
import Ssl from '../components/devops/ssl.vue'
import Fanchaxun from '../components/devops/fanchaxun.vue'
import Icp from '../components/devops/icp.vue'
import Query_icp from '../components/devops/query_icp.vue'
import Source_ip from '../components/devops/source_ip.vue'
import Domain_expire from '../components/devops/domain_expire.vue'
import Software from '../components/devops/software.vue'
import Apollo from '../components/devops/apollo.vue'
import Apollolog from '../components/devops/apollolog.vue'
import Ssh_deny_log from '../components/devops/ssh_deny_log.vue'
import Gameid from '../components/devops/gameid.vue'
import Awswaf from '../components/devops/awswaf.vue'
// 用户管理组件
import UserManage from '../components/user/UserManage.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', meta: { title: '登录' }, component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', meta: { title: '/首页' }, component: Welcome },

      //域名管理
      { path: '/domain/domain_info', meta: { title: '/域名详情管理' }, component: DomainInfo },
      { path: '/domain/ssl_management', meta: { title: '/域名证书管理' }, component: SSLManagement },
      { path: '/domain/source_station_info', meta: { title: '/源站管理' }, component:  SourceStationInfo},
      { path: '/domain/history', meta: { title: '/操作历史记录' }, component:  OperateHistory},
      { path: '/logs', meta: { title: '/日志' }, component:  Logs},
      { path: '/cloud', meta: { title: '/云账号' }, component:  Cloud},
      { path: '/otp', meta: { title: '/二次认证' }, component:  Otp},
      { path: '/ssl', meta: { title: '/证书到期时间' }, component:  Ssl},
      { path: '/fanchaxun', meta: { title: '/泛查询域名' }, component:  Fanchaxun},
      { path: '/icp', meta: { title: '/ICP备案信息' }, component:  Icp},
      { path: '/query_icp', meta: { title: '/ICP备案查询' }, component:  Query_icp},
      { path: '/source_ip', meta: { title: '/回源查询' }, component:  Source_ip},
      { path: '/domain_expire', meta: { title: '/域名到期' }, component:  Domain_expire},
      { path: '/software', meta: { title: '/软件下载' }, component:  Software},
      { path: '/apollo', meta: { title: '/Apollo配置' }, component:  Apollo},
      { path: '/apollolog', meta: { title: '/Apollo操作日志' }, component:  Apollolog},
      { path: '/ssh_deny_log', meta: { title: '/异常登录日志' }, component:  Ssh_deny_log},
      { path: '/gameid', meta: { title: '/游戏ID中文表' }, component:  Gameid},
      { path: '/awswaf', meta: { title: '/awswaf白名单' }, component:  Awswaf},

      // 用户管理
      { path: '/user/manage', meta: { title: '/用户管理' }, component: UserManage },
    ]
  }

]

const router = new VueRouter({
  // mode: 'history'
  routes
})


//挂载全局路由导航守卫
const defaultTitle = 'opsweb'
router.beforeEach((to, from, next) => {
    //to 将要访问的路径
    //from 代表从哪个路径跳转而来
    //next 是一个函数，表示放行

    const tokenStr = window.localStorage.getItem('opsUItoken');
    const token_expire = window.localStorage.getItem('token_expire')
    const current_timeStamps = (new Date()).valueOf()
        //修改页面title
    document.title = to.meta.title ? defaultTitle + to.meta.title : defaultTitle
        //路由判断

    if (to.path === '/login') {
        if (tokenStr) return next(window.localStorage.getItem('activePath'))
        else return next()

    }
    //token不存在或者过期直接跳转到登录页
    if (!tokenStr) return next('/login');
    if (current_timeStamps > Number(token_expire)) {
        Message.error('token过期，请重新登录')
        window.localStorage.removeItem('opsUItoken')
        return next('/login');
    }
    next()

})


export default router
