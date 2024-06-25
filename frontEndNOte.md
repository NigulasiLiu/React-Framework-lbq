6/21

dashboard:**TTPs告警**第四个方格中填写'-'



6/19

dashboard: 309line need be modified



6/18

**modified:**

1. DataManager

2. Dashboard

3. VulList,ScanProgressbar，hostoverview
4. 详情页：告警概览页面**去除**右侧“已处理告警”
5. 病毒扫描：页面调整宽度，去除“病毒扫描任务详情”按键，hostID-->hostuuid

**待分类字段**

病毒扫描：告警类型

漏洞扫描：风险等级

文件完整性、文件监控：告警类型

基线检查：调整建议、状态

蜜罐信息：字段有些少？

威胁狩猎：风险等级





6/5

样式调整

整合文博的部分

前端项目文档





5/29

详情页，不同主机判断对应uuid的操作系统



5/26

考虑用localstroage把漏洞名称存储下来，识别到该名称自动将该行样式改变

注意：立即扫描之后，扫描结果需要先刷新接口获得的数据，再显示风险项个数

刷新后，显示notification

themePicker的配置





5/25

baselineCheck 时间换为Data类型才方便按时间排序

关于“立刻扫描”：发送向定时任务框架发送信息，







字体微软雅黑、宋体

删除按键“删除”



5/12

后续全部使用umbrella storage，不使用localstorage





5/10

![image-20240510095229908](C:\Users\Admin\AppData\Roaming\Typora\typora-user-images\image-20240510095229908.png)

memShell shell_data shell_poc字段长度只少400



**yarn info jwt-decode versions**

**yarn add jwt-decode@3.1.2**

**注意：const VirusMetaData_uuid = useExtractOrigin('uuid', vulnOriginData);**













5/9

内存马加测,shell_poc,shell_data字段长度要增加

新增蜜罐、蜜罐状态展示。。

- 5/8
  - 使用相同组件时，可以直接使用key这个props，react会自动区分是否需要重新渲染

- 5/6
  - 搜索栏筛选条件
  - 注意，包含filterDropDown的columns要修改一下定义

- 5/3
  - hostinventory数据导出有问题-----要有id列名
  - waiting状态时，前端“删除”必须可用

- 4/29
  - 未提及具体内容

- 4/24/2024
  - 删除条目时，先维护extra表，再使用原生方法处理原生表
  - extra表中的status没法更改
  - 定时刷新页面的方法，dataManager维护；
  - 定时任务过期处理，异常处理，增加closed类型任务：假如任务暂停，当时间超过任务结束时间时，原生表中的条目会被自动清除，而extra表中的条目会被保留而且仍然显示running状态
  - displaytable导出功能
  - 页面设计：
    - 验证用户设置有效的任务名称
    - 保证用户设置有效起止时间
    - 目前过期后也可以自动删除extra表中的信息
    - 可以下发“暂停的任务：add_job后立刻pause_job比较麻烦
    - 保证主机是在线的再下发任务
    - “调度中”无法删除？
    - 重复获取/api/agent/all中的数据？：很难处理
    - 让test弹出一个窗口便于演示

- 4/21/2024
  - 有timestamp字段的表：
    - `agent`, uinix时间
    - `asset_mapping`, 
    - `fileintegrityinfo`, unix
    - `host_info`, 
    - `linux_security_checks`,   标准时间
    - `windows_security_checks`  标准时间
    - `monitored_files`, 无数据
    - `port_info`, 
    - `process_info`, unix
    - `scheduler_task_jobs`, 
    - `scheduler_task_record`, 
    - `vul_detection_result`,  unix
    - `vul_detection_result_bug_exp`, 
    - `vul_detection_result_bug_poc`, 
    - `vul_detection_result_finger`, 
  - 注意一下scanTime字段修改为scan_time
  - 立即扫描等类似功能设置为“once”类型的定时任务
  - 在添加任务的同时向schedule_task添加任务详细信息，后续用监听器更新任务信息
  - 任务名称也是唯一，如果相同则替换同名任务
  - 主机如何判断消息属于自己？
  - job_id设置为uuid+任务名称，所以有同名任务直接替换
  - 注意一下记得替换端口号，因为本地测试用的5012，5013
  - 在删除任务后，SCHEDULER_TASK_JOBS中立刻没有了对应条目，而before_job_execution可能正好执行到一半，那么应该如何避免这种冲突？

- 4/20
  - 新增任务 按钮
  - 反射模块debug
  - interval功能调试结束，还剩cron,date以及删除任务功能
  - 定时任务column操作按钮

