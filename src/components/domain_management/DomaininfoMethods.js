
export default {
		 // 获取cdn厂商下拉框选项
     get_project_options(){
      const url = this.http_url
        this.$http.post(url + '/project_info/read').then(res =>{
          let project_list = res.data.msg
          for (var i=0; i<project_list.length; i++){
            this.project_dict[project_list[i]['value']] = project_list[i]['label']
          }
        }).catch(error=>{console.log(error)})
    },

		 // 获取托管商厂商下拉框选项
    get_tgs_cloud_vendor_options(){
      const url = this.http_url
        this.$http.post(url + '/cloud_vendor_info_tgs/read').then(res =>{this.tgs_cloud_vendor_options = res.data.msg}).catch(error=>{console.log(error)})
    },
        // 获取解析商厂商下拉框选项
    get_dns_cloud_vendor_options(){
      const url = this.http_url
        this.$http.post(url + '/cloud_vendor_info_dns/read').then(res =>{this.dns_cloud_vendor_options = res.data.msg}).catch(error=>{console.log(error)})
    },
        // 获取cdn厂商下拉框选项
    get_cdn_cloud_vendor_options(){
      const url = this.http_url
        this.$http.post(url + '/cloud_vendor_info_cdn/read').then(res =>{this.cdn_cloud_vendor_options = res.data.msg}).catch(error=>{console.log(error)})
    },

    // 获取业务下拉框选项
    get_business_options(){
      const url = this.http_url
        this.$http.post(url + '/business_summary_info/read').then(res =>{this.business_options = res.data.msg}).catch(error=>{console.log(error)})
    },
		//获取域名基本信息表格数据
		async domain_name_basic_info_read_submit(params){
			this.domain_name_basic_info_table_data = []
      let query_params = JSON.parse(JSON.stringify(params))
      for (var key in query_params){
				if (query_params[key] === ''){
					delete query_params[key]
				}
			}
      const url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        url + '/domain_name/basic_info/read',
        query_params)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.domain_name_basic_info_table_data = res.msg
      this.batches_table_data.domains = res.msg
      this.batches_can_medit_table = false
		},
    // 新增域名及基本信息
    domain_name_basic_info_addnew_submit(ref_name){
      this.$refs[ref_name].validate( async(valid)=>{
        if (!valid){return false}
        let params = this.domain_name_basic_info_addnew_form
        params.current_user = window.localStorage.getItem('current_user')
      const url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        url + '/domain_name/basic_info/create',
        params)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.domain_name_basic_info_addnew_dialog_is_visible = false
      this.domain_name_basic_info_read_submit(this.domain_name_basic_info_form)
      })
      },
    // 域名基本信息删除
		domain_name_basic_info_delete_click(current_domain_name_details_dict){
			this.$confirm("将删除该域名的所有相关信息", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.isReadOnly = true
        let params = current_domain_name_details_dict
        params.current_user = window.localStorage.getItem('current_user')
        const url = this.http_url
        const {
          data: res
        } = await this.$http.post(
          url + '/domain_name/basic_info/delete',
          params)
        if (res.code !== 200) {
          this.isReadOnly = false
          return this.$message.error(res.msg)
        }
        this.$message.success(res.msg)
        this.isReadOnly = false
        this.domain_name_basic_info_read_submit(this.domain_name_basic_info_form)
        this.get_current_domain_name_opetation_history_record_table_data()
        this.current_domain_name_details_drawer_is_visible = false
      }).catch(() => { })
		},
		// 跳转到阿里云域名质量检测网站
		domain_name_basic_info_doman_check_click(row){
      let domain_env = row.domain_env
      let project = row.project

      let var_target = row.domain_name
      let var_env = ''
  
      if (domain_env =='test'){
        var_env = 'idc-test'
      }else{  
        if (project == 'boya'){
          var_env = `${domain_env}-v2`
        }
        else if(project == 'dy') {
          var_env = `${domain_env}dy`
        }
        else{
          var_env = domain_env
        }
      }
      let url = `http://grafanabak.idc.com/d/xtkCtBkii/prometheus-blackbox-exporter?orgId=1&refresh=10s&from=now-1h&to=now&var-env=${var_env}&var-target=${var_target}&var-location=All&var-cdn=All&var-interval=10s&var-response_time=0`
			window.open(url, '_blank')
		},
    // 点击域名，打开右侧抽屉：域名详情
		 async current_domain_name_click (row) {
      if (this.current_domain_name_details_dict.domain_name !==row.domain_name){
        this.current_domain_name_details_dict = JSON.parse(JSON.stringify(row))
        this.current_domain_name_resolver =JSON.parse(JSON.stringify(this.current_domain_name_details_dict.resolver))
        this.current_domain_name = JSON.parse(JSON.stringify(this.current_domain_name_details_dict.domain_name))
        let params = {
          domain_name: row.domain_name,
          resolver: row.resolver,
        }
        await this.get_current_domain_name_backup_dns_record_table_data(params)
        await this.get_current_domain_name_opetation_history_record_table_data()
        this.current_domain_name_details_drawer_is_visible = true
        await this.get_current_domain_name_dns_record_table_data(params)

        
      }else{
        this.current_domain_name_details_drawer_is_visible = true
      }
      
    },
		// 点击当前域名基本信息编辑按钮
		current_domain_name_basic_info_edit_click(current_domain_name_details_dict){
			this.current_domain_name_basic_info_edit_drawer_is_visible = true
      this.current_domain_name_basic_info_edit_form = JSON.parse(JSON.stringify(current_domain_name_details_dict))
		},
		// 提交当前域名基本信息修改
		async current_domain_name_basic_info_edit_submit(){
			let params = this.current_domain_name_basic_info_edit_form
      params.current_user = window.localStorage.getItem('current_user')
      const url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        url + '/domain_name/basic_info/update',
        params)
      if (res.code !== 200) {
        this.current_domain_name_basic_info_edit_drawer_is_visible = false
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
      this.current_domain_name_basic_info_edit_drawer_is_visible = false
      this.current_domain_name_details_dict = this.current_domain_name_basic_info_edit_form
      this.domain_name_basic_info_read_submit(this.domain_name_basic_info_form)
      this.get_current_domain_name_opetation_history_record_table_data()
		},
		// 获取当前dns解析详情数据
		async get_current_domain_name_dns_record_table_data(params){
      this.current_domain_name_dns_record_table_data = []
			const url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        url + '/domain_name/dns/record/read',
        params)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.current_domain_name_dns_record_delete_click_disabled = res.can_delete
      this.current_domain_name_dns_record_add_click_disabled = res.can_add
      this.current_domain_name_dns_record_table_data = res.msg
      console.log(this.current_domain_name_dns_record_table_data)
      this.current_domain_name_dns_record_table_data_key = Math.random()
		},
		// 获取备用dns解析表格数据
		async get_current_domain_name_backup_dns_record_table_data(params){
			const url = this.http_url
      const {data:res} = await this.$http.get(
        url + '/domain_name/dns/backup/read',
        { params })
        if (res.code !== 200) return this.$message.error(res.msg)
        this.current_domain_name_backup_dns_record_table_data = res.msg 
		},
    	// 获取当前域名操作历史记录，最近5条
		async get_current_domain_name_opetation_history_record_table_data(){
      // 定义变量，获取最近5条操作记录
      let limit_num =5
      // 请求body
      let params = {
        domain_name: this.current_domain_name
      }
			const url = this.http_url
      const {data:res} = await this.$http.post(
        url + `/history/read/${limit_num}`,
        params)
        console.log(res.msg)
        if (res.code !== 200) return this.$message.error(res.msg)
        this.current_domain_name_opetation_history_record_table_data = res.msg 
		},
    // 获取域名whois信息
    async get_current_domain_name_whois_info(domain_name){
      this.whois_loading = true
      this.current_domain_name_whois_details_data ={}
      let params ={domain_name: domain_name}
      const url = this.http_url
      const { data: res } = await this.$http.get(url + '/domain_name/whois/read', {params})
      if (res.code !== 200){
        this.whois_loading = false
        return this.$message.error(res.msg)
      } 
      this.current_domain_name_whois_details_data = res.msg
      this.current_domain_name_whois_details_drawer_is_visible =true
      this.whois_loading = false
    },
     // 获取域名ssl信息
     async get_current_domain_name_ssl_info(domain_name){
      this.ssl_loading = true
      this.current_domain_name_ssl_details_data ={}
      let params ={domain_name: domain_name}
      const url = this.http_url
      const { data: res } = await this.$http.get(url + '/domain_name/ssl/read', {params})
      if (res.code !== 200) {
        this.ssl_loading = false
        return this.$message.error(res.msg)
      }
      this.current_domain_name_ssl_details_data = res.msg
      this.current_domain_name_ssl_details_drawer_is_visible =true
      this.ssl_loading = false
    },
    // 当前dns解析记录
    // 当前dns解析记录 新增
    current_domain_name_dns_record_addnew_click(){},
    current_domain_name_dns_record_addnew_submit(){},
    // 当前dns解析记录
    current_domain_name_dns_record_edit_click(row){
      console.log(row)
      this.current_domain_name_dns_record_edit_drawer_is_visible =true
      if(this.current_domain_name_resolver.includes('hwc')){
        console.log('hwc')
        let current_domain_name_dns_record_edit_form_hwc = JSON.parse(JSON.stringify(row))
        current_domain_name_dns_record_edit_form_hwc.records = current_domain_name_dns_record_edit_form_hwc.records.join('\n')
        this.current_domain_name_dns_record_edit_form = current_domain_name_dns_record_edit_form_hwc
      }else{
        this.current_domain_name_dns_record_edit_form = JSON.parse(JSON.stringify(row))
      }
      console.log(this.current_domain_name_dns_record_edit_form)
      this.current_domain_name_dns_record_edit_form.resolver = this.current_domain_name_resolver
      this.current_domain_name_dns_record_edit_form.current_doamin_name = this.current_domain_name
    },
    // 当前dns解析记录更新
    async current_domain_name_dns_record_edit_submit(){
      let params = this.current_domain_name_dns_record_edit_form
      params.current_user = window.localStorage.getItem('current_user')
      const url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        url + '/domain_name/dns/record/update',
        params)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success('修改成功')
      this.get_current_domain_name_dns_record_table_data({
        domain_name: this.current_domain_name_details_dict.domain_name,
        resolver: this.current_domain_name_resolver,
      })
      this.current_domain_name_dns_record_edit_drawer_is_visible =false
      this.get_current_domain_name_opetation_history_record_table_data()
    },
    // 当前dns解析记录添加
    async current_domain_name_basic_info_add_submit(){
      let params = this.current_domain_name_dns_record_edit_form
      params.current_user = window.localStorage.getItem('current_user')
      const url = this.http_url
      const {
        data: res
      } = await this.$http.post(
        url + '/domain_name/dns/record/add',
        params)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success('添加成功')
      this.get_current_domain_name_dns_record_table_data({
        domain_name: this.current_domain_name_details_dict.domain_name,
        resolver: this.current_domain_name_resolver,
      })
      this.current_domain_name_dns_record_edit_drawer_is_visible =false
      this.get_current_domain_name_opetation_history_record_table_data()
    },
    // 当前dns解析记录 删除
    current_domain_name_dns_record_delete_click(row){
      
      this.current_domain_name_dns_record_delete_dict = JSON.parse(JSON.stringify(row))
      this.current_domain_name_dns_record_delete_dict.resolver = this.current_domain_name_resolver
      this.current_domain_name_dns_record_delete_dict.current_doamin_name = this.current_domain_name
      this.$confirm("请再次确认？", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ()=>{
         let params = this.current_domain_name_dns_record_delete_dict
      const url = this.http_url
        const {
        data: res
      } = await this.$http.post(
        url + '/domain_name/dns/record/delete',
        params)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success('删除成功')
      this.get_current_domain_name_dns_record_table_data({
        domain_name: this.current_domain_name_details_dict.domain_name,
        resolver: this.current_domain_name_resolver,
      })
      this.current_domain_name_dns_record_edit_drawer_is_visible =false
      }).catch(() => { })     
    },
   
    // 备用dns解析记录
    // 备用dns解析记录 新增
    current_domain_name_backup_dns_record_addnew_click(domain_name){
      this.current_domain_name_backup_dns_record_addnew_drawer_is_visible = true
      this.current_domain_name_backup_dns_record_addnew_form.domain_name = JSON.parse(JSON.stringify(domain_name))
    },
    async current_domain_name_backup_dns_record_addnew_submit(){
      let params = this.current_domain_name_backup_dns_record_addnew_form
      params.current_user = window.localStorage.getItem('current_user')
      if (params.resolve_type == 'A记录'){
        params.source_type = -1
      }
      console.log(params)
      const url = this.http_url
      const { data: res } = await this.$http.post(url + '/domain_name/dns/backup/create', params)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success('添加成功')
      this.current_domain_name_backup_dns_record_addnew_drawer_is_visible = false
      params = {
        domain_name: this.current_domain_name_backup_dns_record_addnew_form.domain_name
      }
      this.get_current_domain_name_backup_dns_record_table_data(params)
      this.get_current_domain_name_opetation_history_record_table_data()
    },
    // 备用dns解析记录 更新
    current_domain_name_backup_dns_record_edit_click(row){
      this.current_domain_name_backup_dns_record_edit_drawer_is_visible = true
      this.current_domain_name_backup_dns_record_edit_form = JSON.parse(JSON.stringify(row))
    },
    async current_domain_name_backup_dns_record_edit_submit(){
      let params = this.current_domain_name_backup_dns_record_edit_form
      params.current_user = window.localStorage.getItem('current_user')
      if (params.resolve_type == 'A记录'){
        params.source_type = -1
      }
      const url = this.http_url
      const { data: res } = await this.$http.post(url + '/domain_name/dns/backup/update', params)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success('修改成功')
      this.current_domain_name_backup_dns_record_edit_drawer_is_visible = false
      params = {
        domain_name: this.current_domain_name_backup_dns_record_edit_form.domain_name
      }
      this.get_current_domain_name_backup_dns_record_table_data(params)
      this.get_current_domain_name_opetation_history_record_table_data()
    },
    // 备用dns解析记录 删除
    current_domain_name_backup_dns_record_delete_click(row){
      this.$confirm("请再次确认？", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.isReadOnly = true
        console.log(row)
        let params = JSON.parse(JSON.stringify(row))
        params.current_user = window.localStorage.getItem('current_user')
        const url = this.http_url
        const {
          data: res
        } = await this.$http.post(
          url + '/domain_name/dns/backup/delete',
          params)
        if (res.code !== 200) {
          this.isReadOnly = false
          return this.$message.error(res.msg)
        }
        this.$message.success(res.msg)
        params = {
          domain_name: row.domain_name
        }
        this.get_current_domain_name_backup_dns_record_table_data(params)
        this.get_current_domain_name_opetation_history_record_table_data()
      }).catch(() => { })
    },

    // cdn刷新
    cdn_refresh_click(index, row){
      this.cdn_refresh_form.uri = '/'
      this.cdn_refresh_drawer_is_visible = true
      this.cdn_refresh_form.project = JSON.parse(JSON.stringify(this.current_domain_name_details_dict.project))
      this.cdn_refresh_form.domain_name = JSON.parse(JSON.stringify(row.domain_name))
      this.cdn_refresh_form.cdn_vendor = JSON.parse(JSON.stringify(row.cdn_vendor))
      this.cdn_refresh_form.business = JSON.parse(JSON.stringify(this.current_domain_name_details_dict.business))
    },
    async cdn_refresh_submit(){
      // this.isloading = true
      let params = {
        current_user: window.localStorage.getItem('current_user'),
        project: this.cdn_refresh_form.project,
        domain_name: this.cdn_refresh_form.domain_name,
        uri: this.cdn_refresh_form.uri,
        cdn_vendor: this.cdn_refresh_form.cdn_vendor
      }
      this.$notify({
        title: '刷新中!',
        message: `https://${params.domain_name}${params.uri}`,
        type: 'success',
        duration: 0,
        showClose: true,
        // position: 'bottom-right'
      })
      const url = this.http_url
      const { data: res } = await this.$http.post(url + '/domain_name/cdn/refresh', params)
      if (res.code !== 200) {
        this.isloading = false
        return this.$notify({
          title: `刷新失败:${res.refresh_url}`,
          message: res.msg,
          type: 'error',
          duration: 0,
          showClose: true,
          // position: 'bottom-right'
        })
      }
      // this.isloading = false
      this.$notify({
        title: res.msg,
        message: res.refresh_url,
        type: 'success',
        duration: 0,
        showClose: true,
        // position: 'bottom-right'
      })
      this.get_current_domain_name_opetation_history_record_table_data()
    },

    // cdn 源站配置
    async cdn_sources_config_read(row){
      row.cdn_sources_config_loading = true
      this.cdn_sources_config_table_data =[]
      let params = {
        project: JSON.parse(JSON.stringify(this.current_domain_name_details_dict.project)),
        domain_name: JSON.parse(JSON.stringify(row.domain_name)),
        cdn_vendor: JSON.parse(JSON.stringify(row.cdn_vendor)),
        cname_value: JSON.parse(JSON.stringify(row.resolve_record)),
        business: JSON.parse(JSON.stringify(this.current_domain_name_details_dict.business)),
        business_type: JSON.parse(JSON.stringify(this.current_domain_name_details_dict.business_type))
      }
      const post_url = this.http_url
      const { data: res } = await this.$http.post(post_url + '/domain_name/cdn/sourcesInfo', params)
      if (res.code !== 200){
        row.cdn_sources_config_loading = false
        return this.$message.error(res.msg)
      }
      this.cdn_sources_config_table_data = res.msg
      row.cdn_sources_config_loading = false
      this.cdn_sources_config_drawer_is_visible = true
    },
    // apollo在用颜色
    tableRowClassName(row) {
      if (row.row.apollo === true) {
        return 'success-row';
      }
    },    

    // 批处理：获取当前域名解析的云厂商
    async batches_get_dns_msg(){
      console.log(this.batches_table_domain)
      if (JSON.stringify(this.batches_table_domain) == '[]'){
        return this.$message.error("选择的域名为空")
      }
      this.batches_get_isShow = true
      const {
        data: res
      } = await this.$http.post(this.http_url+"/batches_get_dns_msg", {"domains": this.batches_table_domain})
      if (res.code !== 200) {this.batches_get_isShow = false; return  this.$message.error(res.msg)}
      this.batches_table_data.domains = res.msg
      this.batches_get_isShow = false
      this.batches_can_medit_table = true
    },

    // 批处理：DNS解析值替换为云商
    async batches_moddifying_dns(){
        console.log(this.batches_table_domain)
        if (JSON.stringify(this.batches_table_domain) == '[]' || JSON.stringify(this.batches_with_cloud_cdn) == ''){
          return this.$message.error("选择的域名/替换的云商为空")
        }
        if (this.batches_can_medit_table == false){
          return this.$message.error("更新之前先刷新数据")
        }
        this.batches_button_isShow = true
        const {
          data: res
        } = await this.$http.post(this.http_url+"/batches_moddifying_dns", {"domains": this.batches_table_domain, "cloud_cdn": this.batches_with_cloud_cdn})
        if (res.code !== 200) {this.batches_button_isShow = false; return this.$message.error(res.msg)}
        this.batches_table_data.domains = res.msg
        this.batches_button_isShow = false
        this.$message.success("替换完成")
    },

      // 批处理：切换包含以下云商DNS的域名
      async batches_replace_dns(){
        console.log(this.batches_with_replace_cloud_cdn)
        
        if (JSON.stringify(this.batches_table_domain) == '[]' || JSON.stringify(this.batches_with_replace_cloud_cdn) == ''){
          return this.$message.error("选择的域名/替换的云商为空")
        }
        if (this.batches_can_medit_table == false){
          return this.$message.error("更新之前先刷新数据")
        }
        this.batches_button_replace_isShow = true
        const {
          data: res
        } = await this.$http.post(this.http_url+"/batches_replace_dns", {"domains": this.batches_table_domain, "cloud_cdn": this.batches_with_replace_cloud_cdn})
        if (res.code !== 200) {this.batches_button_replace_isShow = false; return this.$message.error(res.msg)}
        this.batches_table_data.domains = res.msg
        this.batches_button_replace_isShow = false
        this.$message.success("切换完成")
    },

    handleSelectionChange(val) {
      this.batches_table_domain = val
    }
}