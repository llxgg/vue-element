<template>
    <div>
        <div class="container">
            <iframe :src="src" frameborder="0" height='1500px' width="100%"></iframe>
        </div>
    </div>
</template>
<script>
import { IP } from "../../util/api.js"
export default {
   data() {
      return {
          src: IP + '/zcHtml/designModel'
      }
   },
}
</script>
<style>


</style>