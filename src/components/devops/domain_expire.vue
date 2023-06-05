<template><div>
    <font color="red">黄色背景: 域名本月或次月到期</font>
    <!-- 分割线-->
    <el-divider />
  
    <!-- 表单-->
    <el-table
          :data="tableData"
          border
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :default-sort = "{prop: 'expri_date', order: 'ascending'}">
  
          <el-table-column
            type="index"
            label="序号"
            width="70"
            :index="indexMethod">
          </el-table-column>
          
          <el-table-column
            prop="domain"
            sortable
            label="域名">
          </el-table-column>
  
          <el-table-column
            prop="registrar"
            sortable
            label="注册商">
          </el-table-column>

          <el-table-column
            prop="expri_date"
            sortable
            label="到期时间">
          </el-table-column>

          <el-table-column
            prop="check_time"
            sortable
            label="检测时间">
          </el-table-column>
    </el-table>
  
  </div></template>
  
  <style scoped>
    .el-table >>> .warning-row {
      background: rgb(239, 243, 3);
    }
  
    .el-table >>> .success-row {
      background: #33e433;
    }
  </style>
  
  
  <script>
    export default {
      data() {
        return {
          http_url:process.env.VUE_APP_IP_WHITE_HTTP_URL,
          tableData: [],
          update_ssl: false,
          _time: '',
         }
      },
      methods: {
        tableRowClassName(row) {
          if (row.row.status === "success") {
            return 'success-row';
          }
          return 'warning-row';
        },
        async onSubmit () {
          const {
              data: res
            } = await this.$http.post(this.http_url+"/get_domain_expire")
            if (res.code !== 200) return this.$message.error(res.msg)
            this.tableData = res.msg
            this._time = res.time
        }
       },
      created () {
          this.onSubmit()
      },
  }
  </script>
  