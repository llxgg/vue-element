<!-- 项目绑定 -->
<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 流程配置 / 流程授权
        </el-breadcrumb-item>
      </el-breadcrumb>-->

      <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
        <el-breadcrumb-item>申报流程配置</el-breadcrumb-item>
        <el-breadcrumb-item>新增申报流程</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="background-color:#fff;">
      <div id="search" style="margin:10px 0 0px 120px;">
        <el-input
          placeholder="请输入搜索关键字"
          v-model="searchInput"
          clearable
          @clear="clearSearch"
          style="width:300px;margin-right:30px;"
        ></el-input>

        <el-button
          type="primary"
          size="small "
          @click="getDeclarationProject"
          style="width: 64px;"
        >搜索</el-button>
      </div>

      <div>
        <el-form :model="bindFlow" :rules="rules" ref="ruleForm" label-width="120px">
          <div class="form">
            <el-form-item label="选择项目" prop="project" style="text-indent:20px" id="select-project"></el-form-item>

            <div class="form-left">
              <div style="background-color:#f9fafc;line-height:45px;text-indent: 30px;">项目绑定</div>
              <!-- :props 节点配置项 -->
              <el-tree
                ref="tree"
                :data="flowProjectData"
                :props="projectProps"
                show-checkbox
                :default-expand-all="true"
                :default-checked-keys="defaultCheckedArr"
                node-key="id"
                class="eltree"
                highlight-current
              ></el-tree>
            </div>

            <div class="form-right">
              <el-form-item label="流程搜索：" prop="flowSearch">
                <!-- <el-input v-model="bindFlow.flowSearch"></el-input> -->

                <el-select
                  style="width:250px;"
                  v-model="bindFlow.flowSearch"
                  clearable
                  filterable
                  placeholder="请输入关键词"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span style="float: left">流程名称：{{ item.label }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >流程版本：{{ item.version }}</span>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="流程名称：" prop="flowName">
                <el-input
                  :disabled="bindFlow.flowSearch ? true : false"
                  placeholder="流程名称回显"
                  v-model="bindFlow.flowName"
                  style="width:250px;"
                ></el-input>
              </el-form-item>

              <el-form-item label="流程版本：" prop="flowEdition">
                <!-- <el-select v-model="bindFlow.flowEdition" placeholder="请选择流程版本" style="width:210px;">
                <el-option label="1" value="one"></el-option>
                <el-option label="2" value="two"></el-option>
                </el-select>-->

                <el-input
                  :disabled="bindFlow.flowSearch ? true : false"
                  v-model="bindFlow.flowEdition"
                  placeholder="流程版本回显"
                  style="width:250px;"
                ></el-input>
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
            <el-form-item class="bottom" v-if="flagBtn">
              <el-button style="margin-right:30px;" @click="cancelFlow" class="elbutton">取消</el-button>
              <el-button type="primary" @click="submitFlow('ruleForm')" class="elbutton">提交</el-button>
            </el-form-item>

            <el-form-item class="bottom" v-else>
              <el-button
                type="primary"
                style="margin-right:30px;"
                @click="cancelFlow"
                class="elbutton"
              >关闭</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import bus from "../common/bus";
import Axios from "axios";

import { post1, post } from "../../util/http.js";
import {
  bindDeclarationProject,
  searchFlow,
  submitDeclaration,
  seeCurrentDeclaration,
  EditCurrentDeclaration
} from "../../util/api.js";

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
      isEdit: -1, // 编辑 || 提交的按钮
      searchInput: "", // 搜索内容
      options: [],
      loading: false,
      flagBtn: true,
      defaultChecked: [], // 已选中的id
      defaultCheckedArr: [], // 回显选中的叶子节点

      // 选择项目（项目绑定）
      flowProjectData: [],
      // defaultCheckedArr: [
      //   {
      //     id: "1",
      //     name: "申报项目",
      //     declarationVos: [
      //       {
      //         id: "305294b6-d9c6-462f-ab2d-12fb6b462441",
      //         name: "申报1",
      //         disabled: true
      //       },
      //       {
      //         id: "305294b6-d9c6-462f-ab2d-12fb6b462442",
      //         name: "申报2",
      //         disabled: true
      //       }
      //     ]
      //   },
      //   {
      //     id: "2",
      //     name: "申报项目2",
      //     declarationVos: [
      //       {
      //         id: "305294b6-d9c6-462f-ab2d-12fb6b462443",
      //         name: "申报3",
      //         disabled: false
      //       }
      //     ]
      //   }
      // ],

      projectProps: {
        // 属性控件的配置
        label: "name",
        children: "declarationVos"
      },

      // 表单数据
      bindFlow: {
        project: "",
        flowSearch: "",
        flowName: "",
        flowEdition: "", // 版本
        flowCurrency: "", // 通用流程
        flowRegion: "" // 特定区域
        // selectProject: "" // 选中的项目编号
      },
      optionsArr: [], // 所有的流程搜索数据
      declarationFlowId: null, // 传递过来的id，精心编辑

      rules: {
        project: [{ required: true, message: "请选择项目", trigger: "change" }],
        // project: [{ validator: checkProject, trigger: 'blur' }],

        flowSearch: [
          { required: true, message: "请选择相关流程", trigger: "change" }
        ],
        flowName: [
          { required: true, message: "请选择对应的流程名称", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        flowEdition: [
          { required: true, message: "请选择对应的流程版本", trigger: "blur" }
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
            // me.flowProjectData = res.data.zcProjects;

            // 处理：
            console.log("aaaaaaaaaaaa", me.isEdit);

            if (me.isEdit != 1 && me.isEdit != 2) {
              let lastArr = this.handleMenuList(res.data.zcProjects);
               me.flowProjectData = lastArr;
                me.defaultCheckedArr = this.defaultChecked;
            } else {
              // me.flowProjectData = localStorage.getItem("flowProJectData")
            }
          } else {
            console.log("读取异常：", res);
          }
        })
        .catch(err => {
          console.log("获取绑定项目数据异常：", err);
        });
    },

    handleMenuList(arr) {
      let me = this;
      console.warn("新增的时候，要处理的数据：", arr);
      arr === undefined ? (arr = []) : "";

      if (arr.length > 0) {
        arr.forEach(item => {
          let arrchildren = item.declarationVos;
          if (Array.isArray(arrchildren) && arrchildren.length > 0) {
            this.handleMenuList(arrchildren);
          } else {
            // item.binded ? () : ();

            if (item.binded) {
              item.disabled = true;
              // 把id记录

              this.defaultChecked = [...this.defaultChecked, item.id];
              console.log("新增的时候，那些已经选过的：", this.defaultChecked);
            } else {
              item.disabled = false;
            }
          }
        });
      }

      return arr;
      console.error("处理后的数据：", arr);
      setTimeout(() => {
        me.flowProjectData = arr;
        me.defaultCheckedArr = this.defaultChecked;
      }, 18);
    },

    // 删除输入的项目搜索内容（回显所有的）
    clearSearch() {
      this.getDeclarationProject();
    },

    remoteMethod(query) {
      let me = this;
      console.log("输入的搜索内容", query);

      // 请求接口
      post1(me, searchFlow, {
        keyword: query ? query : ""
      })
        .then(res => {
          console.log("请求到流程搜索的数据：", res);

          if (res && res.code == 0) {
            // 处理数据
            let newArr = res.data.map(item => {
              return {
                value: item.id,
                label: item.name,
                version: item.version
              };
            });
            // 处理过的数据（放在组件上显示用的）
            this.options = newArr;

            // 所有数据
            this.optionsArr = res.data;
          }
        })
        .catch(err => {
          console.error("搜索异常：", err);
        });
    },

    // 取消(返回上一层)
    cancelFlow() {
      // this.$router.push({ path: "/flowdeclare" });
      this.$router.back(-1);
    },

    // 根据id查看当前申报流程
    queryFlowId(id) {
      let me = this;
      post1(me, seeCurrentDeclaration, {
        declarationFlowId: id
      })
        .then(res => {
          console.log("查看当前申报流程的数据：", res);
          if (res && res.code == 0) {
            // 默认选中的，其他不选中的，则禁用，不能更换
            let defaultCheckedArr = [];
            defaultCheckedArr.push(res.data.declarationId);

            console.log("*******************默认回显选中的************",defaultCheckedArr);

            this.defaultCheckedArr = defaultCheckedArr;

            this.bindFlow.flowSearch = res.data.flowName;
            this.bindFlow.flowName = res.data.flowName;
            this.bindFlow.flowEdition = res.data.flowVersion;

            // 处理el-tree的数据

            let ProjectData = JSON.parse(
              localStorage.getItem("flowProJectData")
            );
            
            // 把el-tree数据 和 选中的那个传递进去
            let lastArr = this.handleProject(ProjectData);
            this.flowProjectData = lastArr;
            console.warn("***************************");
            console.log("获取到的项目数据：", lastArr);
            console.log("本地已经更新的项目数据：", this.flowProjectData);
            console.warn("***************************");
            
            // this.formatRoutes(ProjectData);
          }
        })
        .catch(err => {
          console.error("查看当前申报流程异常：", err);
        });
    },

    // // 递归处理el-tree不能选择
    handleProject(arr) {
      let me = this;
      console.log("没有数据吗：", arr);
      if (arr.length == 0) return;
      // arr === undefined ? (arr = []) : "";
      if (arr.length > 0) {
        arr.forEach(item => {
          let arrchildren = item.declarationVos;
          if (Array.isArray(arrchildren) && arrchildren.length > 0) {
            this.handleProject(arrchildren);
          } else {
            if (item.id !== this.defaultCheckedArr[0]) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
          }
        });
      }
      return arr;

      // 尝试间隔1s之后再获取更新
      setTimeout(() => {
        console.warn("最终处理是否禁用的那个版本：", arr);
        me.flowProjectData = arr;
      }, 18);

      // console.warn(
      //   "最终处理是否禁用的那个版本：",
      //   this.defaultCheckedArr[0],
      //   arr,
      //   me.flowProjectData
      // );

      //  me.$nextTick(() => {
      //    console.log('进入了nextTick');
      //    me.flowProjectData = arr;
      //  })
      // me.flowProjectData = arr;
      // this.$set(this.flowProjectData, 0, arr);
    },

    // 处理数据2：
    formatRoutes(routerArr, Id) {
      const arr1 = [];

      let obj1 = {};

      const arr2 = [];

      let obj2 = {};

      routerArr.forEach(router => {
        const tmp = { ...router };

        if (tmp.declarationVos && Array.isArray(tmp.declarationVos)) {
          console.warn("进入条件后，得到的每一项数据：", tmp);

          // tmp.isManager == 1 ? (tmp.disabled = true) : (tmp.disabled = false);
          obj1 = {
            id: tmp.id,

            name: tmp.name,

            declarationVos: tmp.declarationVos
          };

          arr1.push(obj1);

          this.formatRoutes(tmp.declarationVos, tmp.id);
        } else {
          // console.log("bbbbbbbbbbbbbbbbbbbb", tmp, Id);
          // 进到最内容数组

          tmp.id !== this.defaultCheckedArr[0]
            ? (tmp.disabled = true)
            : (tmp.disabled = false);

          obj2 = {
            id: tmp.id,
            parentId: Id,

            name: tmp.name,

            binded: tmp.binded
          };

          arr2.push(obj2);
        }
      });

      console.error("xxxx结果1：xxxxx", arr1);
      console.error("xxxx结果2：xxxxx", arr2);
      // return arr;
    },

    // 处理数据3：
    tickMenuIdFilter: function() {
      var resultArr = new Array();
      var getTickMenuId = function(obj) {
        if (undefined == obj || null == obj || !obj instanceof Object) {
          return;
        }
        if (obj.fs > 0) {
          // console.log('obj',obj)
          obj.disabled = true;
          resultArr.push(obj.id);
        }
        if (null != obj.children && obj.children instanceof Array) {
          for (let child of obj.children) {
            getTickMenuId(child);
          }
        }
      };

      return {
        filter: function(arr) {
          if (!arr instanceof Array) {
            return false;
          }
          resultArr = new Array();
          for (let rootMenu of arr) {
            getTickMenuId(rootMenu);
          }
          return resultArr;
        }
      };
    },

    // 提交
    submitFlow(ruleForm) {
      let me = this;

      // 新增
      const k1 = this.$refs.tree.getHalfCheckedKeys(); // 半选(也就是父节点)
      const k2 = this.$refs.tree.getCheckedKeys(); // 全选（选择的每一个节点）

      console.log("tree选中的状态：", "半选：", k1, "全选：", k2);
      // 合并
      const selectKeys = [...k1, ...k2];

      // 把已经选择过的剔除掉：
      console.error(
        "当前选择那些项目：",
        selectKeys,
        "已经选择过的数据：",
        this.defaultCheckedArr
      );
      // 获取当前已经选过的数组中的在最后一位：
      let lastSelectId = this.defaultCheckedArr[
        this.defaultCheckedArr.length - 1
      ];
      console.warn("最后选中的哪个id：", lastSelectId);

      // 获取当前选中的那些id
      let lastIdIndex = selectKeys.findIndex(item => item == lastSelectId);
      console.warn("最后选中的哪个id的位置：", lastIdIndex);

      // 只取lastIdIndex后面的值：
      let currentSelectId = selectKeys.slice(lastIdIndex);
      console.error("当前选中的有哪些id：", currentSelectId);

      // 已经选择过的数据，只要没有的，才保留：

      let difference = selectKeys
        .filter(x => this.defaultCheckedArr.indexOf(x) == -1)
        .concat(
          this.defaultCheckedArr.filter(x => selectKeys.indexOf(x) == -1)
        );
      console.warn("********************************", difference);

      // 获取符合数据的字符串id：
      let lastArray = [];
      difference.map(item => {
        if (item.length > 5) {
          lastArray.push(item);
        }
      });
      console.log("取最长的数据：", lastArray);
      
      // 校验el-tree
      if (this.isEdit !== 1 && this.isEdit !== 2) {
        //新增
        this.bindFlow.project = lastArray;
      } else {
        // 查看、编辑
        this.bindFlow.project = ["1"];
      }

      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          // alert("正在开发中...!");
          // 发送请求
          if (this.isEdit == 2) {
            // 编辑 --- 只能更改流程名称和版本
            let flowId = this.bindFlow.flowSearch;
            console.error("需要编辑的流程id：", flowId, this.declarationFlowId);
            post1(me, EditCurrentDeclaration, {
              declarationFlowId: this.declarationFlowId,
              flowId: flowId
            })
              .then(res => {
                console.log("编辑申报：", res);
                if (res && res.code == 1) {
                  this.$message.success(res.data || "编辑申报方向成功");
                  setTimeout(() => {
                    this.$router.push({ path: "/flowdeclare" });
                  }, 1000);
                } else {
                  this.$message.error(
                    res.data || "编辑申报方向异常，请稍后再试"
                  );
                  setTimeout(() => {
                    this.$router.push({ path: "/flowdeclare" });
                  }, 1000);
                }
              })
              .catch(err => {
                console.log("编辑申报异常：", err);
              });
          } else {
            // // 新增
            // const k1 = this.$refs.tree.getHalfCheckedKeys(); // 半选(也就是父节点)
            // const k2 = this.$refs.tree.getCheckedKeys(); // 全选（选择的每一个节点）

            // console.log("tree选中的状态：", "半选：", k1, "全选：", k2);
            // // 合并
            // const selectKeys = [...k1, ...k2];

            // // 把已经选择过的剔除掉：
            // console.error(  "当前选择那些项目：",selectKeys,'已经选择过的数据：',this.defaultCheckedArr);
            // // 获取当前已经选过的数组中的在最后一位：
            // let lastSelectId = this.defaultCheckedArr[this.defaultCheckedArr.length - 1]
            // console.warn('最后选中的哪个id：',lastSelectId)

            // // 获取当前选中的那些id
            // let lastIdIndex = selectKeys.findIndex(item => item == lastSelectId)
            // console.warn('最后选中的哪个id的位置：',lastIdIndex)

            // // 只取lastIdIndex后面的值：
            // let currentSelectId = selectKeys.slice(lastIdIndex+1)
            // console.warn('当前选中的有哪些id：',currentSelectId)

            // 转换成字符串
            const selectStr = lastArray.join(",");
            // this.selectProject = selectStr; // 保存到data中

            // console.error("el-tree选中那些数据：", selectStr);

            // console.log(

            //   "选择哪个flowId：",
            //   lastSelectArr
            // );
            post1(me, submitDeclaration, {
              ids: selectStr,
              flowId: this.bindFlow.flowSearch
            })
              .then(res => {
                console.log("提交申报流程的数据：", res);
                if (res && res.code == 1) {
                  this.$message.success(res.data || "申报流程绑定成功");
                  setTimeout(() => {
                    this.$router.push({ path: "/flowdeclare" });
                  }, 1000);
                } else {
                  this.$message.success(
                    res.data || "申报流程绑定失败，请稍后再试"
                  );
                  setTimeout(() => {
                    this.$router.push({ path: "/flowdeclare" });
                  }, 1000);
                }
              })
              .catch(err => {
                console.error("提交申报流程错误：", err);
              });
          }
        } else {
          // console.log("error submit!!"); // 校验不通过
          me.$message({
            message: "请输入必填信息",
            type: "warning"
          });

          return false;
        }
      });
    }
  },
  computed: {},
  watch: {
    // 监听流程搜索，赋值版本名称和版本号
    "bindFlow.flowSearch": function(newVal, oldVal) {
      console.log("新的数据：", newVal);
      // 替换：
      if (newVal === oldVal) return;

      if (newVal) {
        let currentObj = this.optionsArr.find(item => {
          return item.id == newVal;
        });

        console.log("流程搜索中，选择的那一个：", currentObj);

        // 替换：
        if (currentObj) {
          this.bindFlow.flowName = currentObj.name;
          this.bindFlow.flowEdition = currentObj.version;
        }
      }
    },
  },

  created() {
    // 获取本地数据:
    let flowId = this.$route.query.bindFlowId || "";
    let isEditNum = this.$route.query.isEdit || "";

    this.isEdit = isEditNum;
    this.declarationFlowId = flowId;

    console.error("=====解析出来的id：=====", flowId, this.isEdit);

    if (flowId && this.$route.query.isEdit == 1) {
      // 查看
      this.flagBtn = false;
      this.queryFlowId(flowId); // 解析出当前流程申报对应的数据
    } else if (flowId && this.$route.query.isEdit == 2) {
      // 编辑
      this.flagBtn = true;
      this.queryFlowId(flowId); // 解析出当前流程申报对应的数据
    }
  },

  mounted() {
    this.getDeclarationProject();
    this.remoteMethod();

    //查看 编辑（el-tree的处理）
    // 1. 先获取当前数据的二级id，不需要获取一级的id（因为选择一级的话，会默认吧他对应的二级都选择了）
    // 2. 拿到二级id后，在el-tree上勾选回显
    // el-tree有一个属性：default-checked-keys ---> 给一个数组，默认勾选相关节点
    // this.defaultCheckedArr = 'xxx'
  }
};
</script>
<style>
.content {
  overflow: Scroll;
  overflow-x: hidden;
  overflow-y: visible;
}

#search {
  display: flex;
  padding-top: 20px;
  padding-bottom: 20px;
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







