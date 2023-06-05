<template>
  <div>
    <!-- 面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线-->
    <el-divider />
    <!--卡片区域-->
    <el-card class="box-card">
      <el-button type="primary"
                 @click="add_user_dialog_visble= true">添加用户</el-button>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加新用户"
                 :visible.sync="add_user_dialog_visble"
                 width="30%">
        <!-- 添加用户表单 -->
        <el-form :model="add_user_form"
                 ref="add_user_form_ref"
                 label-width="80px">

          <el-form-item label="用户名"
                        prop="username"
                        required>
            <el-input v-model="
                        add_user_form.username"
                      autocomplete="off">
            </el-input>
          </el-form-item>

          <el-form-item label="密码"
                        prop="password"
                        required>
            <el-input v-model="add_user_form.password"
                      autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="状态"
                        prop="status"
                        required>
            <el-select v-model="add_user_form.status">
              <el-option label="禁用"
                         :value="0"></el-option>
              <el-option label="启用"
                         :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="add_user_dialog_visble = false">取 消</el-button>
          <el-button type="primary"
                     @click="add_user('add_user_form_ref')">添 加</el-button>
        </span>
      </el-dialog>
      <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                stripe
                
                border
                max-height="600px"
                highlight-current-row
                fit>
        <el-table-column align="center"
                         label="#"
                         type="index">
        </el-table-column>
        <el-table-column prop="username"
                         label="用户名"
                         header-align="center"
                         align="center">
        </el-table-column>
        <el-table-column prop="status"
                         label="状态"
                         header-align="center"
                         align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"
                       @change="change_user_status(scope.row)"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       :active-value="1"
                       :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作"
                         align="center"
                         width="240px">
          <template slot-scope="scope">
            <el-button size="small"
                       type="text"
                       @click="edit_user(scope.row)">修改密码</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-popconfirm title="请再次确认？"
                           @confirm="delete_user(scope.row)">
              <el-button slot="reference"
                         size="small"
                         style="color:red"
                         type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 修改密码对话框 -->
      <el-dialog title="修改密码"
                 :visible.sync="edit_user_dialog_visble"
                 width="30%">
        <!-- 添加用户表单 -->
        <el-form :model="edit_user_form"
                 ref="edit_user_form_ref"
                 label-width="80px">

          <el-form-item label="用户名"
                        prop="username"
                        required>
            <el-input v-model="edit_user_form.username"
                      disabled
                      autocomplete="off">
            </el-input>
          </el-form-item>

          <el-form-item label="密码"
                        prop="password"
                        required="">
            <el-input v-model="edit_user_form.password"
                      type="password"
                      autocomplete="off"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="edit_user_dialog_visble = false">取 消</el-button>
          <el-button type="primary"
                     @click="edit_user_commit('edit_user_form_ref')">提 交</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL,
      tableData: [],
      total: 0,
      currentPage: 1,
      pagesize: 20,
      // 添加用户对话框是否可见
      add_user_dialog_visble: false,
      add_user_form: {
        username: '',
        password: '',
        status: 1,
      },
      // 编辑用户对话框是否可见
      edit_user_dialog_visble: false,
      edit_user_form: {
        password: ''
      },
    }
  },
  created () {
    this.query_user()
  },
  methods: {
    add_user (ref_name) {
      this.$refs[ref_name].validate(async (valid) => {
        if (!valid) { return false }
        let params = this.add_user_form
        const url = this.http_url
        const {
          data: res
        } = await this.$http.post(
          url + '/user_management/create',
          params)
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.add_user_dialog_visble = false
        this.query_user()
      })
    },
    async change_user_status (row) {
      const url = this.http_url
      let params = JSON.parse(JSON.stringify(row))
      const {
        data: res
      } = await this.$http.post(
        url + '/user_management/update/userStatus',
        params)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.query_user()
    },
    edit_user (row) {
      this.edit_user_form = {
        username: JSON.parse(JSON.stringify(row.username)),
        password: ''
      }
      this.edit_user_dialog_visble = true
    },
    edit_user_commit (ref_name) {
      this.$refs[ref_name].validate(async (valid) => {
        if (!valid) { return false }
        let params = this.edit_user_form
        const url = this.http_url
        const {
          data: res
        } = await this.$http.post(
          url + '/user_management/update/password',
          params)
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.edit_user_dialog_visble = false
        this.query_user()
      })
    },
    async query_user () {
      const url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        url + '/user_management/read')
      if (res.code !== 200) return this.$message.error(res.msg)
      this.tableData = res.msg
    },
    async delete_user (row) {
      const url = this.http_url
      let params = row
      const {
        data: res
      } = await this.$http.post(
        url + '/user_management/delete',
        params)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.query_user()
    },
  }
}
</script>

<style lang="less" scoped>
</style>