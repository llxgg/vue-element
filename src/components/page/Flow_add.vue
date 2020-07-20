<template>
  <div v-loading="loading" element-loading-text="处理中...请稍等">
    
    <!-- <div class="top">
      <div>
        <span class="top_span"></span>
        新增流程
      </div>
      <div style="margin-right:15px">
        <el-button style="width: 80px;margin-left: 10px;" @click="refresh">刷新</el-button>
        <el-button style="width: 80px;margin-left: 10px;" @click="goback">返回</el-button>
      </div>
    </div>-->

    <div class="search">
      <div style="margin-right:15px">流程名称</div>
      <el-input v-model="flowInfo.Name" style="width:200px" placeholder="新增必须填写流程名称" :disabled="isName"  @blur="changedata(flowInfo)" :flowInfodata="data.flowInfo"></el-input>
      <div v-if="flag =='1' && flowid  " style="width:60%;display:flex">
       <div  style="margin:0 15px">流程编码</div>
      <el-input v-model="flowCode" style="width:250px;border:" disabled></el-input>
      <div   style="margin:0 15px">历史版本</div>
      <el-select v-model="history" placeholder="请选择"  @change="changehistory">
          <el-option
            v-for="item in historyoptions"
            :key="item.flowId"
            :label="item.flowVersion"
            :value="item.flowId"
           >
          </el-option>
        </el-select>
      </div>
      <div v-if="flag !='1'" style="width:60%;display:flex">
       <div  style="margin:0 15px">申报方向名称</div>
      <el-input v-model="direction" style="width:250px;border:" disabled></el-input>
      <div   style="margin:0 15px">流程版本</div>
      <el-input   v-model="flowVersion" style="width:250px" disabled></el-input>
      </div>
    </div>



    <div class="appcontainer">
      <div class="flow-menu">
        <div
          class="menu-item"
          v-for="item in menueList"
          draggable="true"
          :key="item.type"
          @dragstart="drag(item)"
          @drag="adbor()"
          @dragend="endbor()"
        >
          <i :class="item.icon"></i>
          <div>{{item.name}}</div>
        </div>
        <hr />
        <div class="menu-item" @click="isConnect=true">
          <i class="el-icon-bottom-right"></i>
          <div>连线</div>
        </div>
        <div class="menu-item" @click="isConnect=false">
          <i class="el-icon-rank"></i>
          <div>选择</div>
        </div>
      </div>
      <div class="flow-detail" ref="flowDetail" id="flowDetail"    @drop="drop2($event)" @dragover.prevent>
        <div style="display:flex;color:#6ea1e7;justify-content: center;position:absolute;z-index:999;top:2%;left:35%">
          <el-button plain style="color:#6ea1e7;" @click="flowCopy">复制</el-button>
          <el-button plain style="color:#6ea1e7;" @click="flowpaste">粘贴</el-button>
          <el-button plain style="color:#6ea1e7;" @click="flowcut">剪切</el-button>
          <el-button plain style="color:#6ea1e7;" @click="flowdelete"> 删除</el-button>
          <el-button plain style="color:#6ea1e7;" @click="flowempty">清空</el-button>           
        </div>
        <div style="display:flex;color:#6ea1e7; justify-content:flex-end;position:absolute;z-index:999;top:10%;right:0;">
          <span class="iconfont" @click="bigbox">&#xe71e;</span>
            <span class="iconfont" @click="smallbox" >&#xe71f;</span>
            <span class="iconfont" @click="fullView">&#xe618;</span>
            <span class="iconfont" @click="fullView">&#xe619;</span>
        </div>
         <!-- @drop="drop($event)"  -->
        <div    
          id="flowContent"
          ref="flowContent"
         
          @dragover="allowDrop($event)"
          @click="editFlow()"
          @dblclick="isConnect=false"
          :style="addborder?'-webkit-animation-name: shineRed;-webkit-animation-duration: 3s;-webkit-animation-iteration-count: infinite;':''" 
        >
          <flowNode
            v-for="node in data.nodeList"
            :key="node.id"
            :node="node"
            :id="node.id"
            :isconnect="isConnect"
            @delete-node="deleteNode"
            @change-node-site="changeNodeSite"
            @edit-node="editNode"
            :ref="node.id"
            :class="{borderclass:node.id==isShow}" 
            :style="shiliid==node.id?'border:2px solid #1abc9c':''"
          ></flowNode>
         
        </div>
        <!-- <div class="savebtn">
          <el-button type="primary" size="mini" @click="saveData()">保 存</el-button>
        </div>-->
      </div>
      <div class="flow-edit">
        <div class="flow-edit-content"><!--editType=='flow'-->
          <edit-node ref="nodeForm" id="nodeForm" v-show="flag =='2'?false:(flag =='3'?true:editType=='node')"  @getSon="getSonData" :current="currentnode" ></edit-node>
          <edit-line ref="lineForm" id="lineForm" v-show="flag =='2'?false:(flag =='3'?false:editType=='line')"  @line-save="lineLabelSave" style="padding:12px"></edit-line>
          <edit-flow ref="flowEdit" v-show="flag !='1'?true:(editType=='flow')" :current="currentnode" :flowInfodata="data.flowInfo" @getflow="getflowData"></edit-flow>
          
        </div>
      </div>
    </div>
    <div class="bigboxright-button">
      <el-button    
         v-show="flag !=3?true:false"
        style="background-color: #1abc9c;width:100px;color: #fff;"
        @click="saveFlow(status=1)"
      >暂存</el-button>
      <el-button        
         v-show="flag !=3?true:false"
        style="background-color: #1abc9c;width:100px;color: #fff;margin:0 18px 0 30px"
        @click="saveFlow(status=2)"
      >发布</el-button>
      <el-button style="width:100px;color:#a1a1a3" @click="closeFlow">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";
