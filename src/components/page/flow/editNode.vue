<template>
<div class="editNode">
<el-collapse v-model="activeNames" @change="handleChange">
  <el-collapse-item title="基本信息" name="1" style="background-color:#f6f7fb">
     <el-form
    :model="node"
    ref="dataForm"
    label-width="100px"
    class="flowEditForm margin13"
    size="mini"
  >
  <div class="JBXX"> 
     <div class="JBXX_son" >
            <div class="JBXX_box" style="border-right:1px solid #e7e7e7;color:#9a9b9f">属性名</div>
            <div class="JBXX_box" style="color:#39393b">属性值</div>
      </div>
   </div>
   <div class="JBXX"> 
     <div class="JBXX_son" >
            <div class="JBXX_box" style="border-right:1px solid #e7e7e7;color:#9a9b9f">
              ID
            </div>
            <div class="JBXX_box" style="color:#39393b">
              <el-input disabled v-model="node.nodeId" class="JBXX_box" ></el-input>
            </div>           
      </div>
   </div>
   <div class="JBXX"> 
     <div class="JBXX_son" >
            <div class="JBXX_box" style="border-right:1px solid #e7e7e7;color:#9a9b9f">节点类型</div>
            <div class="JBXX_box">
              <el-input disabled v-model="nodeCategory" class="JBXX_box"></el-input>
            </div>
      </div>
   </div>
   <div class="JBXX"> 
     <div class="JBXX_son" >
            <div class="JBXX_box" style="border-right:1px solid #e7e7e7;color:#9a9b9f">节点编号</div>
            <div class="JBXX_box">
              <el-input  v-model="node.nodeCode" class="JBXX_box" @blur="onInputBlur(node)" disabled></el-input>
            </div>
      </div>
   </div>
   <div class="JBXX"> 
     <div class="JBXX_son" >
            <div class="JBXX_box" style="border-right:1px solid #e7e7e7;color:#9a9b9f">节点名称</div>
            <div class="JBXX_box">
              <el-input  v-model="node.nodeName" class="JBXX_box" @blur="onInputBlur(node)" :disabled="flag=='3'?true:false"></el-input>
            </div>
      </div>
   </div>
   <div class="JBXX"> 
     <div class="JBXX_son" >
            <div class="JBXX_box" style="border-right:1px solid #e7e7e7;color:#9a9b9f">业务类型</div>
            <div class="JBXX_box">
              <el-select v-model="node.businessType" placeholder="请选择" @change="changetype(node)" :disabled="flag=='3'?true:false">
              <el-option
                v-for="item in TypeList"
                :key="item.Value"
                :label="item.Text"
                :value="item.Value"
              ></el-option>
            </el-select>
            </div>
      </div>
   </div>
    <div class="JBXX"> 
     <div class="JBXX_son" >
            <div class="JBXX_box" style="border-right:1px solid #e7e7e7;color:#9a9b9f">备注</div>
            <div class="JBXX_box">
              <el-input  v-model="node.Remark" class="JBXX_box"  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" @blur="onInputBlur(node)" :disabled="flag=='3'?true:false"></el-input>
            </div>
      </div>
   </div>
   
  

  
  </el-form>
  </el-collapse-item>
  </el-collapse>
 </div>
</template>

