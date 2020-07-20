<!-- 流程授权 -->
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
        <el-breadcrumb-item>流程配置</el-breadcrumb-item>
        <el-breadcrumb-item>申报流程配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- card -->
    <div class="container">
      <!-- <div style="margin-bottom: 3px;">流程授权</div> -->
      <!-- 条件筛选 -->
      <div class="table-wrapper">
        <el-input
          v-model="screenData.name"
          placeholder="流程名称"
          style="width: 200px;"
          clearable
          @clear="clearFlowName"
        ></el-input>

        <!-- 所属项目 -->
        <el-select
          v-model="screenData.project"
          style="width: 180px;margin-left: 10px;"
          placeholder="所属项目名称"
        >
          <el-option
            v-for="item in projects"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 授权状态 -->
        <!-- <el-select
          v-model="screenData.roleStatus"
          style="width: 120px;margin-left: 10px;"
          placeholder="授权状态"
        >
          <el-option
            v-for="item in roleStatues"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>-->

        <!-- 发布状态 -->
        <!-- <el-select
          v-model="screenData.sendStatus"
          style="width: 120px;margin-left: 10px;"
          placeholder="发布状态"
        >
          <el-option
            v-for="item in sendStatues"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>-->

        <!-- 创建时间 -->
        <div style="margin-left: 10px;">
          <el-date-picker
            v-model="screenData.startDate"
            type="date"
            placeholder="开始日期"
            style="width: 130px;margin-right: 10px;"
            :picker-options="pickerOptionsStart"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="screenData.endDate"
            type="date"
            placeholder="结束日期"
            style="width: 130px;margin-left:10px;"
            :picker-options="pickerOptionsEnd"
          ></el-date-picker>

          <!-- <el-date-picker
            v-model="screenData.allDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>-->
        </div>

        <!--  -->
        <div class="screen-btn">
          <el-button type="primary" style="width: 80px;" @click="getTableData(1)">查询结果</el-button>
          <el-button style="width: 80px;margin-left: 10px;color:#409EFF;" @click="resetQuery">重置</el-button>
        </div>
      </div>

      <!-- 项目绑定/排序 -->
      <div class="table-wrapper">
        <el-button type="primary" style="width: 100px;" @click="addNewDeclare">新增申报流程</el-button>

        <div class="screen-btn">
          <el-select v-model="screenData.sortOrder" placeholder="排序方式" style="width: 120px;">
            <el-option
              v-for="item in sortRanks"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>

      <!-- 表格 -->
      <div style="margin-top: 8px;" id="el__table">
        <el-table
          :data="tableData"
          min-height="250"
          border
          style="width: 100%"
          :header-cell-style="setHeaderStyle"
          :cell-style="setRowStyle"
        >
          <el-table-column type="selection" width="70" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="序号" width="70" type="index"></el-table-column>

          <el-table-column prop="declarationName" label="申报方向" width="120"></el-table-column>
          <el-table-column prop="code" label="申报编码" width="120"></el-table-column>
          <el-table-column prop="projectName" label="所属项目" width="130"></el-table-column>
          <el-table-column prop="flowName" label="流程名称" width="180"></el-table-column>
          <el-table-column prop="flowVersion" label="流程版本" width="80"></el-table-column>

          <!-- <el-table-column prop="grantStatus" label="授权状态" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.roleStatus == 1 ? roleStatues[0].label : roleStatues[1].label}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="publishStatus" label="发布状态" width="80">
            <template scope="scope">
              <span>{{scope.row.sendStatus == 1 ? sendStatues[0].label : sendStatues[1].label}}</span>
            </template>
          </el-table-column>-->

          <el-table-column prop="createTime" label="创建时间" width="140">
            <!-- <template slot-scope="scope">
              <span>{{formatDate(scope.row.create_time, "yy-mm-dd hh:mm:ss")}}</span>
            </template>-->
          </el-table-column>

          <el-table-column label="绑定时间" width="140">
            <template
              slot-scope="scope"
            >{{scope.row.updateTime.includes('.') ? scope.row.updateTime.substr(0,scope.row.updateTime.indexOf('.')) : scope.row.updateTime}}</template>
          </el-table-column>

          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                style='margin-right:6px;'
                @click="handleRole(scope.row)"
                v-if="scope.row.grantStatus == 0"
              >授权</el-button>-->

              <!-- <el-button size="mini" style="margin-right:6px;" @click="handleSee(scope.row)">查看</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row)"
                style="margin-right:6px;"
              >编辑</el-button>
              <el-button size="mini" type="danger" @click="handleRemove(scope.row)">删除</el-button>-->

              <el-link
                style="margin-right:22px;color:#409EFF;"
                :underline="false"
                @click="handleSee(scope.row)"
              >查看</el-link>
              <el-link
                style="margin-right:22px;color:#409EFF;"
                :underline="false"
                @click="handleEdit(scope.row)"
              >编辑</el-link>
              <el-link style="color:#409EFF;" :underline="false" @click="handleRemove(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-size="pagesize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 10px;width:100%;overflow:hidden;"
        ></el-pagination>

        <!-- 删除提示 -->
        <el-dialog
          title="提示"
          :visible.sync="showDelete"
          :modal="true"
          width="400px"
          style="text-align:center;"
          id="dialog_footer"
        >
          <span>删除后无法恢复，您是否确定删除当前流程？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDelete = false" style="margin-right:16px;">取 消</el-button>
            <el-button type="primary" @click="deleteFlow">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "../common/bus";

