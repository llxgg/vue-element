<template>
    <div>
        <div class="crumbs">
           <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
                <el-breadcrumb-item>政策管理</el-breadcrumb-item>
                <el-breadcrumb-item>政策认领</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div style="margin-bottom: 3px;font-weight:530;display:flex; justify-content:space-between">
               <div style="line-height:40px">新增政策</div>              
            </div>
            <div style="margin:20px 0 20px 0;font-weight:530;font-size:15px">基本信息</div>
            
            <el-form ref="formdata" :rules="rules" :model="formdata" label-width="80px" >
                <div class="tabelsty">
                <el-form-item label="通知名称" class="itemsty" prop="name">
                    <el-input v-model="formdata.name" placeholder="请选择通知名称" style="width:250px"></el-input>
                </el-form-item>
                <div class="itemsty"></div>
                <el-form-item label="通知编码" class="itemsty" prop="code">
                    <el-input v-model="formdata.code"  placeholder="请选择通知编码" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item label="通知分类" class="itemsty" prop="policy" >
                    <el-select v-model="formdata.policy" placeholder="请选择通知分类" style="width:250px">
                        <el-option v-for="item in policys" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布部门" class="itemsty" prop="department">
                    <el-select v-model="formdata.department" placeholder="请选择发布部门" style="width:250px">
                       <el-option v-for="item in departments" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布日期" class="itemsty" prop="time">
                    <el-date-picker
                        v-model="formdata.time"
                        type="date"
                        placeholder="请选择发布日期"
                        style="width:250px">
                    </el-date-picker>
                </el-form-item>
                </div>
                <div class="tabel">
                <el-form-item label="行政区划" prop="city">
                    <!-- <el-checkbox  v-model="citycheckAll" @change="handleCheckAllcit">所有&nbsp;&nbsp;&nbsp;</el-checkbox> -->
                      <el-checkbox-group v-model="formdata.city" >     
                        <el-checkbox v-for="item in citys" :label="item.value" :key="item.value" :value="item.value" @change="handleCheckAllcit(item.value)">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="支持领域" prop="field">
                   
                      <el-checkbox-group v-model="formdata.field">  
        
                        <el-checkbox v-for="item in fields" :label="item.value" :key="item.value" :value="item.value" @change="handleCheckAlldep(item.value)"  >{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                </div>
                <div class="tabelsty">
                <el-form-item label="通知内容" prop="content">
                <el-input
                    type="textarea"
                    :rows="6"
                    placeholder="请输入政策内容"
                    v-model="formdata.content"
                    style="width:384%"
                    >
                </el-input>
                 </el-form-item>
                 </div>
                 <!-- <div class="itemsty"></div>
                <div style="width:58%"></div>
                
                <div></div> -->
                
                 <!-- <div class="tabel">
                
                
                    </div> -->
                   
                   
                       
                <div style="display:flex; justify-content:center;margin:50px 0 50px -100px">
                    <el-button  style="font-size:13px;width:85px;line-height:22px" @click="cancel">取消</el-button>
                    <el-button  type="primary" style="font-size:13px;width:85px;line-height:22px;margin-left:20px" @click="submit('formdata')">提交</el-button>
                </div>
            </el-form>
            

         </div>
      
    </div>
</template>

<script>
import { timestamp, timestampYMD } from "../../../util/date.js";
import { post, post1 } from "../../../util/http.js";
import { cityoption,fieldpotion} from "../../../util/citys.js";
// import {
  
// } from "../../../util/api.js";

    // import bus from '../common/bus';
    export default {
        name: 'addnocite',
        data() {
            return {
                checkList: ['选中且禁用','复选框 A'],
                formdata:{
                    name:'',//通知名称
                    code:'',//通知编码
                    policy:'',//通知分类
                    department:'',//发布部门
                    time:'',//发布日期
                    content:'',//内容，
                    city:[],//行政区划
                    field:[]//支持领域
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
                 citys:cityoption,             
                 fields:fieldpotion,
                citycheckAll: false,//全选
                fieldcheckAll:false,
                 //表格数据
                 tableData:[],

                //表单校验规则
                  rules: {
                    name: [
                        { required: true, message: '请输入通知名称', trigger: 'blur' },
                    ],
                    code: [
                        { required: true, message: '请输入通知编码', trigger: 'blur' },
                    ],
                   policy: [
                        { required: true, message: '请选择通知分类', trigger: 'change' },
                    ],
                   department: [
                        { required: true, message: '请选择发布部门', trigger: 'change' },
                    ],
                    time: [
                        { required: true, message: '请选择发布日期', trigger: 'change' },
                    ],
                    content: [
                        { required: true, message: '请输入通知内容', trigger: 'blur' },
                    ],
                    city: [
                        { type: 'array', required: true, message: '请至少选择一个行政区', trigger: 'change' }
                    ],
                    field: [
                        { type: 'array', required: true, message: '请至少选择一个支持领域', trigger: 'change' }
                    ],
                  }
            }
        },
        components: {
            
        },
        computed: {
            cityarr(){
                let arr=[]
                this.citys.map(item=>{
                    arr.push(item.label)
                })
                return arr
            },
            fieldarr(){
                let arr1=[]
                this.fields.map(item=>{
                    arr1.push(item.label)
                })
                return arr1
            },
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
        return "text-align:center;width:80%";
        },
    
        //点击表单取消按钮
            cancel(){
                
                this.$router.push({
                path: "/policydeploy",
              });
            },
        //点击表单提交按钮
            submit(formName){
                 this.$refs[formName].validate((valid) => {
                
                let sumbitdata =this.formdata
                //表单的格式需要处理一下
                
                sumbitdata.time=sumbitdata.time?timestampYMD(sumbitdata.time):""
                console.log('sumbitdata来了，麻烦查看一下',sumbitdata)

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
            //     path: "/policydeploy",
            //   });
            },


        //element-ui全选方法
            handleCheckAllcit(val) {
            if(val==0){
            this.citycheckAll=!this.citycheckAll
            this.formdata.city = this.citycheckAll ? this.cityarr : [];
            }
        
        },
        handleCheckAlldep(val) {
        if(val==0){
            this.fieldcheckAll=!this.fieldcheckAll
            this.formdata.field = this.fieldcheckAll ? this.fieldarr : [];
            }
        
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
        margin-right: 5px;
    }

    #navs_group{
        display: inline-block;
       line-height: 40px;
    }

    .tabelsty{
        width: 80%;
        padding:0 20% 0 3%;
        display: flex;
        flex-wrap: wrap;   
    }

    .tabel{
        width: 97%;
        padding:1% 0 0 3%;      
    }

    .itemsty{
        width: 42%;
        margin-bottom: 20px;
        
    }

    .checksty{
        display: flex;
        flex-wrap: wrap;
    }

    .navbox{
        line-height: 50px;
    }
    .navspan{
        background-color: #f6f7fb;
        display: inline-block;
        text-indent: 20px;
        width: 120px;
        color:#6a6b6f;
        margin-right: 15px;
        
    }

</style>