<script>
export default {
  name: "editNode",
   props:{
            current:{
                type:Object,
                // default:{}
            },
        },
  data() {
    return {
      activeNames: [],
      node: {},
      TypeList: [
        { Value: "1", Text: "申报" },
        { Value: "2", Text: "网上预受理" },
        { Value: "3", Text: "受理" },
        { Value: "4", Text: "承办" },
        { Value: "5", Text: "审核" },
        { Value: "6", Text: "批准" },
      ],
      //节点类型
      nodeCategory:'',
      falg:''
    };
  },
  created() {
    this.flag = this.$route.query.flag;
    this.flag ==1?this.activeNames.push('1'):'';
    console.log('this.activeNames',this.activeNames)
  },
  methods: {
    init(data, id) {
      console.log("什么来的：", data, id);
      console.log("this.current",this.current)
      
      // 查找当前是第几个节点：
      let index = data.nodeList.findIndex(item => item.id == id);
      console.log("当前是第几个节点：", index);
      // data.nodeList[index]=this.node
      // let curid =data.nodeList[index].id
      // console.log("curid",curid)
      //点击当前节点给他加样式
      // console.log("this.$refs.curid",this.$refs.curid)
      // this.$refs.curid.setAttribute("class", " borderclass")

      var currentNode = {};
      var reg = new RegExp(/\d+/);
      data.nodeList.filter(node => {
        if (node.id === id) {
          if (node.Type == 1) {
            currentNode = {
              nodeId: node.id,
              nodeCategory: node.Type,
              nodeCode: `start_${index + 1}`,
              nodeName: node.label,
              x: reg.exec(node.left).join(),
              y: reg.exec(node.top).join(),
              nodeType: node.Type,
              taskAssignType: node.taskAssignType?node.taskAssignType:'',
              taskAssignValue: "",
              Remark:node.Remark?node.Remark:'',
              businessType: node.businessType?node.businessType:'',
            };

            

            // node.nodeCode = `start_${index + 1}`;
            // node.nodeName = `node_start_${index + 1}`;

            // node.nodeId = node.id;
            // node.x = node.left;
            // node.y = node.top;

            // node.nodeType = node.Type;

            // node.taskAssignType = "";
            // node.taskAssignValue = "";

            // "ext5": "86_24",
            // "leaveEvents": [],
            // "ext1": "",
            // "ext2": "1"
          } else if (node.Type == 2) {
            // node.code = `end_${index + 1}`;
            // node.name = `node_end_${index + 1}`;

            // node.nodeId = node.id;
            // node.x = node.left;
            // node.y = node.top;

            // node.nodeType = node.Type;

            // node.taskAssignType = "";
            // node.taskAssignValue = "";

            currentNode = {
              nodeId: node.id,
              nodeCategory: node.Type,
              nodeCode: `end_${index + 1}`,
              nodeName: node.label,
              x: reg.exec(node.left).join(),
              y: reg.exec(node.top).join(),
              nodeType: node.Type,
              taskAssignType: node.taskAssignType?node.taskAssignType:'',
              taskAssignValue: "",
              Remark:node.Remark?node.Remark:'',
              businessType: node.businessType?node.businessType:'',
            };
            
          } else if (node.Type == 3) {
            currentNode = {
              nodeId: node.id,
              nodeCategory: node.Type,
              nodeCode: `task_${index + 1}`,
              nodeName:node.label,
              x: reg.exec(node.left).join(),
              y: reg.exec(node.top).join(),
              nodeType: node.Type,
              taskAssignType: node.taskAssignType?node.taskAssignType:'',
              taskAssignValue: "",
              Remark:node.Remark?node.Remark:'',
              businessType: node.businessType?node.businessType:'',
            };
          }

          this.node = currentNode;
          this.nodeCategory=this.node.nodeCategory=="1"?"开始节点":this.node.nodeCategory=="2"?"结束节点":"任务节点"
          console.log("====sjdfhsdjfsdnjfshdjfh=======", currentNode);
          this.$emit("getSon", this.node);
          console.log("this.nodethis.node",this.node)
        }
      });
    },

    onInputBlur(node){
      console.log("失去焦点时候")
        this.$emit("getSon", this.node);
    },
    changetype(node){
      console.log(node)
      // console.log(e)
      this.$emit("getSon", this.node);
    },
    getNodeInfo() {
      let me = this;
      // console.log('xxxxxxx',this.node);
      this.$emit("getSon", this.node);

      // return  this.node
    },
     handleChange(val) {
        console.log(val);
      },
     
    
  
  },
  watch: {
    node: function(newVal, oldVal) {
      // console.warn("==========节点发生变化===============：", newVal, oldVal);

        // if (newVal.nodeId !== oldVal.nodeId) {
        //   this.getNodeInfo(newVal);
        // }else {
        //   }
          // this.getNodeInfo();

      
    }
  }
};
</script>
<style>
  .JBXX{
        display: flex;
        flex-wrap: wrap;
        /* height: 150px; */
        width: 100%;
        color: #848291;
    }

    .JBXX_son{
        width: 100%;
        display: flex;
        border:1px solid #e7e7e7;

    }

    .JBXX_box{
        width:100%;
        text-align: center;
        line-height: 50px;
        height: 100%;
    }

    .JBXX .el-input{
        height: 100%!important;
    }

    .JBXX .el-input__inner{
        height: 100%!important;
        border: none;
        border-radius: 0px;
    }

    .JBXX .el-textarea__inner{
        border: none;
        border-radius: 0px;
    }

    .editNode .el-collapse-item__header{
      background-color: #f6f7fb;
      color: #323337;
      font-size: 14px;
      text-indent: 8px;
    }

    .editNode .el-collapse-item__content{
      padding-bottom: 0px;
      
    }

    

 

  
</style>