import { timestamp, timestampYMD } from "../../util/date.js";
import { post, post1 } from "../../util/http.js";
import {
  getDeclareList,
  declareListProject,
  submitDeclaration,
  bindDeclarationProject,
  delDeclaration
} from "../../util/api.js";

export default {
  components: {},
  data() {
    return {
      // 筛选数据
      screenData: {
        name: "", // 流程名称
        project: "", // 所属项目

        startDate: "",
        endDate: "",
        allDate: "", // 开始结束时间
        sortOrder: "" // 排序方式
      },
      showDelete: false, // 删除绑定的流程
      deleteFlowId: "", // 需要删除的流程id

      // 所属项目
      projects: [
        {
          value: 1,
          label: "申报项目"
        },
        {
          value: 2,
          label: "网上预受理项目"
        },
        {
          value: 3,
          label: "承办项目"
        }
      ],

      // 排序方式
      sortRanks: [
        {
          value: "asc",
          label: "时间升序"
        },
        {
          value: "desc",
          label: "时间倒序"
        }
      ],

      tableData: [], // 表格数据
      pagenum: 1, // 当前页码
      pagesize: 10, // 每页多少条
      total: 0, // 总条数

      // 日期时间处理
      /* start 开始时间小于今天,结束时间不能大于开始时间 */
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.screenData.endDate) {
            return time.getTime() > new Date(this.screenData.endDate).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.screenData.startDate) {
            return (
              time.getTime() < new Date(this.screenData.startDate).getTime()
            );
          }
        }
      }
      /* end*/
    };
  },
  methods: {
    // 跳转到新增申报流程
    addNewDeclare() {
      this.$router.push({ path: "/bind_flow", query: {} });
    },

    // 设置表格内容居中
    setHeaderStyle() {
      return "text-align:center";
    },
    setRowStyle() {
      return "text-align:center";
    },

    //格式化table中的日期
    formatDate(value, format) {
      console.log("格式化table中的日期", value, format);
      return timestamp(value, format);
    },

    // 清空输入的流程名称
    clearFlowName() {
      this.screenData.name = "";
      this.pagenum = 1;
      this.getTableData();
    },

    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },

    // 获取所属项目数据
    getDeclareProjectList() {
      let me = this;
      post(me, declareListProject, {})
        .then(res => {
          console.log("获取到的项目数据：", res);
          if (res && res.code == 1) {
            let data = res.data;
            let newArr = data.map(item => {
              return {
                value: item.id,
                label: item.name
              };
            });
            me.projects = newArr;
          }
        })
        .catch(err => {
          console.error("获取所属项目数据异常：", err);
          me.$message.error(err.msg || "获取所属项目异常，请稍后再试");
        });
    },

    //获取表格数据
    getTableData(page) {
      let me = this;

      let startTime = me.screenData.startDate
        ? timestampYMD(me.screenData.startDate)
        : "";
      let endTime = me.screenData.endDate
        ? timestampYMD(me.screenData.endDate)
        : "";

      if ((startTime && !endTime) || (!startTime && endTime)) {
        me.$message({
          type: "warning",
          message: "请完善日期的限制"
        });
        return;
      }

      // let startTime;
      // let endTime;
      //   if(me.screenData.allDate){
      //    startTime = timestampYMD(me.screenData.allDate[0])
      //    endTime = timestampYMD(me.screenData.allDate[1])
      //   }else {
      //     startTime = ""
      //     endTime = ""
      //   }

      // 获取其他筛选数据
      let name = me.screenData.name ? me.screenData.name.trim() : "";
      let projectId = me.screenData.project ? me.screenData.project : "";

      let sortOrder = me.screenData.sortOrder ? me.screenData.sortOrder : "";

      console.warn(
        "申报流程配置--需要的搜索数据；",
        name,
        projectId,
        sortOrder
      );

      let pagenum = page || this.pagenum;
      console.error("当前准备请求的页码是：", pagenum);
      this.pagenum = pagenum;

      post1(me, getDeclareList, {
        limit: me.pagesize,
        page: pagenum,
        likeALL_flow_Name: name,
        orderType: sortOrder, // 排序
        "eqString_d.project_Id": projectId,
        "gtString_ffd.create_time": startTime,
        "ltString_ffd.create_time": endTime
      })
        .then(res => {
          console.log("申报流程得到的数据：", res);
          if (res && res.code == 1) {
            const { data, totalCount } = res;
            me.tableData = data;
            me.total = totalCount;
          }
        })
        .catch(err => {
          console.error("获取申报流程配置数据异常：", err);
          me.$message.error(err.msg || "获取申报流程列表异常，请稍后再试");
        });
    },

    // 重置查询要求
    resetQuery() {
      let me = this;
      console.log("是否需要重置：", me.screenData);
      if (
        me.screenData.name !== "" ||
        me.screenData.project !== "" ||
        me.screenData.startDate !== "" ||
        me.screenData.endDate !== ""
      ) {
        me.screenData.name = "";
        me.screenData.project = "";
        me.screenData.startDate = "";
        me.screenData.endDate = "";

        console.log("重置查询后的查询要求是：", me.screenData);
        // 重新请求数据炫染
        me.getTableData();
      }
    },

    // 表格事件
    handleSee(scope) {
      console.log("查看那个", scope);
      this.$router.push({
        path: "/bind_flow",
        query: { isEdit: 1, bindFlowId: scope.declarationFlowId }
      });
    },
    handleEdit(scope) {
      console.log("编辑那个", scope);
      this.$router.push({
        path: "/bind_flow",
        query: { isEdit: 2, bindFlowId: scope.declarationFlowId }
      });
    },
    handleRemove(scope) {
      console.log("当前要删除的id：", scope);
      this.deleteFlowId = scope.declarationFlowId;
      // 打开弹出框
      this.showDelete = true;
    },

    // 确定删除当前流程
    deleteFlow() {
      let me = this;
      console.log("要删除的流程id：", me.deleteFlowId);
      // 请求数据....
      post1(me, delDeclaration, {
        declarationFlowId: me.deleteFlowId
      }).then(res => {
        console.log("得到的数据：", res);
        if (res && res.code == 1) {
          // 重新炫染
          me.getTableData();
          // 提示
          me.$message.success("当前流程删除成功");
        } else {
          me.$message.error(res.msg || "当前流程删除失败，请稍后再试");
        }
      });

      // 隐藏弹出框
      this.showDelete = false;
    },



    // 获取申报项目的数据，并保存到localStorage中
    getDeclareProjectData() {
      let me = this;
      post1(me, bindDeclarationProject, {
        projectName: ""
      })
        .then(res => {
          console.log("获取绑定项目的数据：", res);
          if (res && res.code == 1) {
            let flowProjectData = res.data.zcProjects;
            // 保存到本地：
            localStorage.setItem(
              "flowProJectData",
              JSON.stringify(flowProjectData)
            );
          }
        })
        .catch(err => {
          console.log("获取绑定项目数据异常：", err);
        });
    }
  },

  computed: {},
  watch: {
    // 监听排序方式是否发生了改变
    "screenData.sortOrder": function(newVal, oldVal) {
      console.log("排序方式是否发生了变化：", newVal, oldVal);
      this.pagenum = 1;
      // 请求
      this.getTableData();
    }
  },

  created() {},

  mounted() {
    // 获取表格数据
    this.getTableData();
    // 获取所属项目的数据
    this.getDeclareProjectList();
    // 获取绑定申报方向porject,并保持到localStorage中
    this.getDeclareProjectData();
  }
};
</script>
<style scoped>
.table-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  position: relative;
}
.screen-btn {
  position: absolute;
  right: 0;
}

#dialog_footer >>> .el-dialog__footer {
  text-align: center !important;
}

#el__table >>> .el-checkbox__inner {
  margin-left: 0;
}
</style>