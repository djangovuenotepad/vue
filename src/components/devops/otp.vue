<template>
<div>
    <div class="demo-image">
      <center>
        <el-image
            style="width: 300px; height: 300px"
            :src="url"
            :fit="fit"
            :key="otp">
        </el-image>
      </center>
    </div>
    <p></p>
    <div> <span class="demonstration"><center><h3>{{ otp }}</h3></center></span></div>
    <p></p>
    <div><center>
        <el-row>
            <el-button @click="updateotp" type="primary">更新OTP二次验证密钥</el-button>
        </el-row>
      </center>
    </div>
</div>
</template>
<script>
    export default {
      data() {
        return {
          http_url:process.env.VUE_APP_IP_WHITE_HTTP_URL,
          otp: '',
          url: process.env.VUE_APP_IP_WHITE_HTTP_URL + '/otpqrcode',
         }
      },
      methods: {
        async updateotp() {
          const {
              data: res
            } = await this.$http.post(this.http_url+"/updateotp")
            // console.log(res.msg)
            if (res.code !== 200) return this.$message.error(res.msg)
            this.$message.success(res.msg)
            this.onSubmit()
          },
        async onSubmit () {
          const {
              data: res
            } = await this.$http.post(this.http_url+"/otptoken")
            if (res.code !== 200) return this.$message.error(res.msg)
            this.otp = res.msg
          },
      },
      created () {
          this.onSubmit()
      },
}
</script>