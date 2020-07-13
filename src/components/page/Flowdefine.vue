<!-- 流程授权 -->
<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 流程配置 / 流程定义
        </el-breadcrumb-item>
      </el-breadcrumb>-->

      <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
        <el-breadcrumb-item>流程配置</el-breadcrumb-item>
        <el-breadcrumb-item>流程定义配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- card -->
    <div class="container">
      <div style="margin-bottom: 3px;font-weight:530;">流程定义</div>
      <!-- 条件筛选 -->
      <div class="table-wrapper">
        <el-input
          v-model="screenData.name"
          placeholder="请输入流程名称"
          style="width: 200px;"
          clearable
          @clear="clearFlowName"
        ></el-input>
        <el-input
          v-model="screenData.code"
          placeholder="请输入流程编码"
          style="width: 200px; margin-left:10px;"
          clearable
          @clear="clearFlowCode"
        ></el-input>

        <!-- 发布状态 -->
        <el-select
          v-model="screenData.status"
          style="width: 120px;margin-left: 10px;"
          placeholder="发布状态"
        >
          <el-option
            v-for="item in flowStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 创建时间 -->
        <div style="margin-left: 10px;">
          <el-date-picker
            type="date"
            placeholder="开始时间"
            v-model="screenData.startDate"
            style="width: 130px;margin-right: 10px;"
            :picker-options="pickerOptionsStart"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            type="date"
            placeholder="结束时间"
            v-model="screenData.endDate"
            style="width: 130px;margin-left:10px;"
            :picker-options="pickerOptionsEnd"
          ></el-date-picker>
        </div>

        <!--  -->
        <div class="screen-btn">
          <el-button type="primary" style="width: 80px;" @click="getTableData">查询结果</el-button>
          <el-button style="width: 80px;margin-left: 10px;color:#409EFF;" @click="resetQuery">重置</el-button>
        </div>
      </div>

      <!-- 新增/排序 -->
      <div class="table-wrapper">
        <el-button type="primary" style="width: 100px;" @click="addFlow">新增流程定义</el-button>

        <!-- <div class="screen-btn">
          <el-button
            type="primary"
            style="width: 80px;margin-right:20px;"
            @click="getHistoryFlow"
        >历史版本</el-button>-->
        <div class="screen-btn">
          <el-button
            style="width: 80px;margin-right:20px;color:#409EFF;"
            @click="deleteAllFlow"
          >批量删除</el-button>

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
      <div style="margin-top: 8px;">
        <el-table
          :data="tableData"
          height="272"
          border
          style="width: 100%"
          :header-cell-style="setHeaderStyle"
          :cell-style="setRowStyle"
          @select="handleSelectFlow"
          @select-all="handleSelectFlowAll"
        >
          <el-table-column type="selection" width="60" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="序号" width="60" type="index"></el-table-column>

          <el-table-column prop="flowName" label="流程名称" width="180"></el-table-column>
          <el-table-column prop="flowCode" label="流程编码" width="150"></el-table-column>

          <el-table-column prop="flowVersion" label="流程版本" width="100"></el-table-column>

          <el-table-column prop="status" label="流程状态" width="100">
            <template slot-scope="scope">
              <span>{{queryFlowStatus(scope.row.status)}}</span>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="instanceCount" label="当前运行实例数" width="120"></el-table-column> -->

          <el-table-column prop="createTime" label="创建时间">
            <!-- <template slot-scope="scope">
              <span>{{formatDate(scope.row.create_time, "yy-mm-dd hh:mm:ss")}}</span>
            </template>-->
          </el-table-column>

          <el-table-column prop="flowId" label="操作" width="260">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleSee(scope.row)" style="margin-right:6px;">查看</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row)"
                style="margin-right:6px;"
              >编辑</el-button>
              <el-button size="mini" type="danger" @click="handleRemove(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-size="pagesize"
          :page-sizes="[5, 10, 15]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 10px;width:100%;overflow:hidden;"
        ></el-pagination>

        <!-- 删除提示 -->
        <el-dialog
          title="提示"
          style="text-align:center;"
          :visible.sync="showDelete"
          :modal="true"
          width="400px"
          id="dialog_footer"
        >
          <span>删除后无法恢复，您是否确定删除当前流程？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDelete = false" style="margin-right:16px;">取 消</el-button>
            <el-button type="primary" @click="deleteFlowSelect">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { timestamp, timestampYMD } from "../../util/date.js";
