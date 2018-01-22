<template>
    <section id="loginView">
        <div  ref="loginFormView">
            <el-row>
                <el-col :span="24">
                    <div class="login-form-wrapper">
                        <el-form :model="loginForm" status-icon :rules="loginFormRules" ref="loginForm" label-width="80px"
                                 size="small">
                            <el-row style="height: 60px">
                                <el-col :span="24">
                                    <div class="grid-content signin-label" style="color:darkgray;text-align: center;">欢迎使用预测机器人</div>
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
                                    <div style="color: black">
                                        还没有账号？ <el-button type="text"  @click="link" style="color: #1d8ce0;cursor: pointer;">注册</el-button>
                                    </div>
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
        </div>
        <div class="footer">
            <div class="slogan">
                预测机器人，智铀科技提供，让预测无处不在
            </div>
            <div>
                Copyright©2017 wisutech.com. All Rights Reserved.
            </div>
        </div>
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
            },
            link(){
                this.$router.push({path:'/regist'});
            }
        },
        mounted(){
            let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.$refs.loginFormView.style.height = (h - 90) + 'px';

        }
    }

</script>

<style lang="scss" type="text/scss">
    @import '~scss_vars';

    #loginView {
        background-color: #3485c5;
        background-image: url("../assets/bg9.jpg");
        background-size: 100%;
        background-repeat: no-repeat;
        height: 100%;
        width: 100%;
        .login-form-wrapper {
            display: inline-block;
            overflow: hidden;
            float: right;
            z-index: 1000;
            margin-right: 141px;
            margin-top: 150px;
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
            text-align: center;
            line-height: 30px;
            background: white;
            color: gray;
            padding:15px;
            .slogan{
                font-size:22px;
                color:black;
            }
        }
    }
</style>