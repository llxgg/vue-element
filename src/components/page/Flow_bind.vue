<!-- 项目绑定 -->
<template>
  <div style="background-color:#fff;">
    <div class="search" style="margin:10px 0 0px 120px;">
      <el-input
        placeholder="请输入搜索关键字"
        v-model="searchInput"
        clearable
        @clear="clearSearch"
        style="width:300px;margin-right:30px;"
      ></el-input>

      <el-button type="primary" style="width:70px;" @click="getDeclarationProject">搜索</el-button>
    </div>

    <div>
      <el-form :model="bindFlow" :rules="rules" ref="ruleForm" label-width="120px">
        <div class="form">
          <el-form-item label="选择项目" prop="project" style="text-indent:20px" id="select-project"></el-form-item>
          <div class="form-left">
            <div style="background-color:#f9fafc;line-height:45px;text-indent: 30px;">项目绑定</div>
            <el-tree
              ref="tree"
              :data="flowProjectData"
              :props="projectProps"
              show-checkbox
              :default-expand-all="true"
              node-key="id"
              class="eltree"
            ></el-tree>
          </div>

          <div class="form-right">
            <el-form-item label="流程搜索：" prop="flowSearch">
              <!-- <el-input v-model="bindFlow.flowSearch"></el-input> -->

              <el-select
                style="width:210px;"
                v-model="bindFlow.flowSearch"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="流程名称：" prop="flowName">
              <el-input v-model="bindFlow.flowName" style="width:210px;"></el-input>
            </el-form-item>

            <el-form-item label="流程版本：" prop="flowEdition">
              <el-select v-model="bindFlow.flowEdition" placeholder="请选择流程版本" style="width:210px;">
                <el-option label="1" value="one"></el-option>
                <el-option label="2" value="two"></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="通用流程：" prop="flowCurrency">
              <el-radio-group v-model="bindFlow.flowCurrency">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>-->

            <!-- <el-form-item label="是否特定区域：" prop="flowRegion">
              <el-radio-group v-model="bindFlow.flowRegion">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>-->
          </div>
        </div>

        <div>
          <el-form-item class="bottom">
            <el-button style="margin-right:30px;" @click="cancelFlow" class="elbutton">取消</el-button>
            <el-button type="primary" @click="submitFlow('ruleForm')" class="elbutton">提交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { post1, post } from "../../util/http.js";
import { bindDeclarationProject, searchFlow } from "../../util/api.js";

export default {
  components: {},
  data() {
    // 自定义校验
    //  var checkProject = (rule, value, callback) => {
    //    return console.log('什么来的：',value);
    //     if (value === '') {
    //       callback(new Error('请再次输入密码'));
    //     } else if (value !== this.ruleForm.pass) {
    //       callback(new Error('两次输入密码不一致!'));
    //     } else {
    //       callback();
    //     }
    //   };

    return {
      searchInput: "", // 搜索内容
      options: [],
      loading: false,

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
        label: "name",
        children: "declarationVos"
      },

      // 表单数据
      bindFlow: {
        flowSearch: "",
        flowName: "",
        flowEdition: "", // 版本
        flowCurrency: "", // 通用流程
        flowRegion: "" // 特定区域
        // selectProject: "", // 选中的项目编号
      },

      rules: {
        // project: [{ type: 'array', required: true, message: "请选择项目", trigger: 'change' }],
        // project: [{ validator: checkProject, trigger: 'blur' }],

        flowSearch: [
          { required: true, message: "请选择对应的流程", trigger: "change" }
        ],
        flowName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        flowEdition: [
          { required: true, message: "请选择流程版本", trigger: "change" }
        ],

        flowCurrency: [
          { required: true, message: "请选择通用流程", trigger: "change" }
        ],
        flowRegion: [
          { required: true, message: "请选择特定区域", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 获取绑定项目的数据(默认暂时所有)
    getDeclarationProject() {
      let me = this;
      let searchProject = me.searchInput ? me.searchInput : "";
      post1(me, bindDeclarationProject, {
        projectName: searchProject
      })
        .then(res => {
          console.log("获取绑定项目的数据：", res);
          if (res && res.code == 1) {
            me.flowProjectData = res.data.zcProjects;
          } else {
            console.log("读取异常：", res.msg);
          }
        })
        .catch(err => {
          console.log("获取绑定项目数据异常：", err);
        });
    },

    // 删除输入的项目搜索内容（回显所有的）
    clearSearch() {
      this.getDeclarationProject();
    },

    remoteMethod(query) {
      let me = this;
      console.log("输入的搜索内容", query);

      if (query !== "") {
        this.loading = true;

        // 请求接口
        post1(me, searchFlow, {
          keyword: query
        })
          .then(res => {
            console.log("请求到的数据：", res);

            this.loading = false;
            if (res && res.code == 0) {
              // 处理数据
              let newArr = res.data.map(item => {
                return {
                  value: item.id,
                  label: `流程名称：${item.name} --- 版本： ${item.version}`
                };
              });
              this.options = newArr;
            }
          })
          .catch(err => {
            console.error("搜索异常：", err);
          });
      } else {
        this.options = [];
      }
    },

    // 更新流程绑定的数据到服务器
    updateFlowBindData() {
      const k1 = this.$refs.tree.getHalfCheckedKeys(); // 半选
      const k2 = this.$refs.tree.getCheckedKeys(); // 全选

      console.log("tree选中的状态：", "半选：", k1, "全选：", k2);
      // 合并
      const selectKeys = [...k1, ...k2];
      // 转换成字符串
      const selectStr = selectKeys.join(",");
      this.selectProject = selectStr;
      // 请求服务器
    },

    // 取消
    cancelFlow() {
      console.log("取消");
      // 跳转
      this.$router.push({path: "/flowdeclare"})
    },

    submitFlow(ruleForm) {
      console.log("提交");
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getDeclarationProject();
  }
};
</script>
<style>
.content {
  overflow-y: visible;
}

.search {
  display: flex;
  padding: 20px 0;
}

.form {
  display: flex;
  width: 100%;
}

.form-left {
  width: 30%;
  border: 1px solid #ebebec;
  border-radius: 5px;
  color: #a8a9aa;
}

.el-tree-node__expand-icon {
  display: none;
  width: 0px;
}
.el-tree-node__label {
  color: #a8a9aa;
}
.el-tree-node__content {
  padding: 10px 0 10px 30px;
  line-height: 40px;
  border-top: 1px solid #ebebec;
}

.el-checkbox__inner {
  margin-left: 30px;
}

.form-right {
  margin-left: 2%;
  width: 30%;
}

.bottom {
  border-top: 1px solid #ebebec;
  width: 100%;
  padding: 20px 0 20px 27%;
  display: flex;
  margin-top: 20px;
}

.elbutton {
  width: 100px;
}

/* .eltree >>> .el-checkbox >>> .el-checkbox__inner {
      margin-left: 50px!important;
} */
#select-project {
  position: relative;
}
#select-project .el-form-item__error {
  width: 100px !important;
  position: absolute;
  left: -92px;
}
</style>