import { post, post1 } from "../../util/http.js";
import { getFlowData, deleteFlow, queryIdFlowNode } from "../../util/api.js";

export default {
  components: {},
  data() {
    return {
      // 筛选数据
      screenData: {
        name: "",
        code: "",
        status: "",
        startDate: "",
        endDate: "",
        sortOrder: "" // 排序方式
      },
      historyFlowCode: "", // 选中流程版本信息
      showDelete: false, // 删除流程弹窗
      removeFlowId: "", // 要删除那个节点

      flowStatus: [
        // 发布状态
        {
          value: 0,
          label: "停用"
        },
        {
          value: 1,
          label: "冻结"
        },
        {
          value: 2,
          label: "正常"
        }
      ],

      //  排序方式
      sortRanks: [
        {
          value: "asc",
          label: "时间排序"
        }
      ],

      tableData: [], // 表格数据
      pagenum: 1, // 当前页码
      pagesize: 5, // 每页多少条
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
    queryFlowStatus(status) {
      console.log('流程状态：',status);

      switch (status) {
        // case "0":
        //   return "停用";
        // case "1":
        //   return "冻结";
        // case "2":
        //   return "正常";
        case "1":
          return "暂存";
        case "2":
          return "已提交";
      }
    },
    // 删除输入的内容
    clearFlowName() {
      this.screenData.name = "";
      // 从新请求
      this.getTableData();
    },
    clearFlowCode() {
      this.screenData.code = "";
      // 从新请求
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
    handleQueryResult() {
      console.log("需要查询查询那些信息：", this.screenData);
    },

    //获取表格数据
    getTableData() {
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

      // 请求数据....
      post1(me, getFlowData, {
        flowName: name,
        flowCode: code,
        startTime: startTime,
        endTime: endTime,
        orderType: sortOrder,
        limit: this.pagesize,
        start: this.pagenum
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
      me.screenData = {
        name: "",
        code: "",
        status: "",
        startDate: "",
        endDate: ""
      };
      console.log("重置查询后的查询要求是：", me.screenData);
      // 重新请求数据炫染
      me.getTableData();
    },

    // 批量删除
    deleteAllFlow() {
      alert("批量删除");
    },

    // 表格事件
    // 查看
    handleSee(scope) {
      console.log("查看那个流程的数据：", scope);
      if (scope) {
        const flowId = scope.flowId;
        this.$router.push({
          path: "/add_flow",
          query: { flowId: flowId, flag: 1 }
        });
      }
    },
    // 编辑
    handleEdit(scope) {
      // alert("编辑当前流程");
      if (scope) {
        const flowId = scope.flowId;
        this.$router.push({
          path: "/add_flow",
          query: { flowId: flowId, flag: 1 }
        });
      }
    },
    handleRemove(scope) {
      // console.log('要删除的节点：',scope);
      this.removeFlowId = scope.flowId;

      // 打开弹出框
      this.showDelete = true;
    },

    // 确定删除当前流程
    deleteFlowSelect() {
      let me = this;
      // 删除请求：.......
      console.log("要删除的流程id：", me.removeFlowId);
      // 请求数据....
      post1(me, deleteFlow, {
        ids: me.removeFlowId
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

    // 新增流程
    addFlow() {
      this.$router.push({
        path: "/add_flow",
        query: { flag: 1 } // 1 为流程定义
      });
    },

    // checkbox
    handleSelectFlow(selection, row) {
      console.log("选择了那个：", selection, row);
      if (selection && selection.length == 1) {
        this.historyFlowCode = row.flowCode;
      }
    },
    // 全选事件
    handleSelectFlowAll(selection) {
      console.log("全选", selection);
    },

    // 历史版本
    getHistoryFlow() {
      console.log("历史版本：", this.historyFlowCode);
      if (!this.historyFlowCode) {
        this.$message.error("请选择一个流程定义");
      } else {
        // 条咋混页面并写到参数
        this.$router.push({
          path: "/flow_history",
          query: { code: this.historyFlowCode }
        });
      }
    }
  },

  computed: {},
  watch: {
    // 监听排序方式是否发生了改变
    "screenData.sortOrder": function(newVal, oldVal) {
      console.log("排序方式是否发生了变化：", newVal, oldVal);
      // 请求
      this.getTableData();
    }
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
</style>