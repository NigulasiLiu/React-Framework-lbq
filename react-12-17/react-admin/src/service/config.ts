

export const APP_Server_IP = 'localhost';
export const APP_Server_PORT = 5000;

export const APP_Server_URL = 'http://'+APP_Server_IP+':'+APP_Server_PORT;
export const Login_API = APP_Server_URL + '/api/login';
export const Agent_Data_API = APP_Server_URL + '/api/agent/all';
export const Monitor_Data_API = APP_Server_URL + '/api/monitored/all';
export const Fim_Data_API = APP_Server_URL + '/api/FileIntegrityInfo/all';
export const Vul_Data_API = APP_Server_URL + '/api/vulndetetion/all';
export const Port_Data_API = APP_Server_URL + '/api/portinfo/all';
export const Process_Data_API = APP_Server_URL + '/api/process/all';
export const Assets_Data_API = APP_Server_URL + '/api/asset_mapping/all';
export const BaseLine_linux_Data_API = APP_Server_URL + '/api/baseline_check/linux/all';
export const BaseLine_windows_Data_API = APP_Server_URL + '/api/baseline_check/windows/all';
export const Task_Data_API = APP_Server_URL + '/api/taskdetail/all';
export const Add_Task_API = APP_Server_URL + '/api/add_task';
export const Del_Task_API = APP_Server_URL + '/api/delete_task';
export const Pause_Task_API = APP_Server_URL + '/api/pause_task';
export const Resume_Task_API = APP_Server_URL + '/api/resume_task';

export const MemoryShell_API = APP_Server_URL + '/api/memoryshell/all';
export const Honey_API = APP_Server_URL + '/api/honeypot/all';
export const Brute_TTPs_API = APP_Server_URL + '/api/brute-force/all';
export const Privilege_TTPs_API = APP_Server_URL + '/api/privilege-escalation/all'
export const Defense_TTPs_API = APP_Server_URL + '/api/defense-avoidance/all';

export const Virus_Data_API = APP_Server_URL + '/api/antivirus/alert';///api/antivirus/alert
export const Virus_Scan = APP_Server_URL + '/api/antivirus/scan';
export const Virus_Upload_File = APP_Server_URL + '/api/antivirus/upload';

export const Isolate_Data_API = APP_Server_URL + '/api/isolate/all';
export const Isolate_encrypt_Data = APP_Server_URL + '/api/isolate/encrypt';
export const Isolate_decrypt_Data = APP_Server_URL + '/api/isolate/decrypt';


export const User_Data_API = APP_Server_URL + '/api/users/all';


export const Provenance_Get_Host_UUID_API = APP_Server_URL + '/api/provenance/get_host_uuid';
export const Provenance_Select_Host_API = APP_Server_URL + '/api/provenance/select_host';
export const Provenance_New_Graph_Data_Event_API = APP_Server_URL + '/api/provenance/new_graph_data_event';
export const Provenance_Update_Time_Range_API = APP_Server_URL + '/api/provenance/update_time_range';
export const Provenance_Get_Filter_API = APP_Server_URL + '/api/provenance/get_filter';
export const Provenance_Update_Filter_API = APP_Server_URL + '/api/provenance/update_filter';
export const Provenance_Apply_Filter_API = APP_Server_URL + '/api/provenance/apply_filter';
export const Provenance_Get_Log_Str_API = APP_Server_URL + '/api/provenance/get_log_str';
export const Provenance_Upload_Camflow_Config_API = APP_Server_URL + '/api/provenance/upload_camflow_config'
export const Process_Get_Tack_Info_API = APP_Server_URL + '/api/provenance/get_track_info'
export const Provenance_Get_Track_Info_API = APP_Server_URL + '/api/provenance/get_track_info'
export const Provenance_Delete_Tracker_API = APP_Server_URL + '/api/provenance/delete_tracker'
export const Provenance_Add_Tracker_API = APP_Server_URL + '/api/provenance/add_tracker'
export const Provenance_Get_Alert_API = APP_Server_URL + '/api/provenance/get_alert';


export const interval_fast = 240000;
export const interval_slow = 960000;






//easy-mock模拟数据接口地址
const MOCK_API = 'https://react-admin-mock.now.sh/api';
export const MOCK_AUTH_ADMIN = MOCK_API + '/admin.js'; // 管理员权限接口
export const MOCK_AUTH_VISITOR = MOCK_API + '/visitor.js'; // 访问权限接口
/** 服务端异步菜单接口 */
export const MOCK_MENU = MOCK_API + '/menu.js';

// github授权
export const GIT_OAUTH = 'https://github.com/login/oauth';
// github用户
export const GIT_USER = 'https://api.github.com/user';

// bbc top news
export const NEWS_BBC =
    'https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=429904aa01f54a39a278a406acf50070';
