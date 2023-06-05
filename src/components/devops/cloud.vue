<template>
<div>
  <el-table
    :data="tableData"
    border
    :default-sort = "{prop: 'account_cloud', order: 'descending'}"
    >

    <el-table-column
      type="index"
      label="序号"
      width="70"
      :index="indexMethod">
    </el-table-column>

    <el-table-column
      prop="account_cloud"
      label="云商"
      sortable
      width="120">
    </el-table-column>

    <el-table-column
      prop="account_name"
      label="账户标识">
    </el-table-column>

    <el-table-column
      prop="admin_account"
      label="主账户">
    </el-table-column>

    <el-table-column
      prop="iam_account"
      label="IAM账户">
    </el-table-column>

    <el-table-column
      prop="iam_public_key"
      label="公钥"
      :show-overflow-tooltip='true'>
    </el-table-column>

    <el-table-column
      prop="iam_private_key"
      label="私钥"
      :show-overflow-tooltip='true'>
    </el-table-column>

  </el-table>
</div>
</template>

<script>
  export default {
    data() {
      return {
        http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL,
        tableData: []
      }
    },
    methods: {
      indexMethod(index){
        return (index+1)
      },
      async onSubmit () {
      const {
        data: res
      } = await this.$http.get(this.http_url+"/select_cloud_key")
      if (res.code !== 200) return this.$message.error(res.msg)
      this.tableData = res.msg
    }
    },
    created () {
      this.onSubmit()
    },
  }
</script>