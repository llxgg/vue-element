<!-- 流程授权 -->
<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 流程配置 / 流程定义
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- card -->
    <div class="container">
      <div style="margin-bottom: 3px;">流程定义</div>
      <!-- 条件筛选 -->
      <div class="table-wrapper">
        <el-input
          v-model="screenData.name"
          placeholder="流程名称"
          style="width: 200px;"
          clearable
          @clear="clearFlowName"
        ></el-input>
        <el-input
          v-model="screenData.code"
          placeholder="流程编码"
          style="width: 200px; margin-left:10px;"
          clearable
          @clear="clearFlowCode"
        ></el-input>

        <!-- 流程状态 -->
        <el-select
          v-model="screenData.status"
          style="width: 120px;margin-left: 10px;"
          placeholder="流程状态"
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
          <el-button style="width: 80px;margin-left: 10px;" @click="resetQuery">重置</el-button>
        </div>
      </div>

      <!-- 新增/排序 -->
      <div class="table-wrapper">
        <el-button type="primary" style="width: 80px;" @click="addFlow">新增流程</el-button>

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
      <div style="margin-top: 8px;">
        <el-table
          :data="tableData"
          height="250"
          border
          style="width: 100%"
          :header-cell-style="setHeaderStyle"
          :cell-style="setRowStyle"
        >
          <el-table-column type="selection" width="55" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="序号" width="60" type="index"></el-table-column>

          <el-table-column prop="flowName" label="流程名称" width="150"></el-table-column>
          <el-table-column prop="flowCode" label="流程编码" width="150"></el-table-column>

          <el-table-column prop="flowVersion" label="最新版本" width="100"></el-table-column>

          <el-table-column prop="status" label="当前状态" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.status == 2 ? flowStatus[1].label : flowStatus[0].label}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="instanceCount" label="当前运行实例数" width="120"></el-table-column>

          <el-table-column prop="create_time" label="创建时间">
            <template slot-scope="scope">
              <span>{{formatDate(scope.row.create_time, "yy-mm-dd hh:mm:ss")}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="flowId" label="操作" width="260">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleSee(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleRemove(scope.$index, scope.row)">删除</el-button>
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
        <el-dialog title="提示" :visible.sync="showDelete" :modal="true" width="400px">
          <span>删除后无法恢复，您是否确定删除当前流程？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDelete = false">取 消</el-button>
            <el-button type="primary" @click="deleteFlow">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { timestamp, timestampYMD } from "../../util/date.js";
import { post1 } from "../../util/http.js";
import { getFlowData } from "../../util/api.js";

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
      showDelete: false, // 删除流程
      flowStatus: [
        // 流程状态
        {
          value: 1,
          label: "暂存"
        },
        {
          value: 2,
          label: "已提交"
        }
      ],

      sortRanks: [
        {
          value: "name",
          label: "流程名称"
        },
        {
          value: "code",
          label: "流程编号"
        },
        {
          value: "status",
          label: "流程状态"
        },
        {
          value: "create_time",
          label: "创建时间"
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
    // 删除输入的内容
    clearFlowName() {
      this.screenData.name = "";
    },
    clearFlowCode() {
      this.screenData.code = "";
    },

    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
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
        ? timestampYMD(me.screenData.startDate) + " 00:00:00"
        : "";
      let endTime = me.screenData.endDate
        ? timestampYMD(me.screenData.endDate) + " 23:59:59"
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
      let status = me.screenData.status ? me.screenData.status : "";
      let sortOrder = me.screenData.sortOrder ? me.screenData.sortOrder : "";

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
        limit:'5',
        page: '1',
        likeALL_FLOW_CODE: code,
        likeALL_FLOW_NAME: name,
        loadList: false,
        forSel: "",
        layTableCheckbox:"on",
      }).then(res => {
        console.log("得到的数据：", res);
        const { start, code, total, data } = res;
        if (code == 1 && data.length > 0) {
          me.tableData = data;
          // me.total = total;
        }
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



    // 表格事件
    handleSee() {
      alert("查看当前流程");
    },
    handleEdit() {
      alert("编辑当前流程");
    },
    handleRemove() {
      // 打开弹出框
      this.showDelete = true;
    },



    // 确定删除当前流程
    deleteFlow() {
      // 删除请求：.......
      // 隐藏弹出框
      this.showDelete = false;
    },

    // 新增流程
    addFlow() {
      this.$router.push({ path: "/add_flow" });
    }
  },



  computed: {},
  watch: {
    // 监听排序方式是否发生了改变
    "screenData.sortOrder": function(newVal, oldVal) {
      console.log("排序方式是否发生了变化：", newVal, oldVal);
      // 请求
      // this.getTableData();
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
</style>