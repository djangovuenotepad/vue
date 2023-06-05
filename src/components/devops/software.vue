<template><div>
    <el-upload
            class="upload-demo"
            :action= this.upload_url
            :on-success="handleAvatarSuccess"
            :disabled="this.switch"
            accept="all"
            show-file-list = "false"
            :on-exceed="handleExceed">
            <el-button size="small" :disabled="this.switch" type="primary">点击上传</el-button>
    </el-upload>

    <!-- 分割线-->
    <el-divider />
    <el-table
        :data="tableData"
        border
        style="width: 100%"
        :default-sort = "{prop: 'file_ctime', order: 'ascending'}"
        :row-class-name="tableRowClassName">

            <el-table-column
            type="index"
            label="序号"
            width="70"
            :index="indexMethod">
            </el-table-column>
     
            <el-table-column
            prop="file_name"
            label="文件">
            </el-table-column>

            <el-table-column
            prop="file"
            width="530"
            label="文件目录">
            </el-table-column>

            <el-table-column
            prop="file_size"
            label="大小">
            </el-table-column>

            <el-table-column
            prop="file_ctime"
            sortable
            label="上传时间">
            </el-table-column>
            

            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button size="small" type="primary"  @click.native.stop="download(scope.row)">下载</el-button>
                <el-button size="small" type="danger"  @click.native.stop="delete_file(scope.row)">删除</el-button>
              </template>
  
            </el-table-column>   

    </el-table>
</div>
</template>
    <script>
      export default {
        data() {
          return {
            file: '',
            tableData: '',
            switch: true,
            http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL,
            upload_url: process.env.VUE_APP_IP_WHITE_HTTP_URL + '/upload_file',
          }
        },

        methods: {
            handlePreview(file) {
                console.log(file);
            },
            handleAvatarSuccess(res) {
                if (res.code !== 200) return this.$message.error(res.msg)
                this.$message.success(res.msg)
                this.software()
            },
            download(row) {
                this.file = row.file_name
                window.open(this.http_url + "/software?s=" + row.file_name)
            },
            async delete_file(row) {
                this.$confirm("是否删除文件  " + row.file_name, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                    const { data: res } = await this.$http.post(this.http_url + "/delete_file",row)
                    if (res.code !== 200) return this.$message.error(res.msg)
                    this.tableData = res.msg
                    this.$message.success(res.msg)
                    this.software()
                }).catch(() => { })
            },
            async software() {
                const { data: res } = await this.$http.post(this.http_url + "/software_list")
                if (res.code !== 200) return this.$message.error(res.msg)
                this.tableData = res.msg
            },
            async upload_switch() {
                const { data: res } = await this.$http.post(this.http_url + "/uploadswitch")
                if (res.code !== 200) return this.$message.error(res.msg)
                this.switch = res.msg
            }

        },

        created () {
          this.upload_switch()
          this.software()
        },

      }
    </script>
  