import panzoom from "panzoom";
import flowNode from "./flow/flowNode.vue";
import editFlow from "./flow/editFlow.vue";
import editNode from "./flow/editNode.vue";
import editLine from "./flow/editLine.vue";
import { Loading } from 'element-ui';


import { post, post1 } from "../../util/http.js";
import { saveFlow ,readFlow,historyFlow,readProcess,
        shouquan,shouquanfabu//申报流程授权发布
        } from "../../util/api.js";
import { getData,setData} from "../../util/sj.js";

export default {
//  inject: ['reload'],
//   name: "Addflow",
  data() {
    return {
      loading:true,
      fullscreen:false,
      nodeInfo: null,
      flowInfo:{
        Name:'',
        Id:''
      },//包括流程名称，ID,备注
      // flowName: "", // 流程名称
      flowVersion:"",//流程版本
      history:'',//历史版本
      direction:'',//申报方向名称
       flowCode:'',//流程编码
      //历史版本
      historyoptions: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }],
      menueList: [
        {
          type: 1,
          name: "起点",
          icon: "el-icon-help"
        },
        {
          type: 2,
          name: "终点",
          icon: "el-icon-s-help"
        },
        {
          type: 3,
          name: "人工活动",
          icon: "el-icon-user"
        }
        // {
        //   type: 4,
        //   name: '自动活动',
        //   icon: 'el-icon-s-tools'
        // },
      ],
      jsPlumb: null, // jsPlumb 实例
      index: 1,
      // 默认设置参数
      jsplumbSetting: {
        // 动态锚点、位置自适应
        Anchors: [
          "Top",
          "TopCenter",
          "TopRight",
          "TopLeft",
          "Right",
          "RightMiddle",
          "Bottom",
          "BottomCenter",
          "BottomRight",
          "BottomLeft",
          "Left",
          "LeftMiddle"
        ],
        Container: "flowContent",
        // 连线的样式 StateMachine、Flowchart,有四种默认类型：Bezier（贝塞尔曲线），Straight（直线），Flowchart（流程图），State machine（状态机）
        Connector: "Flowchart",
        //这个是鼠标拉出来的线的属性
        ConnectionOverlays: [
          [
            "Label",
            {
              label: "",
              id: "label-1",
              cssClass: "csslabel"
            }
          ]
        ],
        // 鼠标不能拖动删除线
        ConnectionsDetachable: false,
        // 删除线的时候节点不删除
        DeleteEndpointsOnDetach: false,
        // 连线的端点
        // Endpoint: ["Dot", {radius: 5}],
        Endpoint: [
          "Rectangle",
          {
            height: 5,
            width: 5
          }
        ],
        // 线端点的样式
        EndpointStyle: {
          fill: "rgba(255,255,255,0)",
          outlineWidth: 1
        },
        LogEnabled: true, //是否打开jsPlumb的内部日志记录
        // 绘制线
        PaintStyle: {
          stroke: "#409eff",
          strokeWidth: 2
        },
        // 绘制箭头
        Overlays: [
          [
            "Arrow",
            {
              width: 8,
              length: 8,
              location: 1
            }
          ]
        ],
        RenderMode: "svg"
      },
      // jsplumb连接参数
      jsplumbConnectOptions: {
        isSource: true,
        isTarget: true,
        // 动态锚点、提供了4个方向 Continuous、AutoDefault
        anchor: "Continuous"
      },
      jsplumbSourceOptions: {
        filter: ".flow-node-drag", //触发连线的区域
        /*"span"表示标签，".className"表示类，"#id"表示元素id*/
        filterExclude: false,
        anchor: "Continuous",
        allowLoopback: false
      },
      jsplumbTargetOptions: {
        filter: ".flow-node-drag",
        /*"span"表示标签，".className"表示类，"#id"表示元素id*/
        filterExclude: false,
        anchor: "Continuous",
        allowLoopback: false
      },
      // 是否加载完毕
      loadEasyFlowFinish: false,
      // 数据
      data: {
        flowInfo: {
          Id: this.getUUID(),
          Name: "",
          Remark: ""
        },
        nodeList: [],
        lineList: [],
        // lastNodeList: []
      },
       data2: '',
       data3:{
        flowInfo: {
          Id: this.getUUID(),
          Name: "",
          Remark: ""
        },
        nodeList: [],
        lineList: [],
        // lastNodeList: []
      },
    
      currentItem: "", //临时存添加的元素
      isConnect: false, //判断是否连接
      timer: null, //定时器,判断单双击,
      currentConnect: "", //当前的连接线
      currentLine: "", //当前连接线数据
      editType: "flow",//编辑的类型
      //页面
      flag:'',
      //点击查看流程图的id
      flowid:'',
      //有editFlow传过来的当前节点信息
      currentnode:{},
      pan:'',//放大缩小的生命
      ddd:'',      
      isShow:"-1", //点击节点样式判断 
      cutid:'',  //是否是剪切
      shiliid:'',//当前流程实例id，用于查询到目前进行到哪一部，然后回显
      ywlsh:'',//调流实例接口所需要的ywlsh
      declaration_flow_id:'',//申报id
      isName:false,//是否禁用流程名称
      addborder:false,//给流程图加边框
      test:{}
    };
  },
  components: {
    flowNode,
    editFlow,
    editNode,
    editLine,
 
  },
  destroyed() {
 
},
  created() {
    
    // loading = Loading.service({
    //   lock: true,
    //   text: '加载加载加载',
    //   background: 'rgba(255,255,255,.9)'
    // })
    // // 获取传递进来的是什么页面,1是新增定义,2是授权,3是流程实例
    this.flag = this.$route.query.flag;
    this.flag !=1?this.direction=this.$route.query.declarationName:'';
    this.flowid=this.$route.query.Id?this.$route.query.Id:this.$route.query.flowId
    //申报方向名称
    this.direction=this.$route.query.flowName?this.$route.query.flowName:''
    //流程图实例需要的ywlsh
    this.ywlsh=this.$route.query.ywlsh?this.$route.query.ywlsh:''

    //是否禁用流程名称的Input
    this.isName=this.flag==1?false:(this.flowid?true:false)

    //授权需要的id
    this.declaration_id=this.$route.query.declaId?this.$route.query.declaId:''

    console.log("22222222222222222222",this.flag != 3)
    //流程实例调用接口
    this.flag=="3"?this.checkProcessInfo():''

  //   // //请求数据，将数据存到本地
    this.flowid?this.reFlowdata():''
    // this.reFlowdata()
    // localStorage.removeItem("flowData");
    // //从本地拿出来回显到流程图  
      setTimeout(()=>{
           this.flowid?this.echoFlow():''  
      },2000)
     
      
    // this.echoFlow()
    //查看历史版本
      this.flag==1&&this.flowid?this.readhistory():''
  },
 
  mounted() {

   
    
    setTimeout(()=>{
      this.jsPlumb = jsPlumb.getInstance();
      this.$nextTick(() => {
      
      this.init();
      // this.reload()
      this.loading=false
    });
    },2500)
    

   

    // this.shuaxin();
  },
  beforeMount() {
   this.sxym()
  },
 
  methods: {
    //查看流程实例id
    async checkProcessInfo(){
      let me =this
      
      if(this.ywlsh){
        const res =await  post1(me, readProcess, {
          "ywlsh":this.ywlsh,
          // "flowId":this.flowid
      },false)


      if(JSON.stringify(res.data) === '{}'){    
      }else{
        console.log('流程实例啊啊啊啊啊',res)
        this.shiliid=res.data.task.nodeId
      }

      }
    },
    changeColor(id){
      this.isShow=id
    },
    
    //刷新
    sxym(){
      // this.$router.go(0)
    },
    //下拉选择历史版本
    changehistory(){
      console.log(this.history)
      this.flowid=this.history
      this.loading=true
      this.flowempty()
       this.flowid?this.reFlowdata():''
   
    // //从本地拿出来回显到流程图   
      setTimeout(()=>{
           this.flowid?this.echoFlow():''  
      },2000)

      setTimeout(()=>{
      this.jsPlumb = jsPlumb.getInstance();
      this.$nextTick(() => {
      
      this.init();
      // this.reload()
      this.loading=false
    });
    },2500)

    },
    //点击放大
    bigbox(){
    console.log(document.getElementById('flowDetail').scrollWidth)  
    // console.log(this.$refs.flowContent.clientWidth)
    // console.log(this.$refs.flowContent.offsetLeft)
    // console.log(this.$refs.flowContent.offsetParent)
      //  this.$message.error('功能尚未开发');
      const x = this.$refs.flowContent.clientWidth / 10;
      const y = this.$refs.flowContent.clientHeight / 10;
      this.pan.smoothZoom(x, y, 1.2);    
    },
    //点击缩小
    smallbox(){
      //  this.$message.error('功能尚未开发');
     const x = this.$refs.flowContent.clientWidth / 10;
      const y = this.$refs.flowContent.clientHeight / 10;

     this.pan.smoothZoom(x, y, 0.8);
 
    },
    //流程授权页面请求数据
    shouquan(){

    },

    //查看历史版本
    async readhistory(){
        let me =this
        const res = await post1(me, historyFlow, {
          "flowId": this.flowid
      },false)
      // console.log("历史版本",res)
      if(res){
      this.historyoptions=res.data
      }
    },
    //本地数据回显
    echoFlow(){
      
        var data789 =JSON.parse(localStorage.getItem("flowData"))
      
       
          console.log('localStroage是什么东西',data789)
          if(data789){
       this.data =setData(data789);

      //回显流程版本和申报方向
      this.flowVersion=this.data.flowVersion
      // this.direction=this.data.
       this.flowInfo=this.data.flowInfo
       //回显流程编码
       this.flowCode=this.data.flowCode
      //  this.$set( this.data, this.data, this.data )
    
      console.log("data来了,data来了",this.data)
      }
       
       
    },

    async reFlowdata(){

      let me =this;
      // localStorage.clear();

      // setTimeout (()=>{
      //   post1(me, readFlow, {
      //   "flowId": this.flowid
      // })
      // .then(res => {
      //   if (res && res.code == 1) {
      //     res?localStorage.setItem("flowData",JSON.stringify(res.data)):''; 
      //   } else {
      //     console.log("异常：", res.msg);
      //   }
      // })
      // .catch(err => {
      //   console.log("错误信息", err);
      // });
      //   console.log("两秒后执行了")
      // },1000);

      const res = await post1(me, readFlow, {
          "flowId": this.flowid
      },false)

     
     
    //  return
      //  console.log('33333333333333333333333333333333333333333')
      // console.log(res.data)
      if(res){
        console.log("进来了")
     localStorage.setItem("flowData",JSON.stringify(res.data))
    //  this.flowid?this.echoFlow():''
    }
      return
    },
    //点击关闭按钮
    closeFlow(){
      
      console.log(res)
      localStorage.removeItem("flowData");　　
      this.flag=='2'?this.$router.push({path:"/flowauth"}):this.flag=='3'?this.$router.push({path:"/instanquery"}):this.$router.push({path:"/flowdefine"})
    },

    // ---------------------------------流程图方法开始---------------------------------------
    init() {
      const _this = this;
      this.jsPlumb.ready(function() {

        //放大缩小逻辑开始
        let flowContent =_this.$refs.flowContent;
        const pan = panzoom(flowContent, {
          smoothScroll: false,
          bounds: true,
          // autocenter: true,
          zoomDoubleClickSpeed: 1,
          minZoom: 0.8,
          maxZoom: 2,
          startTransform: 'scale(1.2)'
        });
        console.log('pan',pan)
        _this.pan = pan;
        //放大缩小逻辑结束

        // 导入默认配置
        _this.jsPlumb.importDefaults(_this.jsplumbSetting);
        // 会使整个jsPlumb立即重绘。
        _this.jsPlumb.setSuspendDrawing(false, true);
        // 初始化节点
        _this.loadEasyFlow();

        // 单点连接线（编辑label）,
        _this.jsPlumb.bind("click", function(conn, originalEvent) {
          //clearTimeout(this.timer);
          //this.timer = setTimeout(function () { // 这里采用执行自定义事件的方式
          //    console.log("click", conn);
          //    _this.editLine(conn);
          //}, 300); // 延迟300ms执行单击事件,区分双击事件
          console.log("click", conn);
          _this.editLine(conn);
          console.log(conn.getOverlay("label-1"));
          //conn.getOverlay("label-1").setLabel('大肥肚'); //初始化label
        });
        // 双击连接线（删除）,
        _this.jsPlumb.bind("dblclick", function(conn, originalEvent) {
          clearTimeout(this.timer);
          console.log("dblclick", conn);

          _this
            .$confirm("确定删除所点击的线吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              _this.jsPlumb.deleteConnection(conn);
            })
            .catch(() => {});
        });
        // 连线
        _this.jsPlumb.bind("connection", function(evt) {
          console.log("connection", evt);
          let from = evt.source.id;
          let to = evt.target.id;
          if (_this.loadEasyFlowFinish) {
            _this.data.lineList.push({
              from: from,
              to: to,
              label: "",
              id: _this.getUUID(),
              Remark: "", // 备注
              toCode: "", // 编码
              toBtn: "" // 按钮名称
            });
          }
          setTimeout(function() {
            _this.editLine(evt.connection);
          }, 100);
        });

        // 删除连线
        _this.jsPlumb.bind("connectionDetached", function(evt) {
          console.log("connectionDetached", evt);
          _this.deleteLine(evt.sourceId, evt.targetId);
        });

        // 改变线的连接节点
        _this.jsPlumb.bind("connectionMoved", function(evt) {
          console.log("connectionMoved", evt);
          _this.changeLine(evt.originalSourceId, evt.originalTargetId);
        });

        // 单击endpoint
        // jsPlumb.bind("endpointClick", function (evt) {
        //   console.log('endpointClick', evt)
        // })
        //
        // // 双击endpoint
        // jsPlumb.bind("endpointDblClick", function (evt) {
        //   console.log('endpointDblClick', evt)
        // })

        // contextmenu 右键
        _this.jsPlumb.bind("contextmenu", function(evt) {
          console.log("contextmenu", evt);
        });

        // beforeDrop
        _this.jsPlumb.bind("beforeDrop", function(evt) {
          console.log("beforeDrop", evt);
          let from = evt.sourceId;
          let to = evt.targetId;
          if (from === to) {
            _this.$message.error("不能连接自己");
            return false;
          }
          if (_this.hasLine(from, to)) {
            _this.$message.error("不能重复连线");
            return false;
          }
          if (_this.hashOppositeLine(from, to)) {
            _this.$message.error("不能回环哦");
            return false;
          }
          return true;
        });

        // beforeDetach
        _this.jsPlumb.bind("beforeDetach", function(evt) {
          console.log("beforeDetach", evt);
        });
      });
    },
    // 加载流程图
    loadEasyFlow() {
      // 初始化连线
      for (var i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i];
        let connection = this.jsPlumb.connect(
          {
            source: line.from,
            target: line.to
          },
          this.jsplumbConnectOptions
        );

        connection.getOverlay("label-1").setLabel(line.label); //初始化label
      }

      // 初始化节点
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions);
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions);
        // jsPlumb.addEndpoint(node.id)
        // 设置可拖拽
        // jsPlumb.draggable(node.id, {
        //     containment: 'parent',
        //     grid: [10, 10]
        // })

        this.jsPlumb.draggable(node.id, {
          containment: "parent"
        });

        // jsPlumb.draggable(node.id)
      }

      
      this.$nextTick(function() {
        this.loadEasyFlowFinish = true;
      });
    },
    // 添加新的节点
    addNode(temp) {
      console.warn("添加节点", temp);

      this.data.nodeList.push(temp);
      this.$nextTick(function() {
        this.jsPlumb.makeSource(temp.id, this.jsplumbSourceOptions);
        this.jsPlumb.makeTarget(temp.id, this.jsplumbTargetOptions);
        this.jsPlumb.draggable(temp.id, {
          containment: "parent"
        });
      });
    },
    // 删除线
    deleteLine(from, to) {
      this.data.lineList = this.data.lineList.filter(function(line) {
        return line.from !== from && line.to !== to;
      });
    },
    // 改变连线
    changeLine(oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo);
    },
    // 改变节点的位置
    changeNodeSite(data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        if (node.id === data.nodeId) {
          node.left = data.left;
          node.top = data.top;
        }
      }
    },
    //删除节点
    deleteNode(nodeId,cut) {
      let text=cut?(cut=="cut"?"确定要剪切节点":"确定要删除节点"):"确定要删除节点"
      this.$confirm(text + nodeId + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          console.log(nodeId)
          console.log("this.data.nodeList",this.data.nodeList)
          // this.data.nodeList = this.data.nodeList.filter(function(node) {
          // 	if (node.id === nodeId) {
          // 		node.show = false
          // 	}
          // 	return true
          // })
          this.data.nodeList.forEach((item, index) => {
            if (item.id === nodeId) {
              this.data.nodeList.splice(index, 1);
              console.log(this.data.nodeList)
            }
          });
         

      
          this.$nextTick(function() {
            console.log("删除" + nodeId);
            this.jsPlumb.removeAllEndpoints(nodeId);
           
          });
      
        })
        .catch(() => {});
      return true;
    },
    //编辑节点
    editNode(nodeId) {
      this.isShow=nodeId
      this.editType = "node";
      this.$nextTick(function() {
        this.$refs.nodeForm.init(this.data, nodeId);
      });
    },
    editLine(conn) {
      var _this = this;
      _this.currentConnect = conn;
      _this.data.lineList.forEach(function(item, index) {
        if (item.from == conn.sourceId && item.to == conn.targetId) {
          _this.currentLine = item;
          _this.editType = "line";
          _this.$nextTick(function() {
            _this.$refs.lineForm.init(item);
          });
          return;
        }
      });
    },
    //删除线
    delLine(conn) {
      this.$confirm("确定删除所点击的线吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.jsPlumb.deleteConnection(conn);
        })
        .catch(() => {});
    },
    // 是否具有该线
    hasLine(from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i];
        if (line.from === from && line.to === to) {
          return true;
        }
      }
      return false;
    },
    // 是否含有相反的线
    hashOppositeLine(from, to) {
      return this.hasLine(to, from);
    },
    lineLabelSave(line) {
      this.currentConnect.getOverlay("label-1").setLabel(line.label);
      //this.$set(this.currentLine, 'label', line.label);
      // console.log("有没有改变line",line)
      // console.log("有没有改变data",this.data)
    },
    drag(item) {
      console.log("aaaaaaaaaaaaaa", item);
      this.currentItem = item;      
    },
    adbor(){
      this.addborder=true
    },
    endbor(){
      this.addborder=false
    },
    getSonData(data) {
      console.log("子组件传递回来的数据：", data);
      this.currentnode=data;
      // console.log("当前currentnode",this.currentnode)
      //  document.getElementById(data.nodeId).classList.add(" borderclass");
      //  this.$refs.dataid.setAttribute("class", " borderclass")
     
      this.data.nodeList.map((item)=>{
        if(item.id==data.nodeId){
          item.label=data.nodeName   
          //修改节点编号
          item.nodeCode=data.nodeCode
          item["Remark"]=data.Remark
          item["taskAssignType"]=data.taskAssignType
          item["businessType"]=data.businessType
        }
      })
       console.log('更新的数据',this.data.nodeList)
        console.log('更新的数据this.data',this.data)
    },
    drop(event) {
      //event.preventDefault();
      var _obj = this.$refs.flowContent;
      console.log(2222222222222)

      // console.log("vvvvvvvvvvvvvvvvvv", this.$refs);
      // console.log("vvvvvvvvvvvvvvvvvv", this.$refs.nodeForm);
      // console.log("nnnnnnnnnnnnnnnnnnnnnnn", this.$refs.nodeForm.$children[0]);
      // console.log(
      //   "vvvvvvvvvvvvvvvvvv",
      //   this.$refs.nodeForm.$children[0].$options
      // );
      // 节点的数据
      // let nodeInfo = this.$refs.nodeForm;
      // // let CurrentNodeData = this.$refs.nodeForm.$children[0].$options.propsData.model;
      // console.log(
      //   "最终----------vvvvvvvvvvvvvvvvvv",
      //   // JSON.stringify(this.$refs.nodeForm.$children[0].$options.propsData)
      //   nodeInfo
      // );

      var temp = {
        id: this.getUUID(),
        label: this.currentItem.name,
        top: event.offsetY + "px",
        left: event.offsetX + "px",
        Type: this.currentItem.type
      };

      this.addNode(temp);
      this.editNode(temp.id);
    },
    drop2(event){
        console.log(2222)
       var temp = {
        id: this.getUUID(),
        label: this.currentItem.name,
        top: event.offsetY + "px",
        left: event.offsetX + "px",
        Type: this.currentItem.type
      };

      this.addNode(temp);
      this.editNode(temp.id);
    },
    allowDrop(event) {
      event.preventDefault();
    },
    getUUID() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
      var uuid = s.join("");
      return uuid;
    },

    // 保存
    async saveFlow(status) {
      let me = this;
      //console.log(this.jsPlumb)
      //console.log(this.jsPlumb.Defaults)
      //console.log('线', this.jsPlumb.getConnections())
      console.log("=========当前流程图的数据===========：", this.data);  
      
      // 判断是否输入了流程名称
      if (!this.flowInfo.Name) {
        this.$alert("请输入流程名称", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      } else {
        //如果是定义的话就跳以下保存的逻辑。
       if(this.flag==1){
        this.data.flowInfo=this.flowInfo
        

      //  const Id=this.data.flowInfo.Id?this.data.flowInfo.Id:this.getUUID()
       console.log('this.data',this.data)
       
        let flowObj=getData(this.data)
        console.log('flowObj',flowObj)
        
       
       
        const Id=this.flowid?this.flowid:this.getUUID()
        flowObj.flowName= this.flowInfo.Name
        flowObj['status']=status// 1暂存 or 2发布
        //流程版本需要跟后端确认字段
        flowObj['flowVersion']=flowObj.flowVersion?flowObj.flowVersion:""
        
        // flowObj['flowCode']=''
        flowObj['nodes']=flowObj.nodes
        flowObj['trans']=flowObj.trans
        flowObj['deptIds']=''
        // flowObj['taskAssignType']=flowObj.taskAssignType
  
        // console.log('flowObj',flowObj)

        flowObj.nodes.map(item=>{
            item['remark']=item.Remark
            item['taskAssignType']=item.taskAssignType
            item['businessType']=item.businessType
            console.log("进来了")
          })
         console.log( flowObj)

        //  flowObj.nodes.map((item)=>{
        //    data.nodeList.map
        //  })

       
        // return
        
          flowObj.trans.map(item=>{
            item['tranId']=item.id
            // item['nodeId']=item.id
            console.log("进来了")
          })
          flowObj.nodes.map(item=>{
            
            item['nodeId']=item.id
            console.log("进来了")
            
          })
        

        if(status==1){
             flowObj['flowId']=this.flowid?this.flowid:''
        }else if(status==2){
            flowObj['flowId']=''
            flowObj['Id']=''
            flowObj.trans.map(item=>{
            item['tranId']=item.id
            // item['nodeId']=item.id
            console.log("进来了")
          })
          flowObj.nodes.map(item=>{
            
            item['nodeId']=item.id
            console.log("进来了")
          })
          //   if(flowObj.nodes.length!=0){
          //     flowObj.nodes.map(item=>{           
          //   item.flowId=''
          //  })
          //   }
          //   if(flowObj.trans.length!=0){
          //      flowObj.trans.map(item=>{
          //   item.flowId=''     
          // })
          //   }
        }

      // flowObj.trans.map(item=>{
      //       item['tranId']=''
      //      item.id=''
      //      item.startNode=''
      //      item.endNode=''
      //     })

      //  flowObj.nodes.map(item=>{
      //       item.id=''
      //       item['nodeId']=''
           
      //     })
        console.log('最终胜出',flowObj)
      
        var istart=0;
        var iend=0
         flowObj.nodes.map(item=>{
           if(item.nodeType=="0"){
             istart++
           }else if(item.nodeType=="9"){
            iend++
           }
          })

        if(istart>1&&iend>1){
          this.$alert("开始节点和结束节点是唯一的,不能有多个开始或结束节点", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {}, 
        });
        console.log(istart,iend)
           istart=0,iend=0
        }else if(istart>1){
          this.$alert("开始节点是唯一的，不能有多个开始节点", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {},
         
        });
        console.log(istart,iend)
          istart=0,iend=0
        }else if(iend>1){
          this.$alert("结束是唯一的，不能有多个结束节点", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {},
         
        });
        console.log(istart,iend)
          istart=0,iend=0
        }
        else if(iend==0 && istart==0){
          this.$alert("开始节点和结束节点都是必须的", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {},
         
        });
        console.log(istart,iend)
          istart=0,iend=0
        }
        else if(iend==0){
          this.$alert("结束节点是必须的，不能缺少结束节点", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {},
         
        });
        console.log(istart,iend)
          istart=0,iend=0
        }
        else if(istart==0){
          this.$alert("开始节点是必须的，不能缺少开始节点", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {},
         
        });
          console.log(istart,iend)
          istart=0,iend=0
        }else{
              
             let massage=status==1?'暂存':'发布'
            //调用保存接口
            post(me, saveFlow, flowObj)
              .then(res => {
                if(res.code=="0"){
                  this.$message.error(`${res.msg},保存失败`);
                }else{
                  console.log("保存流程图的数据：", res);
                this.$message({
                  message: `${massage}成功`,
                  type: 'success'
                });
                // localStorage.removeItem("flowData")　　
              this.flag=='2'?this.$router.push({path:"/flowauth"}):this.flag=='3'?this.$router.push({path:"/instanquery"}):this.$router.push({path:"/flowdefine"})
                }
                
                
              })
              .catch(err => {
                console.log("保存流程图错误调试：", err);
                this.$message.error(`${massage}失败`);
              });
            }
            
        //授权页面更改状态是否为发布。
       }else if(this.flag=="2"){
         //先判断他是点击了暂存还是发布的按钮。1为暂存2为发布
         //申报id  this.declaration_flow_id
          let massage=status==1?'暂存':'发布'
          if(status==1){
            //暂存给他授权，但不发布，调用授权接口，授权接口可以判断他节点是否有重要信息没有填完整
            // return
             let me =this
               post1(me, shouquan, {"declaraionId":this.declaration_id})
              .then(res => {
                if(res.code=="0"){
                  this.$message.error(`${res.msg}`);
                }else{    
                this.$message({
                  message: `${massage}成功`,
                  type: 'success'
                });
                // localStorage.removeItem("flowData")　　
                this.$router.push({path:"/flowauth"})
                }

              })
              .catch(err => {
                console.log("授权错误调试：", err);
                this.$message.error(`${massage}`);
              });
             
          }else if(status==2){

              //调授权接口
              const res1 =await  post1(me, shouquan, {
               "declaraionId":this.declaration_id
            },false)

              if(res1.code==1){
                if(res1.data=="授权成功"){
                  const res2 =await  post1(me, shouquanfabu, {
                    "declaraionId":this.declaration_id
                 },false)
                  if(res2.code==1){
                       this.$message({
                        message: `${massage}`,
                        type: 'success'
                      });
                      this.$router.push({path:"/flowauth"})
                  }else{
                      this.$message.error(`${res2.msg}`);
                  }

                }else{
                  this.$message.error(`${res1.msg}`);
                }
              }else{
                this.$message.error(`${res1.msg}`);
              }

             
              
          }
       }
        // let flowObj = {
        //   flowId: "",
        //   flowVersion: "",
        //   flowName: this.flowName,
        //   flowCode: "ddd",
        //   deptIds: "",
        //   status: "2", // 暂存 or 提交
        //   // 节点
        //   nodes: this.data.nodeList,

        //   //节点对应的数据
        //   trans: this.data.lineList
        // };
       
      }
    },

    // 暂存
    temporaryFlow() {},
    editFlow() {
      this.editType = "flow";
      this.$nextTick(function() {
        this.$refs.flowEdit.init(this.data.flowInfo);
      });
    },

    // ---------------------------------流程图方法结束---------------------------------------
    getflowData(flowInfodata){
      console.log('子组件传来的flowInfodata',flowInfodata)
      console.log('是否有改变this.data',this.data)
    },
    changedata(data){
        console.log("data",data)
        data=this.data.flowInfo
    },
    //刷新
    refresh() {
      console.log("刷新成功");
    },
    //返回
    goback() {
      console.log("返回");
    },
    //全屏
    fullView(){
      // let element = document.documentElement;//设置后就是我们平时的整个页面全屏效果
        let element = document.getElementById('flowDetail');//设置后就是   id==con_lf_top_div 的容器全屏
          if (this.fullscreen) {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          } else {
            if (element.requestFullscreen) {
              element.requestFullscreen();
            } else if (element.webkitRequestFullScreen) {
              element.webkitRequestFullScreen();
            } else if (element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
              // IE11
              element.msRequestFullscreen();
            }
          }
          this.fullscreen = !this.fullscreen;
    },

    //复制
    flowCopy(){    
      console.log(this.currentnode) 
      if(!this.currentnode.nodeId){
        console.log("currentnode是空的")
      }else{
        localStorage.setItem("currentnode",JSON.stringify(this.currentnode))
       this.$message({
          message: '已复制',
          type: 'success'
        });
      }
     
    },
    //粘贴
    flowpaste(){
      var copycurrentnode =JSON.parse(localStorage.getItem("currentnode"))


         console.log("粘贴copycurrentnode",copycurrentnode)
         
         if(copycurrentnode){
        const id=this.cutid==copycurrentnode.nodeId?copycurrentnode.nodeId:this.getUUID()
        var temp1 = {
            id: id,
            label:copycurrentnode.nodeName,
            top: event.offsetY+50 + "px",
            left: event.offsetX +300+ "px",
            Type: copycurrentnode.nodeType,
            Remark:copycurrentnode.Remark,
            taskAssignType:copycurrentnode.taskAssignType,
            businessType:copycurrentnode.businessType,
            nodeCode:copycurrentnode.nodeCode,
            nodeCategory:copycurrentnode.nodeCategory,
            nodeId:id
          };

        this.addNode(temp1);
        this.editNode(temp1.id);
      }
    
    
    
    },
    //剪切
    flowcut(){
      if(this.currentnode.nodeId){
      console.log(this.currentnode)     
      let cut = "cut"
      this.deleteNode(this.currentnode.nodeId,cut)
      localStorage.setItem("currentnode",JSON.stringify(this.currentnode))
      //剪切还是会复制，所以给一个id
      this.cutid=this.currentnode.nodeId
      // this.$message({
      //     message: '已剪切',
      //     type: 'success'
      //   });
      }
    },
    //删除
    flowdelete(){
     console.log("this.currentnode",this.currentnode)
    
       if(this.currentnode.nodeId){
      //调用删除方法
       this.deleteNode(this.currentnode.nodeId)
      console.log(this.data)
       }
    },
    //清空
    flowempty(){
      // console.log("this.data",this.data)
      // return
      // const dataid=this.data.flowInfo.Id?this.data.flowInfo.Id:''
      var connections = this.jsPlumb.getAllConnections();
      console.log("connections",connections)
      
      // this.data.flowInfo.Id=dataid
      // console.log(this.data.flowInfo.Id)
      // document.getElementById('flowContent').empty()
      // console.log("this.$refs.flowContent",this.$refs.flowContent)
      // this.$refs.flowContent.empty()
    
      // const _this = this;
      for(var i=0;i<connections.length;i++){
        jsPlumb.deleteConnection(connections[i]);
      }
      let id =this.data.flowInfo.Id
      this.data.nodeList=[]
      this.data.lineList=[]
      
           
      console.log("this.data",this.data)
      // this.$message({
      //     message: '成功',
      //     type: 'success'
      // });
    }
  }
};
</script>

