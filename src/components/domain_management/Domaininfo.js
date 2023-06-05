import DomaininfoMethods from "./DomaininfoMethods"
export default {
  data () {
    return {
		    // 批处理
			batches_table_data: {},
			batches_table_domain: [],
			batches_with_cloud_cdn: '',
			batches_with_replace_cloud_cdn: '',
			batches_get_isShow: false,
			batches_can_medit_table: false,
			batches_button_isShow: false,
			batches_button_replace_isShow: false,
			dialogTableVisible: false,
			isReadOnly:false,
			// 项目名称字典
			project_dict: {},
			// 托管商云厂商列表
			tgs_cloud_vendor_options:[],
			// DNS云厂商列表
			dns_cloud_vendor_options:[],
			// CDN云厂商列表
			cdn_cloud_vendor_options:[],
			// 业务列表
			business_options:[],
			http_url:process.env.VUE_APP_IP_WHITE_HTTP_URL,
			// 域名基本信息相关变量
			domain_name_basic_info_form:{
				domain_name: '',
        registar: '',
        resolver: '',
				is_beian: '',
				project: '',
				domain_env: '',
				business: '',
        domain_status: '',
        remarks: ''
			},
			domain_name_basic_info_table_data:[],
			domain_name_basic_info_addnew_dialog_is_visible:false,
			domain_name_basic_info_addnew_form:{
				domain_name: '',
        registar: '',
        resolver: '',
				is_beian: '',
				project: '',
				domain_env: '',
				business: '',
				business_type:'',
        domain_status: '',
        remarks: ''
			},
			
			// 域名详情抽屉
			current_domain_name_details_dict:{},
			current_domain_name_resolver:'',
			current_domain_name:'',
			current_domain_name_details_drawer_is_visible:false,
			// whois 详情
			current_domain_name_whois_details_drawer_is_visible:false,
			whois_loading:false,
			current_domain_name_whois_details_data:{},
			// ssl 详情
			current_domain_name_ssl_details_drawer_is_visible:false,
			ssl_loading:false,
			current_domain_name_ssl_details_data:{},
			// 当前域名基本信息详情
			current_domain_name_basic_info_edit_drawer_is_visible:false,
			current_domain_name_basic_info_edit_form:{},
			// 当前dns解析
			current_domain_name_dns_record_table_data:[],
			current_domain_name_dns_record_table_data_key: '',
			current_domain_name_dns_record_addnew_drawer_is_visible:false,
			current_domain_name_dns_record_addnew_form:{},
			current_domain_name_dns_record_edit_drawer_is_visible:false,
            current_domain_name_dns_record_edit_form:{},
			current_domain_name_dns_record_delete_dict:{},
			current_domain_name_dns_record_delete_click_disabled: true,
			current_domain_name_dns_record_add_click_disabled: true,
			// 备用dns解析记录
			current_domain_name_backup_dns_record_table_data:[],
			current_domain_name_backup_dns_record_addnew_drawer_is_visible:false,
			current_domain_name_backup_dns_record_addnew_form:{   
				domain_name: '',
				cdn_vendor: '',
				resolve_type: '',
				resolve_record: '',
				source_type: '',
				remarks: '',
			},
			current_domain_name_backup_dns_record_edit_drawer_is_visible:false,
			current_domain_name_backup_dns_record_edit_form:{},
			// cdn刷新
			isloading:false,
			cdn_refresh_drawer_is_visible:false,
			cdn_refresh_form:{
				domain_name: '',
        uri: '/'
			},
			// cdn源站配置
			cdn_sources_config_drawer_is_visible:false,
			cdn_sources_config_table_data:'',
			// 当前域名操作历史记录表格数据
			current_domain_name_opetation_history_record_table_data:[],
		}
  },
  created () {
		this.domain_name_basic_info_form.project = 'ops'
		this.domain_name_basic_info_read_submit({project:'ops'})
		this.get_project_options()
		this.get_tgs_cloud_vendor_options()
		this.get_cdn_cloud_vendor_options()
		this.get_dns_cloud_vendor_options()
		this.get_business_options()
  },
  methods: {
	...DomaininfoMethods
	}
}