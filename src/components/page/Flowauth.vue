<!-- 流程授权 -->
<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 流程配置 / 流程授权
        </el-breadcrumb-item>
      </el-breadcrumb> -->

       <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
        <el-breadcrumb-item>流程配置</el-breadcrumb-item>
        <el-breadcrumb-item>流程授权</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

  

    <!-- card -->
    <div class="container">
      <div style="margin-bottom: 3px;">流程授权</div>
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
          style="width: 120px;margin-left: 10px;"
          placeholder="所属项目"
        >
          <el-option
            v-for="item in projects"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 授权状态 -->
        <el-select
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
        </el-select>

        <!-- 发布状态 -->
        <el-select
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
        </el-select>

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
        </div>

        <!--  -->
        <div class="screen-btn">
          <el-button type="primary" style="width: 80px;" @click="getTableData">查询结果</el-button>
          <el-button style="width: 80px;margin-left: 10px;" @click="resetQuery">重置</el-button>
        </div>
      </div>

      <!-- 项目绑定/排序 -->
      <div class="table-wrapper">
        <el-button type="primary" style="width: 80px;" @click="goPage">项目绑定</el-button>

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
          min-height="250"
          border
          style="width: 100%"
          :header-cell-style="setHeaderStyle"
          :cell-style="setRowStyle"
        >
          <el-table-column type="selection" width="55" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="序号" width="50" type="index"></el-table-column>

          <el-table-column prop="declarationName" label="申报方向" width="130"></el-table-column>
          <el-table-column prop="directCode" label="申报编码" width="130"></el-table-column>
          <el-table-column prop="projectName" label="所属项目" width="150"></el-table-column>
          <el-table-column prop="flowName" label="流程名称" width="150"></el-table-column>
          <el-table-column prop="flowVersion" label="流程版本" width="80"></el-table-column>

          <el-table-column prop="grantStatus" label="授权状态" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.roleStatus == 1 ? roleStatues[0].label : roleStatues[1].label}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="publishStatus" label="发布状态" width="80">
            <template scope="scope">
              <span>{{scope.row.sendStatus == 1 ? sendStatues[0].label : sendStatues[1].label}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间">
            <!-- <template slot-scope="scope">
              <span>{{formatDate(scope.row.create_time, "yy-mm-dd hh:mm:ss")}}</span>
            </template>-->
          </el-table-column>

          <el-table-column label="操作" width="230">
            <template slot-scope="scope">
              <el-button
                size="mini"
                style='margin-right:6px;'
                @click="handleRole(scope.row)"
                v-if="scope.row.grantStatus == 0"
              >授权</el-button>
              <el-button
                size="mini"
                style='margin-right:6px;'
                @click="handleEdit(scope.row)"
                v-else-if="scope.row.grantStatus == 1"
              >编辑</el-button>
              <el-button size="mini" type="primary" @click="handleSend(scope.row)" style='margin-right:6px;'>发布</el-button>
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
import { getDeclareList } from "../../util/api.js";

export default {
  components: {},
  data() {
    return {
      // 筛选数据
      screenData: {
        name: "", // 流程名称
        project: "", // 所属项目
        roleStatus: "", // 授权状态
        sendStatus: "", // 发布状态

        startDate: "",
        endDate: "",
        sortOrder: "" // 排序方式
      },
      showDelete: false, // 删除绑定的流程
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
      // 授权状态
      roleStatues: [
        {
          value: 0,
          label: "未授权"
        },
        {
          value: 1,
          label: "已授权"
        }
      ],
      // 发布状态
      sendStatues: [
        {
          value: 0,
          label: "未发布"
        },
        {
          value: 1,
          label: "已发布"
        }
      ],

      // 排序方式
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
      total: 100, // 总条数

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
    // 项目绑定
    goPage() {
      this.$router.push({ path: "/bind_flow",query: { parentPath: "flowauth" } });
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
    // handleQueryResult() {},

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

      post1(me, getDeclareList, {
        limit: me.pagesize,
        page: me.page,
        likeALL_flow_Name: name,
        "gtString_ffd.create_time": startTime,
        "ltString_ffd.create_time": endTime
      }).then(res => {
        console.log("申报流程得到的数据：", res);
        if (res && res.code == 1) {
          const { data, totalCount } = res;
          me.tableData = data;
          me.total = totalCount;
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
    handleRole() {
      alert("授权");
    },
    handleEdit() {
      alert("编辑");
    },
    handleSend() {
      alert("发布");
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
</style>