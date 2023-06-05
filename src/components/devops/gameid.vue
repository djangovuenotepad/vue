<template><div>
    <div class="div">
      <div class="_div">
      <el-form :inline="true"  class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" style="float:left;"  @click.native.stop="onSubmit()">更新</el-button>
          </el-form-item>

      </el-form>
      </div>
    </div>
    <div>
    <el-table
        :data="gameid_data"
        border
        style="width: 100%"
        :default-sort = "{prop: 'status', order: 'ascending'}">
            
            <el-table-column
            prop="project"
            sortable
            width=200
            label="项目">
            </el-table-column>

            <el-table-column
            prop="gameid"
            label="游戏ID">
            </el-table-column>

            <el-table-column
            prop="name"
            label="中文名">
            </el-table-column> 

    </el-table>
</div>
<el-dialog
  title="编辑"
  :visible.sync="show"
  width="70%" >
  
  <el-form :inline="true" :model="jsonData" class="demo-form-inline">
  
        <el-form-item label="项目">
            <el-select v-model="jsonData.project">
                <el-option v-for="(value,key,index) in project_all"
                       :key="index"
                       :label="value"
                       :value="key">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="游戏ID">
            <el-input v-model="jsonData.gameid"></el-input>
        </el-form-item>
        <el-form-item label="中文名">
            <el-input v-model="jsonData.gamename"></el-input>
        </el-form-item> 
 
</el-form>
    
  <span slot="footer" class="dialog-footer">
    <el-button @click="show = false">取 消</el-button>
    <el-button type="primary" @click.native.stop="edit()">确 定</el-button>
    </span>
</el-dialog>

</div></template>


<script>
      export default {
        data() {
          return {
            icp_loading: false,
            http_url: process.env.VUE_APP_IP_WHITE_HTTP_URL, 
            gameid_data: '',
            show: false,
            project_all: {"QP":"棋牌","DY":"电游","BY":"博雅","C":"C端赛博"},
            jsonData: {"project":"","gameid":"","gamename":""}
          }
        },
        methods: { 
            onSubmit() { 
                this.show = true 
            },
            async get_game_name() {
              const { data: res } = await this.$http.get(this.http_url + "/get_game_name",this.data)
              if (res.code !== 200) return this.$message.error(res.msg)
              this.gameid_data = res.msg
          },
            async edit() {
                this.show = false
                console.log(this.jsonData)
                const { data: res } = await this.$http.post(this.http_url + "/edit_gameid",this.jsonData)
                if (res.code !== 200) return this.$message.error(res.msg)
                this.$message.success(res.msg)
                this.get_game_name()
            }
        },
        created () {
          this.get_game_name()
        },
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