<template>
    <div>
        <div class="crumbs">
           <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
                <el-breadcrumb-item>政策管理</el-breadcrumb-item>
                <el-breadcrumb-item>政策认领</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" >
            <div style="margin-bottom: 3px;font-weight:530;">审核详情</div>
            <el-form :model="formdata" :rules="rules" ref="formdata" label-width="100px"  style="padding-left:50px">
                
                 <el-form-item label="审批版本" prop="edition">
                    <el-select v-model="formdata.edition" placeholder="请选择审批版本" style="width:250px">
                    <el-option v-for="item in editionoption" :label="item.label" :value="item.label" :key="item.key"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="审批名称"  prop="name">
                    <el-input v-model="formdata.name" placeholder="请输入审批名称" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item label="审批人"  prop="user">
                    <el-input v-model="formdata.user" placeholder="请输入审批人" style="width:250px"></el-input>
                </el-form-item>
                 <el-form-item label="审批部门"  prop="department">
                    <el-select v-model="formdata.department" placeholder="请选择审批部门" style="width:250px">
                       <el-option v-for="item in departments" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审批状态"  prop="status">
                    <el-input v-model="formdata.status" placeholder="请输入审批状态" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item label="审批日期"  prop="date">
                    <el-date-picker
                        v-model="formdata.date"
                        type="date"
                        placeholder="请选择审批日期"
                        style="width:250px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审批结果"  prop="result">
                    <el-input v-model="formdata.result" placeholder="请输入审批状态" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item label="审批意见" prop="content">
                <el-input
                    type="textarea"
                    :rows="6"
                    placeholder="请输入审批意见"
                    v-model="formdata.content"
                    style="width:50%"
                    >
                </el-input>
                 </el-form-item>
             
            </el-form>
            <div style="width:58.4%;display:flex; justify-content:center;margin-top:20px">
            <el-button type="primary" style="font-size:13px;width:75px" @click="cancel">关闭</el-button>
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
        name: 'policysh',
        data() {
            return {
                formdata:{
                    edition:'',//审批版本
                    name:'',//审批名称
                    user:'',//审批人
                    department:'',//审批部门
                    state:'',//审批状态
                    date:'',//审批日期
                    result:'',//审批结果
                    content:'',//审批意见
                },
                editionoption:[
                    {value:"1",label:"版本一"},
                    {value:"2",label:"版本二"},
                ],
                  // 审批部门
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
                //校验规则
                 rules:{
                    edition:[
                        { required: true, message: '请选择审批版本', trigger: 'change' },
                    ],
                    name: [
                        { required: true, message: '请输入政策名称', trigger: 'blur' },
                    ],
                    status:[
                        { required: true, message: '请输入政策状态', trigger: 'blur' },
                    ],
                    user: [
                        { required: true, message: '请输入审批人', trigger: 'blur' },
                    ],
                    status: [
                        { required: true, message: '请输入审批状态', trigger: 'blur' },
                    ],
                   department: [
                        { required: true, message: '请选择发布部门', trigger: 'change' },
                    ],
                    date: [
                        {type: 'date', required: true, message: '请选择审批日期', trigger: 'change' },
                    ],
                    result: [
                        { required: true, message: '请输入审批结果', trigger: 'blur' },
                    ],
                    content: [
                        { required: true, message: '请输入政策内容', trigger: 'blur' },
                    ],
                 }
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
