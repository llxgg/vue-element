<!-- 流程授权 -->
<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 流程配置 / 实例查询
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- card -->
    <div class="container">
      <div style="margin-bottom: 3px;">实例查询</div>
      <!-- 条件筛选 -->
      <div class="table-wrapper">
        <el-input
          v-model="screenData.code"
          placeholder="请输入受理编号"
          style="width: 200px;"
          clearable
          @clear="clearFlowCode"
        ></el-input>
        <el-input
          v-model="screenData.direction"
          placeholder="请输入申报方向"
          style="width: 200px; margin-left:10px;"
          clearable
          @clear="clearFlowDirection"
        ></el-input>

        <!-- 实例状态 -->
        <el-select
          v-model="screenData.status"
          style="width: 160px;margin-left: 10px;"
          placeholder="请选择实例状态"
        >
          <el-option
            v-for="item in currentStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!--  -->
        <div class="screen-btn">
          <el-button type="primary" style="width: 80px;" @click="getTableData(1)">查询结果</el-button>
          <el-button style="width: 80px;margin-left: 10px;color:#409EFF;" @click="resetQuery">重置</el-button>
        </div>
      </div>

      <!-- 新增/排序 -->
      <div class="table-wrapper">
        <!-- <el-button type="primary" style="width: 80px;" @click="showTableAdd = true">新增流程</el-button> -->

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

      <div style="margin-top: 8px;" id="el__table">
        <el-table
          :data="tableData"
          min-height="350"
          border
          style="width: 100%"
          :header-cell-style="setHeaderStyle"
          :cell-style="setRowStyle"
        >
          <el-table-column type="selection" width="70" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="序号" width="70" type="index"></el-table-column>
          <el-table-column prop="YWLSH" label="受理编号" width="130"></el-table-column>
          <el-table-column prop="declarationName" label="申报方向名称" width="150"></el-table-column>
          <el-table-column prop="projectName" label="所属项目" width="150"></el-table-column>
          <el-table-column prop="flowName" label="流程名称"></el-table-column>

          <el-table-column prop="STATUS" label="当前状态" width="120">
            <template slot-scope="scope">
              <span>{{queryStatusName(scope.row.STATUS)}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <!-- <el-button size="mini" @click="handleFlowChart(scope.row)">流程图</el-button>
              <el-button size="mini" @click="handleProcessInfo(scope.row)">过程信息</el-button>-->

              <el-link
                style="margin-right:16px;"
                type="primary"
                :underline="false"
                @click="handleFlowChart(scope.row)"
              >流程图</el-link>
              <el-link type="primary" :underline="false" @click="handleProcessInfo(scope.row)">过程信息</el-link>
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
// import { timestamp, timestampYMD } from "../../util/date.js";
import { post1, post } from "../../util/http.js";

import { getInstanList, getProcessInfo } from "../../util/api.js";

export default {
  components: {},
  data() {
    return {
      flowId: "", // 传递过来的flowId
      // 筛选数据
      screenData: {
        code: "",
        direction: "", // 申报方向
        status: "", // 实例状态
        sortOrder: "" // 排序方式
      },
      currentStatus: [
        // 实例状态
        {
          value: 0,
          label: "正常"
        },
        {
          value: 1,
          label: "补交资料等待"
        },
        {
          value: 2,
          label: "挂起"
        },
        {
          value: 3,
          label: "作废"
        },
        {
          value: 9,
          label: "完成"
        }
      ],

      // 排序
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
      total: 0 // 总条数
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

    // 删除输入的受理编码
    clearFlowCode() {
      this.screenData.code = "";
      // 从新请求
      this.pagenum = 1;
      this.getTableData();
    },
    // 删除输入的申报方向名称
    clearFlowDirection() {
      this.screenData.direction = "";
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

    // 流程图
    handleFlowChart(scope) {
      console.log("流程图当前数据源", scope);
      const flowId = scope.flowId;
      this.$router.push({
        path: "/add_flow",
        query: {
          flag: 3,
          flowId: flowId,
          flowName: scope.declarationName,
          ywlsh: scope.YWLSH
        }
      }); // 3 为流程实例
    },

    // 过程信息
    handleProcessInfo(scope) {
      console.log("过程信息当前数据源", scope);
      this.$router.push({
        path: "/process_info",
        query: { ywlsh: scope.YWLSH }
      });
    },

    //获取表格数据
    getTableData(page) {
      let me = this;

      // 获取其他筛选数据
      // 受理编码
      let code = me.screenData.code ? me.screenData.code.trim() : "";

      // 申报方向
      let direction = me.screenData.direction
        ? me.screenData.direction.trim()
        : "";

      // 实例状态
      // let status =
      //   me.screenData.status == 0
      //     ? 0
      //     : me.screenData.status
      //     ? me.screenData.status
      //     : "";

      // 排序方式
      let sortOrder = me.screenData.sortOrder ? me.screenData.sortOrder : "";

      console.error(
        "拿到的数据：",
        code,
        direction,
        me.screenData.status,
        sortOrder
      );

      // 请求数据
      let pagenum = page || me.pagenum;
      console.error("当前准备请求的页码是：", pagenum);
      me.pagenum = pagenum;

      post(me, getInstanList, {
        ywlsh: code, // 受理编码
        declarationName: direction, // 申报方向
        status: me.screenData.status, // 实例状态
        orderType: sortOrder, // 排序
        current: pagenum,
        size: me.pagesize,
        flowId: me.flowId // 流程授权中，跳过来的，如果有就加，没有就为空
      })
        .then(res => {
          console.log("流程实例得到的数据：", res);

          if (res && res.code == 1) {
            const { data, totalCount } = res;
            me.tableData = data;
            me.total = totalCount;
          }
        })
        .catch(err => {
          console.log("请求流程实例接口异常：", err);
        });
    },

    queryStatusName(status) {
      console.log("=========拿到的状态数据：", status);
      switch (status) {
        case "0":
          return "正常";
        case "1":
          return "补交资料等待";
        case "2":
          return "挂起";
        case "3":
          return "作废";
        case "9":
          return "完成";
      }
    },

    // 重置查询要求
    resetQuery() {
      let me = this;

      console.log("是否需要重置：", me.screenData);
      if (
        me.screenData.code !== "" ||
        me.screenData.direction !== "" ||
        me.screenData.status !== ""
      ) {
        me.screenData.code = "";
        me.screenData.direction = ""; // 申报方向
        me.screenData.status = ""; // 实例状态

        console.log("重置查询后的查询要求是：", me.screenData);
        // 重新请求数据炫染
        me.getTableData();
      }
    }
  },

  computed: {},
  watch: {
    "screenData.sortOrder": function(newVal, oldVal) {
      console.log("排序方式发生变化：", newVal, oldVal);
      // 发送请求
      // this.pagenum = 1;
      this.getTableData();
    }
  },

  created() {
    const flowId = this.$route.query.flowId || "";
    console.log("传递过来的id：", flowId);
    this.flowId = flowId;
    // 获取表格数据
    this.getTableData();
  },
  mounted() {}
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

#el__table >>> .el-checkbox__inner {
  margin-left: 0;
}
</style>