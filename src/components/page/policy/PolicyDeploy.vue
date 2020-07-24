<template>
    <div>
        <div class="crumbs">
           <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
                <el-breadcrumb-item>政策管理</el-breadcrumb-item>
                <el-breadcrumb-item>政策配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div style="margin-bottom: 3px;font-weight:530;">政策配置</div>
            
         <div class="table-wrapper">
        <el-input
          v-model="screenData.name"
          placeholder="请输入政策名称"
          style="width: 200px;"
          clearable
          @clear="clearPolicyName"
        ></el-input>
         <!-- 发布部门 -->
        <el-select
          v-model="screenData.department"
          style="width: 150px;margin-left: 10px;"
          placeholder="发布部门"
        >
          <el-option
            v-for="item in departments"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
         <!-- 政策分类 -->
        <el-select
          v-model="screenData.policy"
          style="width: 150px;margin-left: 10px;"
          placeholder="政策分类"
        >
          <el-option
            v-for="item in policys"
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

        <!-- 查询重置 -->
        <div class="screen-btn">
          <el-button type="primary" style="width: 80px;" @click="getTableData(1)">查询结果</el-button>
          <el-button style="width: 80px;margin-left: 10px;color:#409EFF;" @click="resetQuery">重置</el-button>
        </div>
      
        </div>
        <!-- 新增/排序 -->
      <div class="table-wrapper">
        <el-button type="primary" style="width: 100px;" @click="addPolicy">新增政策</el-button>
        <el-button type="primary" style="width: 100px;" @click="addNotice">新增通知</el-button>

      
        <div class="screen-btn">
          <el-button
            style="width: 80px;margin-right:20px;color:#409EFF;"
            @click="deleteAllPolicy"
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
          <el-table-column prop="policyName" label="政策名称" width="220"></el-table-column>
          <el-table-column prop="policyCode" label="编码编码" width="220"></el-table-column>
          <el-table-column prop="department" label="发布部门" width="100"></el-table-column>
          <el-table-column prop="policy" label="政策分类" width="100"></el-table-column>
          <el-table-column prop="status" label="审核状态" width="100">
            <template slot-scope="scope">
              <span>{{queryPolicyStatus(scope.row.status)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <!-- 拿到政策的id做操作 -->
        <el-table-column prop="policyId" label="操作" width="260">
            <template slot-scope="scope">
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
      </div>

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



         <!-- 删除单个的提示 -->
        <el-dialog
          title="提示"
          style="text-align:center;"
          :visible.sync="showDelete"
          :modal="true"
          width="400px"
          id="dialog_footer"
        >
          <span>删除后无法恢复，您是否确定删除当前政策？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDelete = false" style="margin-right:16px;">取 消</el-button>
            <el-button type="primary" @click="deleteFlowSelect">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 删除多个的提示 -->
        <el-dialog
          title="提示"
          style="text-align:center;"
          :visible.sync="showDeleteAll"
          :modal="true"
          width="400px"
          id="dialog_footer"
        >
          <span>{{showDeleteAllTip}}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDeleteAll = false" style="margin-right:16px;">取 消</el-button>
            <el-button type="primary" @click="deleteFlowSelectAll">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      
    </div>
</template>

<script>
import { timestamp, timestampYMD } from "../../../util/date.js";
import { post, post1 } from "../../../util/http.js";
// import {
  
// } from "../../../util/api.js";

    // import bus from '../common/bus';
    export default {
        name: 'policydeploy',
        data() {
            return {
                 screenData: {
                    name: "",//名称
                    department: "",//部门
                    policy: "",//政策
                    startDate: "",
                    endDate: "",
                    sortOrder: "" // 排序方式
                },
                showDelete: false, // 删除流程弹窗
                removePolicyId: "", // 要删除那个节点

                showDeleteAll: false, // 删除多个流程
                deletePolicyArr: [], // 要删除的流程集合
                showDeleteAllTip: "", // 提示
                // 发布部门
                departments: [
                    {
                    value: 1,
                    label: "A部门"
                    },
                    {
                    value: 2,
                    label: "B部门"
                    },
                    {
                    value: 3,
                    label: "C部门"
                    }
                 ],
                 //政策分类
                 policys: [
                    {
                    value: 1,
                    label: "A政策"
                    },
                    {
                    value: 2,
                    label: "B政策"
                    },
                    {
                    value: 3,
                    label: "C政策"
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
                
            }
        },
        components: {
            
        },
        computed: {
     
        },
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
            queryPolicyStatus(status) {
            console.log("审核状态：", status);

            switch (status) {
                case "1":
                return "待审核";
                case "2":
                return "不通过";
                case "3":
                return "已发布";
            }
            },

           // 删除输入的内容
          clearPolicyName() {
            this.screenData.name = "";
            // 从新请求
            this.pagenum = 1;
            this.getTableData();
            },
            //获取表格数据
            getTableData(page){
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


      let pagenum = page || this.pagenum;
      console.error("当前准备请求的页码是：", pagenum);
      this.pagenum = pagenum;

      // // 请求数据....
      // post1(me, getFlowData, {
      //   likeALL_flow_Name: name,
      //   likeALL_flow_code: code,
      //   gtString_CREATE_TIME: startTime,
      //   ltString_CREATE_TIME: endTime,
      //   orderType: sortOrder,
      //   limit: this.pagesize,
      //   page: pagenum
      // })
      //   .then(res => {
      //     console.log("得到的数据：", res);
      //     if (res && res.code == 1) {
      //       const { start, code, totalCount, data } = res;
      //       me.tableData = data;
      //       me.total = totalCount;
      //     }
      //   })
      //   .catch(err => {
      //     console.log("错误请求：", err);
      //   });


             },
            // 重置查询要求
            resetQuery() {
            let me = this;
            console.log("是否需要重置：", me.screenData);
            if (
                me.screenData.name !== "" ||
                me.screenData.department !== "" ||
                me.screenData.policy !== "" ||
                me.screenData.startDate !== "" ||
                me.screenData.endDate !== ""
            ) {
                me.screenData.name = "";
                me.screenData.department = "";
                me.screenData.policy = "";
                me.screenData.startDate = "";
                me.screenData.endDate = "";

                console.log("重置查询后的查询要求是：", me.screenData);
                // 重新请求数据炫染
                me.getTableData();
            }
            },

            //新增政策
            addPolicy(){
                this.$router.push({
                path: "/addpolicy",
                query:{CandE:"0"}
              });
            },

            //新增通知
            addNotice(){
                this.$router.push({
                path: "/addnotice",
                query:{CandE:"0"}
              });
            },

            //批量删除
            deleteAllPolicy(){
               if (this.deletePolicyArr.length > 0) {
              // 弹框
              this.showDeleteAllTip = `是否确认删除当前选中的${this.deletePolicyArr.length}项流程`;
              this.showDeleteAll = true;
            } else {
              this.showDeleteAllTip = "请选择需要批量删除的流程";
              this.showDeleteAll = true;
            }
            },
            // 批量删除
            // 自定义选择
            handleSelectFlow(selection, row) {
            console.log("选择了那个：", selection, row);
            // 把全选的内容id先保存为一个数组
            var deletePolicyArr = selection.map(item => item.flowId);
            console.log("要删除的id集合：", deletePolicyArr);
            // 保存：
            this.deletePolicyArr = deletePolicyArr;
            },
            // 全选事件
            handleSelectFlowAll(selection) {
            console.log("全选", selection);
            // 把全选的内容id先保存为一个数组
            var deletePolicyArr = selection.map(item => item.flowId);
            console.log("要删除的id集合：", deletePolicyArr);
            // 保存：
            this.deletePolicyArr = deletePolicyArr;
            },
           

            // 表格事件
            // 查看
            handleSee(scope) {
            console.log("查看那条政策的数据：", scope);

            if (scope) {
                const policyId = scope.policyId;
                const status = scope.status;
                this.$router.push({
                path: "/addpolicy",
                query: { policyId: policyId, CandE: 1 ,status:status}
                });
            }

            },
            // 编辑
            handleEdit(scope) {
            // alert("编辑当前流程");
            if (scope) {
                const policyId = scope.policyId;
                this.$router.push({
                path: "/addpolicy",
                query: { policyId: policyId, CandE: 2 }
                });
            }
            },
            handleRemove(scope) {
            // console.log('要删除的节点：',scope);
            this.removePolicyId = scope.flowId;

            // 打开弹出框
            this.showDelete = true;
            },



            //删除
              // 确定删除当前流程
            deleteFlowSelect() {
            let me = this;
            // 删除请求：.......
            console.log("要删除的流程id：", me.removePolicyId);
            // 请求数据....
            post1(me, deleteFlow, {
                ids: me.removePolicyId
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

            //删除多个
             deleteFlowSelectAll() {
            let me = this;
            // 隐藏
            this.showDeleteAll = false;

            // 执行删除操作
            if (this.deletePolicyArr.length > 0) {
                // post(me, deleteAllFlow, {
                // flowIds: this.deletePolicyArr
                // })
                // .then(res => {
                //     console.log("批量删除的结果：", res);
                //     if (res && res.code == 0) {
                //     this.$message.success(res.msg || "批量删除成功");
                //     this.deletePolicyArr = []; // 重置
                //     // 重新请求表格
                //     this.getTableData();
                //     } else {
                //     // 重新请求表格
                //     // this.getTableData();
                //     this.deletePolicyArr = []; // 重置
                //     this.$message.error(res.msg || "批量删除失败，请稍后再试");
                //     }
                // })
                // .catch(err => {
                //     console.log("批量删除异常：", err);
                // });
            } else {
                this.showDeleteAll = false;
            }
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


        }
    }
  //   watch: {
  //   // 监听排序方式是否发生了改变
  //   "screenData.sortOrder": function(newVal, oldVal) {
  //     console.log("排序方式是否发生了变化：", newVal, oldVal);
  //     this.pagenum = 1;
  //     // 请求
  //     this.getTableData();
  //   }
  //   },
  //  created() {},
  // mounted() {
  //   // 获取表格数据
  //   this.getTableData();
  // }

</script>


<style scoped>
    .table-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 50px;
        position: relative;
        /* width:100% */
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
