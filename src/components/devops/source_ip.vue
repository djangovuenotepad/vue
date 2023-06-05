<template><div>
    <div class="div"> 
      <el-form :inline="true" :model="formInline" class="demo-form-inline">

        <el-form-item label="回源IP"> 
            <el-input
                v-model="formInline.ip"
                type="textarea"
                autosize
                >
            </el-input>
        </el-form-item>

        <el-form-item label="回源CNAME"> 
            <el-input
                v-model="formInline.cname"
                type="textarea"
                autosize
                >
            </el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" 
                      @click="onSubmit"
                      :loading="icp_loading"> {{ icp_loading ? '查询中...' : '查询' }}
            </el-button>
        </el-form-item>

        <el-form-item style="float:right;">
            <el-button  type="primary" style="float:right;"
                        @click="Update_source"
                        :loading="source_loading"> {{ source_loading ? '更新中...' : '更新数据' }}
            </el-button>
        </el-form-item>
        <el-form-item style="float:right;">
            <el-button  type="primary" 
                  @click="Copydata"> 复制域名
            </el-button>
        </el-form-item>
      </el-form>      
    </div> 
    <div>
    <el-table
        :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
        border
        max-height="950px"
        style="width: 100%"
        :default-sort = "{prop: 'time', order: 'ascending'}"
        :row-class-name="tableRowClassName">

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
            prop="project"
            sortable
            label="项目">
            </el-table-column>
            
            <el-table-column
            prop="env"
            sortable
            label="环境">
            </el-table-column>

            <el-table-column
            prop="ssyw"
            sortable
            label="所属业务">
            </el-table-column>

            <el-table-column
            prop="cloud"
            sortable
            label="云商">
            </el-table-column>

            <el-table-column
            prop="dns"
            sortable
            width="350"
            label="解析值">
            </el-table-column>

            <el-table-column
            prop="note"
            sortable
            label="备注">
            </el-table-column>

            <el-table-column
            prop="time"
            sortable
            label="检测时间">
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="small" @click.native.stop="update(scope.row)">查询</el-button>
              </template>
            </el-table-column>   

    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[100, 500, 800, 1500]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

</div>

<el-drawer
  :visible.sync="show"
  :with-header="false">
  <json-viewer :value="jsonData"
                     style="height:900px;overflow:auto;"
                     :expand-depth="5"
                     copyable
                     sort>
        </json-viewer>
</el-drawer>

</div></template>
    <script>
      export default {
        data() {
          return {
            show: false,
            copydata: '',
            jsonData: {},
            data: {},
            icp_loading: false,
            source_loading: false,
            currentPage: 1,
            pagesize: 100,
            total: 0,
            http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL,
            tableData: '',
            formInline: {
            }
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

          update(row) {
            this.show = true
            this.jsonData = row.source_ip


          },
          tableRowClassName(row) {
            if (row.row.status === false) {
                return 'faild-row';
              }
          },
          async source_ip() {
              const { data: res } = await this.$http.post(this.http_url + "/get_source_ip_data",this.data)
              if (res.code !== 200) return this.$message.error(res.msg)
              //获取数据总条数
              this.total = res.msg.length
              this.tableData = res.msg
              this.tableData = res.msg
          },
          async onSubmit() {
              this.icp_loading = true
              const { data: res } = await this.$http.post(this.http_url + "/get_source_ip_data",this.formInline)
              if (res.code !== 200) {this.icp_loading = false;return this.$message.error(res.msg)}
              this.tableData = res.msg
              this.copydata = res.copydata
              //获取数据总条数
              this.total = res.msg.length
              this.tableData = res.msg
              this.icp_loading = false
      
          },
          async Copydata() {
              await this.$copyText(this.copydata)
              console.log(res.copydata)
              this.$message.success('复制成功')
          },
          async Update_source() {
              this.source_loading = true
              const { data: res } = await this.$http.post(this.http_url + "/update_source_ip_data",this.formInline)
              if (res.code !== 200) {this.source_loading = false;return       this.$notify({
                      title: '更新回源数据失败!',
                      message: res.msg,
                      type: 'error',
                      duration: 0,
                      showClose: true,
                      // position: 'bottom-right'
                    })}
              this.$notify({
                title: '更新回源数据完成!',
                type: 'success',
                duration: 0,
                showClose: true,
                // position: 'bottom-right'
              })
              this.source_loading = false
              this.source_ip()
      
          }
        },
        created () {
          this.source_ip()
        },
      }
    </script>
  
<style scoped>

.el-table >>> .faild-row {
    background: #f1f504;
}
</style>