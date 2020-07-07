<!-- 项目绑定 -->
<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 流程配置 / 流程授权
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- card -->
    <div class="container">
      <!-- <div>流程授权</div> -->

      <div class="flow_header" style="margin:10px 0 20px 120px;">
        <el-input
          placeholder="请输入搜索关键字"
          v-model="searchInput"
          clearable
          @clear="clearSearch"
          style="width:300px;margin-right:30px;"
        ></el-input>
        <el-button type="success">搜索</el-button>
      </div>

      <el-form
        :model="bindFlow"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
      >
        <el-row style="margin-top:10px;">
          <el-col :span="10">
            <!-- <el-form-item label="选择项目：" prop="projectName"> -->
            <el-form-item label="选择项目：">
              <div class="flow-content-left">
                <h2 class='flow-content-left-title'>项目绑定</h2>
                <el-tree
                  ref="tree"
                  :data="flowProjectData"
                  :props="projectProps"
                  show-checkbox
                  :default-expand-all="true"
                  node-key="id"
                ></el-tree>
              </div>
            </el-form-item>
            <!-- 
                  1.先炫染树
                    data : 数据
                    props ： 配置
                    show-checkbox : 选择框
                    default-expand-all ： 默认全部展开
                    node-key ： 用来指定每一个节点，被选中之后的唯一标识（一般用当前节点id做唯一标识）
                  2.然后勾选默认的/之前已经选择的 default-checked-keys=[选中的节点id，通过递归得到]
                  3.获取当前勾选的节点id
            -->
          </el-col>
          <el-col :span="12" id="bind-flow-right">
            <el-form-item label="流程搜索：" prop="flowSearch">
              <el-input v-model="bindFlow.flowSearch"></el-input>
            </el-form-item>

            <el-form-item label="流程名称：" prop="flowName">
              <el-input v-model="bindFlow.flowName"></el-input>
            </el-form-item>

            <el-form-item label="流程版本：" prop="flowEdition">
              <el-select v-model="bindFlow.flowEdition" placeholder="请选择流程版本">
                <el-option label="1" value="one"></el-option>
                <el-option label="2" value="two"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="通用流程：" prop="flowCurrency">
              <el-radio-group v-model="bindFlow.flowCurrency">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="是否特定区域：" prop="flowRegion">
              <el-radio-group v-model="bindFlow.flowRegion">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item id='bind-flow-btn'>
          <el-button @click="cancelFlow">取消</el-button>
          <el-button type="primary" @click="submitFlow">提交</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      searchInput: "", // 搜索内容
      // 选择项目（项目绑定）
      flowProjectData: [
        {
          id: 1,
          authName: "项目",
          pid: 0, // 默认自己是父级
          children: [
            {
              id: 101,
              authName: "申报方向",
              pid: 1 // 对应的父级id
            },
            {
              id: 102,
              authName: "申报流程",
              pid: 1
            }
          ]
        },

        {
          id: 2,
          authName: "流程",
          pid: 0,
          children: [
            {
              id: 201,
              authName: "申报方向",
              pid: 2
            },
            {
              id: 202,
              authName: "申报流程",
              pid: 2
            }
          ]
        }
      ],
      projectProps: {
        // 属性控件的配置
        label: "authName",
        children: "children"
      },

      // 表单数据
      bindFlow: {
        flowSearch: "",
        flowName: "",
        flowEdition: "", // 版本
        flowCurrency: "", // 通用流程
        flowRegion: "", // 特定区域
      },
      rules: {
        projectName: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        flowSearch:[
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        flowName:[
          { required: true, message: "请输入活动名称", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        flowEdition: [
          { required: true, message: "请选择流程版本", trigger: "change" }
        ],


        flowCurrency: [
          { required: true, message: "请选择通用流程", trigger: "change" }
        ],
        flowRegion: [{ required: true, message: "请选择特定区域", trigger: "change" }]
      }
    };
  },
  methods: {
    clearSearch() {},
    // 更新流程绑定的数据到服务器
    updateFlowBindData() {
      // 先处理tree的数据（选中那些节点id）
      // 获取 所有半选状态的id
      // 获取 所有全选的id
      // 合并半选和 全选状态的id 到一个完整的数组中去，通过join，转换成一个字符串（以逗号分隔的字符串）
      const k1 = this.$refs.tree.getHalfCheckedKeys(); // 半选
      const k2 = this.$refs.tree.getCheckedKeys(); // 全选

      console.log("tree选中的状态：", "半选：", k1, "全选：", k2);
      // 合并
      const selectKeys = [...k1, ...k2];
      // 转换成字符串
      const selectStr = selectKeys.join(",");
      // 请求服务器
    },

    // 取消
    cancelFlow(){
      console.log('取消');
    },

    submitFlow(){
      console.log('提交');
    }
  },
  computed: {},
  watch: {}
};
</script>
<style scoped>
.flow-ruleForm >>> .el-form-item__label {
  text-align: left !important;
}
#bind-flow-right {
  margin-left: 60px;
  overflow: hidden;
}
#bind-flow-right >>> .el-input--small .el-input__inner {
  width: 260px;
}

.flow-content-left {
  height: 200px;
  width: 360px;
  border: 2px solid #c3cbcf;
  border-radius: 6px;
  /* background-color: red; */
}
.flow-content-right {
  height: 200px;
  /* background-color: yellow; */
}

.flow-content-left-title {
  background-color: #F9FAFC;
  height: 38px;
  line-height: 38px;
  color: #9a9a9b;
  font-weight: normal;
  font-size: 16px;
  padding-left: 16px;
}

#bind-flow-btn >>> .el-form-item__content {
  text-align: center;
}
#bind-flow-btn >>> .el-form-item__content button[type="button"]:nth-of-type(1) {
  margin-right: 30px;
}
</style>