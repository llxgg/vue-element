import Vue from 'vue';
import Router from 'vue-router';

// 处理路由重复访问报的错
const originRouter = Router.prototype.push
Router.prototype.push = function push(location) {
    return originRouter.call(this, location).catch(err => err)
}

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [
                // 政策管理
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/policy/Dashboard.vue'], resolve),
                    meta: { title: '政策认领' }
                },
                {
                    path: '/policydeploy',
                    component: resolve => require(['../components/page/policy/PolicyDeploy.vue'], resolve),
                    meta: { title: '政策配置' }
                },
                {
                    path: '/addpolicy',
                    component: resolve => require(['../components/page/policy/AddPolicy.vue'], resolve),
                    meta: { title: '新增政策' }
                },
                {
                    path: '/addnotice',
                    component: resolve => require(['../components/page/policy/AddNotice.vue'], resolve),
                    meta: { title: '新增通知' }
                },
                {
                    path: '/policytc',
                    component: resolve => require(['../components/page/policy/PolicyTc.vue'], resolve),
                    meta: { title: '政策统筹定义' }
                },
                {
                    path: '/policysh',
                    component: resolve => require(['../components/page/policy/PolicySh.vue'], resolve),
                    meta: { title: '审核详情' }
                },
                {
                    path: '/addbasis',
                    component: resolve => require(['../components/page/policy/AddBasis.vue'], resolve),
                    meta: { title: '添加依据' }
                },


                // 项目管理
                {
                    path: '/projectclaim',
                    component: resolve => require(['../components/page/ProjectClaim.vue'], resolve),
                    meta: { title: '项目认领' }
                },
                {
                    path: "/projectdeploy",
                    component: resolve => require(['../components/page/ProjectDeploy.vue'], resolve),
                    meta: { title: "项目配置" }
                },
                {
                    path: "/projectdeclare",
                    component: resolve => require(['../components/page/project/ProjectDeclare.vue'], resolve),
                    meta: { title: "项目申报" }
                },
                {
                    path: "/policyselect",
                    component: resolve => require(['../components/page/project/PolicySelect.vue'], resolve),
                    meta: { title: "选择政策", parentRoute: "projectdeploy" }
                },
                {
                    path: "/addpolicyproject",
                    component: resolve => require(['../components/page/project/addPolicyProject.vue'], resolve),
                    meta: { title: "项目新增", parentRoute: "projectdeploy" }
                },
                {
                    path: "/definitiondeclaration",
                    component: resolve => require(['../components/page/project/definitionDeclaration.vue'], resolve),
                    meta: { title: "定义申报要素", parentRoute: "projectdeploy" }
                },
                {
                    path: "/adddeclaration",
                    component: resolve => require(['../components/page/project/addDeclaration.vue'], resolve),
                    meta: { title: "添加申报方向", parentRoute: "projectdeploy" }
                },


                // 表单管理
                {
                    path: '/tablemanage',
                    component: resolve => require(['../components/page/TableManage.vue'], resolve),
                    meta: { title: '表单管理' }
                },
                {
                    path: '/generte',
                    component: resolve => require(['../components/page/GenerateDatabase.vue'], resolve),
                    meta: { title: '生成数据库表单', parentRoute: "tablemanage" }
                },
                {
                    path: '/generteform',
                    component: resolve => require(['../components/page/GenerateForm.vue'], resolve),
                    meta: { title: '适配生成表单', parentRoute: "tablemanage" }
                },
                {
                    path: 'setHtmlclass',
                    component: resolve => require(['../components/page/setHtmlclass.vue'], resolve),
                    meta: { title: '设置模型样式', parentRoute: "tablemanage" }
                },
                {
                    path: 'pageDesign',
                    component: resolve => require(['../components/page/pageDesign.vue'], resolve),
                    mate: { title: '页面设计' }
                },
                {
                    path: '/datebase',
                    component: resolve => require(['../components/page/Database.vue'], resolve),
                    meta: { title: '数据源管理' }
                },
                {
                    path: '/control',
                    component: resolve => require(['../components/page/Control.vue'], resolve),
                    meta: { title: '控件管理' }
                },


                // 流程管理
                {
                    path: '/flowdefine',
                    component: resolve => require(['../components/page/Flowdefine.vue'], resolve),
                    meta: { title: '流程管理' },
                },
                {
                    path: '/add_flow',
                    component: resolve => require(['../components/page/Flow_add.vue'], resolve),
                    meta: { title: "新增流程" },
                },
                // {
                //     path: '/flow_history',
                //     component: resolve => require(['../components/page/flow/flow_history.vue'], resolve),
                //     meta: { title: "历史流程"},
                // },
                {
                    path: '/flowdeclare',
                    component: resolve => require(['../components/page/flowdeclare.vue'], resolve),
                    meta: { title: "申报流程配置" },
                },
                {
                    path: '/flowauth',
                    component: resolve => require(['../components/page/Flowauth.vue'], resolve),
                    meta: { title: '流程授权' }
                },
                {
                    path: '/bind_flow',
                    component: resolve => require(['../components/page/Flow_bind.vue'], resolve),
                    meta: { title: '流程绑定', parentRoute: "flowdeclare" }
                },
                {
                    path: '/instanquery',
                    component: resolve => require(['../components/page/Instanquery.vue'], resolve),
                    meta: { title: '流程实例' }
                },
                {
                    path: '/process_info',
                    component: resolve => require(['../components/page/ProcessInfo.vue'], resolve),
                    meta: { title: '过程信息', parentRoute: "instanquery" }
                },

                // 审核管理
                {
                    path: '/policyaudit',
                    component: resolve => require(['../components/page/PolicyAudit.vue'], resolve),
                    meta: { title: '待审核政策' }
                },
                {
                    path: '/manageaudit',
                    component: resolve => require(['../components/page/ManageAudit.vue'], resolve),
                    meta: { title: '已审核政策' }
                },
                {
                    path: '/auditproject',
                    component: resolve => require(['../components/page/AuditProject.vue'], resolve),
                    meta: { title: '待审核项目' }
                },
                {
                    path: '/auditedproject',
                    component: resolve => require(['../components/page/AuditedProject.vue'], resolve),
                    meta: { title: '已审核项目' }
                },

                // 其他
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: resolve => require(['../components/page/DragDialog.vue'], resolve),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                },
                {
                    path: '/changeuserdate',
                    component: resolve => require(['../components/page/ChangeUserData.vue'], resolve),
                    meta: { title: '修改用户信息' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        // {
        //     path: '*',
        //     redirect: '/404'
        // }
    ]
})


export default router