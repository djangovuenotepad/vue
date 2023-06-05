<template><div>
    <font color="red">黄色背景: 为6小时前采集的数据 </font>
      <!-- 分割线-->
      <el-divider />
    <!-- 表单-->
    <el-table
          :data="tableData"
          border
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :default-sort = "{prop: 'icp_status', order: 'ascending'}">
  
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
            prop="mainLicence"
            sortable
            label="备案信息">
          </el-table-column>

          <el-table-column
            prop="icp_status"
            sortable
            label="备案状态"
            :show-overflow-tooltip='true'>
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
    
    .el-table >>> .faild-row {
      background: #f00505;
    }
  </style>
  
  
  <script>
    export default {
      data() {
        return {
          http_url:process.env.VUE_APP_IP_WHITE_HTTP_URL,
          tableData: [],
         }
      },
      methods: {
        tableRowClassName(row) {
          if (row.row.check_time_color === "blue") {
            return 'success-row';
          }
          else if (row.row.check_time_color === "yellow") {
            return 'warning-row';
          }
          
            return 'faild-row';
        },
        async onSubmit () {
          const {
              data: res
            } = await this.$http.post(this.http_url+"/get_icp_status")
            if (res.code !== 200) return this.$message.error(res.msg)
            this.tableData = res.msg
          },
      },
      created () {
          this.onSubmit()
      },
  }
  </script>
  