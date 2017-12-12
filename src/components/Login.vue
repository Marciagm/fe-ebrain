<template>
    <section id="loginView">
        <el-row>
            <el-col :span="24">
                <div class="login-form-wrapper">
                    <el-form :model="loginForm" status-icon :rules="loginFormRules" ref="loginForm" label-width="80px"
                             size="small">
                        <el-row style="height: 80px">
                            <el-col :span="4">
                                <div class="grid-content signin-label" style="color:#d3dce6;">登陆</div>
                            </el-col>
                            <el-col :span="4">
                                <div class="grid-content signup-label"><a href="#/regist" style="cursor:pointer">注册</a>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="" labelWidth="0" prop="username">
                                    <el-input name="username"
                                              placeholder="用户名"
                                              v-model="loginForm.username">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="" labelWidth="0" prop="password">
                                    <el-input
                                            name="password"
                                            type="password"
                                            placeholder="密码"
                                            v-model="loginForm.password">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-button class="login-btn" @click.native.prevent="handleSubmit">确定</el-button>
                            </el-col>
                        </el-row>

                    </el-form>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="footer">
                <div>
                    联系方式：platform@ebrain.ai
                </div>
                <div>
                    地址：北京市海淀区中关村科学院南路2号融科咨询中心B座11层
                </div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import {login} from '../api/api';
    //import NProgress from 'nprogress'
    export default {
        data() {
            return {
                loginForm: {
                    username: '',
                    password: '',
                },
                loginFormRules: {
                    username: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        {min: 1, max: 64, message: '请输入账号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 1, max: 64, message: '请输入账号', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            handleSubmit(ev) {
                var _this = this;
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        var param = {username: this.loginForm.username, password: this.loginForm.password};
                        login(param).then(data => {
                            console.log(data);
                            this.logining = false;
                            let {msg, code} = data;
                            if (code > 0) {
                                _this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            } else {
                                /*sessionStorage.setItem('user', JSON.stringify(data.data));
                                 sessionStorage.setItem('token',data.data.token);*/
                                localStorage.setItem('token', data.data.token);
                                localStorage.setItem('user', JSON.stringify(data.data));
                                setTimeout(function () {
                                    _this.$router.push({path: '/main'});
                                }, 100);

                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }

</script>

<style lang="scss">
    @import '~scss_vars';

    #loginView {
        background-color: #3485c5;
        background-image: url("../assets/login-bg2.png");
        background-size: 100%;
        background-repeat: no-repeat;
        height: 100%;
        width: 100%;
        .login-form-wrapper {
            display: inline-block;
            overflow: hidden;
            float: right;
            margin-right: 141px;
            margin-top: 122px;
            background-color: rgba(1, 1, 1, 0.5);
            padding: 20px;
            .el-form {
                background-color: white;
                width: 296px;
                height: 296px;
                padding: 30px;
                .el-row {
                    height: 60px;
                }
                .el-input__inner {
                    width: 292px;
                    height: 35px;
                    padding-left: 50px;
                    border-radius: 0;
                    border: 1px solid #ccc;
                }
                .el-input__inner[name=username] {
                    background-image: url("../assets/username.png");
                    background-repeat: no-repeat;
                    background-position: -1px, -1px;
                }
                .el-input__inner[name=password] {
                    background-image: url("../assets/key.png");
                    background-repeat: no-repeat;
                    background-position: -1px, -1px;
                }
                .signin-label, .signup-label {
                    font-size: 20px;

                }
                .signup-label {
                    font-size: 20px;
                    text-align: right;
                }
                .login-btn {
                    width: 100%;
                    border-radius: 0;
                    color: white;
                    background-color: #1d8ce0;
                    border: none;
                }
                a:-webkit-any-link {
                    text-decoration: none;
                    color: black;
                }
            }
        }
        .footer {
            position: fixed;
            bottom: 0;
            text-align: center;
            line-height: 30px;
            background: #d3dce6;
            color: #255da3;
            padding:15px;
        }
    }
</style>