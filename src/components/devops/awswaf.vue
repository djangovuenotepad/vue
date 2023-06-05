<template><div>
    <div class="div"> 
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            
            <el-form-item label="帐号">
                <el-select v-model="formInline.aws_account_one"
                            clearable
                            filterable
                            placeholder="请选择">
                    <el-option v-for="item in aws_account"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item> 

             
             <el-button type="primary" @click="query_awswaf">查询</el-button>
              
             <el-button type="primary" :disabled=can_edit @click="show = true">白名单编辑</el-button>
        </el-form>
      
    </div>
 <div>
    <el-table
        :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
        border
        style="width: 100%"
        max-height="950px"
        :default-sort = "{prop: 'status', order: 'ascending'}"
        :row-class-name="tableRowClassName">
            <el-table-column
                prop="account"
                label="帐号">
            </el-table-column>

            <el-table-column
                prop="ipset"
                label="IPSet">
            </el-table-column>      
            
            <el-table-column
                prop="ip"
                label="IP地址">
            </el-table-column>
    </el-table>
    <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[100, 500, 2000]"
              :page-size="pagesize"
              :hide-on-single-page = show_pagination
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
    </el-pagination>
</div>

<el-dialog
  title="白名单更新"
  :visible.sync="show"
  width="70%"
  :before-close="handleClose">
  
  <el-form :label-position="labelPosition" label-width="180px" :model="jsonData">
    <el-form-item label="云商帐号">
        <el-input 
           :placeholder=jsonData.aws_account_one
            v-model=jsonData.aws_account_one :disabled="true">
        </el-input>
    </el-form-item>
    <el-form-item label="IPSet">
        <el-select v-model="jsonData.ipset"
                            clearable
                            filterable
                            placeholder="请选择">
                    <el-option v-for="item in aws_ipset"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
         </el-select>
     </el-form-item> 

    <el-form-item label="IPV4">
        <el-input type="textarea" v-model="jsonData.ip" :autosize="{ minRows: 15, maxRows: 30}"></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary"  @click.native.stop="waf_add_ipset_ip">添加</el-button>
        <el-button type="danger" @click.native.stop="waf_delete_ipset_ip">删除</el-button>
    </el-form-item>
  </el-form>


</el-dialog>

</div></template>

<script>
      export default {
        data() {
          return {
            currentPage: 1,
            pagesize: 100,
            total: 0,
            aws_account: [], 
            show_pagination: true,
            aws_ipset: [],
            aws_ipset_one: '', 
            can_edit: true,
            http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL,
            tableData: [], 
            show: false,
            formInline: {},
            jsonData: {
                "aws_account_one":'',
                "ipset": '',
                "ip": '',
                "locktoken": ''
            }
          }
        },
        methods: {
          handleSizeChange(val) {
            this.pagesize = val; 
          },
          handleCurrentChange(val) {
            this.currentPage = val; 
          },
          openFullScreen2() { 
            this.loadingInstance = this.$loading.service({
                lock: true,
                text: '正在加载...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              }); 
          },

          async get_awswaf_account_list(){ 
            return this.aws_account = ['aws2']
            const { data: res } = await this.$http.post(this.http_url + "/get_awswaf_account_list")
            if (res.code !== 200) return this.$message.error(res.msg)
            this.aws_account = res.msg
          },
          async query_awswaf() { 

            this.tableData = []
            this.aws_ipset = [] 
            const { data: res } = await this.$http.post(this.http_url + "/query_awswaf",this.formInline)
            if (res.code !== 200) return this.$message.error(res.msg) 
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                  this.loadingInstance.close();
              });
            this.can_edit = false
            this.tableData = res.msg 
            this.total = res.msg.length
            this.aws_ipset = res.aws_ipset
            this.jsonData.locktoken = res.locktoken
            this.jsonData.aws_account_one = this.formInline.aws_account_one
            this.show_pagination = false 

          }, 
          async waf_add_ipset_ip(){  
            const { data: res } = await this.$http.post(this.http_url + "/waf_add_ipset_ip",this.jsonData)
            if (res.code !== 200) return this.$message.error(res.msg) 
            this.$message.success(res.msg)
            this.query_awswaf()
          }, 
          async waf_delete_ipset_ip(){  
            const { data: res } = await this.$http.post(this.http_url + "/waf_delete_ipset_ip",this.jsonData)
            if (res.code !== 200) return this.$message.error(res.msg)
            this.$message.success(res.msg)
            this.query_awswaf()
          }
        },

        created () {
          this.openFullScreen2()
          this.get_awswaf_account_list()
          this.formInline.aws_account_one = 'aws2'
          this.query_awswaf()
        },
      }
</script> 