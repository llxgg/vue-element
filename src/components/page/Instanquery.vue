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
          placeholder="受理编号"
          style="width: 200px;"
          clearable
          @clear="clearFlowCode"
        ></el-input>
        <el-input
          v-model="screenData.direction"
          placeholder="申报方向"
          style="width: 200px; margin-left:10px;"
          clearable
          @clear="clearFlowDirection"
        ></el-input>

        <!-- 流程状态 -->
        <el-select
          v-model="screenData.status"
          style="width: 120px;margin-left: 10px;"
          placeholder="当前状态"
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
          <el-button type="primary" style="width: 80px;" @click="handleQueryResult">查询结果</el-button>
          <el-button style="width: 80px;margin-left: 10px;" @click="resetQuery">重置</el-button>
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
          <el-table-column prop="code" label="受理编号" width="120"></el-table-column>
          <el-table-column prop="declareName" label="申报方向名称"></el-table-column>
          <el-table-column prop="project" label="所属项目" width="120"></el-table-column>
          <el-table-column prop="flowName" label="流程名称" width="120"></el-table-column>

          <el-table-column prop="status" label="当前状态" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.status == 1 ? currentStatus[0].label : currentStatus[1].label}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleFlowChart(scope.row)">流程图</el-button>
              <el-button size="mini" @click="handleProcessInfo(scope.row)">过程信息</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-size="pagesize"
          :page-sizes="[10, 20, 30]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 10px;width:100%;overflow:hidden;"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      // 筛选数据
      screenData: {
        code: "",
        direction: "",
        status: "",
        sortOrder: "", // 排序方式
      },
      currentStatus: [
        // 流程状态
        {
          value: 1,
          label: "进行中"
        },
        {
          value: 2,
          label: "已完成"
        }
      ],

      sortRanks: [
        {
          value: "name",
          label: "流程名称"
        },
        {
          value: "number",
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
      pagesize: 10, // 每页多少条
      total: 100 // 总条数
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


    // 删除输入的内容
    clearFlowCode() {
      this.screenData.code = ""
    },
    clearFlowDirection() {
      this.screenData.direction = ""
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

    // 流程图
    handleFlowChart(scope) {
      console.log("流程图当前数据源", scope);
    },
    // 过程信息
    handleProcessInfo(scope) {
      console.log("过程信息当前数据源", scope);
    },

    // 按要求查询数据：
    handleQueryResult() {
      let me = this;

      // 获取其他筛选数据
      let code = me.screenData.code ? me.screenData.code.trim() : "";
      let direction = me.screenData.direction ? me.screenData.direction.trim() : "";  
      let status = me.screenData.status ? me.screenData.status : "";
      // 排序方式
      let sortOrder = me.screenData.sortOrder ? me.screenData.sortOrder : "";

      console.error(
        "拿到的数据：",
        code,
        direction,
        status,
        sortOrder
      );

      // 请求数据
    },

       //获取表格数据
    getTableData() {
      this.tableData = [
        {
          code: "123456",
          declareName: "东莞市高端人才认定及个人所得税补贴",
          project: "人才补贴",
          flowName: "境外人才补贴申领",
          status: 1
        },
        {
          code: "66896",
          declareName: "东莞市高端人才认定及个人所得税补贴",
          project: "人才补贴",
          flowName: "境外人才补贴申领",
          status: 2
        }
      ];
    },

    // 重置查询要求
    resetQuery() {
      let me = this;
      me.screenData = {
        code: "",
        direction: "",
        status: "",
        sortOrder: "",
      };
      console.log("重置查询后的查询要求是：", me.screenData);
      // 重新请求数据炫染
      me.getTableData();
    }
  },

  computed: {},
  watch: {
    "screenData.sortOrder":function(newVal,oldVal){
      console.log('排序方式发生变化：',newVal,oldVal);
      // 发送请求
      this.getTableData();
    }
  },


created(){

},
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