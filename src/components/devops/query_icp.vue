<template><div>
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
            <el-button type="primary" 
                      @click="onSubmit"
                      :loading="icp_loading"> {{ icp_loading ? '查询中...' : '查询' }}</el-button>
          </el-form-item>
      </el-form>
      </div>
    </div>
    <div>
    <el-table
        :data="tableData"
        border
        style="width: 100%"
        :default-sort = "{prop: 'status', order: 'ascending'}"
        :row-class-name="tableRowClassName">

            <el-table-column
            type="index"
            label="序号"
            width="70"
            :index="indexMethod">
            </el-table-column>
            
            <el-table-column
            prop="domain"
            label="域名">
            </el-table-column>

            <el-table-column
            prop="mainLicence"
            label="备案号">
            </el-table-column>

            <el-table-column
            prop="status"
            sortable
            label="状态">
            </el-table-column>
            
            <!-- 操作
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="small" @click.native.stop="update(scope.row)">更新</el-button>
              </template>
            </el-table-column>    -->

    </el-table>
</div>
</div></template>
    <script>
      export default {
        data() {
          return {
            icp_loading: false,
            http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL,
            tableData: '',
            formInline: {
              domain: '',
            }
          }
        },
        methods: {
          update(row) {
            console.log(row)

          },
          tableRowClassName(row) {
            if (row.row.icp_status === true) {
                return 'success-row';
              }
                return 'faild-row';
          },
          async onSubmit() {
              this.icp_loading = true
              const { data: res } = await this.$http.post(this.http_url + "/query_icp_status",this.formInline)
              if (res.code !== 200) return this.$message.error(res.msg)
              this.tableData = res.msg
              this.icp_loading = false
      
          }
        }
      }
    </script>
  
<style scoped>

.el-table >>> .success-row {
    background: #33e433;
}

.el-table >>> .faild-row {
    background: #f00505;
}
</style>