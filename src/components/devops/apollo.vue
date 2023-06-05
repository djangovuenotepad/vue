<template>
  <div>
     <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="ops" name="ops"> </el-tab-pane>
        <el-tab-pane label="devops" name="devops"> </el-tab-pane>
    </el-tabs>
 
    <el-table
        :data="tableData"
        border
        style="width: 100%"
        :row-class-name="tableRowClassName">
  
        <el-table-column
            prop="xm"  
            width=100
            label="项目">
        </el-table-column>
            
        <el-table-column
            prop="key"
            width=260
            label="键">
        </el-table-column>
  
        <el-table-column
            prop="value"  
            label="值">
        </el-table-column>
  
        <el-table-column
            prop="comment"
            width=250
            align="center"
            label="备注">
        </el-table-column>
  
        <el-table-column
            prop="last"
            width=180
            align="center"
            label="上次修改时间">
        </el-table-column>
  
  
        <el-table-column  label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-row>
                  <el-button type="primary" style="float:left;" size="small" @click.native.stop="onSubmit(scope.row)">修改</el-button>
                  <el-button type="success" style="float:right;" size="small" @click.native.stop="apollo_release(scope.row)">发布</el-button>
                </el-row>
              </template>
        </el-table-column>   
  
    </el-table>

  
  
  <el-dialog
  title="编辑Apollo参数"
  :visible.sync="show"
  width="70%"
  :before-close="handleClose">
  
  <el-form :label-position="labelPosition" label-width="250px" :model="jsonData">
    <el-form-item :label="jsonData.key">
        <el-input type="textarea" v-model="jsonData.value" :autosize="{ minRows: 4, maxRows: 20}"></el-input>
    </el-form-item>
    <el-form-item label="备注   ">
        <el-input  v-model="jsonData.comment"></el-input>
    </el-form-item>
  </el-form>
    
  <span slot="footer" class="dialog-footer">
    <el-button @click="show = false">取 消</el-button>
    <el-button type="primary" @click.native.stop="apollo_edit()">确 定</el-button>
    </span>
  </el-dialog>
  
  
  
  </div>
</template>
  <style scoped>
  .el-table >>> .success-row {
  background: #0ce30c;;
  }
  </style>
  
  <script>
      export default {
        data() {
            return {
                http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL,
                show: false,
                activeName: 'qp',
                Data: {},
                tableData: {},
                jsonData: {},
            }
        },
        methods: {
            tableRowClassName(row) {
                if (row.row.key === "game.domains" || row.row.key === "config.cocos.public.gateway"){
                return 'success-row';
                }
            },
            async apollo_pull() { 
                    const { data: res } = await this.$http.post(this.http_url + "/apollo_pull")
                    if (res.code !== 200) return this.$message.error(res.msg)
                    this.Data = res.msg
                    this.handleClick() 
            },
            handleClick() { 
                    switch(this.activeName){
                            case 'ops':
                                this.tableData = this.Data.ops;
                                break;
                            case 'devops':
                                this.tableData = this.Data.devops;
                                break;
                } 
          },

          onSubmit(row) {
            this.show = true
            this.jsonData = row
          },

          async apollo_edit() {
            this.show = false
            console.log(this.jsonData)
            const { data: res } = await this.$http.post(this.http_url + "/apollo_edit",this.jsonData)
            if (res.code !== 200) return this.$message.error(res.msg)
            this.$message.success(res.msg)
            this.apollo_pull()
          },
          
          async apollo_release(row) {
            console.log(this.jsonData)
            const { data: res } = await this.$http.post(this.http_url + "/apollo_release",row)
            if (res.code !== 200) return this.$message.error(res.msg)
            this.$message.success(res.msg)
            this.apollo_pull()
          }
        },
        created () {
           this.apollo_pull() 
        },
      }
  </script>
  