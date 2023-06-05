 <template>
  <div class="login_container">
    <span>opsweb </span>
    <span>{{env}}</span>
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png"
             alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef"
               :model="loginForm"
               :rules="loginFormRules"
               label-width="0px"
               class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model.trim="loginForm.username"
                    prefix-icon="iconfont icon-denglu-yonghuming"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input show-password
                    type="password"
                    @keyup.enter.native="login"
                    v-model.trim="loginForm.password"
                    prefix-icon="iconfont icon-denglu-mima"></el-input>
        </el-form-item>
        <!-- 二次认证 -->
        <el-form-item prop="otp">
          <el-input show-password
                    type="password"
                    @keyup.enter.native="login"
                    v-model.trim="loginForm.otp"
                    prefix-icon="iconfont icon-denglu-mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary"
                     @click="login">登录</el-button>
          <el-button type="info"
                     @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@/assets/fonts/iconfont.css'
export default {
  data () {
    return {
      current_time: new Date(),
      env: process.env.VUE_APP_ENV,
      loginForm: {
        username: '',
        password: '',
        otp: '',
      },
      loginFormRules: {
        //验证用户名和密码是否合法
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        },],
        otp: [{
          required: true,
          message: '请输入二次认证',
          trigger: 'blur',
        },],
      },
    }
  },
  methods: {
    //点击重置按钮，重置登陆表单
    resetLoginForm () {
      console.log(process.env)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid)  //true or false
        if (!valid) return
        //时间戳
        let timeStamps = (new Date()).valueOf()
        // let key = 'opstest'
        // console.log(this.$md5(this.loginForm.password + timeStamps + key))
        let params = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          otp: this.loginForm.otp,
          req_timestamp: timeStamps
        }
        const loginurl = process.env.VUE_APP_IP_WHITE_HTTP_URL + '/login'
        const {
          data: res
        } = await this.$http.post(
          loginurl,
          params)
        // console.log(res)
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        //token有效时间为30分钟，要与后端接口一致
        let token_expire = timeStamps + 300 * 60 * 1000
        // console.log(timeStamps,token_expire)
        window.localStorage.setItem('current_user', params.username)
        window.localStorage.setItem('opsUItoken', res.token)
        window.localStorage.setItem('token_expire', token_expire)
        let activePath = window.localStorage.getItem('activePath')
        if (activePath) {
          this.$router.push(activePath)
        } else {
          this.$router.push('/home')
        }

      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 330px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>