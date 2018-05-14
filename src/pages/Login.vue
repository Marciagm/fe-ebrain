<template>
    <entry-part>
        <el-row slot="frame">
            <el-col :xl="{span: 8, offset: 16}" :lg="{span: 7, offset: 17}" :md="{span: 9, offset: 13}" :sm="{span: 10, offset: 12}" :xs="{span: 11, offset: 11}">
                <el-form :model="loginForm" :rules="loginFormRules" class="login-form-con" ref="loginForm" id="form">
                    <div class="login-form-con-head">密码登录</div>
                    <el-form-item prop="username">
                        <el-input name="username" placeholder="邮箱／手机号登录" v-model="loginForm.username" @focus="inputFocus" @keyup.media-play-pause="method" id="loginInput"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" name="password" placeholder="请输入密码" v-model="loginForm.password" @focus="inputFocus" id="passwordInput"></el-input>
                        <div style="font-size: 12px; color: #ff0000;height: 14px;">{{ errorTips }}</div>
                    </el-form-item>
                    
                    <el-button @click.native.prevent="handleSubmit">登录</el-button>
                    <div class="login-submit" @click="link">
                        还没有账号？<a>立即注册</a>
                    </div>
                </el-form>
            </el-col>
        </el-row>
    </entry-part>
</template>

<script>
    import {login} from '../api/api';
    import ElCol from "element-ui/packages/col/src/col";
    import entryPart from '@/components/Entry'
    import jwtDecode from 'jwt-decode'

    //import NProgress from 'nprogress'
    export default {
        components: {
            ElCol,
            entryPart
        },
        data() {
            return {
                errorTips: '',
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
            inputFocus () {
                this.errorTips = '';
            },
            handleSubmit(ev) {
                var _this = this;
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        var param = {user: this.loginForm.username, password: this.loginForm.password};
                        login(param).then(data => {
                        
                            this.logining = false;
                            //let {msg, code} = data;
                            if (data.token) {
                                localStorage.setItem('token', data.token);
                                var decodedInfo = jwtDecode(data.token);
                                console.log(decodedInfo);
                                localStorage.setItem('user', JSON.stringify({nickname: decodedInfo.nickname, userId: decodedInfo.user_id}));
                                setTimeout(function () {
                                    _this.$router.push({path: '/main'});
                                }, 100);
                            }
                            else {
                                let { error } = data;
                                this.errorTips = '!' + error.desc;
                                //this.loginForm.username = '';
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            link() {
                this.$router.push({path: '/regist'});
            }
        },
        mounted() {
            const form = document.getElementById('form');
            const loginInput = document.getElementById('loginInput');
            const passwordInput = document.getElementById('passwordInput');

            form.onkeypress = (event) => {
                if (event.charCode != 13) {
                    return;
                }
                if (loginInput.value && passwordInput.value) {
                    this.handleSubmit();
                }
                else if (loginInput.value) {
                    passwordInput.focus();
                }
                else {
                    loginInput.focus();
                }
            }
        }
    }

</script>

<style lang="scss" type="text/scss">
    @import '~scss_vars';
    .login-form-con {
        width: 330px;
        height: 353px;
        margin-top: 120px;
        margin-right: 96px;
        background: #fff;
        border-radius: 8px;
        padding-top: 49px;
        padding-left: 40px;
        padding-right: 40px;
        box-sizing: border-box;
        .login-form-con-head {
            font-size: 16px;
            margin-bottom: 29px;
        }
        button {
            width: 250px;
            height: 40px;
            //background: #ccc;
            background-image: linear-gradient(90deg, 
                #0d65be 0%, 
                #1978d9 45%, 
                #248bf4 100%), 
            linear-gradient(
                #cccccc, 
                #cccccc);
            border-radius: 4px;
            font-size: 16px;
            color: #fff;
            margin-bottom: 10px;
        }
        button:hover {
            color: #fff;
        }
        .submitable {
            width: 250px;
            height: 40px;
            color: #ffffff;
            background-image: linear-gradient(90deg, 
                #0d65be 0%, 
                #1978d9 45%, 
                #248bf4 100%), 
            linear-gradient(
                #cccccc, 
                #cccccc);
        }
        .login-submit {
            font-size: 14px;
            position: relative;
            font-family: STHeitiSC-Light;
            cursor: pointer;
            color: #666666;
            a {
                text-decoration: none;
                color: #116bc7;
                font-family: STHeitiSC-Light;
            }
        }

    }
</style>