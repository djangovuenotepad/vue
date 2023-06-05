<template><div>
  <!-- 
  <el-button  type="primary" round 
                @click="Update_ssl"
                :loading="update_ssl"> {{ update_ssl ? '更新中...' : '更新数据' }}
  </el-button>
  -->
  <font color="red">黄色背景: 1.剩余天数小于15天 2.检测的数据不是三天以内的  3.解析值不可用</font>
  <!-- 分割线-->
  <el-divider />

  <!-- 表单-->
  <el-table
        :data="tableData"
        border
        style="width: 100%"
        :row-class-name="tableRowClassName"
        :default-sort = "{prop: 'days', order: 'ascending'}">

        <el-table-column
          type="index"
          label="序号"
          width="70"
          :index="indexMethod">
        </el-table-column>
        
        <el-table-column
          prop="domain"
          sortable
          width="260"
          label="域名">
        </el-table-column>

        <el-table-column
          prop="cdn"
          sortable
          width="240"
          label="CDN">
        </el-table-column>
        <el-table-column
          prop="cname"
          sortable
          label="解析值"
          :show-overflow-tooltip='true'>
        </el-table-column>

        <el-table-column
          prop="start"
          sortable
          width="240"
          label="证书申请时间">
        </el-table-column>

        <el-table-column
          prop="end"
          sortable
          label="证书到期时间">
        </el-table-column>

        <el-table-column
          prop="check_time"
          sortable
          label="检测时间">
        </el-table-column>

        <el-table-column
          prop="days"
          sortable
          width="120"
          label="剩余天数">
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
       }
    },
    methods: {
      tableRowClassName(row) {
        if (row.row.latest === "success") {
          return 'success-row';
        }
        return 'warning-row';
      },
      async onSubmit () {
        const {
            data: res
          } = await this.$http.post(this.http_url+"/get_alldns_ssl")
          if (res.code !== 200) return this.$message.error(res.msg)
          this.tableData = res.msg
      },
      async Update_ssl(){
          this.update_ssl = true
          const {
              data: res
            } = await this.$http.post(this.http_url+"/update_ssl")
            if (res.code !== 200) {this.update_ssl = false;return  this.$notify({
                  title: '更新证书数据失败!',
                  message: res.msg,
                  type: 'error',
                  duration: 0,
                  showClose: true,
                  // position: 'bottom-right'
                })}
          this.$notify({
                  title: '更新证书数据完成!',
                  type: 'success',
                  duration: 0,
                  showClose: true,
                  // position: 'bottom-right'
                })
          this.update_ssl = false
          this.onSubmit()
          },
     },
    created () {
        this.onSubmit()
    },
}
</script>
