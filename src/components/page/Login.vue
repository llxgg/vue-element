<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">正在登录到 后台管理系统</div>
            <el-form :model="ruleForm" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入账户">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm">登录</el-button>
                </div>
                <p class="login-tips">Tips :请输入正确的账号与密码。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                }
            }
        },
        methods: {
            submitForm() {
                var me = this
                if(me.ruleForm.username && me.ruleForm.password) {
                    localStorage.setItem('ms_username',this.ruleForm.username);
                    this.$router.push('/');
                }else{
                    console.log(me.ruleForm.username);
                    console.log(me.ruleForm.password);
                    if(me.ruleForm.username == ''){
                        me.$notify({
                            title: '警告',
                            message: '请输入用户名',
                            type: 'warning'
                        });
                    }
                    if(me.ruleForm.password == ''){
                        me.$notify({
                            title: '警告',
                            message: '请输入用户密码',
                            type: 'warning'
                        })
                    }
                }
                // this.$refs[formName].validate((valid) => {
                //     if (valid) {
                //         localStorage.setItem('ms_username',this.ruleForm.username);
                //         this.$router.push('/');
                //     } else {
                //         console.log('error submit!!');
                //         return false;
                //     }
                // });
                
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        /* left:50%; */
        right:10%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        background: rgba(255,255,255, 0.3);
        /* background-color: #fff; */
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>