<template>
  <div>
    <!-- 面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>域名管理</el-breadcrumb-item>
      <el-breadcrumb-item>源站管理</el-breadcrumb-item>
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

        <!-- 源站地址 -->
        <el-form-item label="源站地址"
                      prop="ip_addr">
          <el-input v-model.trim="form.ip_addr"
                    placeholder="源站地址" />
        </el-form-item>
        <!-- ip归属地 -->
        <el-form-item label="ip归属地"
                      prop="ip_region">
          <el-input v-model.trim="form.ip_region"
                    placeholder="ip归属地" />
        </el-form-item>
        <!-- ip来源厂商 -->
        <el-form-item label="ip来源厂商"
                      prop="ip_from">
          <el-select v-model="form.ip_from"
                     placeholder="ip来源厂商"
                     clearable
                     filterable
                     allow-create>
            <el-option label="谷歌云"
                       value="谷歌云"></el-option>
            <el-option label="阿里云"
                       value="阿里云"></el-option>
            <el-option label="微软云"
                       value="微软云"></el-option>
          </el-select>
        </el-form-item>
        <!-- 源站类型 -->
        <el-form-item label="源站类型"
                      prop="source_type">
          <el-select v-model="form.source_type"
                     placeholder="源站类型"
                     clearable
                     filterable
                     allow-create>
            <el-option label="gcp"
                       value="gcp"></el-option>
            <el-option label="slb"
                       value="slb"></el-option>
          </el-select>
        </el-form-item>
        <!-- 环境 -->
        <el-form-item label="环境"
                      prop="ip_env">
          <el-select v-model="form.ip_env"
                     placeholder="请选择"
                     clearable
                     filterable
                     allow-create>
            <el-option label="test"
                       value="test"></el-option>
            <el-option label="uat"
                       value="uat"></el-option>
            <el-option label="prod"
                       value="prod"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <el-button type="primary"
                 @click="onSubmit">查询</el-button>
      <el-button type="primary"
                 @click="dialogFormVisible = true">添加</el-button>
      <!-- 添加新记录弹出框 -->

      <el-dialog title="添加源站"
                 :visible.sync="dialogFormVisible">
        <el-form :inline="true"
                 label-suffix=":"
                 v-model="form"
                 class="demo-form-inline">
          <!-- 源站地址 -->
          <el-form-item label="源站地址"
                        prop="ip_addr">
            <el-input v-model.trim="form.ip_addr"
                      placeholder="源站地址" />
          </el-form-item>
          <!-- ip归属地 -->
          <el-form-item label="ip归属地"
                        prop="ip_region">
            <el-input v-model.trim="form.ip_region"
                      placeholder="ip归属地" />
          </el-form-item>
          <!-- ip来源厂商 -->
          <el-form-item label="ip来源厂商"
                        prop="ip_from">
            <el-select v-model="form.ip_from"
                       placeholder="ip来源厂商"
                       clearable
                       filterable
                       allow-create>
              <el-option label="谷歌云"
                         value="谷歌云"></el-option>
              <el-option label="阿里云"
                         value="阿里云"></el-option>
              <el-option label="微软云"
                         value="微软云"></el-option>
            </el-select>
          </el-form-item>
          <!-- 源站类型 -->
          <el-form-item label="源站类型"
                        prop="source_type">
            <el-select v-model="form.source_type"
                       placeholder="源站类型"
                       clearable
                       filterable
                       allow-create>
              <el-option label="gcp"
                         value="gcp"></el-option>
              <el-option label="slb"
                         value="slb"></el-option>
            </el-select>
          </el-form-item>
          <!-- 环境 -->
          <el-form-item label="环境"
                        prop="ip_env">
            <el-select v-model="form.ip_env"
                       placeholder="请选择"
                       clearable
                       filterable
                       allow-create>
              <el-option label="test"
                         value="test"></el-option>
              <el-option label="uat"
                         value="uat"></el-option>
              <el-option label="prod"
                         value="prod"></el-option>
            </el-select>
          </el-form-item>

          <!-- 备注 -->
          <el-form-item label="备注"
                        prop="remarks">
            <el-input v-model.trim="form.remarks"
                      placeholder="备注" />
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="add_new_record">添加</el-button>
        </div>
      </el-dialog>

      <!--  表格区域-->
      <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                stripe
                size="mini"
                border
                max-height="600px"
                empty-text="loading..."
                highlight-current-row
                fit>
        <el-table-column align="center"
                         label="#"
                         type="index">
        </el-table-column>
        <el-table-column prop="ip_addr"
                         label="源站地址">
        </el-table-column>
        <el-table-column prop="ip_region"
                         label="ip归属地">
        </el-table-column>
        <el-table-column prop="ip_from"
                         label="ip来源厂商">
        </el-table-column>

        <el-table-column prop="source_type"
                         label="源站类型">
        </el-table-column>

        <el-table-column prop="ip_env"
                         label="环境">
        </el-table-column>

        <el-table-column prop="remarks"
                         label="备注">
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="80px">
          <template slot-scope="scope">
            <el-button size="small"
                       type="text"
                       :disabled="isReadOnly"
                       @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <!-- 点击编辑时弹出框 -->
            <el-dialog title="添加源站"
                       :visible.sync="editDialogFormVisible">
              <el-form :inline="true"
                       label-suffix=":"
                       v-model="edit_form"
                       class="demo-form-inline">
                <!-- 源站地址 -->
                <el-form-item label="源站地址"
                              prop="ip_addr">
                  <el-input v-model.trim="edit_form.ip_addr"
                            disabled
                            placeholder="源站地址" />
                </el-form-item>
                <!-- ip归属地 -->
                <el-form-item label="ip归属地"
                              prop="ip_region">
                  <el-input v-model.trim="edit_form.ip_region"
                            placeholder="ip归属地" />
                </el-form-item>
                <!-- ip来源厂商 -->
                <el-form-item label="ip来源厂商"
                              prop="ip_from">
                  <el-select v-model="edit_form.ip_from"
                             placeholder="ip来源厂商"
                             clearable
                             filterable
                             allow-create>
                    <el-option label="谷歌云"
                               value="谷歌云"></el-option>
                    <el-option label="阿里云"
                               value="阿里云"></el-option>
                    <el-option label="微软云"
                               value="微软云"></el-option>
                  </el-select>
                </el-form-item>
                <!-- 源站类型 -->
                <el-form-item label="源站类型"
                              prop="source_type">
                  <el-select v-model="edit_form.source_type"
                             placeholder="源站类型"
                             clearable
                             filterable
                             allow-create>
                    <el-option label="gcp"
                               value="gcp"></el-option>
                    <el-option label="slb"
                               value="slb"></el-option>
                  </el-select>
                </el-form-item>
                <!-- 环境 -->
                <el-form-item label="环境"
                              prop="ip_env">
                  <el-select v-model="edit_form.ip_env"
                             placeholder="请选择"
                             clearable
                             filterable
                             allow-create>
                    <el-option label="test"
                               value="test"></el-option>
                    <el-option label="uat"
                               value="uat"></el-option>
                    <el-option label="prod"
                               value="prod"></el-option>
                  </el-select>
                </el-form-item>

                <!-- 备注 -->
                <el-form-item label="备注"
                              prop="remarks">
                  <el-input v-model.trim="edit_form.remarks"
                            placeholder="备注" />
                </el-form-item>
              </el-form>
              <div slot="footer"
                   class="dialog-footer">
                <el-button @click="editDialogFormVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="edit_commit">提交修改</el-button>
              </div>
            </el-dialog>
            &nbsp;
            <el-popconfirm title="请再次确认？"
                           @confirm="handleDelete(scope.$index, scope.row)">
              <el-button slot="reference"
                         size="small"
                         type="text"
                         :disabled="isReadOnly">删除</el-button>
            </el-popconfirm>

          </template>
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
        ip_addr: '',
        ip_region: '',
        ip_from: '',
        source_type: '',
        ip_env: '',
        remarks: ''
      },
      edit_form: {
        ip_addr: '',
        ip_region: '',
        ip_from: '',
        source_type: '',
        ip_env: '',
        remarks: ''
      },
      isReadOnly: false,
      dialogFormVisible: false,
      editDialogFormVisible: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pagesize: 20,
      token: 'bfzhvtmf' + window.localStorage.getItem('opsUItoken') + 'vodvjjnv',
      http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL
    }
  },
  created () {
    this.init_post_request()
  },
  methods: {
    async init_post_request () {
      this.total = 0
      this.currentPage = 1
      this.pagesize = 20
      this.form.ip_env = 'prod'
      let params = {
        ip_env: 'prod'
      }
      console.log(params)
      const post_url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        post_url + '/source_station_info/read',
        params)
      // console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      //获取数据总条数
      this.total = res.msg.length
      this.tableData = res.msg

    },
    handleEdit (index, row) {
      this.editDialogFormVisible = true
      this.edit_form = JSON.parse(JSON.stringify(row))
    },
    async handleDelete (index, row) {
      this.isReadOnly = true
      console.log(row)
      let params = row
      const post_url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        post_url + '/source_station_info/delete',
        params)
      if (res.code !== 200) {
        this.isReadOnly = false
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
      this.isReadOnly = false
      this.init_post_request()
    },

    async add_new_record () {
      let params = this.form
      const post_url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        post_url + '/source_station_info/create',
        params)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.dialogFormVisible = false
      this.init_post_request()
    },
    async edit_commit () {
      let params = this.edit_form
      const post_url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        post_url + '/source_station_info/update',
        params)
      if (res.code !== 200) {
        this.editDialogFormVisible = false
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
      this.editDialogFormVisible = false
    },
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
      let params = {}
      //传参判断
      if (this.form.ip_addr !== '') { params.ip_addr = this.form.ip_addr }
      if (this.form.ip_region !== '') { params.ip_region = this.form.ip_region }
      if (this.form.ip_from !== '') { params.ip_from = this.form.ip_from }
      if (this.form.source_type !== '') { params.source_type = this.form.source_type }
      if (this.form.ip_env !== '') { params.ip_env = this.form.ip_env }
      console.log(params)
      const post_url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        post_url + '/source_station_info/read',
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