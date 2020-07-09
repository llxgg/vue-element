<template>
  <el-form
    :model="line"
    ref="dataForm"
    label-width="100px"
    class="flowEditForm margin13"
    size="mini"
  >
    <el-form-item label="ID">
      <el-input disabled v-model="line.tranId"></el-input>
    </el-form-item>
    <el-form-item label="流转编号">
      <el-input v-model="line.tranCode"></el-input>
    </el-form-item>
    <el-form-item label="流转名称">
      <el-input v-model="line.tranName"></el-input>
    </el-form-item>
    <el-form-item label="流转按钮">
      <el-input v-model="line.tranBtn"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="line.Remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "editLine",
  data() {
    return {
      line: { label: "" },

    //   toCode: "",
    //   toName: "",
    //   toBtn: "",

      isUpdate: false
    };
  },
  watch: {
    line: {
      handler(val) {
        if (this.isUpdate) {
            console.log('准备返回给父组件的数据：',this.line);
            // 处理一下数据
            
          this.$emit("line-save", this.line);
        }
      },
      deep: true
    },
  },
  methods: {
    init(item) {
      this.isUpdate = false;
      console.log("什么xxxxxx", item);

      this.line = item;
      this.$nextTick(function() {
        this.isUpdate = true;
      });
    },


  }
};
</script>
