<template>
<div>
    <el-table
      :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize).reverse()"
      >
      <el-table-column
        prop="log"
        label="日志"
        >
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[100, 200, 300, 400]"
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
        pagesize: 100,
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
      } = await this.$http.post(this.http_url+"/logs")
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