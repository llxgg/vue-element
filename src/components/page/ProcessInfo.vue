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
        <el-breadcrumb-item>查询过程信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- card -->
    <div class="container">
      <!-- <div style="margin-bottom: 3px;">流程授权</div> -->
      <!-- 条件筛选 -->
      <div class="table-wrapper">
        <el-input
          v-model="screenData.name"
          placeholder="环节名称"
          style="width: 200px;"
          clearable
          @clear="clearLinkName"
        ></el-input>

        <!-- 执行人 -->
        <el-select
          v-model="screenData.executor"
          style="width: 120px;margin-left: 20px;"
          placeholder="执行人"
        >
          <el-option
            v-for="item in executors"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 执行意见 -->
        <el-select
          v-model="screenData.executorIdea"
          style="width: 120px;margin-left: 20px;"
          placeholder="执行意见"
        >
          <el-option
            v-for="item in executorIdeas"
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

 

        <!--  -->
        <div class="screen-btn">
          <el-button type="primary" style="width: 80px;" @click="getTableData">查询结果</el-button>
          <el-button style="width: 80px;margin-left: 10px;color:#409EFF;" @click="resetQuery">重置</el-button>
        </div>
      </div>

      <!-- 项目绑定/排序 -->
      <!-- <div class="table-wrapper">
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
      </div> -->


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
          <!-- <el-table-column type="selection" width="55" :show-overflow-tooltip="true"></el-table-column> -->
          <el-table-column label="序号" width="80" type="index"></el-table-column>

          <el-table-column prop="nodeName" label="环节名称" width="220"></el-table-column>
          <el-table-column prop="executeUserName" label="执行人" width="150"></el-table-column>

          <el-table-column prop="executeTime" label="执行时间">
            <!-- <template slot-scope="scope">
              <span>{{formatDate(scope.row.create_time, "yy-mm-dd hh:mm:ss")}}</span>
            </template>-->
          </el-table-column>

              <el-table-column prop="note" label="执行意见"></el-table-column>

          <el-table-column prop="remark" label="备注" width="230"></el-table-column>
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
        <!-- <el-dialog title="提示" :visible.sync="showDelete" :modal="true" width="400px">
          <span>删除后无法恢复，您是否确定删除当前流程？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDelete = false">取 消</el-button>
            <el-button type="primary" @click="deleteFlow">确 定</el-button>
          </span>
        </el-dialog> -->
      </div>
    </div>
  </div>
</template>

<script>
import { timestamp, timestampYMD } from "../../util/date.js";
import { post,post1 } from "../../util/http.js";
import { getProcessInfo } from "../../util/api.js";

export default {
  components: {},
  data() {
    return {
      // 筛选数据
      screenData: {
        name: "", // 环节名称
        executor: "", // 执行人
        executorIdea: "" // 执行意见
      },

      // showDelete: false, // 删除绑定的流程

      // 执行人
      executors: [
        {
          value: 1,
          label: "one"
        },
        {
          value: 2,
          label: "two"
        },
        {
          value: 3,
          label: "three"
        }
      ],
      // 执行意见
      executorIdeas: [
        {
          value: 1,
          label: "好"
        },
        {
          value: 2,
          label: "很好"
        },
        {
          value: 3,
          label: "非常好"
        }
      ],

      tableData: [], // 表格数据
      pagenum: 1, // 当前页码
      pagesize: 5, // 每页多少条
      total: 100, // 总条数
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


    // 清空输入的流程名称
    clearLinkName() {
      this.screenData.name = "";
      this.getTableData()
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



    //获取表格数据
    getTableData(ywlsh) {
      let me = this;
      let name = me.screenData.name ? me.screenData.name.trim() : "";

      console.log("输入的数据：",name, me.screenData.executor, me.screenData.executorIdea);

      post(me, getProcessInfo, {
        limit: me.pagesize,
        page: me.pagenum,
        // likeALL_flow_Name: name,
        "ywlsh": ywlsh,
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



  },

  computed: {},
  watch: {},

  created() {
    let ywlsh = this.$route.query.ywlsh;
    console.log('=====得到的业务流水号：======',ywlsh);
    this.getTableData(ywlsh);
  },

  mounted() {
    // 获取表格数据
    // this.getTableData();
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