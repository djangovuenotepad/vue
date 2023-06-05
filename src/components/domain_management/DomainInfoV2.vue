<template>
  <div>
    <!-- 面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>域名管理</el-breadcrumb-item>
      <el-breadcrumb-item>域名详情管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线-->
    <el-divider />
    <!--卡片区域-->
    <el-card class="box-card">
      <!-- 域名基本信息查询表单 -->
      <el-form :inline="true"
               label-suffix=":"
               v-model="domain_name_basic_info_form"
               class="demo-form-inline">
        <!-- 项目 -->
        <el-form-item label="项目"
                      prop="project">
          <el-select v-model="domain_name_basic_info_form.project"
                     style="width:150px"
                     placeholder="请选择"
                     clearable
                     filterable
                     allow-create>

            <el-option v-for="(value,key,index) in project_dict"
                       :key="index"
                       :label="value"
                       :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 环境 -->
        <el-form-item label="环境"
                      prop="domain_env">
          <el-select v-model="domain_name_basic_info_form.domain_env"
                     style="width:150px"
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

        <!-- 所属业务 -->
        <el-form-item label="所属业务"
                      prop="business">
          <el-select v-model="domain_name_basic_info_form.business"
                     clearable
                     filterable
                     placeholder="请选择">
            <el-option v-for="item in business_options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 域名 -->
        <el-form-item label="域名"
                      prop="domain_name">
          <el-input v-model.trim="domain_name_basic_info_form.domain_name"
                    placeholder="域名" />
        </el-form-item>

        <!-- 是否备案 -->
        <el-form-item label="是否备案"
                      prop="is_beian">
          <el-select v-model="domain_name_basic_info_form.is_beian"
                     style="width:150px"
                     placeholder="请选择"
                     clearable
                     filterable
                     allow-create>
            <el-option label="是"
                       :value="1"></el-option>
            <el-option label="否"
                       :value="0"></el-option>
          </el-select>
        </el-form-item>

        <!-- 域名状态 -->
        <el-form-item label="域名状态"
                      prop="domain_status">
          <el-select v-model="domain_name_basic_info_form.domain_status"
                     style="width:150px"
                     placeholder="域名状态"
                     clearable
                     filterable
                     allow-create>
            <el-option label="在用"
                       :value="1"></el-option>
            <el-option label="备用"
                       :value="0"></el-option>
            <el-option label="异常"
                       :value="-1"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <!-- 域名及基本信息查询提交按钮 -->
      <el-button type="primary"
                 @click="domain_name_basic_info_read_submit(domain_name_basic_info_form)">查询</el-button>
      <!-- 域名及基本信息新增按钮 -->
      <el-button type="primary"
                 @click="domain_name_basic_info_addnew_dialog_is_visible = true">添加</el-button>

      <!-- 批处理按钮 -->
      <el-button type="primary"
                 style="float:right;"
                 @click="dialogTableVisible = true">批处理</el-button>
      <!-- 新增域名及基本信息对话框 -->
      <el-dialog title="新增域名及基本信息"
                 :close-on-click-modal="false"
                 :visible.sync="domain_name_basic_info_addnew_dialog_is_visible">
        <el-form :inline="true"
                 label-suffix=":"
                 ref="domain_name_basic_info_addnew_form_ref"
                 :model="domain_name_basic_info_addnew_form"
                 class="demo-form-inline">
          <!-- 域名 -->
          <el-form-item label="域名"
                        required
                        prop="domain_name">
            <el-input v-model.trim="domain_name_basic_info_addnew_form.domain_name"
                      placeholder="域名" />
          </el-form-item>

          <!-- 域名托管商 -->
          <el-form-item label="域名托管商"
                        required
                        prop="registar">
            <el-select v-model="domain_name_basic_info_addnew_form.registar"
                       clearable
                       filterable
                       placeholder="请选择">
              <el-option v-for="item in tgs_cloud_vendor_options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 域名解析商 -->
          <el-form-item label="域名解析商"
                        required
                        prop="resolver">
            <el-select v-model="domain_name_basic_info_addnew_form.resolver"
                       clearable
                       filterable
                       placeholder="请选择">
              <el-option v-for="item in dns_cloud_vendor_options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 是否备案 -->
          <el-form-item label="是否备案"
                        required
                        prop="is_beian">
            <el-select v-model="domain_name_basic_info_addnew_form.is_beian"
                       placeholder="请选择"
                       clearable
                       filterable
                       allow-create>
              <el-option label="是"
                         :value="1"></el-option>
              <el-option label="否"
                         :value="0"></el-option>
            </el-select>
          </el-form-item>

          <!-- 项目 -->
          <el-form-item label="项目"
                        required
                        prop="project">
            <el-select v-model="domain_name_basic_info_addnew_form.project"
                       placeholder="请选择"
                       clearable
                       filterable
                       allow-create>

              <el-option v-for="(value,key,index) in project_dict"
                         :key="index"
                         :label="value"
                         :value="key">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 环境 -->
          <el-form-item label="环境"
                        required
                        prop="domain_env">
            <el-select v-model="domain_name_basic_info_addnew_form.domain_env"
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

          <!-- 所属业务 -->
          <el-form-item label="业务"
                        required
                        prop="business">
            <el-select v-model="domain_name_basic_info_addnew_form.business"
                       clearable
                       filterable
                       placeholder="请选择">
              <el-option v-for="item in business_options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 业务类型 -->
          <el-form-item label="业务类型"
                        required
                        prop="business_type">
            <el-select v-model="domain_name_basic_info_addnew_form.business_type"
                       placeholder="业务类型"
                       clearable
                       filterable
                       allow-create>
              <el-option label="前端"
                         value="前端"></el-option>
              <el-option label="后端"
                         value="后端"></el-option>
            </el-select>
          </el-form-item>

          <!-- 域名状态 -->
          <el-form-item label="域名状态"
                        required
                        prop="domain_status">
            <el-select v-model="domain_name_basic_info_addnew_form.domain_status"
                       placeholder="域名状态"
                       clearable
                       filterable
                       allow-create>
              <el-option label="在用"
                         :value="1"></el-option>
              <el-option label="备用"
                         :value="0"></el-option>
              <el-option label="异常"
                         :value="-1"></el-option>
            </el-select>
          </el-form-item>

          <!-- 备注 -->
          <el-form-item label="备注"
                        prop="remarks">
            <el-input v-model.trim="domain_name_basic_info_addnew_form.remarks"
                      placeholder="备注" />
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="domain_name_basic_info_addnew_dialog_is_visible = false">取 消</el-button>
          <el-button type="primary"
                     @click="domain_name_basic_info_addnew_submit('domain_name_basic_info_addnew_form_ref')">添加</el-button>
        </div>
      </el-dialog>

      <!--域名及基本信息表格区域-->
      <el-table :data="domain_name_basic_info_table_data"
                border
                :row-class-name="tableRowClassName"
                fit>
        <el-table-column label="域名" 
                         width="240px">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="current_domain_name_click(scope.row)">{{scope.row.domain_name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="registar" 
                         label="域名托管商"
                         width="150px">
        </el-table-column>

        <el-table-column prop="resolver" 
                         label="域名解析商">
        </el-table-column>
        <el-table-column prop="is_beian"
                         align="center"
                         label="是否备案">
          <template slot-scope="scope">
            <span v-if="scope.row.is_beian == 1">是</span>
            <span v-if="scope.row.is_beian == 0">否</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="当前解析值"
                         width="400px">
          <template slot-scope="scope">
            {{scope.row.current_parse.join(',')}}
          </template>
        </el-table-column> -->
        <el-table-column prop="project"
                         align="center"
                         label="项目">
          <template slot-scope="scope">
            <span v-text="project_dict[scope.row.project]"></span>

          </template>
        </el-table-column>

        <el-table-column prop="domain_env"
                         align="center"
                         label="环境">
        </el-table-column>

        <el-table-column prop="business"
                         align="center"
                         label="业务">
        </el-table-column>

        <el-table-column prop="business_type"
                         align="center"
                         label="业务类型">
        </el-table-column>

        <el-table-column prop="domain_status"
                         align="center"
                         label="域名状态">
          <template slot-scope="scope">
            <span v-if="scope.row.domain_status == 1">在用</span>
            <span v-if="scope.row.domain_status == 0"></span>
            <span v-if="scope.row.domain_status == -1">异常</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks"
                         align="center"
                         label="备注">
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="150">
          <template slot-scope="scope">
            <el-link type="warning"
                     :underline="false"
                     @click="current_domain_name_click(scope.row)">详情</el-link>
            <el-divider direction="vertical"></el-divider>
            <!-- <el-link type="danger"
                     :underline="false"
                     disabled
                     @click="domain_name_basic_info_delete_click(scope.row)">删除</el-link>
            <el-divider direction="vertical"></el-divider> -->
            <el-link type="success"
                     :underline="false"
                     @click="domain_name_basic_info_doman_check_click(scope.row)">线路质量检测</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

   <!-- Dialog：批量处理 -->
   <el-dialog center  width="1300px" title="批量更新DNS解析值" :visible.sync="dialogTableVisible">


          <el-form :inline="true"   v-model="batches_table_data">
            
            <el-form-item label="指定CDN/云商:"
                          prop="cdn_vendor">
                <el-select v-model="batches_with_cloud_cdn"
                          clearable
                          filterable
                          placeholder="请选择">
                  <el-option v-for="item in cdn_cloud_vendor_options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label-position="left" >
              
                <el-button type="primary" @click="batches_moddifying_dns" :loading="batches_button_isShow"> {{ batches_button_isShow ? '执行中...' : '提交' }}</el-button>
            </el-form-item>


            <el-form-item label="故障CDN/云商:"
                          prop="cdn_vendor">
                <el-select v-model="batches_with_replace_cloud_cdn"
                          clearable
                          multiple
                          filterable
                          placeholder="请选择">
                  <el-option v-for="item in cdn_cloud_vendor_options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label-position="left" >
              
                <el-button type="danger" @click="batches_replace_dns" :loading="batches_button_replace_isShow"> {{ batches_button_replace_isShow ? '执行中...' : '提交' }}</el-button>
            </el-form-item>


            <div class="demo-drawer__footer" style="float:right;"> 
              <el-form-item label="刷新数据:">
                  <el-button type="success" icon="el-icon-refresh" :disabled="batches_get_isShow" circle @click="batches_get_dns_msg"> </el-button>
              </el-form-item>
            </div>
            <el-table height="500" 
                        border 
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        ref="multipleTable"
                        :data="batches_table_data.domains">
                  <el-table-column  type="selection"   width="100"> </el-table-column>
                  <el-table-column  label="域名" width="250" > <template slot-scope="scope">{{ scope.row.domain_name }}</template> </el-table-column>
                  <el-table-column property="cloud_cdn" label="当前解析云商" width="200"></el-table-column>
                  <el-table-column property="cloud_cdn_value" label="当前解析值" ></el-table-column>
                  <el-table-column property="result" label="更新结果" ></el-table-column>
            </el-table>
        </el-form>
        <font color="red">1.将域名DNS解析值替换为指定云商</br>2.将域名解析在故障云商的DNS切换到其他域名解析记录大全</font> 
      </el-dialog>


    <!-- 右侧抽屉：域名详情 -->
    <el-drawer :title="current_domain_name_details_dict.domain_name"
               size="64.5%"
               :visible.sync="current_domain_name_details_drawer_is_visible"
               :modal="false">

      <div style="margin:20px;height:800px;overflow:auto;">

        <!-- 域名及基本信息详情 -->
        <div>
          <el-row>
            <el-col :span="4"><b>域名托管商：</b> </el-col>
            <el-col :span="4">{{current_domain_name_details_dict.registar}}</el-col>
            <el-col :span="4"><b>域名解析商：</b></el-col>
            <el-col :span="4">{{current_domain_name_details_dict.resolver}}</el-col>
            <el-col :span="4"><b>是否备案：</b></el-col>
            <el-col :span="4"
                    v-if="current_domain_name_details_dict.is_beian == 1">是</el-col>
            <el-col :span="4"
                    v-else>否</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4"> <b>项目：</b></el-col>
            <el-col :span="4">
              <span v-text="project_dict[current_domain_name_details_dict.project]"></span>

            </el-col>
            <el-col :span="4"><b>环境：</b></el-col>
            <el-col :span="4">{{current_domain_name_details_dict.domain_env}}</el-col>
            <el-col :span="4"><b>业务：</b></el-col>
            <el-col :span="4">{{current_domain_name_details_dict.business}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4"><b>业务类型：</b></el-col>
            <el-col :span="4"> {{current_domain_name_details_dict.business_type}}</el-col>
            <el-col :span="4"><b>域名状态：</b></el-col>
            <el-col :span="4"
                    v-if="current_domain_name_details_dict.domain_status == 1">在用</el-col>
            <el-col :span="4"
                    v-if="current_domain_name_details_dict.domain_status == 0">备用</el-col>
            <el-col :span="4"
                    v-if="current_domain_name_details_dict.domain_status == -1">异常</el-col>
            <el-col :span="4"><b>备注：</b></el-col>
            <el-col :span="4"> {{current_domain_name_details_dict.remarks}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-button type="primary"
                       size="small"
                       @click="get_current_domain_name_whois_info(current_domain_name_details_dict.domain_name)"
                       :loading="whois_loading"> {{ whois_loading ? 'loading...' : 'whois查询' }}</el-button>
            <el-button type="primary"
                       size="small"
                       @click="get_current_domain_name_ssl_info(current_domain_name_details_dict.domain_name)"
                       :loading="ssl_loading"> {{ ssl_loading ? 'loading...' : 'ssl查询' }}</el-button>
            <el-button style="float:right;"
                       type="danger"
                       size="small"
                       @click="domain_name_basic_info_delete_click(current_domain_name_details_dict)">删除</el-button>
            <el-button style="float:right;"
                       type="primary"
                       size="small"
                       @click="current_domain_name_basic_info_edit_click(current_domain_name_details_dict)">编辑</el-button>
          </el-row>
        </div>
        <!-- 当前域名whois详情抽屉 -->
        <el-drawer append-to-body
                   :visible.sync="current_domain_name_whois_details_drawer_is_visible">
          <json-viewer :value="current_domain_name_whois_details_data"
                       style="height:700px;overflow:auto;"
                       :expand-depth="5"
                       copyable> </json-viewer>
          <div class="demo-drawer__footer"
               style="float:right;margin:20px">
            <el-button type="primary"
                       @click="current_domain_name_whois_details_drawer_is_visible = false">确定</el-button>
          </div>
        </el-drawer>
        <!-- 当前域名ssl详情抽屉 -->
        <el-drawer append-to-body
                   :visible.sync="current_domain_name_ssl_details_drawer_is_visible">
          <json-viewer :value="current_domain_name_ssl_details_data"
                       style="height:700px;overflow:auto;"
                       :expand-depth="5"
                       copyable> </json-viewer>
          <div class="demo-drawer__footer"
               style="float:right;margin:20px">
            <el-button type="primary"
                       @click="current_domain_name_ssl_details_drawer_is_visible = false">确定</el-button>
          </div>
        </el-drawer>
        <!-- 当前域名基本信息编辑抽屉 -->
        <el-drawer title="更新域名基本信息"
                   append-to-body
                   :visible.sync="current_domain_name_basic_info_edit_drawer_is_visible">
          <div style="margin:20px">
            <el-form label-suffix=":"
                     label-position="right"
                     label-width="100px"
                     v-model="current_domain_name_basic_info_edit_form">
              <!-- 域名 -->
              <el-form-item label="域名"

                            prop="domain_name">
                <el-input v-model.trim="current_domain_name_basic_info_edit_form.domain_name"
                          disabled
                          placeholder="域名" />
              </el-form-item>

              <!-- 域名托管商 -->
              <el-form-item label="域名托管商"
                            prop="registar">
                <el-select v-model="current_domain_name_basic_info_edit_form.registar"
                           clearable
                           filterable
                           placeholder="请选择">
                  <el-option v-for="item in tgs_cloud_vendor_options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <!-- 域名解析商 -->
              <el-form-item label="域名解析商"
                            prop="resolver">
                <el-select v-model="current_domain_name_basic_info_edit_form.resolver"
                           clearable
                           filterable
                           placeholder="请选择">
                  <el-option v-for="item in dns_cloud_vendor_options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 是否备案 -->
              <el-form-item label="是否备案"
                            prop="is_beian">
                <el-select v-model="current_domain_name_basic_info_edit_form.is_beian"
                           placeholder="请选择"
                           clearable
                           filterable
                           allow-create>
                  <el-option label="是"
                             :value="1"></el-option>
                  <el-option label="否"
                             :value="0"></el-option>
                </el-select>
              </el-form-item>
              <!-- 项目 -->
              <el-form-item label="项目"
                            prop="project">
                <el-select v-model="current_domain_name_basic_info_edit_form.project"
                           placeholder="请选择"
                           clearable
                           filterable
                           allow-create>
                  <el-option v-for="(value,key,index) in project_dict"
                             :key="index"
                             :label="value"
                             :value="key">
                  </el-option>
                </el-select>
              </el-form-item>

              <!-- 环境 -->
              <el-form-item label="环境"
                            prop="domain_env">
                <el-select v-model="current_domain_name_basic_info_edit_form.domain_env"
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

              <!-- 所属业务 -->
              <el-form-item label="业务"
                            prop="business">
                <el-select v-model="current_domain_name_basic_info_edit_form.business"
                           clearable
                           filterable
                           placeholder="请选择">
                  <el-option v-for="item in business_options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 业务类型 -->
              <el-form-item label="业务类型"
                            prop="domain_status">
                <el-select v-model="current_domain_name_basic_info_edit_form.business_type"
                           placeholder="业务类型"
                           clearable
                           filterable
                           allow-create>
                  <el-option label="前端"
                             value="前端"></el-option>
                  <el-option label="后端"
                             value="后端"></el-option>
                </el-select>
              </el-form-item>
              <!-- 域名状态 -->
              <el-form-item label="域名状态"
                            prop="domain_status">
                <el-select v-model="current_domain_name_basic_info_edit_form.domain_status"
                           placeholder="域名状态"
                           clearable
                           filterable
                           allow-create>
                  <el-option label="在用"
                             :value="1"></el-option>
                  <el-option label="备用"
                             :value="0"></el-option>
                  <el-option label="异常"
                             :value="-1"></el-option>
                </el-select>
              </el-form-item>

              <!-- 备注 -->
              <el-form-item label="备注"
                            prop="remarks">
                <el-input v-model.trim="current_domain_name_basic_info_edit_form.remarks"
                          placeholder="备注" />
              </el-form-item>
            </el-form>
            <div slot="footer"
                 style="float:right;">
              <el-button @click="current_domain_name_basic_info_edit_drawer_is_visible = false">取 消</el-button>
              <el-button type="primary"
                         @click="current_domain_name_basic_info_edit_submit">提交修改</el-button>
            </div>
          </div>
        </el-drawer>
        <el-divider></el-divider>
        <!-- 当前域名dns解析详情表格 -->
        <h1 style="margin:0px;">域名当前解析记录：
          <el-button size="mini"
                     type="success"
                     icon="el-icon-refresh"
                     circle
                     @click="get_current_domain_name_dns_record_table_data({domain_name:current_domain_name_details_dict.domain_name,resolver:current_domain_name_details_dict.resolver})">
          </el-button>
        </h1>
        <!-- 阿里云 -->
        <el-table v-if="current_domain_name_resolver.includes('aliyun')"
                  :data="current_domain_name_dns_record_table_data"
                  :key="current_domain_name_dns_record_table_data_key"
                  border
                  size="mini"
                  fit>
          <el-table-column prop="RR"
                           label="主机记录"
                           align="center">
          </el-table-column>
          <el-table-column prop="Type"
                           label="记录类型"
                           align="center">
          </el-table-column>
          <el-table-column prop="Line"
                           label="解析线路"
                           align="center">
          </el-table-column>
          <el-table-column prop="Value"
                           label="记录值"
                           align="center"
                           width="300px">
          </el-table-column>
          <el-table-column prop="TTL"
                           label="TTL"
                           align="center">
          </el-table-column>
          <el-table-column prop="Status"
                           label="状态"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           align="center"
                           width="100px">
            <template slot-scope="scope">
              <el-link type="primary"
                       @click="current_domain_name_dns_record_edit_click(scope.row)">修改</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger"
                       :disabled="current_domain_name_dns_record_delete_click_disabled"
                       @click="current_domain_name_dns_record_delete_click(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 腾讯云 -->
        <el-table v-else-if="current_domain_name_resolver.includes('tencent')"
                  :data="current_domain_name_dns_record_table_data"
                  :key="current_domain_name_dns_record_table_data_key"
                  border
                  size="mini"
                  fit>
          <el-table-column prop="Name"
                           label="主机记录"
                           align="center">

          </el-table-column>
          <el-table-column prop="Type"
                           label="记录类型"
                           align="center">
          </el-table-column>
          <el-table-column prop="Line"
                           label="解析线路"
                           align="center">
          </el-table-column>
          <el-table-column prop="Value"
                           label="记录值"
                           align="center"
                           width="300px">
          </el-table-column>
          <el-table-column prop="TTL"
                           label="TTL"
                           align="center">
          </el-table-column>
          <el-table-column prop="Status"
                           label="状态"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           align="center"
                           width="100px">
            <template slot-scope="scope">
              <el-link type="primary"
                       @click="current_domain_name_dns_record_edit_click(scope.row)">修改</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger"
                       :disabled="current_domain_name_dns_record_delete_click_disabled"
                       @click="current_domain_name_dns_record_delete_click(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 华为云 -->
        <el-table v-else-if="current_domain_name_resolver.includes('hwc')"
                  :data="current_domain_name_dns_record_table_data"
                  :key="current_domain_name_dns_record_table_data_key"
                  border
                  size="mini"
                  fit>
          <el-table-column prop="name"
                           label="域名"
                           align="center">
          </el-table-column>
          <el-table-column prop="type"
                           label="记录类型"
                           align="center">
          </el-table-column>
          <el-table-column prop="line"
                           label="解析线路">
          </el-table-column> 
          <el-table-column label="记录值"
                           align="center"
                           width="300px">
            <template slot-scope="scope">
              {{scope.row.records}}
            </template>
          </el-table-column>
          <el-table-column prop="ttl"
                           label="TTL"
                           align="center">
          </el-table-column>
          <el-table-column prop="status"
                           label="状态"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           align="center"
                           width="100px">
            <template slot-scope="scope">
              <el-link type="primary"
                       @click="current_domain_name_dns_record_edit_click(scope.row)">修改</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger"
                       :disabled="current_domain_name_dns_record_delete_click_disabled"
                       @click="current_domain_name_dns_record_delete_click(scope.row)">删除</el-link>
            </template>
          </el-table-column>

        </el-table>
        <!-- Name.com -->
        <el-table v-else-if="current_domain_name_resolver.includes('Name.com')"
                  :data="current_domain_name_dns_record_table_data"
                  :key="current_domain_name_dns_record_table_data_key"
                  border
                  size="mini"
                  fit>
          <el-table-column prop="host"
                           label="主机记录"
                           align="center">
          </el-table-column>
          <el-table-column prop="type"
                           label="记录类型"
                           align="center">
          </el-table-column>
          <!-- <el-table-column prop="Line"
                           label="解析线路">
          </el-table-column> -->
          <el-table-column prop="answer"
                           label="记录值"
                           align="center"
                           width="300px">
          </el-table-column>
          <el-table-column prop="ttl"
                           label="TTL"
                           align="center">
          </el-table-column>

          <el-table-column label="操作"
                           align="center"
                           width="100px">
            <template slot-scope="scope">
              <el-link type="primary"
                       @click="current_domain_name_dns_record_edit_click(scope.row)">修改</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger"
                       :disabled="current_domain_name_dns_record_delete_click_disabled"
                       @click="current_domain_name_dns_record_delete_click(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- GoDaddy -->
        <el-table v-else-if="current_domain_name_resolver.includes('GoDaddy')"
                  :data="current_domain_name_dns_record_table_data"
                  :key="current_domain_name_dns_record_table_data_key"
                  border
                  size="mini"
                  fit>
          <el-table-column prop="name"
                           label="主机记录"
                           align="center">
          </el-table-column>
          <el-table-column prop="type"
                           label="记录类型"
                           align="center">
          </el-table-column>
          <!-- <el-table-column prop="Line"
                           label="解析线路">
          </el-table-column> -->
          <el-table-column prop="data"
                           label="记录值"
                           align="center">
          </el-table-column>
          <el-table-column prop="ttl"
                           label="TTL"
                           align="center">
          </el-table-column>
          <!-- <el-table-column prop="Status"
                           label="状态">
          </el-table-column> -->

          <el-table-column label="操作"
                           align="center"
                           width="100px">
            <template slot-scope="scope">
              <el-link type="primary"
                       @click="current_domain_name_dns_record_edit_click(scope.row)">修改</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger"
                       :disabled="current_domain_name_dns_record_delete_click_disabled"
                       @click="current_domain_name_dns_record_delete_click(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-divider></el-divider>
        <!-- 当前域名备用解析记录详情 -->
        <div style="display:flex;justify-content:space-between;">
          <h1 style="margin:0px;">CDN/云厂商解析记录大全：</h1>
          <el-button type="primary"
                     size="small"
                     @click="current_domain_name_backup_dns_record_addnew_click(current_domain_name_details_dict.domain_name)">添加新记录</el-button>
        </div>
        <!--  当前域名备用解析记录详情表格-->
        <el-table :data="current_domain_name_backup_dns_record_table_data"
                  border
                  size="mini"
                  fit>
          <el-table-column prop="cdn_vendor"
                           align="center"
                           width="100px"
                           label="CDN/云厂商">
          </el-table-column>

          <el-table-column prop="resolve_type"
                           align="center"
                           width="80px"
                           label="解析类型">
          </el-table-column>

          <el-table-column align="center"
                           label="解析记录"
                           width="300px">
            <template slot-scope="scope">
              <span v-if="JSON.stringify(current_domain_name_dns_record_table_data).includes(scope.row.resolve_record)"
                    style="color:#01DF01">{{scope.row.resolve_record}}</span>
              <span v-else>{{scope.row.resolve_record}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="source_type"
                           align="center"
                           width="80px"
                           label="源站类型">
            <template slot-scope="scope">
              <span v-if="scope.row.source_type == 1">真实源</span>
              <span v-if="scope.row.source_type == 0">伪装源</span>
              <span v-if="scope.row.source_type == -1"></span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks"
                           align="center"
                           label="备注">
          </el-table-column>
          <el-table-column label="操作"
                           align="center"
                           width="300">
            <template slot-scope="scope">
              <el-link type="primary"
                       :underline="false"
                       @click="current_domain_name_backup_dns_record_edit_click(scope.row)">编辑</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger"
                       :underline="false"
                       @click="current_domain_name_backup_dns_record_delete_click(scope.row)">删除</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="primary"
                       :underline="false"
                       :disabled="current_domain_name_details_dict.business_type === '后端'|| scope.row.resolve_type =='A记录' || JSON.stringify(scope.row.cdn_vendor).includes('GTM') || JSON.stringify(scope.row.cdn_vendor).includes('WAF')"
                       @click="cdn_refresh_click(scope.$index, scope.row)">CDN缓存刷新</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="primary"
                       :underline="false"
                       :disabled="scope.row.resolve_type !=='CNAME'"
                       @click="cdn_sources_config_read(scope.row)"
                       :loading="scope.row.cdn_sources_config_loading"> {{ scope.row.cdn_sources_config_loading ? 'loading...' : '查看源站配置' }}</el-link>

            </template>
          </el-table-column>
        </el-table>
        <el-divider></el-divider>
        <!-- 当前域名历史操作日志查询 -->
        <h1 style="margin:0px;">域名操作历史记录(最近5条)：</h1>
        <el-table :data="current_domain_name_opetation_history_record_table_data"
                  border
                  size="mini"
                  fit>
          <el-table-column prop="details"
                           align="left"
                           label="域名操作详情">
          </el-table-column>
          <el-table-column prop="operate_people"
                           align="center"
                           width="100px"
                           label="操作人">
          </el-table-column>
          <el-table-column prop="operate_time"
                           align="center"
                           width="150px"
                           label="操作时间">
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <!-- 修改当前域名dns解析记录抽屉 -->
    <el-drawer title="修改域名dns解析"
               :append-to-body="true"
               :visible.sync="current_domain_name_dns_record_edit_drawer_is_visible">
      <div style="margin:20px">
        <!-- 阿里云 -->
        <el-form v-if="current_domain_name_resolver.includes('aliyun')"
                 label-position="top"
                 label-suffix=":"
                 :model="current_domain_name_dns_record_edit_form"
                 class="demo-form-inline">
          <!-- 主机记录 -->
          <el-form-item label="主机记录"
                        prop="RR">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.RR"
                      disabled
                      placeholder="主机记录" />
          </el-form-item>
          <!-- 记录类型 -->
          <el-form-item label="记录类型"
                        prop="Type">
            <el-select v-model="current_domain_name_dns_record_edit_form.Type"
                       placeholder="请选择"
                       clearable
                       filterable
                       allow-create>
              <el-option label="A"
                         value="A"></el-option>
              <el-option label="CNAME"
                         value="CNAME"></el-option>
            </el-select>
          </el-form-item>
          <!-- 解析线路 -->
          <el-form-item label="解析线路"
                        prop="Line">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.Line"
                      disabled
                      placeholder="解析线路" />
          </el-form-item>
          <!-- 记录值 -->
          <el-form-item label="记录值"
                        prop="Value">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.Value"
                      placeholder="记录值" />
          </el-form-item>
          <!-- TTL -->
          <el-form-item label="TTL"
                        prop="TTL">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.TTL"
                      disabled
                      placeholder="TTL" />
          </el-form-item>
          <!-- 状态 -->
          <el-form-item label="状态"
                        prop="Status">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.Status"
                      disabled
                      placeholder="Status" />
          </el-form-item>
        </el-form>
        <!-- 腾讯云 -->
        <el-form v-if="current_domain_name_resolver.includes('tencent')"
                 label-position="top"
                 label-suffix=":"
                 v-model="current_domain_name_dns_record_edit_form"
                 class="demo-form-inline">
          <!-- 主机记录 -->
          <el-form-item label="主机记录"
                        prop="Name">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.Name"
                      disabled
                      placeholder="主机记录" />
          </el-form-item>
          <!-- 记录类型 -->
          <el-form-item label="记录类型"
                        prop="Type">
            <el-select v-model="current_domain_name_dns_record_edit_form.Type"
                       placeholder="请选择"
                       clearable
                       filterable
                       allow-create>
              <el-option label="A"
                         value="A"></el-option>
              <el-option label="CNAME"
                         value="CNAME"></el-option>
            </el-select>
          </el-form-item>
          <!-- 解析线路 -->
          <el-form-item label="解析线路"
                        prop="Line">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.Line"
                      disabled
                      placeholder="解析线路" />
          </el-form-item>
          <!-- 记录值 -->
          <el-form-item label="记录值"
                        prop="Value">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.Value"
                      placeholder="记录值" />
          </el-form-item>
          <!-- TTL -->
          <el-form-item label="TTL"
                        prop="TTL">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.TTL"
                      disabled
                      placeholder="TTL" />
          </el-form-item>
          <!-- 状态 -->
          <el-form-item label="状态"
                        prop="Status">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.Status"
                      disabled
                      placeholder="Status" />
          </el-form-item>
        </el-form>
        <!-- 华为云-->
        <el-form v-if="current_domain_name_resolver.includes('hwc')"
                 label-position="top"
                 label-suffix=":"
                 v-model="current_domain_name_dns_record_edit_form"
                 class="demo-form-inline">
          <!-- 主机记录 -->
          <el-form-item label="域名"
                        prop="name">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.name"
                      disabled
                      placeholder="主机记录" />
          </el-form-item>
          <!-- 记录类型 -->
          <el-form-item label="记录类型"
                        prop="type">
            <el-select v-model="current_domain_name_dns_record_edit_form.type"
                       placeholder="请选择"
                       clearable
                       filterable
                       allow-create>
              <el-option label="A"
                         value="A"></el-option>
              <el-option label="CNAME"
                         value="CNAME"></el-option>
            </el-select>
          </el-form-item>
          <!-- 解析线路 -->
          <!-- <el-form-item label="解析线路"
                        prop="Line">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.Line"
                      disabled
                      placeholder="解析线路" />
          </el-form-item> -->
          <!-- 记录值 -->
          <el-form-item label="记录值"
                        prop="records">
            <el-input type="textarea"
                      v-model="current_domain_name_dns_record_edit_form.records"
                      placeholder="记录值" />
          </el-form-item>
          <!-- TTL -->
          <el-form-item label="TTL"
                        prop="ttl">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.ttl"
                      disabled
                      placeholder="TTL" />
          </el-form-item>
          <!-- 状态 -->
          <el-form-item label="状态"
                        prop="status">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.status"
                      disabled
                      placeholder="Status" />
          </el-form-item>
        </el-form>
        <!-- Name.com-->
        <el-form v-if="current_domain_name_resolver.includes('Name.com')"
                 label-position="top"
                 label-suffix=":"
                 v-model="current_domain_name_dns_record_edit_form"
                 class="demo-form-inline">
          <!-- 主机记录 -->
          <el-form-item label="主机记录"
                        prop="host">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.host"
                      disabled
                      placeholder="主机记录" />
          </el-form-item>
          <!-- 记录类型 -->
          <el-form-item label="记录类型"
                        prop="type">
            <el-select v-model="current_domain_name_dns_record_edit_form.type"
                       placeholder="请选择"
                       clearable
                       filterable
                       allow-create>
              <el-option label="A"
                         value="A"></el-option>
              <el-option label="CNAME"
                         value="CNAME"></el-option>
            </el-select>
          </el-form-item>
          <!-- 解析线路 -->
          <!-- <el-form-item label="解析线路"
                        prop="Line">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.Line"
                      disabled
                      placeholder="解析线路" />
          </el-form-item> -->
          <!-- 记录值 -->
          <el-form-item label="记录值"
                        prop="answer">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.answer"
                      placeholder="记录值" />
          </el-form-item>
          <!-- TTL -->
          <el-form-item label="TTL"
                        prop="ttl">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.ttl"
                      disabled
                      placeholder="TTL" />
          </el-form-item>
          <!-- 状态 -->
          <!-- <el-form-item label="状态"
                        prop="status">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.status"
                      disabled
                      placeholder="Status" />
          </el-form-item> -->
        </el-form>
        <!-- GoDaddy-->
        <el-form v-if="current_domain_name_resolver.includes('GoDaddy')"
                 label-position="top"
                 label-suffix=":"
                 v-model="current_domain_name_dns_record_edit_form"
                 class="demo-form-inline">
          <!-- 主机记录 -->
          <el-form-item label="主机记录"
                        prop="name">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.name"
                      disabled
                      placeholder="主机记录" />
          </el-form-item>
          <!-- 记录类型 -->
          <el-form-item label="记录类型"
                        prop="type">
            <el-select v-model="current_domain_name_dns_record_edit_form.type"
                       disabled
                       placeholder="请选择"
                       clearable
                       filterable
                       allow-create>
              <el-option label="A"
                         value="A"></el-option>
              <el-option label="CNAME"
                         value="CNAME"></el-option>
            </el-select>
          </el-form-item>
          <!-- 解析线路 -->
          <!-- <el-form-item label="解析线路"
                        prop="Line">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.Line"
                      disabled
                      placeholder="解析线路" />
          </el-form-item> -->
          <!-- 记录值 -->
          <el-form-item label="记录值"
                        prop="data">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.data"
                      placeholder="记录值" />
          </el-form-item>
          <!-- TTL -->
          <el-form-item label="TTL"
                        prop="ttl">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.ttl"
                      disabled
                      placeholder="TTL" />
          </el-form-item>
          <!-- 状态 -->
          <!-- <el-form-item label="状态"
                        prop="status">
            <el-input v-model.trim="current_domain_name_dns_record_edit_form.status"
                      disabled
                      placeholder="Status" />
          </el-form-item> -->
        </el-form>

        <div class="demo-drawer__footer"
             style="float:right;">
          <el-button @click="current_domain_name_dns_record_edit_drawer_is_visible =false">取 消</el-button>
          <el-button type="primary"
                         :disabled="current_domain_name_dns_record_add_click_disabled"
                         @click="current_domain_name_basic_info_add_submit">A记录添加</el-button>
          <el-button type="primary"
                     @click="current_domain_name_dns_record_edit_submit">提交修改</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 添加域名备用解析记录抽屉 -->
    <el-drawer title="添加新解析记录"
               :append-to-body="true"
               :visible.sync="current_domain_name_backup_dns_record_addnew_drawer_is_visible">
      <div style="margin:20px">
        <el-form label-suffix=":"
                 label-position="top"
                 :model="current_domain_name_backup_dns_record_addnew_form"
                 class="demo-form-inline">
          <!-- 域名 -->
          <el-form-item label="域名"
                        prop="domain_name">
            <el-input v-model.trim="current_domain_name_backup_dns_record_addnew_form.domain_name"
                      disabled
                      placeholder="域名" />
          </el-form-item>

          <!-- CDN/云厂商 -->
          <el-form-item label="CDN/云厂商"
                        prop="cdn_vendor">
            <el-select v-model="current_domain_name_backup_dns_record_addnew_form.cdn_vendor"
                       clearable
                       filterable
                       placeholder="请选择">
              <el-option v-for="item in cdn_cloud_vendor_options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 域名解析商 -->
          <el-form-item label="解析类型"
                        prop="resolve_type">
            <el-select v-model="current_domain_name_backup_dns_record_addnew_form.resolve_type"
                       placeholder="请选择"
                       clearable
                       filterable
                       allow-create>
              <el-option label="A记录"
                         value="A记录"></el-option>
              <el-option label="CNAME"
                         value="CNAME"></el-option>
            </el-select>
          </el-form-item>
          <!-- 解析记录值 -->
          <el-form-item label="解析记录值"
                        prop="resolve_record">
            <el-input v-model.trim="current_domain_name_backup_dns_record_addnew_form.resolve_record"
                      placeholder="解析记录值" />
          </el-form-item>
          <!-- 源站类型 -->
          <el-form-item label="源站类型"
                        v-show="current_domain_name_backup_dns_record_addnew_form.resolve_type =='CNAME'"
                        prop="source_type">
            <el-select v-model="current_domain_name_backup_dns_record_addnew_form.source_type"
                       placeholder="请选择"
                       clearable
                       filterable
                       allow-create>
              <el-option label="真实源"
                         :value="1"></el-option>
              <el-option label="伪装源"
                         :value="0"></el-option>
            </el-select>
          </el-form-item>
          <!-- 备注 -->
          <el-form-item label="备注"
                        prop="remarks">
            <el-input v-model.trim="current_domain_name_backup_dns_record_addnew_form.remarks"
                      placeholder="备注" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer"
             style="float:right;">
          <el-button @click="current_domain_name_backup_dns_record_addnew_drawer_is_visible =false">取 消</el-button>
          <el-button type="primary"
                     @click="current_domain_name_backup_dns_record_addnew_submit">提交</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 修改域名备用解析记录抽屉 -->
    <el-drawer title="编辑域名解析记录"
               :append-to-body="true"
               :visible.sync="current_domain_name_backup_dns_record_edit_drawer_is_visible">
      <div style="margin:20px">
        <el-form label-position="top"
                 label-suffix=":"
                 v-model="current_domain_name_backup_dns_record_edit_form"
                 class="demo-form-inline">
          <!-- 域名 -->
          <el-form-item label="域名"
                        prop="domain_name">
            <el-input v-model.trim="current_domain_name_backup_dns_record_edit_form.domain_name"
                      disabled
                      placeholder="域名" />
          </el-form-item>

          <!-- CDN/云厂商 -->
          <el-form-item label="CDN/云厂商"
                        prop="cdn_vendor">
            <el-select v-model="current_domain_name_backup_dns_record_edit_form.cdn_vendor"
                       clearable
                       filterable
                       placeholder="请选择">
              <el-option v-for="item in cdn_cloud_vendor_options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 域名解析商 -->
          <el-form-item label="解析类型"
                        prop="resolve_type">
            <el-select v-model="current_domain_name_backup_dns_record_edit_form.resolve_type"
                       placeholder="请选择"
                       disabled
                       clearable
                       filterable
                       allow-create>
              <el-option label="A记录"
                         value="A记录"></el-option>
              <el-option label="CNAME"
                         value="CNAME"></el-option>
            </el-select>
          </el-form-item>
          <!-- 解析记录值 -->
          <el-form-item label="解析记录值"
                        prop="resolve_record">
            <el-input v-model.trim="current_domain_name_backup_dns_record_edit_form.resolve_record"
                      disabled
                      placeholder="解析记录值" />
          </el-form-item>
          <!-- 源站类型 -->
          <el-form-item label="源站类型"
                        v-show="current_domain_name_backup_dns_record_edit_form.resolve_type =='CNAME'"
                        prop="source_type">
            <el-select v-model="current_domain_name_backup_dns_record_edit_form.source_type"
                       placeholder="请选择"
                       clearable
                       filterable
                       allow-create>
              <el-option label="真实源"
                         :value="1"></el-option>
              <el-option label="伪装源"
                         :value="0"></el-option>

            </el-select>
          </el-form-item>
          <!-- 备注 -->
          <el-form-item label="备注"
                        prop="remarks">
            <el-input v-model.trim="current_domain_name_backup_dns_record_edit_form.remarks"
                      placeholder="备注" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer"
             style="float:right;">
          <el-button @click="current_domain_name_backup_dns_record_edit_drawer_is_visible = false">取 消</el-button>
          <el-button type="primary"
                     @click="current_domain_name_backup_dns_record_edit_submit">提交</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 刷新cdn抽屉 -->
    <el-drawer title="CDN缓存刷新"
               :append-to-body="true"
               :visible.sync="cdn_refresh_drawer_is_visible">
      <div style="margin:20px">
        <el-form label-position="top"
                 label-suffix=":"
                 v-model="cdn_refresh_form"
                 class="demo-form-inline">
          <!-- 刷新URL -->
          <el-form-item label="刷新URL"
                        prop="domain_name">
            <el-input v-model="cdn_refresh_form.domain_name"
                      disabled>
              <template slot="prepend">https://</template>
            </el-input>
          </el-form-item>
          <!-- cdn厂商 -->
          <el-form-item label="cdn厂商"
                        prop="cdn_vendor">
            <el-input v-model="cdn_refresh_form.cdn_vendor"
                      disabled>
            </el-input>
          </el-form-item>
          <!-- 刷新目录 -->
          <el-form-item label="刷新目录"
                        prop="uri">
            <el-select v-model="cdn_refresh_form.uri"
                       :disabled="current_domain_name_details_dict.business !== 'cocos'"
                       placeholder="请选择"
                       clearable
                       filterable
                       allow-create>
              <el-option label="全站刷新"
                         value="/"></el-option>
              <el-option v-if="current_domain_name_details_dict.business == 'cocos'"
                         label="/dy/"
                         value="/dy/"></el-option>
              <el-option v-if="current_domain_name_details_dict.business == 'cocos'"
                         label="/u3d/"
                         value="/u3d/"></el-option>
              <el-option v-if="current_domain_name_details_dict.business == 'cocos'"
                         label="/src/assest/"
                         value="/src/assest/"></el-option>
              <el-option v-if="current_domain_name_details_dict.business == 'cocos'"
                         label="/wjbz/"
                         value="/wjbz/"></el-option> 
              <el-option v-if="current_domain_name_details_dict.business == 'cocos'"
                         label="/bwjl/"
                         value="/bwjl/"></el-option> 
            </el-select>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer"
             style="float:right;">
          <el-button @click="cdn_refresh_drawer_is_visible=false">取 消</el-button>
          <el-button type="primary"
                     :loading="isloading"
                     @click="cdn_refresh_submit">{{isloading ? '刷新中' : '立即刷新'}}</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- cdn源站信息抽屉 -->
    <el-drawer title="CDN源站配置"
               :append-to-body="true"
               :visible.sync="cdn_sources_config_drawer_is_visible">
      <div style="margin-left:20px">
        <json-viewer :value="cdn_sources_config_table_data"
                     style="height:700px;overflow:auto;"
                     :expand-depth="5"
                     copyable> </json-viewer>
        <div class="demo-drawer__footer"
             style="float:right;margin-right:20px">

          <el-button type="primary"
                     @click="cdn_sources_config_drawer_is_visible = false">确定</el-button>

        </div>
      </div>

    </el-drawer>
  </div>
</template>

<script>
import Domaininfo from './Domaininfo.js'
export default {
  ...Domaininfo
}
</script>

<style lang="less" scoped>
/deep/ :focus {
  outline: 0;
}
</style>

<style scoped>
.el-table >>> .success-row {
  background: #0cff04;
}
</style>