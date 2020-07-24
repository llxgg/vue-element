<template>
    <div>
        <div class="container" style="display:flex; justify-content:center;">
            <div style="width:50%;border:1px solid #ededee;padding:30px">
                <div class="column">
                <div style="margin-bottom: 3px;font-weight:530;font-size:20px">添加依据</div>
                </div>
                <el-form ref="form" :model="form" :rules="rules" label-width="150px" id="el__table" style="padding-right:10%">
                    <el-form-item label="法律法规名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="依据编号" prop="code">
                        <el-input v-model="form.code" placeholder="请输入编号"></el-input>
                    </el-form-item>
                     <el-form-item label="发布时间" prop="time">
                        <el-date-picker
                        v-model="form.time"
                        type="date"
                        placeholder="选择日期"
                        style="width:100%">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="发布部门" prop="department">
                        <el-select v-model="form.department" placeholder="请选择发布部门"  style="width:100%">
                            <el-option
                                v-for="item in departments"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="内容摘要" prop="content">
                        <el-input type="textarea" v-model="form.content" :rows="6" placeholder="请输入内容摘要"></el-input>
                    </el-form-item>
                    <el-form-item label="原文链接" prop="link">
                        <el-input v-model="form.link" placeholder="请输入链接"></el-input>
                    </el-form-item>               
              </el-form>
                <div style="display:flex; justify-content:center;margin:50px 0">
                    <el-button  style="font-size:13px;width:75px" @click="cancel">取消</el-button>
                    <el-button  type="primary" style="font-size:13px;width:75px;margin-left:20px" @click="submit('form')">确定</el-button>
                </div>
            </div>
         </div>
      
    </div>
</template>

<script>
import { timestamp, timestampYMD } from "../../../util/date.js";
import { post, post1 } from "../../../util/http.js";
import {
  
} from "../../../util/api.js";

    // import bus from '../common/bus';
    export default {
        name: 'addbasis',
        data() {
            return {
                form:{
                    name:'',
                    code:'',
                    department:'',
                    time:'',
                    content:'',
                    link:'',//原文链接
                },
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
                 //表单校验规则
                 rules:{
                     name:[
                        { required: true, message: '请输入名称', trigger: 'blur' },
                     ],
                     code:[
                        { required: true, message: '请输入编号', trigger: 'blur' },
                     ],
                     department:[
                         { required: true, message: '请选择部门', trigger: 'change' }
                     ],
                     time:[
                         { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                     ],
                     content:[
                        { required: true, message: '请输入内容', trigger: 'blur' },
                     ],
                     link:[
                        { required: true, message: '请输入链接', trigger: 'blur' },
                     ],
                 },

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
           //取消
            cancel(){
                
                this.$router.push({
                path: "/addpolicy",
              });
            },
            //确定
            submit(formName){
                 this.$refs[formName].validate((valid) => {
                if (valid) {
                     this.$message({
                        message: '数据提交成功',
                        type: 'success'
                        });
                } else {
                    this.$message.error('数据提交失败');
                    return false;
                }
                });
                
            //     this.$router.push({
            //     path: "/addpolicy",
            //   });
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

    #el__table >>> .el-checkbox__inner {
      margin-left: 0;
    }

    #el__table >>> .el-input__inner{
        
    }

    .column{
        margin-bottom: 3%;
    }

</style>
