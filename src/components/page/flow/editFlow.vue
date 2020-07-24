<template>
 <div class="editFlow">
    <!-- 新增流程 -->
    <el-form :model="flowData" v-if="flag=='1'" ref="dataForm" label-width="100px" class="flowEditForm margin13" size="mini" style="padding:12px">
        <el-form-item label="GUID">
            <el-input disabled v-model="flowInfodata.Id"></el-input>
        </el-form-item>
        <!-- <el-form-item label="流程名称">
            <el-input v-model="flowInfodata.Name" @blur="onInputBlur()"></el-input>
        </el-form-item> -->
        <el-form-item label="备注">
            <el-input v-model="flowInfodata.Remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
    </el-form>

<!-- 新增授权 -->
<el-form :model="delegateData" v-if="flag !='1' " ref="delegateData" label-width="100px" class="flowEditForm margin13" size="mini" style="padding:-12px">
<el-collapse v-model="activeName"  @change="changecollapse"  id="collapseid">
  <el-collapse-item title="审批用户" name="1" @click.native="clickcollapse(name='1')" ref="collapseone" id="collapseItem1">
      
    <div class="SPYH">
        <div class="SPYH_son" >
            <div class="SPYH_box" style="border-right:1px solid #e7e7e7;">属性名</div>
            <div class="SPYH_box" style="color:#39393b;position: relative;" >
                属性值
                <div class="box_tips"  @click="handleTips()">
                    <div class="box_tips_small" >
                    </div>
                    <div class="tips" v-show="tips"  >
                        <div style="background-color:#8f949a;line-height:30px;display:flex;flex-direction:row-reverse;">
                            <span style="font-size:15px;display:block;width:30px;font-weight: ;">X</span>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;flex-direction: column;justify-content：flex-start;padding-left:5px">
                            <div style="line-height:30px;font-size:15px;font-weight:600;text-align: left;">
                                说明
                            </div>
                            <div style="overflow-x: hidden;height:100px;line-height:13px">
                                <span class="tips_text">
                                    为不同的申报方向，选择不同的中台规则库，主要是配置企业资质和项目资质--中台规则库
                                </span>
                                <span class="tips_text">
                                    点击添加  选择规则列表
                                </span >
                                <span class="tips_text">
                                    如果材料验证通过，下一步流程正常进行
                                </span>
                                <span class="tips_text">
                                    如果材料未通过，下一步流程页面显示提示
                                </span>
                                
                            </div>
                        </div>
                     
                    </div>
                </div>
            </div>
            
        </div>
        <div class="SPYH_son">
            <div class="SPYH_box" style="border-right:1px solid #e7e7e7;">处理层级</div>
            <div class="SPYH_box" >
                 <!-- <el-cascader
                    style="height:100%;width:100%"
                    v-model="delegateData.area"
                    :options="area_options"
                    @change="handleChange">
                    </el-cascader> -->
                    <el-select v-model="delegateData.area" filterable placeholder="请选择" @change="changearea" :disabled="flag=='2'&&CandE !='1'?false:true" >
                    <el-option
                    v-for="item in area_options"
                    :key="item.id"
                    :label="item.groupName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="SPYH_son">
            <div class="SPYH_box" style="border-right:1px solid #e7e7e7;">授权用户</div>
            <div class="SPYH_box">
                <el-select v-model="delegateData.squser" filterable placeholder="请选择" :disabled="flag=='2'&&CandE !='1'?false:true" @change="changeSq">
                    <el-option
                    v-for="item in squser_options"
                    :key="item.id"
                    :label="item.userName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="SPYH_son">
            <div class="SPYH_box" style="border-right:1px solid #e7e7e7;">授权角色</div>
            <div class="SPYH_box">
                 <el-select v-model="delegateData.sqrole" filterable placeholder="请选择" :disabled="flag=='2'&&CandE !='1'?false:true" @change="changeSq">
                    <el-option
                    v-for="item in sqrole_options"
                    :key="item.id"
                    :label="item.groupName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>
    </div>
  </el-collapse-item>
  <el-collapse-item title="审批表单" name="2" @click.native="clickcollapse(name='2')">
    <div></div>
    <div >
         <el-checkbox-group v-model="delegateData.from" :disabled="flag=='2'&&CandE !='1'?false:true" @change="changeBd">
            <el-checkbox v-for="item in from_options" :label="item.id" :key="item.id" :value="item.name" style="width:100% ;line-height: 40px;border-bottom:1px solid #e7e7e7;padding-left:12px" >{{item.name}}</el-checkbox>
        </el-checkbox-group>
    </div>
  </el-collapse-item>
  <el-collapse-item title="审批材料" name="3" @click.native="clickcollapse(name='3')">
    <div>
        <el-checkbox-group v-model="delegateData.material" :disabled="flag=='2'&&CandE !='1'?false:true" @change="changeCl">
            <el-checkbox v-for="item in material_options" :label="item.id" :key="item.id" :value="item.name" style="width:100% ;line-height: 40px;border-bottom:1px solid #e7e7e7;padding-left:12px" >{{item.name}}</el-checkbox>
        </el-checkbox-group>
    </div>
    
  </el-collapse-item>
  <el-collapse-item title="审批规则" name="4" @click.native="clickcollapse(name='4')" >
   <div >
        <el-checkbox-group v-model="delegateData.rule"  :disabled="flag=='2'&&CandE !='1'?false:true" @change="changeGz">
            <el-checkbox v-for="item in rule_options" :label="item.id" :key="item.id" :value="item.name" style="width:100% ;line-height: 40px;border-bottom:1px solid #e7e7e7;padding-left:12px">{{item.name}}</el-checkbox>
        </el-checkbox-group>
    </div>
  </el-collapse-item>
   <el-collapse-item title="审批时限" name="5" @click.native="clickcollapse(name='5')" >
    <div class="SPSX" style="padding:7px;box-sizing: border-box;">
        <div class="SPSX_son" >
            <div>
                开启审批时限设置
            </div>
       
            <el-switch
                v-model="delegateData.timeswitch"
                active-color="#5695e2"
                :disabled="flag=='2'&&CandE !='1'?false:true"
                @change="changeSx"
                >
            </el-switch>
           
        </div>
        <div class="SPSX_son">
            <div style="width:17%">
                备注:
            </div>
            <div style="display: flex; flex-wrap: wrap;">
                <div>1.超时信息页面预警</div>
                <div>2.审批时限(按工作日历)</div>
            </div>
        </div>
        <div class="SPSX_son" style="flex-wrap: wrap;">
            <div style="width:100%" >
                审批时间设置
            </div>
             <el-date-picker
            v-model="delegateData.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="line-height:30px"
            @change="changeSx"
            :disabled="flag=='2'&&CandE !='1'?false:true"
            >
            </el-date-picker>
        </div>
    </div>
   
  </el-collapse-item>
   <el-collapse-item title="审批通知" name="6" @click.native="clickcollapse(name='6')">
    <div>
        <div class="radiobox">            
                <el-radio-group v-model="delegateData.notic_chufa" style="display:flex;flex-direction:column;justify-content：flex-start" :disabled="flag=='2'&&CandE !='1'?false:true" @change="changeTz">
                   <el-radio v-for="item in notic_chufa_options" :label="item.id" :key="item.id" :value="item.name" class="SPTZ_radio" style="line-height:45px">{{item.name}}</el-radio>
                </el-radio-group>     
        </div>
        <div style="display:flex;flex-direction:column;justify-content：flex-start">
            <div style="line-height:45px;border-bottom:1px solid #e7e7e7;text-indent: 10px;">
                发送方式
            </div>
        <!-- <el-checkbox-group v-model="delegateData.notic_send">
            <el-checkbox v-for="item in notic_send_options" :label="item.name" :key="item.value" style="width:100% ;line-height: 45px;" class="SPTZ_radio">{{item.name}}</el-checkbox>
        </el-checkbox-group> -->
        <el-radio-group v-model="delegateData.notic_send" style="display:flex;flex-direction:column;justify-content：flex-start" :disabled="flag=='2'&&CandE !='1'?false:true" @change="changeTz">
                   <el-radio v-for="item in notic_send_options" :label="item.id" :key="item.id" :value="item.name" class="SPTZ_radio" style="line-height:45px">{{item.name}}</el-radio>
         </el-radio-group> 
    </div>
      <div style="display:flex;flex-direction:column;justify-content：flex-start">
            <div style="line-height:45px;border-bottom:1px solid #e7e7e7;text-indent: 10px;">
                接收对象
            </div>
            <el-radio-group v-model="delegateData.notic_user" style="display:flex;flex-direction:column;justify-content：flex-start" :disabled="flag=='2'&&CandE !='1'?false:true" @change="changeTz">
                   <el-radio v-for="item in notic_user_options" :label="item.id" :key="item.id" :value="item.name" class="SPTZ_radio" style="line-height:45px">{{item.name}}</el-radio>
            </el-radio-group> 
        <!-- <el-checkbox-group v-model="delegateData.notic_user">
            <el-checkbox v-for="item in notic_user_options" :label="item.name" :key="item.value" style="width:100% ;line-height: 45px;" class="SPTZ_radio">{{item.name}}</el-checkbox>
        </el-checkbox-group> -->
    </div>
    </div>
  </el-collapse-item>
