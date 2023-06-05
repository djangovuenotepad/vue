<template>
    <div class="div">
      <div class="_div">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input
                  v-model="formInline.domain"
                  type="textarea"
                  autosize
                  ></el-input>
          </el-form-item>
    
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
      </el-form>
      </div>
    
      <div class="_div">
           <p v-html="msg1"></p>
      </div>
      <div class="_div2">
           <p v-html="msg2"></p>
      </div>
      <div class="_div">
           <p v-html="msg3"></p>
      </div>
    </div>
    
    </template>
    <script>
      export default {
        data() {
          return {
            http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL,
            msg1: '',
            msg2: '',
            formInline: {
              domain: '',
            }
          }
        },
        methods: {
          async onSubmit() {
            const { data: res } = await this.$http.post(this.http_url + "/fanchaxun",this.formInline)
            if (res.code !== 200) return this.$message.error(res.msg)
            this.msg1 = res.msg1
            this.msg2 = res.msg2
            this.msg3 = res.msg3
    
          }
        }
      }
    </script>
<style scoped>
.div{
    width: 100%;
    display: table;
    margin: 0 auto;
}
.div >>> ._div{
    float: left;
    width: 20%;
    display: table-cell;
}
.div >>>._div2{
    float: left;
    width: 40%;
    display: table-cell;
}
</style>
    