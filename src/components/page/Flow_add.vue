<template>
  <div>
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
      <el-input v-model="flowInfo.Name" style="width:200px" placeholder="新增必须填写活动名称"></el-input>
      <div v-if="parentPath =='flowdeclare'" style="width:60%;display:flex">
       <div style="margin:0 15px">流程编码</div>
      <el-input v-model="flowInfo.Id" style="width:250px;border:" disabled></el-input>
      <div style="margin:0 15px">历史版本</div>
      <el-input v-model="flowVersion" style="width:250px" disabled></el-input>
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
      <div class="flow-detail" ref="flowDetail" id="flowDetail" style="background-color:#fff">
        <div style="display:flex;color:#6ea1e7;justify-content: center;">
          <el-button plain style="color:#6ea1e7;" @click="flowCopy">复制</el-button>
          <el-button plain style="color:#6ea1e7;" @click="flowpaste">粘贴</el-button>
          <el-button plain style="color:#6ea1e7;" @click="flowcut">剪切</el-button>
          <el-button plain style="color:#6ea1e7;" @click="flowdelete"> 删除</el-button>
          <el-button plain style="color:#6ea1e7;" @click="flowempty">清空</el-button>           
        </div>
        <div style="display:flex;color:#6ea1e7; justify-content:flex-end">
          <span class="iconfont">&#xe71e;</span>
            <span class="iconfont">&#xe71f;</span>
            <span class="iconfont" @click="fullView">&#xe618;</span>
            <span class="iconfont" @click="fullView">&#xe619;</span>
        </div>
        <div
          id="flowContent"
          ref="flowContent"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          @click="editFlow()"
          @dblclick="isConnect=false"
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
          ></flowNode>
        </div>
        <!-- <div class="savebtn">
          <el-button type="primary" size="mini" @click="saveData()">保 存</el-button>
        </div>-->
      </div>
      <div class="flow-edit">
        <div class="flow-edit-content">
          <edit-flow ref="flowEdit" v-show="parentPath =='flowdeclare'?true:editType=='flow'" :current="currentnode" ></edit-flow>
          <edit-node ref="nodeForm" v-show="parentPath =='flowdeclare'?false:(editType=='node')"  @getSon="getSonData" ></edit-node>
          <edit-line ref="lineForm" v-show="parentPath =='flowdeclare'?false:editType=='line'" @line-save="lineLabelSave" style="padding:12px"></edit-line>
        </div>
      </div>
    </div>
    <div class="bigboxright-button">
      <el-button
        style="background-color: #1abc9c;width:100px;color: #fff;margin-left:30%"
        @click="saveFlow(status=1)"
      >暂存</el-button>
      <el-button
        style="background-color: #1abc9c;width:100px;color: #fff;margin:0 18px 0 30px"
        @click="saveFlow(status=2)"
      >发布</el-button>
      <el-button style="width:100px;color:#a1a1a3" @click="closeFlow">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";
import flowNode from "./flow/flowNode.vue";
import editFlow from "./flow/editFlow.vue";
import editNode from "./flow/editNode.vue";
import editLine from "./flow/editLine.vue";



import { post, post1 } from "../../util/http.js";
import { saveFlow ,readFlow} from "../../util/api.js";
import { getData,setData} from "../../util/sj.js";

