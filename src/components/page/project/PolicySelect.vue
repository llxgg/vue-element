<!-- 政策选择 -->
<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
        <el-breadcrumb-item>项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- card -->
    <div class="container">
      <div style="margin-bottom: 3px;font-weight:530;">选择政策</div>
      <!-- 条件筛选 -->
      <div class="table-wrapper">
        <!-- 请选择政策发布部门 -->
        <el-select
          v-model="screenData.publish"
          style="width: 180px;margin-left: 10px;"
          placeholder="请选择政策发布部门"
        >
          <el-option
            v-for="item in publishs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 请选择政策执行区域 -->
        <el-select
          v-model="screenData.policy"
          style="width: 180px;margin-left: 10px;"
          placeholder="请选择政策执行区域"
        >
          <el-option
            v-for="item in policys"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 搜索关键词 -->
        <el-input
          v-model="screenData.name"
          placeholder="请输入搜索关键词"
          style="width: 200px;margin:0 20px 0 10px;"
          clearable
          @clear="clearPolicyName"
        ></el-input>

        <el-button type="primary" style="width: 80px;" @click="getTableData(1)">查询结果</el-button>
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
          @row-click="selectRow"
        >
          <el-table-column width="70" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-radio
                v-model="selectRadioIndex"
                :label="scope.$index"
                @change.native="getCurrentRow(scope.row)"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>

          <el-table-column label="序号" width="70" type="index"></el-table-column>

          <el-table-column prop="flowName" label="政策名称" width="280"></el-table-column>
          <el-table-column prop="flowName" label="政策内容"></el-table-column>

          <el-table-column prop="flowVersion" label="区域" width="160"></el-table-column>

          <el-table-column prop="flowCode" label="发布部门" width="180"></el-table-column>
        </el-table>

        <!-- 分页 -->
        <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-size="pagesize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 10px;width:100%;overflow:hidden;"
        ></el-pagination>-->

        <!-- 取消、下一步 -->
        <div class="btn-bottom">
          <el-button style="margin-right:30px;" @click="cancelPolicy" class="elbutton">取消</el-button>
          <el-button type="primary" @click="nextPagePolicy" class="elbutton">下一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { timestamp, timestampYMD } from "../../../util/date.js";
import { post, post1 } from "../../../util/http.js";
import {
  getFlowData,
  deleteFlow,
  deleteAllFlow,
  queryIdFlowNode
} from "../../../util/api.js";

export default {
  components: {},
  data() {
    return {
      // 筛选数据
      screenData: {
        name: "", // 项目名称
        publish: "", // 发布部门
        policy: "" // 所属政策
      },

      selectRadioIndex:"", // 选中的高亮
      selectRadio: "", // 选择表格中的那条数据

      policys: [
        // 所属政策
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

      examineStatues: [
        // 审核状态
        {
          value: 1,
          label: "未审核"
        },
        {
          value: 2,
          label: "已审核"
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

    // 删除输入的内容
    clearPolicyName() {
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

    // 选择那一行的数据：
    selectRow(row) {
      console.warn("选择那一行的数据：", row, this.tableData.indexOf(row));
      this.selectRadioIndex = this.tableData.indexOf(row);
      this.selectRadio = row;
    },
    getCurrentRow(row) {
      this.selectRadioIndex = row;
      this.selectRadio = row;
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
      console.log("是否需要重置：", me.screenData);

      if (
        me.screenData.name !== "" ||
        me.screenData.publish !== "" ||
        me.screenData.policy !== "" ||
        me.screenData.examineStatus !== "" ||
        me.screenData.startDate !== "" ||
        me.screenData.endDate !== ""
      ) {
        me.screenData.name = "";
        me.screenData.publish = "";
        me.screenData.policy = "";
        me.screenData.examineStatus = "";
        me.screenData.startDate = "";
        me.screenData.endDate = "";

        console.log("重置查询后的查询要求是：", me.screenData);
        // 重新请求数据炫染
        me.getTableData();
      }
    },

    // 取消
    cancelPolicy() {
      this.$router.back(-1);
    },
    // 下一步
    nextPagePolicy() {
      console.warn('单选选中了哪一个：',this.selectRadio);
      this.$router.push({
        path: "/addpolicyproject",
        query: {}
      });
    }
  },

  computed: {},
  watch: {
    // 监听排序方式是否发生了改变
    "screenData.sortOrder": function(newVal, oldVal) {
      console.log("排序方式是否发生了变化：", newVal, oldVal);
      // this.pagenum = 1;
      //  return console.log('排序时的页码是：',this.pagenum);

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

#el__table >>> .el-checkbox__inner {
  margin-left: 0;
}
/* #el__table >>> .el-radio__label {
  display: none !important;
} */

.btn-bottom {
  width: 100%;
  /* padding: 20px 0 20px 27%; */
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>