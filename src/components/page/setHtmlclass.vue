<template>
    <div>
        <div class="container">
            <iframe :src="src"  frameborder="0" width="100%" height="2000px"></iframe>
        </div>
    </div>
</template>
<script>
import { IP } from "../../util/api.js";
export default {
  data() {
    return {
      formid: "", //表单id
      state: 1, //表单当前状态
      src: null //嵌套h5模板调整页面
    };
  },
  created() {
    this.event = window.addEventListener("message", (e) => {
      var me = this
      if(e.data.function) {
        if(e.data.function == 'next') {
          me.next()
        }
        else if(e.data.function == 'pre' ) {
          me.prev()
        }
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('message', this.event)
  },
  mounted() {
    document.querySelector(".content-box>.content").scrollTo(0,0)
    this.formid = this.$route.query.id ? this.$route.query.id : "";
    this.state = this.$route.query.state;
    this.src = IP + '/zcHtml/designHtml?id=' + this.formid;
  },
  methods: {
    next() {
      var me = this;
      me.$router.push({
        path: "/generteform",
        query: { id: me.formid, state: me.state }
      });
    },
    prev() {
      var me = this;
      me.$router.push({
        path: "/generte",
        query: { id: me.formid, state: me.state }
      });
    }
  }
};
</script>
<style>
</style>