<template>
  <div>
    <!-- 面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>域名管理</el-breadcrumb-item>
      <el-breadcrumb-item>操作记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线-->
    <el-divider />
    <!--卡片区域-->
    <el-card class="box-card">

      <!-- 表单区域 -->

      <el-form :inline="true"
               label-suffix=":"
               v-model="form"
               class="demo-form-inline">

        <!-- 域名 -->
        <el-form-item label="域名"
                      prop="domain_name">
          <el-input v-model.trim="form.domain_name"
                    placeholder="域名" />
        </el-form-item>
        <!-- 日期选择 -->
        <el-form-item label="日期">
          <el-date-picker v-model="form.operate_time"
                          type="datetimerange"
                          align="right"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="datePickerOptions">
          </el-date-picker>
        </el-form-item>
        &nbsp;
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <!--  表格区域-->
      <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                stripe
                border
                max-height="600px"
                highlight-current-row
                fit>
        <el-table-column prop="domain_name"
                         align="left"
                         width="240px"
                         label="域名">
        </el-table-column>
        <el-table-column prop="details"
                         align="left"
                         label="域名操作详情">
        </el-table-column>
        <el-table-column prop="operate_people"
                         align="center"
                         width="100px"
                         label="操作人">
        </el-table-column>
        <el-table-column prop="operate_time"
                         align="center"
                         width="200px"
                         label="操作时间">
        </el-table-column>
      </el-table>
      <br>
      <!-- 分页功能 -->
      <el-pagination v-show="true"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[20, 50, 100, 200]"
                     :page-size="pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      datePickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近七天',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      form: {
        domain_name: '',
        operate_time: ''

      },
      dialogFormVisible: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pagesize: 20,
      http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL,
      // 域名操作历史记录页:表格数据
    }
  },
  async created () {
    this.total = 0
    this.currentPage = 1
    this.pagesize = 20
    // {op_type: xxxxx,op_datetime:'[0,123456789]'}
    let params = {}
    let timeStamps_now = Date.parse(new Date()) / 1000
    let timeStamps_before_24h = timeStamps_now - 24 * 3600
    params.operate_time_range = JSON.stringify([timeStamps_before_24h, timeStamps_now])
    console.log(params)
    const post_url = this.http_url
    const {
      data: res
    } = await this.$http.post(
      post_url + '/history/read/0',
      params)
    // console.log(res)
    if (res.code !== 200) return this.$message.error(res.msg)
    //获取数据总条数
    this.total = res.msg.length
    this.tableData = res.msg

  },
  methods: {
    //分页功能函数
    handleSizeChange (val) {
      this.pagesize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    },

    async onSubmit () {
      this.tableData = []
      this.total = 0
      this.currentPage = 1
      this.pagesize = 20
      // {op_type: xxxxx,op_datetime:'[0,123456789]'}
      let params = {}
      //传参判断
      if (this.form.domain_name !== '') { params.domain_name = this.form.domain_name }
      if (this.form.operate_time != '') {
        const starttime = Date.parse(this.form.operate_time[0]) / 1000
        const endtime = Date.parse(this.form.operate_time[1]) / 1000
        params.operate_time_range = JSON.stringify([starttime, endtime])
      }
      console.log(params)
      const post_url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        post_url + '/history/read/0',
        params)
      // console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      //获取数据总条数
      this.total = res.msg.length
      this.tableData = res.msg
      // this.$message.success(res.msg)
    }
  }
}
</script>

<style lang="less" scoped>
</style>