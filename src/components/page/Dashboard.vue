<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 政策管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </div>
</template>

<script>

    import bus from '../common/bus';
    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                
            }
        },
        components: {
            
        },
        computed: {
     
        },

        methods: {
            
        }
    }

</script>


<style scoped>
    

</style>
