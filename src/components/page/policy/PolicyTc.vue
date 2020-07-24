<template>
    <div>
        <div class="crumbs">
           <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
                <el-breadcrumb-item>政策管理</el-breadcrumb-item>
                <el-breadcrumb-item>政策认领</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div style="margin-bottom: 3px;font-weight:530;">定义统筹要素</div>
            <div style="margin:20px 0 20px 0;font-weight:530;font-size:15px">基本信息</div>
            <el-table 
            :data="tableData"          
            min-height="250"
            border
           style="width:58.4%"
            :header-cell-style="setHeaderStyle"
            :cell-style="setRowStyle"
            :row-style="{height: '40px',fontSize:'13px'}"
            >
          <el-table-column prop="project" label="要素" width="240" ></el-table-column>
          <el-table-column prop="tongchou" label="下级是否统筹" width="240">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.tongchou">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column prop="kexuan" label="下级是否可选" width="240">
               <template slot-scope="scope">
              <el-radio-group v-model="scope.row.kexuan">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
                </template>
          </el-table-column>

            </el-table>
            <div style="width:58.4%;display:flex; justify-content:center;margin-top:20px">
            <el-button  style="font-size:13px;width:75px" @click="cancel">取消</el-button>
            <el-button  type="primary" style="font-size:13px;width:75px;margin-left:20px" @click="submit">提交</el-button>
            </div>
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
        name: 'policytc',
        data() {
            return {
                tableData:[{
                    project:'政策名称',
                    tongchou:'',
                    kexuan:'',
                    value:'name',
                },
                {
                    project:'发布部门',
                    tongchou:'',
                    kexuan:'',
                    value:''
                },
                {
                    project:'发布层级',
                    tongchou:'',
                    kexuan:'',
                    value:''
                },
                {
                    project:'主项编码',
                    tongchou:'',
                    kexuan:'',
                    value:''
                },
                {
                    project:'发布层级',
                    tongchou:'',
                    kexuan:'',
                    value:''
                },
                {
                    project:'子项编码',
                    tongchou:'',
                    kexuan:'',
                    value:''
                }
                ],

                 
            }

        },
        components: {
            
        },
        computed: {
     
        },
        watch: {
    
      },

      created() {},
      mounted() {
        // 获取表格数据
        // this.getTableData();
      },

      methods: {
          // 设置表格内容居中
            setHeaderStyle() {
            return `text-align:center;background-color: #f6f7fb;`;
            },
            setRowStyle() {
            return "text-align:center";
            },

            //取消
            cancel(){
                console.log(this.tableData)
                this.$router.push({
                path: "/addpolicy",
              });
            },
            //提交
            submit(){
                console.log(this.tableData)
                this.$router.push({
                path: "/addpolicy",
              });
            }
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

</style>