- 4/18/2024
  - 针对定时任务也需要：根据uuid,根据指定行数据(想想id如何设置)删除的接口，添加任务的接口
  - 问题：如何设置job_id
  - 显示器显示设置：缩放比125%，分辨率1920*1080，浏览器100%
  - 定时任务：前端发送POST请求，server处理，产生特定消息，通过Kafka传递给不同agent,
    agent根据消息向调度器中添加任务，使用add_job；
  - 希望不同agent的所有定时任务都使用一个apscheduled_jobs来存储；
    目前问题：apscheduled_jobs表的字段是否能扩展？
  - 不同agent使用同一个job_store时，不是用其他任何锁机制会导致job_store信息覆写
  - kinit?

- 4/17
  - 完成定时任务功能，前端页面：资产指纹-定时任务-下发任务

- 4/15/2024 
  - 5000-7341行控制按钮样式
  - 7909之后控制菜单item样式
  - 目前Table悬停行已经不是浅红色

- 4/13
  - 注意一下没有数据是不要直接显示loading icon而是看是否需要默认填充数据

- 4/9
  - 在主机详情页的表中为有需要的表添加白名单表

- 4/8
  - 使用hostport表链接monitoredfile和vul表
  - 当前的flask配置
  - 每个表都添加了uuid字段：资产测绘asset_mapping、基线检查*2，漏洞检测(`vul_detection_result`)、端口信息、运行进程信息, host_info和monitored_files并没有用上，前者不知道怎么用，后者获取不到数据
  - 最近的一次flask修改：
    - config文件在不同主机运行时记得修改
    - asset_mapping表需要增加uuid?
    - fim表的schema中extra拼写错误
    - monitored_files表数据获取不到？
    - vul表的windows和ubuntu的uuidquery是分离的，所以后续还需要修改
  - 主机详情的基线风险piechart待修改
  - flask定时任务
  - 基线检查详情页：获取对应uuid的主机信息

- 4/7
  - 微隔离前端展示
  - vul相关数据的展示(msql中的表是否需要使用uuid？/其他)
  - 告警：内存

马检测、病毒扫描、威胁溯源的信息提取
  - 修改所有columns，添加必要的搜索功能
  - overviewPanel中的条目添加跳转
  - 考虑升级antd，增加FloatButton，观察是否冲突(冲突)已验证会发生冲突
  - $env:NODE_OPTIONS = "--openssl-legacy-provider"??
  - 切回14甚至还是出现问题，那么现在需要考虑重新pull/重新git clone 已解决

- 4/4
  - filters记得表字段完善后手动填写
  - Bread

- 4/3
  - 整合了uuid，记得把后端代码发过去，说明“请求全部数据”都用/all而非/query_all
  - 基线检查：’调整建议’的filter
  - windowsvul的piechart
  - 准备把hostOverview里的FetchTable降级为CustomTable
  - DetailsPage的Menu也需要改动
  - Table需要什么类型的data?

- 3/28
  - filterSearch 用于开启筛选项的搜索，通过 filterSearch:(input, record) => boolean 设置自定义筛选方法
  - status绿色光点，offline主机不可下发任务
  - 开关switch后续考虑
  - autoPopulateFilters停用
  - ScatterChart替换linechart
  - 漏洞概览--立即扫描
  - 威胁狩猎、内存马检测页面
  - 详情页
  - 点击overview中的条目直接跳转到FetchTable的已筛选表

- 3/27
  - 将FetchAPITable解构一下

- 3/25
  - 本周工作：见飞书

- 3/23
  - 切换table时，部分panel未自动挂载更新部分
  - 筛选、排序、DatePicker功能出现bug
  - agent表相关的搜索栏的添加使用?型参数有冲突
  - 基线检查 时间，告警是否分级？
  - 组件挂载时重复调用接口
  - scanType---漏洞检查页面Bug
  - tableUtils

- 3/22
  - processinfo  扫描时间
  - 漏洞检查 时间，告警是否分级？
  - 基线检查 时间，告警是否分级？
  - 病毒扫描，扫描结果告警分级？

- 3/21
  - 需要unix时间戳，排序、DatePicker都是根据unix时间实现
  - checkbox勾选状态在属性筛选、搜索筛选的各自优先级下的改变

- 3/20
  - 注意FetchTable中的url不需要all
  - DataContext里的需要all
  - DataManger要置于App组件

- 3/15
  - 主机详情页--部分未完成
  - 基线检查详情页---
  - 病毒扫描详情页---
  - 系统监控-后端监控+后端服务+服务告警

- 3/13
  - 小型悬浮窗的触发被设置在customTable
  - 新建任务组件需要复用：但是选中主机下发任务时，
    需要读取selectedrowkey以获取主机id，构建url，以调用接口，需要在不同的
    父组件中设计state属性以及函数，传入Fetch组件

- 3/10
  - OverViewPanel小型表格的条目，被点击时转到对应子panel然后自动(搜索)获取字段值
  - 各种悬浮窗
  - 极限检查详情

- 2/1
  - 漏洞详情页面
  - columns字段冲突

- 1/31
  - 準備做漏洞詳情頁面

- 1/18
  - 先做页面内容