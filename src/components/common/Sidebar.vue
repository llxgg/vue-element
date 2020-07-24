<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="false"
      background-color="#fff"
      text-color="#000"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <!-- <i :class="item.icon"></i> -->
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>

        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <!-- <i :class="item.icon"></i> -->
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      parentPath: "",
      collapse: true,
      items: [
        {
          index: "1",
          title: "政策管理",
          subs: [
            {
              index: "dashboard",
              title: "政策认领",
            },
            {
              index: "policydeploy",
              title: "政策配置",
            },
          ],
        },
        {
          index: "2",
          title: "项目管理",
          subs: [
            {
              index: "projectclaim",
              title: "项目认领",
            },
            {
              index: "projectdeploy",
              title: "项目配置",
            },
            {
              index: "projectdeclare",
              title: "项目申报",
            },
          ],
        },
        {
          index: "3",
          title: "表单配置",
          subs: [
            {
              index: "datebase",
              title: "数据源管理",
            },
            {
              index: "tablemanage",
              title: "表单管理",
            },
            {
              index: "pageDesign",
              title: "页面设计",
            },
          ],
        },
        {
          index: "4",
          title: "流程配置",
          subs: [
            {
              index: "flowdefine",
              title: "流程定义配置",
            },
            {
              index: "flowdeclare",
              title: "申报流程配置",
            },
            {
              index: "flowauth",
              title: "流程授权",
            },
            {
              index: "instanquery",
              title: "流程实例",
            },
          ],
        },
        {
          index: "5",
          title: "审核管理",
          subs: [
            {
              index: "policyaudit",
              title: "待审核政策",
            },
            {
              index: "manageaudit",
              title: "已审核政策",
            },
            {
              index: "auditproject",
              title: "待审核项目",
            },
            {
              index: "auditedproject",
              title: "已审核项目",
            },
          ],
        },
        // {
        //     icon: 'el-icon-lx-calendar',
        //     index: '6',
        //     title: '表单相关',
        //     subs: [
        //         {
        //             index: 'form',
        //             title: '基本表单'
        //         },
        //         {
        //             index: '3-2',
        //             title: '三级菜单',
        //             subs: [
        //                 {
        //                     index: 'editor',
        //                     title: '富文本编辑器'
        //                 },
        //                 {
        //                     index: 'markdown',
        //                     title: 'markdown编辑器'
        //                 },
        //             ]
        //         },
        //         {
        //             index: 'upload',
        //             title: '文件上传'
        //         }
        //     ]
        // },
        // {
        //     icon: 'el-icon-lx-emoji',
        //     index: 'icon',
        //     title: '自定义图标'
        // }
        // {
        //     icon: 'el-icon-lx-favor',
        //     index: 'charts',
        //     title: 'schart图表'
        // },
        // {
        //     icon: 'el-icon-rank',
        //     index: '7',
        //     title: '拖拽组件',
        //     subs: [
        //         {
        //             index: 'drag',
        //             title: '拖拽列表',
        //         },
        //         {
        //             index: 'dialog',
        //             title: '拖拽弹框',
        //         }
        //     ]
        // },
        // {
        //     icon: 'el-icon-lx-warn',
        //     index: '7',
        //     title: '错误处理',
        //     subs: [
        //         {
        //             index: 'permission',
        //             title: '权限测试'
        //         },
        //         {
        //             index: '404',
        //             title: '404页面'
        //         }
        //     ]
        // }
      ],
    };
  },
  watch: {
    // $route(newVal,oldVal){
    //     console.log('==========路由变化=============',newVal,oldVal);
    //     const {fullPath, params, query} = newVal;
    //     if(fullPath == "/add_flow"){
    //     }
    // }
    parentPath: function (newVal) {},
  },

  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
    });

    console.error("获取到的父url：", this.$route, this.$route.query.parentPath);

    this.parentPath = this.$route.query.parentPath;
  },

  computed: {
    onRoutes() {
      console.log("左侧菜单栏那个高亮：", this.$route.path, this.$route.query);
      // var reg = RegExp(/_/);
      // console.log("是否是子目录：", reg.test(this.$route.path));
      let path = this.$route.path;
      let parentRoute = this.$route.meta.parentRoute
        ? this.$route.meta.parentRoute
        : "";
      console.log("当前子路由对应的父路由是：", parentRoute);

      // 1 为流程定义配置， 2 为申报流程配置， 3 为流程实例
      if (this.$route.path == "/add_flow" && this.$route.query.flag == 1) {
        // 流程图对应的菜单栏高亮
        return "flowdefine";
      } else if (
        this.$route.path == "/add_flow" &&
        this.$route.query.flag == 2
      ) {
        return "flowauth";
      } else if (
        this.$route.path == "/add_flow" &&
        this.$route.query.flag == 3
      ) {
        return "instanquery";
      } else if (this.$route.path == "/bind_flow") {
        // 申报流程配置高亮
        return parentRoute;
      } else if (this.$route.path == "/process_info") {
        // 流程实例高亮
        return parentRoute;
      } else if (this.$route.path == "/generte") {
        // 表单管理
        return parentRoute;
      } else if (this.$route.path == "/setHtmlclass") {
        // 表单
        return parentRoute;
      } else if (this.$route.path == "/generteform") {
        // 表单
        return parentRoute;
      } else if (this.$route.path == "/policyselect") {
        // 选择政策
        return parentRoute;
      } else if (this.$route.path == "/addpolicyproject") {
        //项目新增
        return parentRoute;
      } else if (this.$route.path == "/definitiondeclaration") {
        // 定义申报要素
        return parentRoute;
      } else if (this.$route.path == "/adddeclaration") {
        // 添加申报方向
        return parentRoute;
      } else {
        return this.$route.path.replace("/", "");
      }
    },

    // defaultActive() {
    //   return console.log("拿到的是什么：", this.$router.mate);

    //   let pathNameArray = this.$route.path.split("/");
    //   console.log("的到的结果：", pathNameArray);
    //   // 去掉空字符
    //   let newArr = pathNameArray.filter(item => {
    //     return item !== "";
    //   });
    //   console.log("得到的结果：", newArr);

    //   if (newArr.length > 1) {
    //     // 进入子路由，则对应的父路由高亮显示
    //     return newArr[0];
    //   } else {
    //     return newArr[0];
    //   }
    // }
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
  background: #fff;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar > ul {
  height: 100%;
}
</style>
