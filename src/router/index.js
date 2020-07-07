import Vue from 'vue';
import Router from 'vue-router';

// 处理路由重复访问报的错
const originRouter = Router.prototype.push
Router.prototype.push = function push(location) {
    return originRouter.call(this,location).catch(err => err)
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
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '政策管理' }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/project',
                    component: resolve => require(['../components/page/Project.vue'], resolve),
                    meta: { title: '项目管理' }
                },
                {
                    path: '/tablemanage',
                    component: resolve => require(['../components/page/TableManage.vue'], resolve),
                    mate: { title: '表单管理' }
                },
                {
                    path: '/generte',
                    component: resolve => require(['../components/page/GenerateDatabase.vue'], resolve),
                    mate: { title: '生成数据库表单' }
                },
                {
                    path: '/generteform',
                    component: resolve => require(['../components/page/GenerateForm.vue'], resolve),
                    mate: { title: '适配生成表单' }
                },
                {
                    path: 'setHtmlclass',
                    component: resolve => require(['../components/page/setHtmlclass.vue'], resolve),
                    mate: { title: '设置模型样式' }
                },
                {
                    path: '/datebase',
                    component: resolve => require(['../components/page/Database.vue'], resolve),
                    mate: { title: '数据源管理' }
                },
                {
                    path: '/control',
                    component: resolve => require(['../components/page/Control.vue'], resolve),
                    mate: { title: '控件管理' }
                },

                // 形式审核
                {
                    path: '/policyaudit',
                    component: resolve => require(['../components/page/PolicyAudit.vue'], resolve),
                    mate: { title: '政策审核' }
                },
                {
                    path: '/manageaudit',
                    component: resolve => require(['../components/page/ManageAudit.vue'], resolve),
                    mate: { title: '项目审核' }
                },
                {
                    path: '/flowaudit',
                    component: resolve => require(['../components/page/FlowAudit.vue'], resolve),
                    mate: { title: '流程审核' }
                },
                
                // 流程管理
                {
                    path: '/flowdefine',
                    component: resolve => require(['../components/page/Flowdefine.vue'], resolve),
                    mate: { title: '流程定义' },
                },
                {
                    path:'/add_flow',
                    component: resolve => require(['../components/page/Flow_add.vue'],resolve),
                    mate:{title: "新增流程" },
                },
                {
                    path: '/flowauth',
                    component: resolve => require(['../components/page/Flowauth.vue'], resolve),
                    mate: { title: '流程授权' }
                },
                {
                    path: '/bind_flow',
                    component: resolve => require(['../components/page/Flow_bind.vue'], resolve),
                    mate: { title: '流程绑定' }
                },
                {
                    path: '/instanquery',
                    component: resolve => require(['../components/page/Instanquery.vue'], resolve),
                    mate: { title: '实例查询' }
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