export default {
  name: "Addflow",
  data() {
    return {
      fullscreen:false,
      nodeInfo: null,
      flowInfo:{
        Name:'',
        Id:''
      },//包括流程名称，ID,备注
      // flowName: "", // 流程名称
      flowVersion:"",//流程版本
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
          Name: "我的流程",
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
          Name: "我的流程",
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
      editType: "",//编辑的类型
      //页面
      parentPath:'',
      //点击查看流程图的id
      flowid:'',
      //有editFlow传过来的当前节点信息
      currentnode:{}
    };
  },
  components: {
    flowNode,
    editFlow,
    editNode,
    editLine,
 
  },
  created() {
    // // 获取传递进来的页面
    this.parentPath = this.$route.query.parentPath;
    this.flowid=this.$route.query.flowId
    // this.flowid='5014c6c9-4677-4b0e-95da-46ebc9e47724'
    // console.log(this.parentPath)
    console.log(this.$route.query.flowId)


    // //请求数据，将数据存到本地
    this.flowid?this.reFlowdata():''
    // this.reFlowdata()
    // //从本地拿出来回显到流程图
    this.flowid?this.echoFlow():''
    // this.echoFlow()

  },
  mounted() {
    // this.ggg()
    this.jsPlumb = jsPlumb.getInstance();
    this.$nextTick(() => {
      this.init();
      
    });
    this.editFlow();
  },
 
  methods: {
    //流程授权页面请求数据
    shouquan(){

    },
    //本地数据回显
    echoFlow(){
        var data789 =JSON.parse(localStorage.getItem("flowData"))
        console.log('localStroage',data789)
       
       this.data =setData(data789);
       this.flowInfo=this.data.flowInfo
       console.log(this.data.nodeList)
    },

    async reFlowdata(){

      let me =this;

      const res = await post1(me, readFlow, {
          "flowId": this.flowid
      })
      
     
      //  console.log('33333333333333333333333333333333333333333')
      console.log(res.data)
     res?localStorage.setItem("flowData",JSON.stringify(res.data)):''; 

      return
    },
    //点击关闭按钮
    closeFlow(){
      this.parentPath=='flowdefine'?this.$router.push({path:"/flowauth"}):this.$router.push({path:"/flowdefine"})
    },

    // ---------------------------------流程图方法开始---------------------------------------
    init() {
      const _this = this;
      this.jsPlumb.ready(function() {
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
    deleteNode(nodeId) {
      this.$confirm("确定要删除节点" + nodeId + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          // this.data.nodeList = this.data.nodeList.filter(function(node) {
          // 	if (node.id === nodeId) {
          // 		node.show = false
          // 	}
          // 	return true
          // })
          this.data.nodeList.forEach((item, index) => {
            if (item.id === nodeId) {
              this.data.nodeList.splice(index, 1);
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
    },
    drag(item) {
      console.log("aaaaaaaaaaaaaa", item);
      this.currentItem = item;
    },
    getSonData(data) {
      // console.log("子组件传递回来的数据：", data);
      this.currentnode=data;
      // console.log("当前currentnode",this.currentnode)
     
      this.data.nodeList.map((item)=>{
        if(item.id==data.nodeId){
          item.label=data.nodeName   
          //修改节点编号
          item.nodeCode=data.nodeCode
          item["Remark"]=data.Remark
          item["taskAssignType"]=data.taskAssignType
        }
      })
      //  console.log('更新的数据',this.data.nodeList)

    },
    drop(event) {
      //event.preventDefault();
      var _obj = this.$refs.flowContent;

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
    saveFlow(status) {
      let me = this;
      //console.log(this.jsPlumb)
      //console.log(this.jsPlumb.Defaults)
      //console.log('线', this.jsPlumb.getConnections())
      console.log("=========当前流程图的数据===========：", this.data);
      // return

      // 判断是否输入了流程名称
      if (!this.flowInfo.Name) {
        this.$alert("请输入流程名称", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      } else {
        // 处理数据：(vuex)
        // console.log("xxxxxxxx", this.data);
        this.data.flowInfo=this.flowInfo


       
        let flowObj=getData(this.data)
        flowObj.flowName= this.flowInfo.Name
        flowObj['status']=status// 1暂存 or 2发布
        //流程版本需要跟后端确认字段
        flowObj['flowVersion']=''

  
        console.log('flowObj',flowObj)
        // return

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
        let massage=flowObj.status==1?'暂存':'发布'

        //调用保存接口
        post(me, saveFlow, flowObj)
          .then(res => {
            console.log("保存流程图的数据：", res);
             this.$message({
              message: `${massage}成功`,
              type: 'success'
            });
          })
          .catch(err => {
            console.log("保存流程图错误调试：", err);
            this.$message.error(`${massage}失败`);
          });
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
      localStorage.setItem("flowhandle",JSON.stringify(this.data))
       this.$message({
          message: '已复制',
          type: 'success'
        });
    },
    //粘贴
    flowpaste(){
      var copydata =JSON.parse(localStorage.getItem("flowhandle"))
      let copyid=''
      if(copydata){
        if( this.data.flowInfo.Id){
         
          copydata.flowInfo.Id=this.data.flowInfo.Id
          this.data=copydata
       
          console.log(this.data)
          this.$message({
          message: '已粘贴',
          type: 'success'
        });
        
        }else{
          
          this.data.nodeList=copydata.nodeList
          this.data.lineList=copydata.lineList
          // this.data.nodeList.map(()=>{item.flowId=''})
          // this.data.lineList.map(()=>{item.flowId=''})
          console.log(222222222222222222)
          console.log(this.data)
       
          this.$message({
          message: '已粘贴',
          type: 'success'
        });
   
        }
      }else{
         this.$message('无任何粘贴');
      }
    
    
    },
    //剪切
    flowcut(){
      console.log(this.data)
      this.data.flowInfo.Id=''
      // this.data.nodeList.map(()=>{item.flowId=''})
      // this.data.lineList.map(()=>{item.flowId=''})
      localStorage.setItem("flowhandle",JSON.stringify(this.data))
      this.flowempty()
      this.$message({
          message: '已剪切',
          type: 'success'
        });
    },
    //删除
    flowdelete(){
      const id=this.data.flowInfo.Id?this.data.flowInfo.Id:''
      this.flowempty()
      //调用删除接口
    },
    //清空
    flowempty(){
      // const dataid=this.data.flowInfo.Id?this.data.flowInfo.Id:''
      this.data=this.data3;  
      this.data.nodeList=[]
      this.data.lineList=[]
      // this.data.flowInfo.Id=dataid
      // console.log(this.data.flowInfo.Id)
      this.jsPlumb.remove('flowContent')    
      console.log(this.data)
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
  padding: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  word-break: break-all;
  border-radius: 4px;
  position: relative;
  overflow-y: scroll;
  
}

#flowContent {
  width: 200%;
  height: 200%;
  position: relative;
  /* 添加滚动条 */
  
  min-height: 200px;
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
  /* justify-content: center; */
  padding: 20px 0;
  background-color: #fff;
}

.content{
  overflow-y:visible;
  overflow-x:hidden;
  
}




</style>
