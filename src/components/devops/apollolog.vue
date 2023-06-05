<template>
    <div>
        <el-table border
          :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
          >

          <el-table-column
            prop="exec"
            label="详情">
          </el-table-column>

          <el-table-column
            prop="time"
            width=200
            align="center"
            label="执行时间">
          </el-table-column>

          <el-table-column
            prop="user"
            width=120
            align="center"
            label="操作人">
          </el-table-column>

        </el-table>
    
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>
    </template>
    <script>
      export default {
        data(){
            return{
            tableData:[],
            currentPage: 1,
            pagesize: 20,
            total: 0,
            http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL,
            }
        },
        methods: {
          handleSizeChange(val) {
            this.pagesize = val;
            console.log(`每页 ${val} 条`);
            this.onSubmit()
          },
          handleCurrentChange(val) {
            this.currentPage = val;
            console.log(`当前页: ${val}`);
            this.onSubmit()
          },
    
        async onSubmit () {
          const {
            data: res
          } = await this.$http.post(this.http_url+"/apollo_history_log")
          // console.log(res.msg)
          if (res.code !== 200) return this.$message.error(res.msg)
          //获取数据总条数
          this.total = res.msg.length
          this.tableData = res.msg
          // this.$message.success(res.msg)
          console.log(res.msg)
        }
        },
        created () {
        this.onSubmit()
        },
    
      }
    </script>
    <style scoped>
    .el-table  >>> .cell {
          white-space: pre-wrap;
        }
    </style>