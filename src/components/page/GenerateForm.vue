<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单配置 / 表单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>适配生成表单</div>

            <el-tabs v-model="activeName" @tab-click="handleClick">
            
              <el-tab-pane label="html5模板" name="1">
                <div>
                  <div>
                      <div class="title">pc端</div>
                      <div >
                        <div v-html="content"></div>
                        <iframe :src="h5pc"  frameborder="0" width="100%" height="600px" :style="h5height"></iframe>
                      </div>
                  </div>
                  
              </div>
              </el-tab-pane>
              <el-tab-pane label="PDF模板" name="2">
                <!-- <iframe src="http://10.168.1.220:9038/upload/pdf/20200622/7d0a68cf-7189-40a1-bf90-94ebaf2710fb.pdf" width="100%" height="1000px"></iframe> -->
                <iframe :src="pdfpc" width="100%" height="1000px"></iframe>
                <!-- <pdf src="http://10.168.1.220:9038/upload/pdf/20200622/7d0a68cf-7189-40a1-bf90-94ebaf2710fb.pdf"></pdf> -->
                <!-- <pdf :src='pdfpc'></pdf> -->
              </el-tab-pane>
              <el-tab-pane label="移动端" name="3">
                <div style="margin-top: 20px;height: auto;background: #efefef;width:100%;text-align: center;">
                      <div class="title">移动端</div>
                      <iframe :src="h5app" id='h5app' ref='h5app'  frameborder="0" width="400px"  class="app" :style="phoneHeight"></iframe>
                  </div>
              </el-tab-pane>
              
            </el-tabs>
            <div style="margin: 20px auto;width: 150px;">
                <el-button @click="prev">上一步</el-button>
                <el-button type="primary" @click="next">保存</el-button>
            </div>
        </div>
        
    </div>
</template>
<script>
import { post } from "../../util/http.js";
import { test, getTableInfo, IP, tableSave } from "../../util/api.js";
import pdf from "vue-pdf";

export default {
  components: {
    pdf
  },

  data() {
    return {
      activeIndex: "0",
      activeName: "1",
      content: null,
      formid: null,
      src: "",
      h5pc: "",
      h5app: "",
      pdfpc: "",
      h5height: '',//动态h5模板高度
      phoneHeight: '',//动态phone模板高度
      state: 1//表单当前状态
    };
  },
  mounted() {
    // this.getMB()
    document.querySelector(".content-box>.content").scrollTo(0,0)
    this.formid = this.$route.query.id ? this.$route.query.id : "";
    this.state = this.$route.query.state
    // this.$refs.pdf.$el.style.width = parseInt(50) + "%";
    this.getTableDetail(this.formid);
    this.h5pc = IP + "/zcHtml/h5?id=" + this.formid;
    console.log(window.pageXOffset)
  },
  
  created() {
    var me = this
    me.event = window.addEventListener('message', function(e) {
      if(e.data.h5height) {
        me.h5height = 'height: ' + e.data.h5height  + 'px;'
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('message', this.event)
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if (key == 1) {
        this.src = this.pdfsrc;
      } else {
        this.src = this.pdfsrc2;
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
      if(tab.name == '3') {
        var me = this
        me.h5app = IP + "/zcHtml/phone?id=" + me.formid;
        window.addEventListener('message', function(e) {
          if(e.data.height) {
            var h = parseInt(e.data.height) + parseInt(100)
            me.phoneHeight = "height: " + h +"px;"
          }
        })
      }
    },
    prev() {
      var me = this;
      me.$router.push({
        path: "/setHtmlclass",
        query: { id: me.formid, state: me.state }
      });
    },
    next() {
      console.log("点击了下一步");
      var me = this;
      post(me, tableSave, {
        id: me.formid
      }).then(res => {
        if(res.status == 1) {
          me.$message({
            type: 'success',
            message: res.msg || '保存成功'
          })
        }else{
          me.$message({
            type: 'error',
            message: res.msg || '系统出错，请重试'
          })
        }
      })
    },
    getMB() {
      var me = this;
      post(me, test).then(res => {
        me.content = res.content;
      });
    },
    getTableDetail(id) {
      var me = this;
      console.log(id);
      post(me, getTableInfo, { id }).then(res => {
        if (res.status == "1" && res.content) {
          me.pdfpc = res.content.pdfUrl;
        } else {
          me.$message({
            type: "error",
            message: "获取pdf失败"
          });
        }
      });
    }
  }
};
</script>
<style>
.title {
  line-height: 30px;
  padding-left: 10px;
  height: 30px;
  background: #ddd;
  border: 1px solid #ddd;
  width: 100%;
  text-align: left;
}
.content {
  width: 100%;
  min-height: 500px;
  position: relative;
}
.app {
  margin: 0 auto;
}
</style>