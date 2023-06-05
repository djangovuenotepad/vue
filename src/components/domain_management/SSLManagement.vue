<template>
  <div>
    <!-- 面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>域名管理</el-breadcrumb-item>
      <el-breadcrumb-item>域名证书管理</el-breadcrumb-item>
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
        <el-form-item label="证书名称"
                      prop="certificate_name">
          <el-input v-model.trim="form.certificate_name"
                    placeholder="支持模糊查询" />
        </el-form-item>
        <!-- ip归属地 -->
        <el-form-item label="域名"
                      prop="domain_name">
          <el-input v-model.trim="form.domain_name"
                    placeholder="支持模糊查询" />
        </el-form-item>
        <el-button type="primary"
                   @click="onSubmit">查询</el-button>
        <el-button type="primary"
                   style="float:right;"
                   @click="is_reapply=false;value=[]
                   ;is_drawer_visible = true">申请新证书</el-button>
        <el-button type="primary"
                   style="float:right;"
                   @click="is_dialog_visible = true">上传证书</el-button>

      </el-form>

      <!-- 上传证书对话框 -->
      <el-dialog title="上传证书:"
                 width="30%"
                 :visible.sync="is_dialog_visible">
        <div style="border:1px solid #2991FA;background:#EAF4FF;margin-bottom:20px;padding:10px;font-size:12px">
          <b>1.上传证书之前，请确保证书格式为pem</b>
          <br>
          <b>2.若不填写证书名称，则使用证书信息中的commonName(推荐)</b>
          <br>
          <b>3.证书的具体用途可写入描述中</b>
        </div>
        <el-form :model="upload_cert_form"
                 ref="upload_cert_form_ref"
                 label-width="80px">

          <el-form-item label="证书名称"
                        prop="certificate_name">
            <el-input v-model="upload_cert_form.certificate_name"
                      disabled
                      placeholder="使用证书中的commonName"
                      style="width:300px"></el-input>
          </el-form-item>

          <el-form-item label="证书公钥"
                        prop="public_key"
                        required>
            <el-input v-model.trim="upload_cert_form.public_key"
                      type="textarea"
                      placeholder="-----BEGIN CERTIFICATE-----"
                      :rows="5"></el-input>
          </el-form-item>

          <el-form-item label="证书私钥"
                        prop="private_key"
                        required>
            <el-input v-model.trim="upload_cert_form.private_key"
                      type="textarea"
                      placeholder="-----BEGIN RSA PRIVATE KEY-----"
                      :rows="5"></el-input>
          </el-form-item>

          <el-form-item label="描述"
                        prop="description">
            <el-input v-model="upload_cert_form.description"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="is_dialog_visible = false">取 消</el-button>
          <el-button type="primary"
                     @click="uploda_cert('upload_cert_form_ref')">上 传</el-button>
        </div>
      </el-dialog>

      <!-- 申请新证书抽屉 -->
      <el-drawer title="申请新证书"
                 size='50%'
                 :visible.sync="is_drawer_visible">
        <div style="margin-left:20px;margin-right:20px">
          <!--是否申请泛域名证书-->
          泛域名：
          <el-radio v-model="radio"
                    label="1">是</el-radio>
          <el-radio v-model="radio"
                    label="0">否</el-radio>

          <el-form v-show="radio == '1'"
                   label-width="80px"
                   label-suffix=":"
                   label-position="left"
                   :model="create_pan_domain_cert_form"
                   style="margin-top:20px;">
            <el-form-item label="泛域名"
                          required
                          prop="pan_domain_name">
              <el-input v-model.trim="create_pan_domain_cert_form.pan_domain_name"
                        placeholder="多个泛域名用英文逗号隔开" />
            </el-form-item>

          </el-form>
          <el-transfer v-show="radio == '0'"
                       v-model="value"
                       style="margin-top:20px;"
                       :data="data"
                       filterable
                       :titles="['Source', 'Target']">
          </el-transfer>
          <br>
          <div slot="footer"
               class="dialog-footer">
            <el-button style="float:right;margin-left:10px;"
                       type="primary"
                       :disabled="isdisabled"
                       @click="create_new_ssl_cert">开始申请</el-button>
            <el-button style="float:right;"
                       @click="is_drawer_visible = false">取 消</el-button>
          </div>
          <br>
          <div>
            <el-button type="text"
                       style="color:#85CE61">日志输出：</el-button>
            <el-button type="text">
            </el-button>
          </div>
          <div id="log_id"
               ref="log"
               style="border:1px solid #C0C4CC;border-radius: 4px;height:400px;overflow:auto">
          </div>
        </div>
      </el-drawer>

      <!--  表格区域-->
      <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                @cell-dblclick="dbclick_cell"
                stripe
                size="mini"
                border
                max-height="600px"
                highlight-current-row
                :default-sort="{prop:'end_time',order:'ascending'}"
                fit>
        <el-table-column align="center"
                         label="#"
                         type="index">
        </el-table-column>
        <el-table-column prop="certificate_name"
                         label="证书名称"
                         header-align="center"
                         align="center">
        </el-table-column>
        <el-table-column prop="common_name"
                         label="证书公用名"
                         header-align="center"
                         align="center">
        </el-table-column>
        <el-table-column prop="bind_domain"
                         label="证书绑定域名"
                         header-align="center"
                         align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover"
                        placement="top">
              <pre>{{JSON.parse(scope.row.bind_domain).join('\n') }}</pre>
              <pre slot="reference"
                   v-if="JSON.parse(scope.row.bind_domain).length ===1">{{JSON.parse(scope.row.bind_domain)[0]}}</pre>
              <pre slot="reference"
                   v-else>{{JSON.parse(scope.row.bind_domain)[0]  + '\n' + JSON.parse(scope.row.bind_domain)[1]}}</pre>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column prop="total_domain_number"
                         label="域名个数"
                         width="70"
                         header-align="center"
                         align="center">
        </el-table-column>

        <el-table-column prop="description"
                         label="描述"
                         header-align="center">
          <template slot-scope="scope">
            <span v-show="!scope.row.iseditor">{{scope.row.description}}</span>
            <el-input type="text"
                      size="mini"
                      @keyup.enter.native="submit_change(scope.row)"
                      v-show="scope.row.iseditor"
                      v-model="scope.row.description"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="organization_name"
                         label="颁发机构"
                         width="260"
                         header-align="center"
                         align="center">
        </el-table-column>
        <el-table-column prop="start_time"
                         sortable
                         label="颁发时间"
                         header-align="center"
                         align="center">
        </el-table-column>
        <el-table-column prop="end_time"
                         sortable
                         label="到期时间"
                         header-align="center"
                         align="center">
          <template slot-scope="scope">
            <p>{{scope.row.end_time}}</p>
            <p v-if="scope.row.is_expired"
               style="color:red">已过期</p>

          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="250px">
          <template slot-scope="scope">
            <el-button size="small"
                       type="text"
                       @click="re_apply(scope.row)">重新签发</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button size="small"
                       type="text"
                       @click="copy_public_key(scope.row.certificate_name)">复制公钥</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button size="small"
                       type="text"
                       @click="copy_private_key(scope.row.certificate_name)">复制私钥</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button size="small"
                       type="text"
                       style="color:red"
                       @click="delete_certificate(scope.row.certificate_name)">删除</el-button>

            <!-- <el-divider direction="vertical"></el-divider> -->
            <!-- <el-button size="small"
                       type="text"
                       @click="download_zip(scope.row.certificate_name)">下载zip</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <br>
      <!-- 分页功能 -->
      <el-pagination v-show="true"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[50, 100, 200]"
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
        certificate_name: '',
        domain_name: '',
      },
      create_pan_domain_cert_form: {
        pan_domain_name: '',
      },

      // 云厂商列表
      cloud_vendor_options: [],
      // 是否泛域名
      radio: '0',
      // 是否重新申请
      is_reapply: false,
      all_data: [],
      domain_resolver_dict: {},
      data: [],
      value: [],

      // 上传证书对话框是否可见
      is_dialog_visible: false,
      upload_cert_form: {
        certificate_name: '',
        public_key: '',
        private_key: '',
        description: ''
      },
      // 申请信证书抽屉是否可见
      is_drawer_visible: false,
      isdisabled: false,
      //日志
      tableData: [],
      total: 0,
      currentPage: 1,
      pagesize: 50,

      http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL,
      ws_url: "wss://"+window.location.host,
      websocket_instance: null,
      token: window.localStorage.getItem('opsUItoken')
    }
  },
  created () {
    this.onSubmit()
    this.get_cloud_vendor_options()
    this.init_data()
    console.log('created');
  },
  destroy () {
    this.websocket_instance.close()
  },
  methods: {
    // 查询证书
    async onSubmit () {
      this.tableData = []
      this.total = 0
      this.currentPage = 1
      this.pagesize = 50
      let params = this.form
      console.log(params)
      const post_url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        post_url + '/domain_name/ssl_cert/read',
        params)
      // console.log(res.msg)
      if (res.code !== 200) return this.$message.error(res.msg)
      //获取数据总条数
      this.total = res.msg.length
      this.tableData = res.msg
      // this.$message.success(res.msg)
      console.log(res.msg)
    },
    // 删除证书
    delete_certificate(certificate_name){
      	this.$confirm("将删除该证书的所有相关信息", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let params = {
          certificate_name: certificate_name
        }
        params.current_user = window.localStorage.getItem('current_user')
        const url = this.http_url
        const {
          data: res
        } = await this.$http.post(
          url + '/domain_name/ssl_cert/delete',
          params)
        if (res.code !== 200) {

          return this.$message.error(res.msg)
        }
        this.$message.success(res.msg)
        this.onSubmit()
      }).catch(() => { })
    },
    // 修改证书描述
    dbclick_cell (row, column, cell, event) {

      if (column.property === 'description') {
        row.iseditor = !row.iseditor
      }
    },
    async submit_change (row) {
      let params = {
        certificate_name: row.certificate_name,
        description: row.description
      }
      const post_url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        post_url + '/domain_name/ssl_cert/update_description',
        params)
      // console.log(res.msg)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.onSubmit()
    },
    // 上传证书
    uploda_cert (ref_name) {
      this.$refs[ref_name].validate(async (valid) => {
        if (!valid) { return false }
        let params = this.upload_cert_form
        const url = this.http_url
        const {
          data: res
        } = await this.$http.post(
          url + '/domain_name/ssl_cert/upload',
          params)
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.is_dialog_visible = false
        this.onSubmit()
      })
    },
    // 申请新证书
    create_new_ssl_cert () {
      this.isdisabled = true
      console.log(this.is_reapply)
      this.$refs.log.innerHTML = ''
      let domain_list = []
      let pan_domain_list = []
      let certificate_name = ''

      // 非泛域名
      if (this.radio === '0') {
        if (this.value.length === 0) {
          this.isdisabled = false
          return this.$message.error('请至少选择一个域名！')
        }

        //以第一个域名为证书名称
        certificate_name = this.value[0]
        for (let domain of this.value) {
          // 生成域名证书列表：每个域名，对应一个解析商
          domain_list.push({ 'domain_name': domain, 'resolver': this.domain_resolver_dict[this.get_main_domain_name(domain)] })
        }
      }
      // 泛域名
      if (this.radio === '1') {
        if (this.create_pan_domain_cert_form.pan_domain_name == '') {
          this.isdisabled = false
          return this.$message.error('泛域名未填写！')
        }
        pan_domain_list = this.create_pan_domain_cert_form.pan_domain_name.split(',')
        certificate_name = pan_domain_list[0]
        for (let domain of pan_domain_list) {
          // 生成域名证书列表：每个域名，对应一个解析商
          domain_list.push({ 'domain_name': domain, 'resolver': this.domain_resolver_dict[this.get_main_domain_name(domain)] })
        }
      }
      // 检查主域名是否录入了域名系统
      for (let i = 0; i < domain_list.length; i++) {
        if (typeof (domain_list[i].resolver) == "undefined") {
          this.isdisabled = false
          return this.$message.error(`${domain_list[i].domain_name}不在域名系统中，请先录入`)
        }

      }

      // 发起websocket请求，申请证书，实时打印日志：
      let params = {
        token: this.token,
        domain_list: domain_list,
        certificate_name: certificate_name,
        is_reapply: this.is_reapply
      }
      console.log(params)
      this.mywebsocket(JSON.stringify(params))

    },
    // 重新签发新证书
    async re_apply (row) {
      this.is_reapply = true
      let certificate_name = JSON.stringify(row.certificate_name)
      let domain_list = JSON.parse(row.bind_domain)
      this.is_drawer_visible = true
      if (certificate_name.includes('*')) {
        this.radio = "1"
        this.create_pan_domain_cert_form.pan_domain_name = domain_list.join()
      }
      else {
        this.radio = "0"
        this.value = domain_list
      }
    },
    // 获取cdn厂商下拉框选项
    get_cloud_vendor_options () {
      const url = this.http_url
      this.$http.post(url + '/cloud_vendor_info/read').then(res => { this.cloud_vendor_options = res.data.msg }).catch(error => { console.log(error) })
    },
    // 获取所有域名的基本信息
    // 获取主域名
    get_main_domain_name (domain_name) {
      domain_name = domain_name + ''
      let domain_name_list = domain_name.split('.')
      let domain_name_list_length = domain_name_list.length
      let main_domain_name = `${domain_name_list[domain_name_list_length - 2]}.${domain_name_list[domain_name_list_length - 1]}`
      return main_domain_name
    },
    async init_data () {
      let query_params = {}
      const url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        url + '/domain_name/basic_info/read',
        query_params)

      this.all_data = res.msg
      for (let i = 0; i < this.all_data.length; ++i) {
        let domain_name = this.all_data[i].domain_name.split(':')[0]
        let main_domain_name = this.get_main_domain_name(domain_name)
        let resolver = this.all_data[i].resolver
        this.data.push({
          key: domain_name,
          // label: `${domain_name}(${resolver})`
          label: domain_name
        })
        this.domain_resolver_dict[main_domain_name] = resolver
      }
      // console.log(this.data)
      console.log(this.domain_resolver_dict)
    },

    mywebsocket (message) {
      if ('WebSocket' in window) {
        this.websocket_instance = new WebSocket(this.ws_url + '/domain_name/ssl_cert/create');
      } else {
        alert('当前浏览器不支持websocket')
      }
      //连接发生错误的回调方法
      this.websocket_instance.onerror = (e) => {
        this.setMessageInnerHTML("WebSocket连接发生错误,请打开浏览器控制台查看原因", 'p')
        console.log(e)
      };

      //连接成功建立的回调方法
      this.websocket_instance.onopen = (e) => {
        // console.log('连接成功')
        this.setMessageInnerHTML("WebSocket连接成功", 'p')
        this.websocket_instance.send(message)
      }

      //接收到消息的回调方法
      this.websocket_instance.onmessage = (event) => {
        let data = event.data
        let data_json = JSON.parse(data)
        this.setMessageInnerHTML(data_json.msg, 'p')
      }

      //连接关闭的回调方法
      this.websocket_instance.onclose = (e) => {
        this.setMessageInnerHTML("WebSocket连接关闭", 'p')
        this.isShow = true
      }
    },
    setMessageInnerHTML (message, css_style) {
      let ansi_up = new this.$ansi_up
      let logarea_child_el = document.createElement(css_style)
      logarea_child_el.style.margin = 0
      let myhtml1 = ansi_up.ansi_to_html(message)
      let myhtml2 = myhtml1.replace(/\n/g, "<br/>")
      logarea_child_el.innerHTML = myhtml2
      this.$refs.log.append(logarea_child_el)
      this.$refs.log.scrollTop = this.$refs.log.scrollHeight
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
    // 复制公钥
    async copy_public_key (certificate_name) {
      let params = {
        certificate_name: certificate_name
      }
      const post_url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        post_url + '/domain_name/ssl_cert/public_key_read',
        params)
      // console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      await this.$copyText(res.msg)
      this.$message.success('复制成功')
    },
    // 复制私钥
    async copy_private_key (certificate_name) {
      let params = {
        certificate_name: certificate_name
      }
      const post_url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        post_url + '/domain_name/ssl_cert/private_key_read',
        params)
      // console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      await this.$copyText(res.msg)
      this.$message.success('复制成功')
    },
    // 下载zip
    download_zip (certificate_name) { },
  }

}
</script>

<style lang="less" scoped>
/deep/.el-transfer-panel {
  width: 320px;
}
/deep/ :focus {
  outline: 0;
}
</style>