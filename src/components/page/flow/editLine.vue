<template>
  <el-form
    :model="line"
    ref="dataForm"
    label-width="100px"
    class="flowEditForm margin13"
    size="mini"
  >
    <el-form-item label="ID">
      <el-input disabled v-model="line.Id" @blur="onInputBlur(line)"></el-input>
    </el-form-item>
    <el-form-item label="流转编号">
      <el-input v-model="line.tranCode" @blur="onInputBlur(line)" disabled></el-input>
    </el-form-item>
    <el-form-item label="流转名称">
      <el-input v-model="line.label" @blur="onInputBlur(line)" :disabled="CandE=='1'?true:false"></el-input>
    </el-form-item>
    <!-- <el-form-item label="流转按钮">
      <el-input v-model="line.tranBtn"></el-input>
    </el-form-item> -->
    <!-- <el-form-item label="备注">
      <el-input v-model="line.Remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" @blur="onInputBlur(line)"></el-input>
    </el-form-item> -->
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

      isUpdate: false,
      CandE:"",
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
  created(){
    //知道此页面是查看还是编辑CandE 1是查看,2是编辑
    this.CandE = this.$route.query.CandE?this.$route.query.CandE:'';
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
    onInputBlur(line){
      this.$emit("line-save", this.line);
    }

  }
};
</script>