<style>
/*  ------------------------------流程图样式开始------------------------------------------- */
.appcontainer {
  display: flex;
  height: calc(70vh - 40px);
  color: #606266;
  background-color: #fff;
}

.flow-detail {
  flex: 1;
  border: 1px solid #ebeef5;
  /* padding: 12px; */
  /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
  word-break: break-all;
  border-radius: 4px;
  position: relative;
  overflow-y: scroll;
  white-space:nowrap;
  padding-top: 46px;
  background-color:#fff;
}

#flowContent {
  width: 500%;
  height: 500%;
  position: relative;
  /* 添加滚动条 */
  padding-bottom:40px;
  /* min-height: 200px; */
   background-color: #fff;
}

.item {
  position: absolute;
  width: 60px;
  height: 90px;
  border: 1px solid #007aff;
}

.flow-menu {
  width: 100px;
  padding: 10px;
  margin: 0 10px;
  border: 1px solid #ebeef5;
  padding: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  word-break: break-all;
  border-radius: 4px;
}

.menu-item {
  text-align: center;
  box-shadow: 0 0 4px #696969;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  padding: 5px 0;
  border-radius: 5px;
}

.menu-item > i {
  font-size: 30px;
}

.flow-edit {
  width: 300px;
  padding: 0 10px;
}

