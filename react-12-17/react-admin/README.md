# react-admin([尝试一下在线编辑](https://codesandbox.io/s/react-admin-u9kdb))

react-admin system solution

<img src="https://raw.githubusercontent.com/yezihaohao/react-admin/master/screenshots/logo.png" alt="logo" width="150" height="53" />

![travis-ci](https://travis-ci.org/yezihaohao/react-admin.svg?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

<!-- ### 🔥🔥🔥 默认主分支切换成 TypeScript 开发，如果你希望继续使用 JS 开发，请使用[JS](https://github.com/yezihaohao/react-admin/tree/js)分支代码(继续维护) -->

### 文档地址：[wiki](https://github.com/yezihaohao/react-admin/wiki)

### 问题和方案汇总：[issue](https://github.com/yezihaohao/react-admin/issues/12)

### 更新日志迁移至[CHANGELOG.md](https://github.com/yezihaohao/react-admin/blob/master/CHANGELOG.md)😁(重要！对于了解项目部分功能和代码很有用！)

### cli 安装和使用 react-admin 🔥

使用 [saigao](https://github.com/yezihaohao/saigao) 快速安装和下载 react-admin 模板来开发项目：

```js
npm i -g saigao

saigao myapp
// 或者使用npx 下载模板
npx saigao myapp
```

### 前言

> 网上 react 后台管理开源免费的完整版项目比较少，所以利用空余时间集成了一个版本出来，已放到 GitHub
> 启动和打包的时间都稍长，请耐心等待两分钟

-   [GitHub 地址](https://github.com/yezihaohao/react-admin)
-   [预览地址](https://admiring-dijkstra-34cb29.netlify.com)(已增加响应式，可手机预览 😄)

### 依赖模块

<span style="color: rgb(184,49,47);">项目是用 create-react-app 创建的，主要还是列出新加的功能依赖包</span>

<span style="color: rgb(184,49,47);">点击名称可跳转相关网站 😄😄</span>

-   [react](https://facebook.github.io/react/)
-   [react-router](https://react-guide.github.io/react-router-cn/)(<span style="color: rgb(243,121,52);">react 路由，4.x 的版本，如果还使用 3.x 的版本，请切换分支（ps:分支不再维护）</span>)
-   [redux](https://redux.js.org/)(基础用法，但是封装了通用 action 和 reducer，demo 中主要用于权限控制（ps：目前可以用 16.x 的 context api 代替），可以简单了解下)
-   [antd](https://ant.design/index-cn)(<span style="color: rgb(243,121,52);">蚂蚁金服开源的 react ui 组件框架</span>)
-   [axios](https://github.com/mzabriskie/axios)(<span style="color: rgb(243,121,52);">http 请求模块，可用于前端任何场景，很强大 👍</span>)
-   [echarts-for-react](https://github.com/hustcc/echarts-for-react)(<span style="color: rgb(243,121,52);">可视化图表，别人基于 react 对 echarts 的封装，足够用了</span>)
-   [recharts](http://recharts.org/#/zh-CN/)(<span style="color: rgb(243,121,52);">另一个基于 react 封装的图表，个人觉得是没有 echarts 好用</span>)
-   [nprogress](https://github.com/rstacruz/nprogress)(<span style="color: rgb(243,121,52);">顶部加载条，蛮好用 👍</span>)
-   [react-draft-wysiwyg](https://github.com/jpuri/react-draft-wysiwyg)(<span style="color: rgb(243,121,52);">别人基于 react 的富文本封装，如果找到其他更好的可以替换</span>)
-   [react-draggable](https://github.com/mzabriskie/react-draggable)(<span style="color: rgb(243,121,52);">拖拽模块，找了个简单版的</span>)
-   [screenfull](https://github.com/sindresorhus/screenfull.js/)(<span style="color: rgb(243,121,52);">全屏插件</span>)
-   [photoswipe](https://github.com/dimsemenov/photoswipe)(<span style="color: rgb(243,121,52);">图片弹层查看插件，不依赖 jQuery，还是蛮好用 👍</span>)
-   [animate.css](http://daneden.me/animate)(<span style="color: rgb(243,121,52);">css 动画库</span>)
-   [react-loadable](https://github.com/jamiebuilds/react-loadable)(代码拆分，按需加载，预加载，样样都行，具体见其文档，推荐使用)
-   [redux-alita](https://github.com/yezihaohao/redux-alita) 极简的 redux2react 工具
-   其他小细节省略

### 功能模块

<span style="color: rgb(184,49,47);">备注：项目只引入了 ant-design 的部分组件，其他的组件 antd 官网有源码，可以直接复制到项目中使用，后续有时间补上全部组件。</span>

<span style="color: rgb(184,49,47);">项目使用了 antd 的自定义主题功能-->黑色，若想替换其他颜色，具体操作请查看 antd 官网</span>

<!--more-->

-   首页
    -   完整布局
    -   换肤(全局功能，暂时只实现了顶部导航的换肤，后续加上其他模块)
-   导航菜单
    -   顶部导航(菜单伸缩，全屏功能)
    -   左边菜单(增加滚动条以及适配路由的 active 操作)
-   UI 模块
    -   按钮(antd 组件)
    -   图标(antd 组件并增加彩色表情符)
    -   加载中(antd 组件并增加顶部加载条)
    -   通知提醒框(antd 组件)
    -   标签页(antd 组件)
    -   轮播图(ant 动效组件)
    -   富文本
    -   拖拽
    -   画廊
-   动画
    -   基础动画(animate.css 所有动画)
    -   动画案例
-   表格
    -   基础表格(antd 组件)
    -   高级表格(antd 组件)
    -   异步表格(数据来自掘金酱的接口)
-   表单
    -   基础表单(antd 组件)
-   图表
    -   echarts 图表
    -   recharts 图表
-   页面
    -   登录页面(包括 GitHub 第三方登录)
    -   404 页面

### 功能截图

#### 首页

![截图](https://raw.githubusercontent.com/yezihaohao/yezihaohao.github.io/master/imgs/rd1.gif)

#### 按钮图标等

![截图](https://raw.githubusercontent.com/yezihaohao/yezihaohao.github.io/master/imgs/rd2.gif)

#### 轮播图

![截图](https://raw.githubusercontent.com/yezihaohao/yezihaohao.github.io/master/imgs/rd3.gif)

#### 富文本

![截图](https://raw.githubusercontent.com/yezihaohao/yezihaohao.github.io/master/imgs/rd4.gif)

#### 拖拽

![截图](https://raw.githubusercontent.com/yezihaohao/yezihaohao.github.io/master/imgs/rd5.gif)

#### 画廊

![截图](https://raw.githubusercontent.com/yezihaohao/yezihaohao.github.io/master/imgs/rd6.gif)

#### 动画

![截图](https://raw.githubusercontent.com/yezihaohao/yezihaohao.github.io/master/imgs/rd7.gif)

#### 表格

![截图](https://raw.githubusercontent.com/yezihaohao/yezihaohao.github.io/master/imgs/rd8.gif)

#### 表单

![截图](https://raw.githubusercontent.com/yezihaohao/yezihaohao.github.io/master/imgs/rd9.gif)

#### 图表

![截图](https://raw.githubusercontent.com/yezihaohao/yezihaohao.github.io/master/imgs/rd10.gif)

#### 页面

![截图](https://raw.githubusercontent.com/yezihaohao/yezihaohao.github.io/master/imgs/rd11.gif)

#### 菜单拖拽

![截图](https://raw.githubusercontent.com/yezihaohao/react-admin/master/screenshots/menu_draggable.gif)

### 代码目录

```js
+-- build/                                  ---打包的文件目录
+-- config/                                 ---npm run eject 后的配置文件目录
+-- node_modules/                           ---npm下载文件目录
+-- public/
|   --- index.html							---首页入口html文件
|   --- npm.json							---echarts测试数据
|   --- weibo.json							---echarts测试数据
+-- src/                                    ---核心代码目录
|   +-- axios                               ---http请求存放目录
|   |    --- index.js
|   +-- components                          ---各式各样的组件存放目录
|   |    +-- animation                      ---动画组件
|   |    |    --- ...
|   |    +-- charts                         ---图表组件
|   |    |    --- ...
|   |    +-- Dashboard                      ---首页组件
|   |    |    --- ...
|   |    +-- forms                          ---表单组件
|   |    |    --- ...
|   |    +-- pages                          ---页面组件
|   |    |    --- ...
|   |    +-- tables                         ---表格组件
|   |    |    --- ...
|   |    +-- ui                             ---ui组件
|   |    |    --- ...
|   |    --- BreadcrumbCustom.jsx           ---面包屑组件
|   |    --- HeaderCustom.jsx               ---顶部导航组件
|   |    --- Page.jsx                       ---页面容器
|   |    --- SiderCustom.jsx                ---左边菜单组件
|   +-- style                               ---项目的样式存放目录，主要采用less编写
|   +-- utils                               ---工具文件存放目录
|   --- App.js                              ---组件入口文件
|   --- index.js                            ---项目的整体js入口文件，包括路由配置等
--- .env                                    ---启动项目自定义端口配置文件
--- .eslintrc                               ---自定义eslint配置文件，包括增加的react jsx语法限制
--- package.json
```

### 安装运行

##### 1.下载或克隆项目源码

##### 2.yarn 安装依赖(国内建议增加淘宝镜像源，不然很慢，你懂的 😁)

> 有些老铁遇到运行时报错，首先确定下是不是最新稳定版的 nodejs 和 yarn，切记不要用 cnpm

```js
// 首推荐使用yarn装包，避免自动升级依赖包
yarn;
```

##### 3.启动项目

```js
yarn start
```

##### 4.打包项目

```js
yarn build
```

### Q&A(点击问题查看答案)

#### 1.[create-react-app 打包项目 run build 增加进度条信息?](https://github.com/yezihaohao/react-admin/issues/12#issuecomment-325383346)

#### 2.[接口跨域了，怎么在本地开发时配置代理?](https://github.com/yezihaohao/react-admin/issues/12#issuecomment-326169055)

#### 3.[在使用 hashRouter 的情况下怎么实现类似锚点跳转?](https://github.com/yezihaohao/react-admin/issues/12#issuecomment-345127221)

#### 4.[怎么添加多页面配置?](https://github.com/yezihaohao/react-admin/issues/12#issuecomment-348088852)

#### 5.[路由传参数接问号怎么传?](https://github.com/yezihaohao/react-admin/issues/12#issuecomment-375583089)

#### 6.[如何兼容 IE 浏览器?](https://github.com/yezihaohao/react-admin/issues/12#issuecomment-510295292)

### License

MIT

### 结尾

该项目会不定时更新，后续时间会添加更多的模块

欢迎和感谢大家 PR~~👏👏

若有问题，可加 QQ 群与我交流

-   1 群：264591039（已满）
-   2 群：592688854（已满）
-   3 群：743490497 (已满)
-   4 群：150131600 (已满)

如果对你有帮助，给个 star 哟~~❤️❤️❤️❤️

```
react-admin
├─ .commitlintrc.js
├─ .env
├─ .env.ra.dev
├─ .env.ra.production
├─ .env.ra.starandsea
├─ .eslintrc
├─ .gitattributes
├─ .gitignore
├─ .prettierignore
├─ .prettierrc
├─ .travis.yml
├─ CHANGELOG.md
├─ config
│  ├─ env.js
│  ├─ jest
│  │  ├─ cssTransform.js
│  │  └─ fileTransform.js
│  ├─ modules.js
│  ├─ paths.js
│  ├─ pnpTs.js
│  ├─ webpack.config.js
│  └─ webpackDevServer.config.js
├─ LICENSE
├─ package.json
├─ public
│  ├─ assets
│  │  └─ less.min.js
│  ├─ favicon.ico
│  ├─ images
│  │  └─ icons
│  │     ├─ icon-128x128.png
│  │     ├─ icon-144x144.png
│  │     ├─ icon-152x152.png
│  │     ├─ icon-192x192.png
│  │     ├─ icon-384x384.png
│  │     ├─ icon-512x512.png
│  │     ├─ icon-72x72.png
│  │     └─ icon-96x96.png
│  ├─ index.html
│  ├─ logo.png
│  ├─ manifest.json
│  ├─ robots.txt
│  └─ theme.less
├─ README.md
├─ screenshots
│  ├─ logo.png
│  ├─ menu_draggable.gif
│  ├─ pwa.png
│  └─ themepicker.png
├─ scripts
│  ├─ start.js
│  └─ test.js
├─ src
│  ├─ App.test.tsx
│  ├─ App.tsx
│  ├─ components
│  │  ├─ AlertList.tsx
│  │  ├─ ARP
│  │  │  ├─ ARPAlertList.tsx
│  │  │  ├─ ARPWhiteList.tsx
│  │  │  ├─ configuration.tsx
│  │  │  └─ status.tsx
│  │  ├─ AssetsCenter
│  │  │  ├─ AssetFingerprint.tsx
│  │  │  ├─ ContainerCluster.tsx
│  │  │  ├─ CustomDataTable.tsx
│  │  │  ├─ CustomPieChart.tsx
│  │  │  ├─ DataContext.tsx
│  │  │  ├─ DataDisplayTable.html
│  │  │  ├─ DataService.ts
│  │  │  ├─ FetchAPIDataTable.tsx
│  │  │  ├─ HostInventory.tsx
│  │  │  ├─ MetaDataUtilize.tsx
│  │  │  ├─ OverviewPanel.tsx
│  │  │  ├─ tableUtils.tsx
│  │  │  └─ TooltipForPieChart.tsx
│  │  ├─ auth
│  │  │  ├─ Basic.tsx
│  │  │  └─ RouterEnter.tsx
│  │  ├─ CCP
│  │  │  ├─ CCPAlertList.tsx
│  │  │  └─ CCPWhiteList.tsx
│  │  ├─ charts
│  │  │  ├─ CustomEchartsPie.tsx
│  │  │  ├─ CustomTooltip.tsx
│  │  │  ├─ Echarts.tsx
│  │  │  ├─ EchartsArea.tsx
│  │  │  ├─ EchartsEffectScatter.tsx
│  │  │  ├─ EchartsForce.tsx
│  │  │  ├─ EchartsGraphnpm.tsx
│  │  │  ├─ EchartsPie.tsx
│  │  │  ├─ EchartsScatter.tsx
│  │  │  ├─ Recharts.tsx
│  │  │  ├─ RechartsBarChart.tsx
│  │  │  ├─ RechartsRadarChart.tsx
│  │  │  ├─ RechartsRadialBarChart.tsx
│  │  │  ├─ RechartsSimpleLineChart.tsx
│  │  │  └─ redundancy.html
│  │  ├─ ContextAPI
│  │  │  ├─ data.json
│  │  │  ├─ DataDisplayTable.tsx
│  │  │  ├─ FileIntegrityContext.tsx
│  │  │  └─ VirusScanning.tsx
│  │  ├─ Dashboard
│  │  │  ├─ card.less
│  │  │  ├─ Dashboard.tsx
│  │  │  ├─ EchartsProjects.tsx
│  │  │  ├─ EchartsViews.tsx
│  │  │  ├─ link.less
│  │  │  └─ preversion
│  │  ├─ DataCard.tsx
│  │  ├─ DetailsPage
│  │  │  ├─ DetailsPage.tsx
│  │  │  ├─ DetailsTableColumns.tsx
│  │  │  ├─ HostDetailsTable.tsx
│  │  │  ├─ HostOverview.tsx
│  │  │  └─ PerformanceMonitor.tsx
│  │  ├─ env
│  │  │  └─ index.tsx
│  │  ├─ extension
│  │  │  ├─ MultipleMenu.tsx
│  │  │  ├─ QueryParams.tsx
│  │  │  └─ Visitor.tsx
│  │  ├─ HeaderandSideMenuStyle.less
│  │  ├─ HeaderCustom.tsx
│  │  ├─ HostProtection
│  │  │  ├─ BaselineDetectList.tsx
│  │  │  ├─ CustomLoader.tsx
│  │  │  ├─ HeartBeat.less
│  │  │  ├─ HostAlertList.tsx
│  │  │  ├─ HostWhiteList.tsx
│  │  │  ├─ LoaderBar.less
│  │  │  ├─ LoaderBar.tsx
│  │  │  ├─ progress.less
│  │  │  ├─ ScanProcessSidebar.tsx
│  │  │  ├─ VulnerabilityDetailsSidebar.tsx
│  │  │  └─ VulnerabilityList.tsx
│  │  ├─ index.tsx
│  │  ├─ Page.tsx
│  │  ├─ pages
│  │  │  ├─ Login.tsx
│  │  │  └─ NotFound.tsx
│  │  ├─ SidebarStyle.css
│  │  ├─ SiderCustom.tsx
│  │  ├─ SiderMenu.tsx
│  │  ├─ SiderMenu_discard.tsx
│  │  ├─ smenu
│  │  │  ├─ Sub1.tsx
│  │  │  └─ Sub2.tsx
│  │  ├─ statistic.less
│  │  ├─ SubComponents
│  │  │  ├─ FilterComponent.tsx
│  │  │  ├─ SearchComponent.tsx
│  │  │  └─ SidebarComponent.tsx
│  │  ├─ tables
│  │  │  ├─ AdvancedTables.tsx
│  │  │  ├─ AsynchronousTable.tsx
│  │  │  ├─ BasicTable.tsx
│  │  │  ├─ BasicTables.tsx
│  │  │  ├─ ExpandedTable.tsx
│  │  │  ├─ FixedTable.tsx
│  │  │  ├─ SearchTable.tsx
│  │  │  ├─ SelectTable.tsx
│  │  │  └─ SortTable.tsx
│  │  ├─ ui
│  │  │  ├─ banners
│  │  │  │  ├─ AutoPlay.tsx
│  │  │  │  ├─ Basic.tsx
│  │  │  │  ├─ Custom.tsx
│  │  │  │  └─ index.tsx
│  │  │  ├─ Buttons.tsx
│  │  │  ├─ Draggable.tsx
│  │  │  ├─ emoji
│  │  │  │  ├─ iconfont.ts
│  │  │  │  └─ index.tsx
│  │  │  ├─ Icons.tsx
│  │  │  ├─ map
│  │  │  │  ├─ index.tsx
│  │  │  │  └─ Tencent.tsx
│  │  │  ├─ Modals.tsx
│  │  │  ├─ Notifications.tsx
│  │  │  ├─ Spins.tsx
│  │  │  ├─ Tabs.tsx
│  │  │  └─ Wysiwyg.tsx
│  │  ├─ VirusScanning
│  │  │  ├─ VirusScanning.tsx
│  │  │  ├─ VirusScanningWhiteList.tsx
│  │  │  └─ VirusScanTableSidebar.tsx
│  │  ├─ WhiteList.tsx
│  │  └─ widget
│  │     ├─ AuthWidget.tsx
│  │     ├─ BreadcrumbCustom.tsx
│  │     ├─ Copyright.tsx
│  │     ├─ index.tsx
│  │     ├─ Loading.tsx
│  │     ├─ PwaInstaller.tsx
│  │     └─ ThemePicker.tsx
│  ├─ index.tsx
│  ├─ logo.svg
│  ├─ Page.tsx
│  ├─ react-app-env.d.ts
│  ├─ routes
│  │  ├─ config.ts
│  │  ├─ index.tsx
│  │  └─ RouteWrapper.tsx
│  ├─ service
│  │  ├─ config.ts
│  │  ├─ index.ts
│  │  └─ tools.ts
│  ├─ serviceWorker.ts
│  ├─ style
│  │  ├─ antd
│  │  │  ├─ header.less
│  │  │  ├─ index.less
│  │  │  ├─ layout.less
│  │  │  ├─ menu.less
│  │  │  ├─ reset.less
│  │  │  ├─ utils.less
│  │  │  └─ variables.less
│  │  ├─ app.less
│  │  ├─ banner.less
│  │  ├─ button.less
│  │  ├─ card.less
│  │  ├─ font
│  │  │  ├─ y6oxFxU60dYw9khW6q8jGw.woff2
│  │  │  └─ youyuan.TTF
│  │  ├─ global.less
│  │  ├─ icons.less
│  │  ├─ img.less
│  │  ├─ imgs
│  │  │  ├─ 404.png
│  │  │  ├─ 5.png
│  │  │  ├─ b1.jpg
│  │  │  ├─ beauty.jpg
│  │  │  ├─ emptybox-grey.png
│  │  │  ├─ funnel.png
│  │  │  ├─ installer.png
│  │  │  ├─ logo.png
│  │  │  ├─ mobile.gif
│  │  │  ├─ owl.png
│  │  │  ├─ owl1.png
│  │  │  ├─ scanguard.png
│  │  │  ├─ spot_location.png
│  │  │  ├─ user.png
│  │  │  └─ user1.png
│  │  ├─ index.less
│  │  ├─ lib
│  │  │  └─ animate.css
│  │  ├─ login.less
│  │  ├─ menu.less
│  │  ├─ modal.less
│  │  ├─ progress.less
│  │  ├─ scroll.less
│  │  ├─ table.less
│  │  ├─ theme
│  │  │  ├─ index.js
│  │  │  ├─ theme-danger.json
│  │  │  ├─ theme-grey.json
│  │  │  ├─ theme-info.json
│  │  │  └─ theme-warn.json
│  │  ├─ utils-border.less
│  │  ├─ utils-color.less
│  │  ├─ utils-size.less
│  │  ├─ utils-spacing.less
│  │  ├─ utils-text.less
│  │  └─ variables.less
│  └─ utils
│     ├─ hooks.ts
│     └─ index.ts
├─ theme.js
├─ tsconfig.json
└─ yarn.lock

```