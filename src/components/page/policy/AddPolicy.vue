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
               <div>
                <el-button v-show="CandE=='0' || CandE=='2'" type="primary" style="height:40px;font-size:13px" @click="Policytongchou">政策统筹登记</el-button>
                <!-- 已发布不可编辑 -->
                <el-button v-show="CandE=='1' && status !='3'" type="primary"  style="width:90px;height:40px;font-size:13px" @click="Policybianji">编辑</el-button>
                <el-button v-show="CandE=='1' || CandE=='2'" type="primary" style="width:90px;height:40px;font-size:13px" @click="Policyxiangqing">审核详情</el-button>
                </div>
            </div>
            <div style="margin:20px 0 20px 0;font-weight:530;font-size:15px">基本信息</div>
            
            <el-form ref="formdata" :rules="rules" :model="formdata" :disabled="CandE=='1'" label-width="80px"  >
                <div class="tabelsty">
                <el-form-item label="政策名称" class="itemsty" prop="name">
                    <el-input v-model="formdata.name" placeholder="请选择政策名称" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item v-if="CandE=='1' || CandE=='2'" label="政策状态" class="itemsty" prop="status">
                    <el-input v-model="formdata.status" placeholder="请选择政策名称" style="width:250px"></el-input>
                </el-form-item>
                <div v-if="CandE!='1' && CandE!='2'" class="itemsty"></div>
                <el-form-item label="政策编码" class="itemsty" prop="code">
                    <el-input v-model="formdata.code"  placeholder="请选择政策编码" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item label="政策分类" class="itemsty" prop="policy" >
                    <el-select v-model="formdata.policy" placeholder="请选择政策分类" style="width:250px">
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
                <el-form-item label="政策内容" prop="content">
                <el-input
                    type="textarea"
                    :rows="6"
                    placeholder="请输入政策内容"
                    v-model="formdata.content"
                    style="width:384%"
                    >
                </el-input>
                 </el-form-item>
                 <div class="itemsty"></div>
                
                 <el-form-item label="法律依据" class="itemsty">
                    <el-button type="primary">选择依据</el-button>
                    <el-button type="primary" @click="addbasis">添加依据</el-button>
                </el-form-item>
                <div style="width:58%"></div>
                </div>
                <div></div>
                <el-table
                    :data="tableData"
                    min-height="250"
                    border
                    fit
                    style="width: 80%;margin-left:9%"

                    :header-cell-style="setHeaderStyle"
                    :cell-style="setRowStyle" 

                >              
                <!-- <el-table-column type="selection" width="70" :show-overflow-tooltip="true"></el-table-column> -->
                <el-table-column label="序号" width="70" type="index"></el-table-column>
                <el-table-column prop="policyName" label="法律法规名称" width="120"></el-table-column>
                <el-table-column prop="policyCode" label="依据文号" width="120"></el-table-column>
                <el-table-column prop="department" label="发布部门" width="100"></el-table-column>
                <el-table-column prop="createTime" label="发布时间" width="100"></el-table-column>
                <el-table-column prop="policy" label="摘要" width="200"></el-table-column>
                <el-table-column prop="policy" label="原文链接" width="150"></el-table-column>
                <el-table-column prop="policyId" label="操作" >
                    <template slot-scope="scope">
                    <el-link style="color:#409EFF;" :underline="false" @click="handleRemove(scope.row)">撤销</el-link>
                    </template>
                </el-table-column>
                 </el-table>
                 <div class="tabel">
                  <el-form-item label="行驶层级" prop="level">
                      <el-checkbox-group v-model="formdata.level" >
                        <el-checkbox v-for="item in levels" :label="item.value" :key="item.value" :value="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="行政区划" prop="city">
                    <!-- <el-checkbox  v-model="citycheckAll" @change="handleCheckAllcit">所有&nbsp;&nbsp;&nbsp;</el-checkbox> -->
                      <el-checkbox-group v-model="formdata.city" >     
                        <el-checkbox v-for="item in citys" :label="item.value" :key="item.value" :value="item.value" @change="handleCheckAllcit(item.value)">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="主管部门" prop="redepartment">
                   
                      <el-checkbox-group v-model="formdata.redepartment">  
        
                        <el-checkbox v-for="item in redepartments" :label="item.value" :key="item.value" :value="item.value" @change="handleCheckAlldep(item.value)"  >{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                    </div>
                    <div style="margin:20px 0 0px 0;font-weight:530;font-size:15px">标签信息</div>
                    <div style="width: 97%;padding:1.3% 0 0 3%;  ">
                        <el-form-item label="选择标签">
                            <el-radio-group v-model="formdata.tag">
                            <el-radio label="企业标签"></el-radio>
                            <el-radio label="个人标签"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div style="border:1px solid #e5e4e8;margin-left:6%">
                            <div class="navbox">
                               <span class="navspan" >企业性质</span>  
                               <span>
                                   <el-checkbox-group v-model="formdata.qyxz"  id="navs_group"> 
                                        <el-checkbox  v-for="item in qyxzoption" :label="item.value" :key="item.value" :value="item.value"  border >{{item.label}}</el-checkbox>
                                   </el-checkbox-group>
                                </span>                  
                            </div >
                            <div style="border-top:1px solid #e5e4e8;border-bottom:1px solid #e5e4e8" class="navbox">
                                <span class="navspan">所属行业</span>  
                                <span>
                                     <el-checkbox-group v-model="formdata.qyhy" id="navs_group"> 
                                        <el-checkbox  v-for="item in qyhyoption" :label="item.value" :key="item.value" :value="item.value"  border >{{item.label}}</el-checkbox>
                                    </el-checkbox-group>
                                </span>
                            </div>
                            <div class="navbox">
                                <span class="navspan"> 企业规模</span>  
                                <span >
                                    <el-checkbox-group v-model="formdata.qygm" id="navs_group"> 
                                        <el-checkbox  v-for="item in qygmoption" :label="item.value" :key="item.value" :value="item.value"  border >{{item.label}}</el-checkbox>
                                     </el-checkbox-group>
                                </span>
                            </div>
                        </div>
                    </div>
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
import { cityoption,departmentoption } from "../../../util/citys.js";
// import {
  
// } from "../../../util/api.js";

    // import bus from '../common/bus';
    export default {
        name: 'addpolicy',
        data() {
            return {
                checkList: ['选中且禁用','复选框 A'],
                formdata:{
                    name:'',//政策名称
                    status:'',//政策状态
                    code:'',//政策编码
                    policy:'',//政策分类
                    department:'',//发布部门
                    time:'',//发证日期
                    content:'',//内容，
                    level:[],//行驶层级
                    city:[],//行政区划
                    redepartment:[],//主管部门
                    tag:'',
                    qyxz:[],
                    qyhy:[],
                    qygm:[],
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
                 levels:[
                     {
                    value: 1,
                    label: "省级"
                    },
                    {
                    value: 2,
                    label: "市级"
                    },
                    {
                    value: 3,
                    label: "县级"
                    },
                    {
                    value: 4,
                    label: "乡级"
                    },
                    {
                    value: 5,
                    label: "村级"
                    }
                 ],
                 qyxzoption:[
                     {value:1,label:"合资"},
                     {value:2,label:"独资"},
                     {value:3,label:"国有"},
                     {value:4,label:"私营"},
                 ],
                 qyhyoption:[
                     {value:1,label:"农林渔畜"},
                     {value:2,label:"采矿"},
                     {value:3,label:"采购批发零售"},
                     {value:4,label:"建筑"},
                     {value:5,label:"人才引育"},
                     {value:6,label:"科技创新"},
                 ],
                 qygmoption:[
                     {value:1,label:"50"},
                     {value:2,label:"50-100"},
                     {value:3,label:"500+"},
                 ],
                 citys:cityoption,             
                 redepartments:departmentoption,
                 citycheckAll: false,//全选
                 redepartmentcheckAll:false,
                 //表格数据
                 tableData:[],

                //表单校验规则
                  rules: {
                    name: [
                        { required: true, message: '请输入政策名称', trigger: 'blur' },
                    ],
                    status:[
                        { required: true, message: '请输入政策状态', trigger: 'blur' },
                    ],
                    code: [
                        { required: true, message: '请输入政策编码', trigger: 'blur' },
                    ],
                   policy: [
                        { required: true, message: '请选择政策分类', trigger: 'change' },
                    ],
                   department: [
                        { required: true, message: '请选择发布部门', trigger: 'change' },
                    ],
                    time: [
                        { required: true, message: '请选择发布日期', trigger: 'change' },
                    ],
                    content: [
                        { required: true, message: '请输入政策内容', trigger: 'blur' },
                    ],
                    //法律依据还没有进入到校验规则
                     level: [
                        { type: 'array', required: true, message: '请至少选择一个行驶层级', trigger: 'change' }
                    ],
                    city: [
                        { type: 'array', required: true, message: '请至少选择一个行政区域', trigger: 'change' }
                    ],
                    redepartment: [
                        { type: 'array', required: true, message: '请至少选择一个主管部门', trigger: 'change' }
                    ],
                  },
                 //政策ID
                  policyId:"",
                 //查看还是编辑
                  CandE:'',
                 //审核状态
                 status:'',
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
            departmentarr(){
                let arr1=[]
                this.redepartments.map(item=>{
                    arr1.push(item.label)
                })
                return arr1
            },
        },
        watch: {
    
      },

      created() {
          //获取政策id以及知道是查看还是编辑
          this.policyId=this.$route.query.policyId?this.$route.query.policyId:''
          this.CandE=this.$route.query.CandE?this.$route.query.CandE:''
          this.status=this.$route.query.status?this.$route.query.status:''

          //如果是查看和编辑的页面，需要拿到政策ID进行调接口回显
      },
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
        //政策统筹
        Policytongchou(){
             this.$router.push({
                path: "/policytc",
              });
        },
        //依据撤销
        handleRemove(){

        },

        //添加依据页面跳转
        addbasis(){
            this.$router.push({
                path: "/addbasis",
            });
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
                    //  console.log('this.formdata来了，麻烦查看一下',this.formdata)
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
            this.redepartmentcheckAll=!this.redepartmentcheckAll
            this.formdata.redepartment = this.redepartmentcheckAll ? this.departmentarr : [];
            }
        
        },


        //点击编辑
        Policybianji(){
            this.$router.push({
                path: "/addpolicy",
                query:{CandE:"2",policyId:this.policyId}
            });
        },
        //点击审核详情
        Policyxiangqing(){
            this.$router.push({
                path: "/policysh",
                query:{CandE:"1",policyId:this.policyId}
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
        padding:3% 0 0 3%;  
        
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
