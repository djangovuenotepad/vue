<template><div> 
  <div  style="width:200px;">
    <el-slider v-model="day" mix="1" max="7" @change="onSubmit"></el-slider>
  </div>
    <el-table
          :data="tableData"
          border
          style="width: 100%"
          :default-sort = "{prop: '日志', order: 'descending'}">
  
          <el-table-column
            type="index"
            label="序号"
            width="70"
            :index="indexMethod">
          </el-table-column>
          
          <el-table-column
            prop="日志"
            sortable
            width="250"
            label="日志索引">
          </el-table-column>

          <el-table-column
            prop="信息"
            sortable
            label="详细信息">
          </el-table-column>

          <el-table-column
            prop="服务器"
            sortable
            width="200"
            label="服务器">
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
          day: 0,
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
            } = await this.$http.post(this.http_url+"/ssh_deny_log",{"day": this.day})
            if (res.code !== 200) return this.$message.error(res.msg)
            this.tableData = res.msg
            this._time = res.time
            if (this.day == 0 ) return this.$message.success("查询1个小时以内的数据")
            this.$message.success("查询 "+this.day+" 天以内的数据")
        }
       },
      created () {
          this.onSubmit()
      },
  }
  </script>
  