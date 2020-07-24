<!-- 项目认领 -->
<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
        <el-breadcrumb-item>项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目认领</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- card -->
    <div class="container">
      <div style="margin-bottom: 3px;font-weight:530;">项目认领</div>
      <!-- 条件筛选 -->
      <div class="table-wrapper">
        <el-input
          v-model="screenData.name"
          placeholder="请输入项目名称"
          style="width: 200px;"
          clearable
          @clear="clearProjectName"
        ></el-input>

        <el-input
          v-model="screenData.code"
          placeholder="请输入项目编号"
          style="width: 200px;margin:0 20px;"
          clearable
          @clear="clearProjectCode"
        ></el-input>

        <el-button type="primary" icon="el-icon-search" @click="queryProjectData">查询</el-button>

        <!--  -->
        <!-- <div class="screen-btn">
          <el-button type="primary" style="width: 80px;" @click="getTableData(1)">查询结果</el-button>
          <el-button style="width: 80px;margin-left: 10px;color:#409EFF;" @click="resetQuery">重置</el-button>
        </div>-->
      </div>

      <!-- 筛选条件 -->
      <div style="height:300px;background:red;margin-top: 8px;"></div>

      <!-- 表格 -->
      <div style="margin-top: 8px;" id="el__table">
        <el-table
          :data="tableData"
          min-height="250"
          border
          style="width: 100%"
          :header-cell-style="setHeaderStyle"
          :cell-style="setRowStyle"
          @select="handleSelectFlow"
          @select-all="handleSelectFlowAll"
        >
          <el-table-column type="selection" width="70" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="序号" width="70" type="index"></el-table-column>

          <el-table-column prop="flowName" label="项目名称" width="220"></el-table-column>
          <el-table-column prop="flowCode" label="项目编码" width="220"></el-table-column>

          <el-table-column prop="flowVersion" label="发布部门" width="100"></el-table-column>
          <el-table-column prop="flowVersion" label="出台单位" width="100"></el-table-column>

          <el-table-column prop="status" label="项目类型" width="100">
            <template slot-scope="scope">
              <span>{{queryExamineStatus(scope.row.status)}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间"></el-table-column>

          <el-table-column prop="status" label="认领状态" width="100">
            <template slot-scope="scope">
              <span>{{queryExamineStatus(scope.row.status)}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="flowId" label="操作" width="100">
            <template slot-scope="scope">
              <el-link
                style="margin-right:22px;color:#409EFF;"
                :underline="false"
                @click="handleProjectClaim(scope.row)"
              >认领</el-link>
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
      </div>
    </div>
  </div>
</template>

<script>
import { timestamp, timestampYMD } from "../../util/date.js";
import { post, post1 } from "../../util/http.js";
import {
  getFlowData,
  deleteFlow,
  deleteAllFlow,
  queryIdFlowNode
} from "../../util/api.js";

export default {
  components: {},
  data() {
    return {
      // 筛选数据
      screenData: {
        name: "", // 政策名称
        category: "", // 政策分类
        publish: "", // 发布部门
        startDate: "", // 开始时间
        endDate: "" // 结束时间
        // sortOrder: "" // 排序方式
      },

      categorys: [
        // 政策状态
        {
          value: 1,
          label: "复工复产"
        },
        {
          value: 2,
          label: "精准扶贫"
        }
      ],

      publishs: [
        // 发布部门
        {
          value: 1,
          label: "东莞市交通运输"
        },
        {
          value: 2,
          label: "精准扶贫"
        }
      ],

      //  排序方式
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

      // 日期处理（选择的结束日期不能小于开始日期）
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
    };
  },

  methods: {
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

    // 处理表格中的流程状态的回显
    queryExamineStatus(status) {
      console.log("审核状态：", status);

      switch (status) {
        case "1":
          return "暂存";
        case "2":
          return "已提交";
      }
    },

    // 删除输入的项目名称
    clearProjectName() {
      this.screenData.name = "";
      // 从新请求
      this.pagenum = 1;
      this.getTableData();
    },
    clearProjectCode() {
      this.screenData.name = "";
      // 从新请求
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

    // 按要求查询数据：
    queryProjectData() {
      alert("正在开发中...");
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
      // 防止用户只选一个
      if ((startTime && !endTime) || (!startTime && endTime)) {
        me.$message({
          type: "warning",
          message: "请完善日期的限制"
        });
        return;
      }

      // 获取其他筛选数据
      let name = me.screenData.name ? me.screenData.name.trim() : "";
      let code = me.screenData.code ? me.screenData.code.trim() : "";
      // let status = me.screenData.status ? me.screenData.status : ""; // 发布状态
      let sortOrder = me.screenData.sortOrder ? me.screenData.sortOrder : ""; // 筛选

      // console.error(
      //   "拿到的数据：",
      //   name,
      //   code,
      //   status,
      //   startTime,
      //   endTime,
      //   sortOrder,
      //   me.pagesize
      // );

      let pagenum = page || this.pagenum;
      console.error("当前准备请求的页码是：", pagenum);
      this.pagenum = pagenum;

      // 请求数据....
      post1(me, getFlowData, {
        likeALL_flow_Name: name,
        likeALL_flow_code: code,
        gtString_CREATE_TIME: startTime,
        ltString_CREATE_TIME: endTime,
        orderType: sortOrder,
        limit: this.pagesize,
        page: pagenum
      })
        .then(res => {
          console.log("得到的数据：", res);
          if (res && res.code == 1) {
            const { start, code, totalCount, data } = res;
            me.tableData = data;
            me.total = totalCount;
          }
        })
        .catch(err => {
          console.log("错误请求：", err);
        });
    },

    // 重置查询要求
    resetQuery() {
      let me = this;
      // me.screenData = {
      //   name: "",
      //   code: "",
      //   status: "",
      //   startDate: "",
      //   endDate: ""
      // };
      console.log("是否需要重置：", me.screenData);
      if (
        me.screenData.name !== "" ||
        me.screenData.code !== "" ||
        me.screenData.startDate !== "" ||
        me.screenData.endDate !== ""
      ) {
        me.screenData.name = "";
        me.screenData.code = "";
        me.screenData.startDate = "";
        me.screenData.endDate = "";

        console.log("重置查询后的查询要求是：", me.screenData);
        // 重新请求数据炫染
        me.getTableData();
      }
    },

    // 批量删除
    // 自定义选择
    handleSelectFlow(selection, row) {
      console.log("选择了那个：", selection, row);
      // 把全选的内容id先保存为一个数组
      var deleteFlowArr = selection.map(item => item.flowId);
      console.log("要删除的id集合：", deleteFlowArr);
      // 保存：
      this.deleteFlowArr = deleteFlowArr;
    },
    // 全选事件
    handleSelectFlowAll(selection) {
      console.log("全选", selection);
      // 把全选的内容id先保存为一个数组
      var deleteFlowArr = selection.map(item => item.flowId);
      console.log("要删除的id集合：", deleteFlowArr);
      // 保存：
      this.deleteFlowArr = deleteFlowArr;
    },
    deleteAllFlow() {
      if (this.deleteFlowArr.length > 0) {
        // 弹框
        this.showDeleteAllTip = `是否确认删除当前选中的${this.deleteFlowArr.length}项流程`;
        this.showDeleteAll = true;
      } else {
        this.showDeleteAllTip = "请选择需要批量删除的流程";
        this.showDeleteAll = true;
      }
    },
    deleteFlowSelectAll() {
      let me = this;
      // 隐藏
      this.showDeleteAll = false;

      // 执行删除操作
      if (this.deleteFlowArr.length > 0) {
        post(me, deleteAllFlow, {
          flowIds: this.deleteFlowArr
        })
          .then(res => {
            console.log("批量删除的结果：", res);
            if (res && res.code == 0) {
              this.$message.success(res.msg || "批量删除成功");
              this.deleteFlowArr = []; // 重置
              // 重新请求表格
              this.getTableData();
            } else {
              // 重新请求表格
              // this.getTableData();
              this.deleteFlowArr = []; // 重置
              this.$message.error(res.msg || "批量删除失败，请稍后再试");
            }
          })
          .catch(err => {
            console.log("批量删除异常：", err);
          });
      } else {
        this.showDeleteAll = false;
      }
    },

    // 表格事件
    // 项目认领
    handleProjectClaim(scope) {
      return console.warn("审核项目跳转页面");
      if (scope) {
        const flowId = scope.flowId;
        this.$router.push({
          path: "/add_flow",
          query: { flowId: flowId, flag: 1 }
        });
      }
    }
  },

  computed: {},
  watch: {
    // 监听排序方式是否发生了改变
    // "screenData.sortOrder": function(newVal, oldVal) {
    //   console.log("排序方式是否发生了变化：", newVal, oldVal);
    //   // this.pagenum = 1;
    //   //  return console.log('排序时的页码是：',this.pagenum);
    //   // 请求
    //   this.getTableData();
    // }
  },

  created() {},
  mounted() {
    // 获取表格数据
    this.getTableData();
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