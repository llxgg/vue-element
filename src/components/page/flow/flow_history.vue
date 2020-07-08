<!-- 历史版本 -->
<template>
  <div>
    <!-- 面包屑 -->
    <!-- <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 流程配置 / 流程定义
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>-->

    <!-- card -->
    <div class="container">
      <!-- 表格 -->
      <div style="margin-top: 8px;">
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
          <el-table-column type="selection" width="80" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="序号" width="80" type="index"></el-table-column>

          <el-table-column prop="flowName" label="流程名称"></el-table-column>
          <el-table-column prop="flowCode" label="流程编码" width="200"></el-table-column>

          <el-table-column prop="flowVersion" label="流程版本" width="100"></el-table-column>

          <!-- <el-table-column prop="status" label="当前状态" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.status == 2 ? flowStatus[1].label : flowStatus[0].label}}</span>
            </template>
          </el-table-column>-->

          <el-table-column prop="instanceCount" label="当前运行实例数" width="120"></el-table-column>

          <!-- <el-table-column prop="createTime" label="创建时间">
             <template slot-scope="scope">
              <span>{{formatDate(scope.row.create_time, "yy-mm-dd hh:mm:ss")}}</span>
            </template>
          </el-table-column>-->

          <!-- <el-table-column prop="flowId" label="操作" width="260">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleSee(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleRemove(scope.row)">删除</el-button>
            </template>
          </el-table-column>-->
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
      </div>
    </div>
  </div>
</template>

<script>
// import { timestamp, timestampYMD } from "../../util/date.js";
import { post, post1 } from "../../../util/http.js";
import { historyFlow } from "../../../util/api.js";

export default {
  components: {},
  data() {
    return {
      pagesize: 5,
      pagenum: 1,
      total: 0,
      tableData:[],
      historyCode: ""
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

    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getFlowHistory();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getFlowHistory();
    },

    handleSelectFlow() {},
    handleSelectFlowAll() {},

    // getFlowHistory --- 根据code查询当前流程
    getFlowHistory() {
      let me = this;
      post1(me, historyFlow, {
        page: me.pagenum,
        limit: me.pagesize,
        eqString_FLOW_CODE: me.historyCode
      }).then(res => {
        console.log("得到的历史版本数据：", res);
        if(res && res.code == 1){
          this.tableData = res.data;
          this.total = res.totalCount;
        }
      });
    }
  },

  computed: {},
  watch: {},

  created() {
    console.log("history获取到的数据：", this.$route.query.code);

    // 获取参数发起请求
    if (!this.$route.query.code) {
      this.$router.push("/flowdefine");
      return;
    }
    
    this.historyCode = this.$route.query.code

    this.getFlowHistory()
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
</style>