</el-collapse>
</el-form>

   </div>
</template>

<script>
    import { editNode } from "./editNode.vue";
    import { 
            sqjuese,sqyonghu,sqcengji,savespyh,getspyh,
            getspbdxlk,saveupdaetspbd,getspbdnode,
            getspclxlk,saveupdaetspcl,getspclnode,
            getspgzxlk,saveupdaetspgz,getspgznode,
            saveupdatespsx,getspsxnode,
            saveupdatesptz,getsptz,
            getdefnode
            } 
            from "../../../util/api.js";
    import { post, post1 } from "../../../util/http.js";
    import {timestampYMD} from '../../../util/date.js'

    export default {
        name:'editFlow',
        props:{
            current:{
                type:Object,
                // default:{}
            },
            flowInfodata:{
                type:Object,
            }
        },
        data() {
            return {
                flowData: {},
                //默认每次只能展示一个,折叠面板默认打开第一项
                activeName: [],
                flag:'',
                //新增授权的表单数据
                delegateData:{
                    //地区
                    area:"",
                    //授权用户
                    squser:"",
                    //授权角色
                    sqrole:"",
                    //审批表单
                    from:[],
                    //审批材料
                    material:[],
                    //审批规则
                    rule:[],
                    //审批时间设置
                    timeswitch:false,
                    //审批时间
                    time:[],
                    //审批通知
                    //何时触发
                    notic_chufa:"",
                    //发送方式
                    notic_send:"",
                    //接收对象
                    notic_user:""
                },
                //获取层级数据
                area_options:  '',
                //授权用户数据
                squser_options: '', 
                //授权角色数据
                sqrole_options:'',          
                //审批表单
                from_options:'',
                //审批材料
                material_options:'',
                //审批规则
                rule_options:'',
                //审批通知触发时机
         notic_chufa_options:[
             {name:'提交时触发',id:"1"},
             {name:"到达时触发",id:"2"},
             {name:"回退时触发",id:"3"},
             {name:"过期时触发",id:"4"},
         ],
         //审批通知发送方式
          notic_send_options:[
             {name:"邮件",id:"1"},
             {name:"短信",id:"2"},
             {name:"站内信",id:"3"},
             {name:"企业微信",id:"4"},
         ],
        //审批通知接手对象
          notic_user_options:[
             {name:"当前节点提交人",id:"1"},
             {name:"表单创建人",id:"2"},
             {name:"当前节点处理人",id:"3"},
         ],
        //审批用户提示
        tips:false,
        currentnode:this.current,
        //保存的时候需要添加的id
        declaration_flow_id:'',
        //资料未完整的数组
        defectarr:[],
        declaration_id:'',


        //CandE 1查看 2编辑
        CandE:'',
            }
        },
        //监听
        watch: {
                async current(news, olds){//放的是val的新旧变量
                    // this.change = 'new: ' + news + ' old: ' + olds;
                    console.log('点击获取节点信息',news)
                    // if(this.flag !=flowdefine)return
                    // news.nodeId='11_6_node_4'//测试数据
                    //获取到当前节点信息,调取接口做回显
                    let me =this;
                    
                    //先还原
                    this.delegateData={ 
                    area:'',
                    squser:'',   
                    sqrole:'',        
                    from:[],        
                    material:[],        
                    rule:[],         
                    timeswitch:false,         
                    time:[],           
                    notic_chufa:'',  
                    notic_send:[],        
                    notic_user:[]
                    }
                    // 点击节点后的this.delegateData
                    console.log('this.delegateData',this.delegateData)

                    
                    if(this.flag!="1"){
                    //获取审批用户-关联关系                    
                    const SPyh = await post1("#collapseid", getspyh, {
                        'nodeid':news.nodeId
                    },true)
                    console.log("审批用户关联信息",SPyh)
                    if(SPyh.data){
                      this.delegateData.area=SPyh.data.clcjid//层级

                      this.delegateData.sqrole=SPyh.data.sqjsid//授权角色
                      
                    if( SPyh.data.clcjid){
                        const squser_options = await post1("#collapseid", sqyonghu, {
                                    grouptype: 'org',
                                    groupId:SPyh.data.clcjid
                        },true)
                        if(squser_options){
                     console.log('授权用户',squser_options)

                     this.squser_options=squser_options.data
                        if(SPyh.data.users[0]){
                        this.delegateData.squser=SPyh.data.users[0].sqyhid//授权用户
                      }
                    }
                     }
                    
                    }

                    //获取审批表单-关联关系
                    const SPbd = await post1("#collapseid", getspbdnode, {
                        'nodeid':news.nodeId
                    },true)
                    console.log("审批表单关联信息",SPbd)
                    if(SPbd.data){
                    SPbd.data.map((item)=>{this.delegateData.from.push(item.formid)})
                    // console.log('this.delegateData.from',this.delegateData.from)
                    }
                    //获取审批材料-关联关系
                    const SPcl = await post1("#collapseid", getspclnode, {
                        'nodeid':news.nodeId
                    },true)
                    console.log("审批材料关联信息",SPcl)
                    if(SPcl.data){
                    SPcl.data.map((item)=>{this.delegateData.material.push(item.materialid)})
                    }
                    //获取审批规则-关联关系
                    const SPgz = await post1("#collapseid", getspgznode, {
                        'nodeid':news.nodeId
                    },true)
                    console.log("审批规则关联信息",SPgz)
                    if(SPgz.data){
                    SPgz.data.map((item)=>{this.delegateData.rule.push(item.ruleid)})
                    }

                    //获取审批时间-关联关系
                    const SPsj = await post1("#collapseid", getspsxnode, {
                        'nodeid':news.nodeId
                    },true)
                    console.log("审批时间关联信息",SPsj)

                    
                    if(SPsj.data){
                    this.delegateData.timeswitch=SPsj.data.isset=='1'?true:false
                    let  startdate=SPsj.data.stardate?SPsj.data.stardate:''
                    let  enddate=SPsj.data.endate?SPsj.data.endate:''
                     this.delegateData.time=[new Date(startdate),new Date(enddate)]
                    }


                    //获取审批通知关联关系
                    const SPtz = await post1("#collapseid", getsptz, {
                        'nodeid':news.nodeId
                    },true)
                    console.log("审批通知关联信息",SPtz)

                    if(SPtz.data){
                        //触发方式
                         this.delegateData.notic_chufa=SPtz.data.cffs,
                        //发送方式
                         this.delegateData.notic_send=SPtz.data.fsfs,
                        //接手对象
                         this.delegateData.notic_user=SPtz.data.jsdxlx
                    }

                    console.log("审批通知有没有关联呢",this.delegateData)



            }
        },

       
        }, 

        methods: {
            onInputBlur(){
                this.$emit("getflow", this.flowInfodata);
            },
            //折叠板如果关闭,需要校验当前节点是否已经填写授权信息
            changecollapse(e){  
                
            },
            //数组去重
            distinct(a,b) {
                    return Array.from(new Set([...a,b]))
            },
            async clickcollapse(name){
                console.log(name)
            //    if(this.flag=="2"){
            //     // console.log(this.delegateData)
            //     let currentid =this.current?this.current.nodeId:''
            //     if(currentid){
            //     if(name=="1" && this.delegateData.sqrole && this.delegateData.area && this.delegateData.squser){
            //         let me =this;
            //         console.log(this.delegateData);

            //         //保存修改审批用户-关联关系
            //         const res = await post(me,savespyh , {
            //             data:[
            //                 {
            //                   "sqjsid":this.delegateData.sqrole,
            //                   "clcjid":this.delegateData.area,
            //                   "sqyhid":this.delegateData.squser,
            //                   "nodeid":currentid,
            //                   "declaration_flow_id" :this.declaration_flow_id
            //                 }
            //             ]
            //         },false)

            //         //调用接口
            //         this.getdelarr()
                   

               
            //     }else if(name=="2" && this.delegateData.from.length !=0){
            //         let me =this;

            //         console.log('this.delegateData.from',this.delegateData.from)
            //         let fromdata="";
            //         // this.delegateData.from.map((item)=>{                        
            //         //     fromdata=fromdata+item+""+"_"
            //         //     fromdata.split('_')
            //         //     fromdata
            //         // })
            //         fromdata=this.delegateData.from.join("_")
            //         console.log("data",fromdata)

            //         //保存流程配置中的审批表单跟节点关联
            //         const res = await post(me,saveupdaetspbd , {
            //             "data":[{
            //                 zcformid:fromdata,
            //                 "nodeid":currentid,
            //                 "declaration_flow_id" :this.declaration_flow_id  
            //             }]
                                         
            //         },false)
                    
            //         //调用接口
            //         this.getdelarr()
                
            //     }else if(name=="3" && this.delegateData.material !=0){
            //         let me =this;

            //         let materialdata="";
            //         // this.delegateData.material.map((item)=>{
            //         //     materialdata=materialdata+item+""+"_"
            //         // })
            //         materialdata=this.delegateData.material.join("_")
            //         //保存流程配置中的审批材料跟节点关联
            //         const res = await post(me,saveupdaetspcl , {
            //             data:[{
            //                 "materialid":materialdata,
            //                 "nodeid":currentid,
            //                   "declaration_flow_id" :this.declaration_flow_id 
            //             }]
            //         },false)
            //     }else if(name=="4" && this.delegateData.rule !=0){
            //         let me =this;

            //         let ruledata="";
            //         // this.delegateData.rule.map((item)=>{
            //         //     ruledata=ruledata+item+""+"_"
            //         // })
            //         ruledata=this.delegateData.rule.join("_")
            //         //保存流程配置中的审批规则跟节点关联
            //         const res = await post(me,saveupdaetspgz , {
            //             data:[
            //                 {
            //                     "ruleid":ruledata,
            //                      "nodeid":currentid,
            //                        "declaration_flow_id" :this.declaration_flow_id
            //                 }
            //             ]
            //         },false)
            //     }else if(name=="5" && this.delegateData.time !=0 ){
            //         let me =this;

            //         console.log(this.delegateData.time)
            //         console.log(timestampYMD(this.delegateData.time[1]))
            //         //保存节点审批时间
            //         const res = await post1(me,saveupdatespsx , {                     
            //                 "nodeid":currentid,
            //                 "isset":this.delegateData.timeswitch==true?1:0,
            //                 "endate":timestampYMD(this.delegateData.time[1]),
            //                 "stardate":timestampYMD(this.delegateData.time[0]),
            //                   "declaration_flow_id" :this.declaration_flow_id                                              
            //         },false)
                    
            //     }else if(name=="6"&& this.delegateData.notic_chufa !="" && this.delegateData.notic_send!="" && this.delegateData.notic_user!=""){   
            //         //保存审批通知
            //         let me =this;
            //         console.log('想要知道审批通知',this.delegateData)
                   
            //         const res = await post1(me,saveupdatesptz , {                     
            //                 "nodeid":currentid,
            //                 "cffs":this.delegateData.notic_chufa,
            //                 "fsfs":this.delegateData.notic_send,
            //                 "jsdxlx":this.delegateData.notic_user,
            //                 "declaration_flow_id" :this.declaration_flow_id                                          
            //         },false)
            //     }
            //     }























                // this.activeName=this.distinct(this.activeName)
            
               
                // let currentid =this.current?this.current.nodeId:''
                // if(currentid){   
                //     //校验用户1、表单2、材料3为必填选项 其余为选填
                //     if(this.activeName.includes("1")){
                //         console.log("进去了")
                //         if(this.delegateData.area&&this.delegateData.squser&&this.delegateData.sqrole){
                //             console.log("不需要")
                //            console.log(Array.from(new Set(this.activeName)))
                //             // console.log(this.activeName)
                //             // this.$set(this.activeName,,)
                //         }else{
                //             console.log("进去下面了")
                //             this.activeName=this.distinct(this.activeName)
                //             //   this.activeName.splice(this.activeName.indexOf('1'),1);
                //             // console.log("流程名字")
                //             let length= this.activeName.length==0? this.activeName.length: this.activeName.length+1
                //             this.$set(this.activeName,length,"1")
                //             console.log(this.activeName)
                //             // this.activeName=this.distinct(this.activeName)
                //         //    this.activeName=Array.from(new Set(this.activeName))
                //         } 
                //     }
                // }
                // }
            },
            
            init(data) {
                this.flowData = data;
            },
            //地区下拉选择框
             handleChange(value) {
               
            },
            async getoption(){
                let me =this;

                //授权角色
                const sqrole_options = await post1(me, sqjuese, {
                    group_type: 'role'
                },false)

                this.sqrole_options=sqrole_options.data

                // 获取层级
                 const area_options  = await post1(me, sqcengji, {
                    group_type: 'org'
                },false)

                this.area_options=area_options.data

                //授权用户是根据选择层级之后会返回不同的用户

                //获取审批表单数据
                 const  from_options  = await post1(me, getspbdxlk, {
                    group_type: 'org'
                },false)

                this.from_options =from_options.data

                //获取审批材料数据
                const material_options = await post1(me, getspclxlk, {
                    
                },false)

                this.material_options =material_options.data

                //获取审批规则数据
                const rule_options = await post1(me, getspgzxlk, {
                    
                },false)

                this.rule_options =rule_options.data


     
                console.log('授权角色',this.sqrole_options)
                console.log('层级',area_options)
                console.log('审批表单',from_options)
                 console.log('审批材料',material_options)
                 console.log('审批规则',rule_options)
                // console.log('用户',sqyonghu)
            },
            

            async getdelarr(){
                let me =this
                //先获取为完成的节点信息
                const res = await post1(me, getdefnode, {
                    declaraionId:this.declaration_id 
                },false)

                console.log("getdefnode-------------",res)
                if(res.data){
                    this.defectarr=res.data
                    this.$emit("getdefarr", this.defectarr);
                }

            },

             //审批用户提示
                handleTips() {
                    this.tips=!this.tips;
                   
                },
                onConfirm() { },
                onCancel() { },

                //用组件方法来调保存的接口开始
                //审批用户
                //审批的处理层级
                //选择处理层级回显授权用户
                async changearea(e){
                    let me = this;
                    this.squser_options=[]
                    this.delegateData.squser=''
                    // console.log('this.current',this.current)
                    console.log(e)
                    // //授权用户
                    const squser_options = await post1(me, sqyonghu, {
                        grouptype: 'org',
                        groupId:`${e}`
                    },false)
                    console.log('授权用户',squser_options)
                    // console.log(squser_options)
                    this.squser_options=squser_options.data

                    //调保存的接口
                    let currentid =this.current?this.current.nodeId:false
                    if(currentid){
                        let me =this;
                        console.log(this.delegateData);

                        //保存修改审批用户-关联关系
                        const res = await post(me,savespyh , {
                            data:[
                                {
                                    "sqjsid":this.delegateData.sqrole?this.delegateData.sqrole:' ',
                                    "clcjid":this.delegateData.area?this.delegateData.area:' ',
                                    "sqyhid":this.delegateData.squser?this.delegateData.squser:' ',
                                    "nodeid":currentid,
                                    "declaration_flow_id" :this.declaration_flow_id
                                }
                            ]
                        },false)

                        //调用接口
                        this.getdelarr()
                    }
                },

                //授权用户和授权角色
                async changeSq(){
                    //调保存的接口
                    let currentid =this.current?this.current.nodeId:false
                    if(currentid){
                        let me =this;
                        console.log(this.delegateData);

                        //保存修改审批用户-关联关系
                        const res = await post(me,savespyh , {
                            data:[
                                {
                                    "sqjsid":this.delegateData.sqrole?this.delegateData.sqrole:' ',
                                    "clcjid":this.delegateData.area?this.delegateData.area:' ',
                                    "sqyhid":this.delegateData.squser?this.delegateData.squser:' ',
                                    "nodeid":currentid,
                                    "declaration_flow_id" :this.declaration_flow_id
                                }
                            ]
                        },false)

                        //调用接口
                        this.getdelarr()
                    }
                },

                //审批表单
               async changeBd(){
                    //调保存的接口
                    let currentid =this.current?this.current.nodeId:false
                    if(currentid){
                    let me =this;                
                    console.log('this.delegateData.from',this.delegateData.from)
                    let fromdata="";
                    fromdata=this.delegateData.from.join("_")
                    console.log("data",fromdata)

                    //保存流程配置中的审批表单跟节点关联
                    const res = await post(me,saveupdaetspbd , {
                        "data":[{
                            zcformid:fromdata,
                            "nodeid":currentid,
                            "declaration_flow_id" :this.declaration_flow_id  
                        }]
                                            
                    },false)
                    
                    //调用接口
                    this.getdelarr()
                    }
                },

                //审批材料
               async changeCl(){
                    //调保存的接口
                    let currentid =this.current?this.current.nodeId:false
                    if(currentid){
                        let me =this;

                        let materialdata="";
                        materialdata=this.delegateData.material.join("_")
                        //保存流程配置中的审批材料跟节点关联
                        const res = await post(me,saveupdaetspcl , {
                            data:[{
                                "materialid":materialdata,
                                "nodeid":currentid,
                                "declaration_flow_id" :this.declaration_flow_id 
                            }]
                        },false)
                        }
                    },
              

                //审批规则
               async changeGz(){
                    //调保存的接口
                    let currentid =this.current?this.current.nodeId:false
                    if(currentid){
                    let me =this;

                    let ruledata="";
                    // this.delegateData.rule.map((item)=>{
                    //     ruledata=ruledata+item+""+"_"
                    // })
                    ruledata=this.delegateData.rule.join("_")
                    //保存流程配置中的审批规则跟节点关联
                    const res = await post(me,saveupdaetspgz , {
                        data:[
                            {
                                "ruleid":ruledata,
                                "nodeid":currentid,
                                "declaration_flow_id" :this.declaration_flow_id
                            }
                        ]
                    },false)
                    }
                },

                //审批时限
               async changeSx(){
                    //调保存的接口
                    let currentid =this.current?this.current.nodeId:false
                    if(currentid){
                         let me =this;

                        console.log(this.delegateData.time)
                        console.log(timestampYMD(this.delegateData.time[1]))
                        //保存节点审批时间
                        const res = await post1(me,saveupdatespsx , {                     
                                "nodeid":currentid,
                                "isset":this.delegateData.timeswitch==true?1:0,
                                "endate":this.delegateData.time[1]?timestampYMD(this.delegateData.time[1]):' ',
                                "stardate":this.delegateData.time[0]?timestampYMD(this.delegateData.time[0]):' ',
                                "declaration_flow_id" :this.declaration_flow_id                                              
                        },false)
                    }
                },

                //审批通知
               async changeTz(){
                    //调保存的接口
                    let currentid =this.current?this.current.nodeId:false
                    if(currentid){
                        //保存审批通知
                        let me =this;
                        // console.log('想要知道审批通知',this.delegateData)
                        
                        const res = await post1(me,saveupdatesptz , {                     
                                "nodeid":currentid,
                                "cffs":this.delegateData.notic_chufa?this.delegateData.notic_chufa:' ',
                                "fsfs":this.delegateData.notic_send?this.delegateData.notic_send:' ',
                                "jsdxlx":this.delegateData.notic_user?this.delegateData.notic_user:' ',
                                "declaration_flow_id" :this.declaration_flow_id                                          
                        },false)
                    }
                },


    
        },
            created() {
            // 获取传递进来的页面名称
            this.flag = this.$route.query.flag;
            this.declaration_flow_id=this.$route.query.declarationFlowId?this.$route.query.declarationFlowId:''
            this.declaration_id=this.$route.query.declaId?this.$route.query.declaId:''
            console.log(this.flag)
            console.log("this.declaration_flow_id",this.declaration_flow_id)

             //知道此页面是查看还是编辑CandE 1是查看,2是编辑
            this.CandE = this.$route.query.CandE?this.$route.query.CandE:'';

            this.flag !='1'?this.getoption():''
            
            console.log("this.current",this.current)

            //获取未完成节点信息
            this.declaration_id?this.getdelarr():''

        },
      
         
    }

