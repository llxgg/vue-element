<template>
    <div  >
        <div class="crumbs">
           <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
                <el-breadcrumb-item>政策管理</el-breadcrumb-item>
                <el-breadcrumb-item>政策认领</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div style="margin-bottom: 3px;font-weight:530;">政策认领</div>
            <div style="display:flex;margin-top:10px">
                <el-input v-model="formdata.name" placeholder="请输入政策名称" clearable  @clear="clearPolicyName" style="width:200px;margin-right:12px"></el-input>
                <el-input v-model="formdata.code" placeholder="请输入政策编码" clearable  @clear="clearPolicyCode" style="width:200px;margin-right:12px"></el-input>
                <el-button type="primary" style="width:100px" @click="query">查询</el-button>
            </div>
             <div style="border:1px solid #e5e4e8; margin-top:20px">
                <div class="navbox">
                    <span class="navspan" >政策类型</span>  
                    <span style="width:90%;padindg-top:10px;display:block">
                        <el-checkbox-group v-model="formdata.zclx"  id="navs_group"> 
                            <el-checkbox  v-for="item in zclxoption" :label="item.value" :key="item.value" :value="item.value"  border >{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </span>                  
                </div >
                <div style="border-top:1px solid #e5e4e8;border-bottom:1px solid #e5e4e8" class="navbox">
                    <span class="navspan">扶持对象</span>  
                    <span style="width:90%">
                        <el-checkbox-group v-model="formdata.fcdx" id="navs_group"> 
                            <el-checkbox  v-for="item in fcdxoption" :label="item.value" :key="item.value" :value="item.value"  border >{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </span>
                </div>
                <div class="navbox">
                    <span class="navspan"> 行驶层级</span>  
                    <span style="width:90%">
                        <el-checkbox-group v-model="formdata.xscj" id="navs_group"> 
                            <el-checkbox  v-for="item in xscjoption" :label="item.value" :key="item.value" :value="item.value"  border >{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </span>
                </div>
                <div class="navbox" style="border-top:1px solid #e5e4e8;border-bottom:1px solid #e5e4e8" >
                    <span class="navspan">发布部门</span>  
                    <span style="width:90%">
                        <el-checkbox-group v-model="formdata.fbbm" id="navs_group" class="group_notbox" > 
                            <el-checkbox  v-for="item in fbbmoption" :label="item.value" :key="item.value" :value="item.value" @change="changebox(item.value,'fbbm')" >{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </span>
                </div>
                <div class="navbox">
                    <span class="navspan">行政区域</span>  
                    <span style="width:90%">
                        <el-checkbox-group v-model="formdata.xzqh" id="navs_group" class="group_notbox"  > 
                            <el-checkbox  v-for="item in xzqhoption" :label="item.value" :key="item.value" :value="item.value"  @change="changebox(item.value,'xzqh')">{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </span>
                </div>
            </div>
             <!-- 表格 -->
      <div style="margin-top: 25px;" id="el__table">
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
          <el-table-column prop="policyCode" label="政策编码" width="150"></el-table-column>
          <el-table-column prop="department" label="部门名称" width="100"></el-table-column>
           <el-table-column prop="company" label="出台单位" width="100"></el-table-column>
          <el-table-column prop="policy" label="政策分类" width="100"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
           <el-table-column prop="status" label="认领状态" width="100">
            <template slot-scope="scope">
              <span>{{queryPolicyStatus(scope.row.status)}}</span>
            </template>
          </el-table-column>
          <!-- 拿到政策的id做操作 -->
        <el-table-column prop="policyId" label="操作" >
            <template slot-scope="scope">
               <el-link
                style="margin-right:22px;color:#409EFF;"
                :underline="false"
                @click="handleSee(scope.row)"
              >认领</el-link>
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


         </div>
      
    </div>
</template>

<script>
import { timestamp, timestampYMD } from "../../../util/date.js";
import { post, post1 } from "../../../util/http.js";
import { cityoption,departmentoption,fieldpotion,fieldpotions } from "../../../util/citys.js";
// import {
  
// } from "../../../util/api.js";

    // import bus from '../common/bus';
    export default {
        name: 'dashboard',
        data() {
            return {
                formdata:{
                    name:'',
                    code:'',
                    zclx:[],
                    fcdx:[],
                    xscj:[],
                    fbbm:["0"],
                    xzqh:["0"],
                },
                zclxoption:[],
                fcdxoption:[
                    {value:1,label:"企业"},
                    {value:2,label:"个人"},
                ],
                xscjoption:[
                    {value:1,label:"国家"},
                    {value:2,label:"省"},
                    {value:3,label:"市"},
                    {value:4,label:"县"},
                ],
                fbbmoption:[],
                xzqhoption:[],

                //表格开始
                deletePolicyArr:[],//选中的集合

                tableData: [], // 表格数据
                pagenum: 1, // 当前页码
                pagesize: 10, // 每页多少条
                total: 0, // 总条数

                loading:true
            }
        },
        components: {
            
        },
        computed: {
     
        },
        watch: {

      },

      created() {
          this.zclxoption=fieldpotions,
          this.fbbmoption=departmentoption,
            this.xzqhoption=cityoption,
            console.log("this.zclxoption",this.zclxoption)
          departmentoption[0]={value:"0",label:"不限"}
          cityoption[0]={value:"0",label:"不限"}

      },
      mounted() {
        //   if(this.zclxoption.length !=0){
        //       this.loading=false
        //   }
        // 获取表格数据
        // this.getTableData();
      },

      methods: {
          //为点击"不限"做斗争
          changebox(val,what){
              console.log(val)
           if(what=="fbbm"){

            if(val==0){
                this.formdata.fbbm=["0"]
            }else{
               let index= this.formdata.fbbm.indexOf("0");
               index==-1?"":this.formdata.fbbm.splice(index,1)
               console.log(this.formdata.fbbm)
            }

           }else if(what=="xzqh"){
            if(val==0){
                this.formdata.xzqh=["0"]
            }else{
               let index= this.formdata.xzqh.indexOf("0");
               index==-1?"":this.formdata.xzqh.splice(index,1)
               console.log(this.formdata.xzqh)
            }
           }
          },

            // 删除输入的内容
            clearPolicyName() {
            this.screenData.name = "";
            // 从新请求
            this.pagenum = 1;
            this.getTableData();
            },
            //删除输入的
            clearPolicyCode() {
            this.screenData.code = "";
            // 从新请求
            this.pagenum = 1;
            this.getTableData();
            },

          //点击查询按钮
          async query(){
              console.log("点击了查询按钮,看看formdata有什么东西",this.formdata)
                let me = this
              //发送请求
                // const res =await  post1(me, "填请求地址吧", {
                //    limit: this.pagesize,
                //    page: pagenum
                // },false)
            
          },

          //-----------------------表格部分开始--------------------------------
          // 设置表格内容居中
            setHeaderStyle() {
            return "text-align:center";
            },
            setRowStyle() {
            return "text-align:center";
            },

            //点击选择按钮
            // 自定义选择
            handleSelectFlow(selection, row) {
            console.log("选择了那个：", selection, row);
            // 把全选的内容id先保存为一个数组
            var deletePolicyArr = selection.map(item => item.flowId);
            // console.log("要删除的id集合：", deletePolicyArr);
            // 保存：
            this.deletePolicyArr = deletePolicyArr;
            },
            // 全选事件
            handleSelectFlowAll(selection) {
            console.log("全选", selection);
            // 把全选的内容id先保存为一个数组
            var deletePolicyArr = selection.map(item => item.flowId);
            // console.log("要删除的id集合：", deletePolicyArr);
            // 保存：
            this.deletePolicyArr = deletePolicyArr;
            },

            //认领
            handleSee(scope) {
            console.log("认领的政策数据：", scope);

            // if (scope) {
            //    //点击认领之后改变状态,需要调接口
            //     const flowId = scope.flowId;
            //     this.$router.push({
            //     path: "/add_flow",
            //     query: { flowId: flowId, flag: 1 }
            //     });
            // }
            },

            // 处理表格中的认领状态的回显
            queryPolicyStatus(status) {
            console.log("审核状态：", status);

            switch (status) {
                case "1":
                return "认领";
                case "2":
                return "未认领";
            }
            },



            //获取表格的数据
            //获取表格数据
            getTableData(page){
               let me = this;

                // 获取其他筛选数据
            let name = me.formdata.name ? me.formdata.name.trim() : "";
            let code = me.formdata.code ? me.formdata.code.trim() : "";
            let zclx = me.formdata.zclx
            let fcdx = me.formdata.fcdx
            let xscj = me.formdata.xscj
            let fbbm = me.formdata.fbbm
            let xzqh = me.formdata.xzqh


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

      },
    }

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
    #navs_group >>> .el-checkbox__input{
        display: none;
    }

    #navs_group >>> .el-checkbox__label{
        padding-left: 6px;
    }

    #navs_group >>> .el-checkbox{
        margin-right: 10px;
        margin-left:0px
    }

    #navs_group{
        display: inline-block;
       line-height: 40px;
       padding-top: 5px;
    }

    .navbox{
        line-height: 50px;
        display: flex;
    }
    .navspan{
        background-color: #f6f7fb;
        display: inline-block;
        text-indent: 20px;
        width: 10%;
        color:#6a6b6f;
        margin-right: 15px;
    }

</style>
