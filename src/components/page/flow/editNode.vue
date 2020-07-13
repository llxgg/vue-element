<template>
  <el-form
    :model="node"
    ref="dataForm"
    label-width="100px"
    class="flowEditForm margin13"
    size="mini"
  >
    <el-form-item label="ID">
      <el-input disabled v-model="node.nodeId"></el-input>
    </el-form-item>

    <el-form-item label="节点类型">
      <el-input disabled v-model="node.nodeCategory"></el-input>
      <!-- <el-select v-model="node.category" placeholder="请选择">
        <el-option
          v-for="item in TypeList"
          :key="item.Value"
          :label="item.Text"
          :value="item.Value"
        ></el-option>
      </el-select>-->
    </el-form-item>

    <el-form-item label="节点编号">
      <el-input v-model="node.nodeCode"></el-input>
    </el-form-item>

    <el-form-item label="节点名称">
      <el-input v-model="node.nodeName"></el-input>
    </el-form-item>

    <el-form-item label="任务分配类型">
      <el-select v-model="node.Type" placeholder="请选择">
        <el-option
          v-for="item in TypeList"
          :key="item.Value"
          :label="item.Text"
          :value="item.Value"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="任务分配值">
      <el-input v-model="node.label"></el-input>
    </el-form-item>

    <el-form-item label="备注">
      <el-input v-model="node.Remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "editNode",
  data() {
    return {
      node: {},
      TypeList: [
        { Value: 1, Text: "绑定时定义授权" },
        { Value: 2, Text: "执行时自动进行下一环节授权" },
        { Value: 3, Text: "执行时手动进行下一环节授权" }
      ]
    };
  },
  methods: {
    init(data, id) {
      console.error("什么来的：", data, id);

      // 查找当前是第几个节点：
      let index = data.nodeList.findIndex(item => item.id == id);
      console.log("当前是第几个节点：", index);

      var currentNode = {};
      var reg = new RegExp(/\d+/);
      data.nodeList.filter(node => {
        if (node.id === id) {
          if (node.Type == 1) {
            currentNode = {
              nodeId: node.id,
              nodeCategory: node.label,
              nodeCode: `start_${index + 1}`,
              nodeName: `node_start_${index + 1}`,
              x: reg.exec(node.left).join(),
              y: reg.exec(node.top).join(),
              nodeType: node.Type,
              taskAssignType: "",
              taskAssignValue: ""
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
              nodeCategory: node.label,
              nodeCode: `end_${index + 1}`,
              nodeName: `node_end_${index + 1}`,
              x: reg.exec(node.left).join(),
              y: reg.exec(node.top).join(),
              nodeType: node.Type,
              taskAssignType: "",
              taskAssignValue: ""
            };
          } else if (node.Type == 3) {
            currentNode = {
              nodeId: node.id,
              nodeCategory: node.label,
              nodeCode: `task_${index + 1}`,
              nodeName: `node_task_${index + 1}`,
              x: reg.exec(node.left).join(),
              y: reg.exec(node.top).join(),
              nodeType: node.Type,
              taskAssignType: "",
              taskAssignValue: ""
            };
          }

          this.node = currentNode;
          console.log("====sjdfhsdjfsdnjfshdjfh=======", currentNode);
        }
      });
    },

    getNodeInfo() {
      let me = this;
      // console.log('xxxxxxx',this.node);
      // this.$emit("getSon", this.node);
    }
  },
  watch: {
    // node: function(newVal, oldVal) {
    //   console.warn("==========节点发生变化===============：", newVal, oldVal);

    //     if (newVal.nodeId !== oldVal.nodeId) {
    //       this.getNodeInfo(newVal);
    //     }else {
    //       this.getNodeInfo();
    //     }

      
    // }
  }
};
</script>
