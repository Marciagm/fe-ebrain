<template>
    <div>
        <el-row id="mainView" class="container">
            <el-col :span="24" class="header">
                <el-col :span="20" :offset="2">
                    <el-col :span="4" class="logo" style="padding-left:0" >
                        <a href="#/main/modelList"><img :src="'../static/logo-ebrain.png'"></img></a>
                    </el-col>
                    <el-col :span="10" >
                        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                            <el-menu-item index="1"><a href="#/main/modelList">模型</a></el-menu-item>
                            <el-menu-item index="2"><a href="#/main/dataView">数据</a></el-menu-item>
                        </el-menu>
                    </el-col>
                    <el-col :span="10" class="userinfo">
                        <el-dropdown trigger="click">
                            <span class="el-dropdown-link userinfo-inner">欢迎：{{sysUserName}}</span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-col>
            </el-col>
            <el-col class="main">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </el-col>
            <!--<el-col :span="24" class="footer">
                <div>
                    联系方式：platform@ebrain.ai
                </div>
                <div>
                   地址：北京市海淀区中关村科学院南路2号融科咨询中心B座11层
                </div>
            </el-col>-->
        </el-row>
        <div class="help"><a @click="gotoHelp">帮助</a></div>
    </div>
</template>

<script>
    import { logout } from '../api/api';
    import ElCol from "element-ui/packages/col/src/col";
    export default {

        components: {ElCol},
        data() {
            return {
                sysName:'Ebrain',
                activeIndex:'1',
                collapsed:false,
                sysUserName: '',
                sysUserAvatar: ''
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            //退出登录
            logout: function () {
                var _this = this;
                this.$confirm('确认退出吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    //sessionStorage.removeItem('user');
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    localStorage.removeItem("jobInfo");
                    logout({}).then(data => {
                        console.log("logou success");
                    });

                    _this.$router.push('/login');
                }).catch(() => {

                });

            },
            gotoHelp:function(){
                console.log("help")
                this.$router.push('/main/help');
            }

        },
        mounted() {
            /*var user = sessionStorage.getItem('user');
             if (user) {
             user = JSON.parse(user);
             this.sysUserName = user.nickname || '';
             this.sysUserAvatar = user.avatar || '';
             }*/

            var user = localStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.nickname || '';
                this.sysUserAvatar = user.avatar || '';
            }

        }
    }


</script>

<style lang="scss" type="text/scss">
    @import '~scss_vars';

    .help{
        width: 32px;
        height: 80px;
        position: absolute;
        background: #006bc7;
        top: 250px;
        left:-14px;
        font-size: 18px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        color:white;
        writing-mode:tb-rl;
        cursor: pointer;
        padding:4px;
        display: flex;
        justify-content: center;
        align-items: center;
        display: none;
    }
    .help:hover{
        background: #1166b7;
    }
    #mainView{
        overflow: auto;
        top: 0px;
        bottom: 0px;
        width: 100%;
        .header {
            line-height: 60px;
            background: #262932;
            color:#fff;
            z-index: 200;
            .el-menu{
                background: transparent;
            }
            .el-menu-item{
                font-size: 24px;
                color:white;
            }
            .el-menu-item a{
                text-decoration: none;
            }
            .el-menu--horizontal{
                border-bottom: none;
            }
            .el-menu--horizontal>.el-menu-item.is-active, .el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
                color: white;
                border-buttom:2px solid white;
            }
            .el-menu--horizontal .el-menu-item:focus, .el-menu--horizontal .el-menu-item:hover {
                background-color: transparent;
            }
            .userinfo {
                text-align: right;
                float: right;
                .userinfo-inner {
                    cursor: pointer;
                    color:#fff;
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 10px 0px 10px 10px;
                        float: right;
                    }
                }
            }
            .el-dropdown-menu{
                padding: 0;
                margin: 0;
            }
            .logo {
                //width:230px;
                height:60px;
                font-size: 22px;
                padding-left:20px;
                padding-right:20px;
                img {
                    width: 100px;
                    float: left;
                    margin: 10px 10px 10px 18px;
                }
                .txt {
                    color:#fff;
                }
                a{
                    text-decoration: none;
                    color:white;
                }
            }
            .logo-width{
                width:230px;
            }
            .logo-collapse-width{
                width:60px
            }
            .tools{
                padding: 0px 23px;
                width:14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
        }
        .main{
            z-index: 100;
        }
        .footer{
            z-index: 100;
            background: #d3dce6;
            text-align: center;
            line-height: 30px;
            color: white;
            padding:15px;
        }
        .el-step__title.is-success,.el-step__head.is-success{
            color:#1d8ce0;
            border-color: #1d8ce0;
        }
    }
</style>