.flow-edit-content {
  background: #fff;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  border: 1px solid #ebeef5;
  /* padding: 12px; */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  word-break: break-all;
  border-radius: 4px;
}
.csslabel {
  color: #434343;
  font-weight: 400;
  z-index: 10;
  font-size: 12px;
  color: #409eff;
  background: #fff;
}
.csslabel .label-text {
  background-color: white;
}
.savebtn {
  position: absolute;
  top: 5px;
  right: 5px;
}
/* ---------------------------------流程图样式结束---------------------------------------- */
.top {
  background-color: rgb(243, 243, 243);
  height: 50px;
  color: #a1a1a3;
  line-height: 50px;
  border-bottom: 2px solid #efefef;
  font-size: 14px;
  width: 100%;
  box-shadow: 0px 2px 1px #eee;
  display: flex;
  justify-content: space-between;
}

.top_span {
  display: inline-block;
  width: 5px;
  height: 15px;
  background-color: #1abc9c;
}

.search {
  height: 40px;
  background-color: #fff;
  display: flex;
  line-height: 40px;
  color: #7f7d7d;
  font-size: 13px;
  padding: 20px 0;
  padding-left: 50px;
  width: 100%;
}

.bigboxright-button {
  color: #fff;
  display: flex;
  justify-content: center;
  padding: 20px 0;
  background-color: #fff;
  padding-right: 15%;
}

.content{
  overflow-y:visible;
  overflow-x:hidden;
  
}

.borderclass{
      border:1.2px solid #f58f98;
     
}

@-webkit-keyframes  shineRed {
    from { -webkit-box-shadow: 0 0 5px #bbb; }
    50% { -webkit-box-shadow: 0 0 10px #7bbfea; }
    to { -webkit-box-shadow: 0 0 5px #bbb; }
}

/* .shine_red{
-webkit-animation-name: shineBlue; 
-webkit-animation-duration: 3s;
-webkit-animation-iteration-count: infinite; 
} */





</style>
