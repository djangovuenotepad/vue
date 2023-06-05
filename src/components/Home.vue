<template>
  <el-container class="home-container">
    <!-- 头部区域  -->
    <el-header>
      <div @click="backHome">
        <img src="../assets/ops.png"
             alt="">
        <span>{{env}}</span>
      </div>
      <span>{{current_time}}</span>
      <div>
        <el-dropdown>
          <span>
            {{current_user}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="primary"
                         @click="edit_personal_user(current_user)">修改密码</el-button>
              <el-button type="primary"
                         @click="logout">退出</el-button>
            </el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>

      </div>
    </el-header>
    <el-dialog title="修改密码"
               :close-on-click-modal="false"
               :visible.sync="edit_personal_user_dialog_visble"
               width="30%">
      <!-- 修改密码表单 -->
      <el-form :model="edit_personal_user_form"
               ref="edit_personal_user_form_ref"
               label-width="80px">

        <el-form-item label="用户名"
                      prop="username"
                      required>
          <el-input v-model="edit_personal_user_form.username"
                    disabled
                    autocomplete="off">
          </el-input>
        </el-form-item>

        <el-form-item label="密码"
                      prop="password"
                      required="">
          <el-input v-model="edit_personal_user_form.password"
                    type="password"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="edit_personal_user_dialog_visble = false">取 消</el-button>
        <el-button type="primary"
                   @click="edit_personal_user_commit('edit_personal_user_form_ref')">提 交</el-button>
      </span>
    </el-dialog>

    <!-- 页面主体区域  -->
    <el-container>
      <!-- 侧边栏  -->
      <el-aside :width="isCollapse ? '64px':'250px'">
        <!-- 点击折叠与展开  -->
        <div class="toggle-button"
             @click="toggleCollp">|||</div>
        <!-- 侧边栏菜单  -->
        <el-menu :default-active="activePath"
                 router
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 unique-opened
                 background-color="#99CCCC"
                 text-color="black"
                 active-text-color="#9933FF">


          <!-- 一级菜单  域名管理-->
          <el-submenu index='domain'>
                <!-- 模板区域  -->
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-basketball"></i>
                  <!-- 文本  -->
                  <span>域名管理</span>
                </template>
                <!-- 二级菜单  -->
                <!-- 域名详情管理 -->
                <el-menu-item index='/domain/domain_info'
                              @click="saveNavState('/domain/domain_info')">
                  <!-- 模板区域  -->
                  <template slot="title">
                    <!-- 图标 -->
                    <svg class="icon"
                         aria-hidden="true">
                      <use xlink:href="#icon-xiangqing"></use>
                    </svg>
                    <!-- 文本  -->
                    <span>域名详情管理</span>
                  </template>
                </el-menu-item>
 

                <!-- 域名ssl证书管理 -->
                <el-menu-item index='/domain/ssl_management'
                              @click="saveNavState('/domain/ssl_management')">
                  <!-- 模板区域  -->
                  <template slot="title">
                    <!-- 图标 -->
                    <svg class="icon"
                         aria-hidden="true">
                      <use xlink:href="#icon-sslzhengshu"></use>
                    </svg>
                    <!-- 文本  -->
                    <span>域名证书管理</span>
                  </template>
                </el-menu-item>



                  <!-- 操作历史记录 -->
                  <el-menu-item index='/domain/history'
                                @click="saveNavState('/domain/history')">
                    <template slot="title">
                      <svg class="icon"
                          aria-hidden="true">
                        <use xlink:href="#icon-shiwucaozuojilu"></use>
                      </svg>
                      <span>操作历史记录</span>
                    </template>
                  </el-menu-item>
        </el-submenu>

        <!-- 一级菜单  检测任务-->
        <el-submenu  index='time'>
              <template slot="title">
                  <i class="el-icon-time"></i>
                  <span>检测任务</span>
              </template>
              
              <el-menu-item index='/ssl'
                      @click="saveNavState('/ssl')">
                      <template slot="title">
                        <i class="el-icon-lock"></i>
                        <span>证书检测</span>
                      </template>
                </el-menu-item>

                <el-menu-item index='/icp'
                      @click="saveNavState('/icp')">
                      <template slot="title">
                        <i class="el-icon-postcard"></i>
                        <span>备案检测</span>
                      </template>
                </el-menu-item>
              
                <el-menu-item index='/domain_expire'
                      @click="saveNavState('/domain_expire')">
                      <template slot="title">
                        <i class="el-icon-message-solid"></i>
                        <span>域名到期</span>
                      </template>
                </el-menu-item>

                <el-menu-item index='/ssh_deny_log'
                      @click="saveNavState('/ssh_deny_log')">
                      <template slot="title">
                        <i class="el-icon-warning-outline"></i>
                        <span>异常登录</span>
                      </template>
                </el-menu-item>

                <el-menu-item index='/source_ip'
                      @click="saveNavState('/source_ip')">
                      <template slot="title">
                        <i class="el-icon-search"></i>
                        <span>回源查询</span>
                      </template>
                </el-menu-item>
        </el-submenu>

        <!-- 一级菜单  Apollo-->
        <el-submenu index="apollo">
                <template slot="title">
                    <i class="el-icon-folder-opened"></i>
                    <span>Apollo</span>
                </template> 

                <el-menu-item index='/apollo'
                          @click="saveNavState('/apollo')">
                          <template slot="title">
                            <i class="el-icon-copy-document"></i>
                            <span>生产发布</span>
                          </template>
                </el-menu-item>

                <el-menu-item index='/apollolog'
                      @click="saveNavState('/apollolog')">
                      <template slot="title">
                        <i class="el-icon-tickets"></i>
                        <span>执行记录</span>
                      </template>
                </el-menu-item>


        </el-submenu>


        <!-- 一级菜单  云商管理-->
        <el-submenu index="云商管理">
                <template slot="title">
                    <i class="el-icon-cloudy-and-sunny"></i>
                    <span>云商管理</span>
                </template> 

                <el-menu-item index='/awswaf'
                          @click="saveNavState('/awswaf')">
                          <template slot="title">
                            <i class="el-icon-lightning"></i>
                            <span>AWS WAF白名单</span>
                          </template>
                </el-menu-item>



        </el-submenu>
        <!-- 一级菜单  运维工具-->
        <el-submenu>
              <template slot="title">
                  <i class="el-icon-s-platform"></i>
                  <span>运维工具</span>
              </template> 

                <el-menu-item index='/fanchaxun'
                        @click="saveNavState('/fanchaxun')">
                        <template slot="title">
                          <i class="el-icon-notebook-1"></i>
                          <span>泛查询值</span>
                        </template>
                </el-menu-item>

                <el-menu-item index='/gameid'
                        @click="saveNavState('/gameid')">
                        <template slot="title">
                          <i class="el-icon-edit"></i>
                          <span>游戏名称</span>
                        </template>
                </el-menu-item>

                <el-menu-item index='/query_icp'
                      @click="saveNavState('/query_icp')">
                      <template slot="title">
                        <i class="el-icon-postcard"></i>
                        <span>备案查询</span>
                      </template>
                </el-menu-item>

                <el-menu-item index='/logs'
                      @click="saveNavState('/logs')">
                      <template slot="title">
                        <i class="el-icon-tickets"></i>
                        <span>系统日志</span>
                      </template>
                </el-menu-item>

                <el-menu-item index='/software'
                    @click="saveNavState('/software')">
                    <template slot="title">
                      <i class="el-icon-download"></i>
                      <span>软件下载</span>
                    </template>
                </el-menu-item>

                <el-menu-item index='/cloud'
                    @click="saveNavState('/cloud')">
                    <template slot="title">
                      <i class="el-icon-cloudy"></i>
                      <span>云商密钥</span>
                    </template>
                </el-menu-item>

                <el-menu-item index='/otp'
                    @click="saveNavState('/otp')">
                    <template slot="title">
                      <i class="el-icon-s-custom"></i>
                      <span>二次认证</span>
                    </template>
                </el-menu-item>



        </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 右侧内容主体  -->
      <el-main :style="{left:leftStyle}">
        <!-- 路由占位符 -->
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

//创建一个函数来增加月日时小于10在前面加0
var padaDate = function (value) {
  return value < 10 ? '0' + value : value;
};
export default {
  data () {
    return {
      current_time: '',
      env: process.env.VUE_APP_ENV,
      isCollapse: false,
      leftStyle: '250px',
      activePath: '',
      current_user: window.localStorage.getItem('current_user'),
      http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL,
      edit_personal_user_dialog_visble: false,
      edit_personal_user_form: {
        password: ''
      },
    }
  },
  created () {
    let activePath = window.localStorage.getItem('activePath')
    if (activePath) this.activePath = activePath
    else {
      window.localStorage.setItem('activePath', '/welcome')
      this.activePath = window.localStorage.getItem('activePath')
    }
  },
  mounted () {
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => { //修改数据current_time
      _this.current_time = new Date().getFullYear() +
        "-" +
        padaDate(new Date().getMonth() + 1) +
        "-" +
        padaDate(new Date().getDate()) +
        " " +
        padaDate(new Date().getHours()) +
        "时" +
        padaDate(new Date().getMinutes()) +
        "分" +
        padaDate(new Date().getSeconds()) +
        "秒"
    }, 1000)
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    edit_personal_user (current_user) {
      this.edit_personal_user_form.username = current_user
      this.edit_personal_user_form.password = ''
      this.edit_personal_user_dialog_visble = true
    },
    edit_personal_user_commit (ref_name) {
      this.$refs[ref_name].validate(async (valid) => {
        if (!valid) { return false }
        let params = this.edit_personal_user_form
        const url = this.http_url
        const {
          data: res
        } = await this.$http.post(
          url + '/user_management/update/password',
          params)
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.edit_personal_user_dialog_visble = false
      })
    },
    logout () {
      window.localStorage.clear()
      const url = this.http_url
      this.$http.post(url + '/logout')
      this.$router.push('/login')
    },
    //点击按钮，实现菜单的折叠与展开
    toggleCollp () {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse === true) {
        this.leftStyle = '64px'
      } else {
        this.leftStyle = '250px'
      }
    },
    //点击左上角图标跳回首页
    backHome () {
      this.$router.push('/welcome')
      window.localStorage.setItem('activePath', '/welcome')
    },
    //保存菜单激活状态
    saveNavState (activePath) {
      window.localStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  position: relative;
  width: 100%;
  background-color: #339999;
  display: flex;
  justify-content: space-between;
  padding-left: 0;

  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 110px;
      height: 60px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  background-color: #99cccc;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  position: absolute;
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #99ccff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>