</script>
<style>

    .SPYH{
        display: flex;
        flex-wrap: wrap;
        /* height: 150px; */
        width: 100%;
        color: #848291;
    }

    .SPYH_son{
        width: 100%;
        display: flex;
        border:1px solid #e7e7e7;

    }

    .SPYH_box{
        width:50%;
        text-align: center;
        line-height: 50px;
    }

    .el-cascader{
        width: 100%;
        height: 100%;
    }

    .SPYH .el-input{
        height: 100%!important;
    }

    .SPYH .el-input--small {
        height: 100%!important;
    }

    .SPYH .el-input__inner{
        height: 100%!important;
        border: none;
        /* color: #3399ff; */
        color:#39393b;
    }
    .SPYH_son .el-select{
        height: 100%!important;
        
    }

    .SPYH_son .el-date-editor{
        height: 70%!important;
    }

    .SPSX{
        display: flex;
        flex-wrap: wrap;
        /* height: 150px; */
        width: 100%;
        color: #848291;
    }

    .SPSX_son{
        width: 100%;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e7e7e7 ;
        padding: 10px 0;
    }

    .SPTZ_radio{
        line-height: 40px;
        padding-left: 20px;
        border-bottom:1px solid #e7e7e7;
        box-sizing: border-box;
    }

    .editFlow .el-collapse-item__header{
      background-color: #f6f7fb;
      color: #323337;
      font-size: 14px;
      text-indent: 8px;
      
    }

    .editFlow .el-collapse-item__content{
      padding-bottom: 0px;
    }

       .box_tips{
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      background-color: #138cdd;
      padding: 2px;
      cursor: help;
      
    }
    .box_tips_small{
      width: 11px;
      height: 1px;
      border-top: 1px solid #fff;
      border-bottom: 1px solid #fff;
      background-color: #fff;
      padding: 3px 0;
      background-clip:content-box;
    }

    .tips{
        position: absolute;
        top: 15px;
        right: 5px;
        width: 289px;
        height: 182px;
        border:1px solid #8f949a;
        background-color: #fff;
        float: left;
        z-index:9999;
        
    }

    .tips_text{
        padding:7px 0;
        display: block;
        text-align: left;
        line-height:20px;
    }

    .radiobox .el-radio{
        margin-right: 0px;
    }


</style>
