<template>
	<el-row class="top">
		<el-col :md="{span: 2}" :sm="{span: 3, offset: 1}" :xs="{span: 3, offset: 0}"  class="logo">
			<img src="../images/logo.png">
		</el-col>
		<el-col :md="7" :sm="8" :xs="8" class="nav">
			<ul>
				<li v-for="(item, index) in nav" @click="tab(item, index)">
					<a v-if="index == curIndex" style="color: #1b7bdd;">{{ item.name }}</a>
					<a v-else>{{ item.name }}</a>
				</li>
			</ul>
		</el-col>
		<el-col justify="right" :md="{span: 6, offset: 7}" :sm="{span:8, offset: 3}" :xs="{span: 8, offset: 0}" class="info">
			<div class="top-project-name" v-show="projectStatus">
				<input type="text" placeholder="未命名任务" v-model="projectName" class="project-name" @change="setProjectName">
				<div class="sep"></div>
			</div>
			<img class="icon" src="../images/message.png">
			<img class="icon" src="../images/help.png">
			<img class="icon" src="../images/project.png">
			<div class="sep"></div>
			<div class="user">
				<img src="../images/user.png">
			</div>
			<div class="nickname">
				<el-dropdown trigger="click">
                    <span class="el-dropdown-link user-name">{{ sysUserName }}</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
			</div>
		</el-col>
	</el-row>
</template>
<style lang="scss">
	.top {
		background: #fff;
		height: 68px;
		.logo {
			margin-top: 20px;
		}
		.nav {
			height: 68px;
			a {
				height: 20px;
				font-size: 14px;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 1px;
				color: #999999;
			}
			ul {
				height: 68px;
				list-style: none;
				margin: 0;
				li {
					cursor: pointer;
					margin-right: 39px;
					height: 68px;
					line-height: 68px;
					display: inline-block;
				}
			}
		}
		.info {
			height: 68px;
			display: inline-block;
			vertical-align: top;
			.icon {
				margin-top: 25px;
				width: 20px;
				height: 20px;
				margin-right: 20px;
			}
			.sep {
				vertical-align: top;
				margin-top: 30px;
				margin-right: 20px;
				display: inline-block;
				width: 1px;
				height: 10px;
				background-color: #cccccc;
			}
			.user {
				height: 68px;
				display: inline-block;
				vertical-align: top;
				width: 30px;
				img {
					margin-top: 22px;
				}
			}
			.top-project-name {
				display: inline-block; 
				vertical-align: top; 
				line-height: 68px;
			}
			.project-name {
				height: 25px;
				border: 0;
				font-size: 14px;
				letter-spacing: 1px;
				color: #666666;
				line-height: 20px;
				margin-right: 14px;
				text-align: right;
			}
			.nickname {
				cursor: pointer;
				margin-left: 17px;
				height: 68px;
				margin-top: 5px;
				line-height: 68px;
				display: inline-block;
				vertical-align: top;
				.user-name {
					display: inline-block;
					height: 68px;
				}
			}
		}
	}
</style>
<script>
    import { logout } from '../api/api';

	export default {
		name: 'top',
		data () {
			return {
				projectName: '',
				sysUserName: 'User',
				curIndex: 0,
				nav: [
					{
						name: '数据',
						path: '/main/data'
					}, 
					{
						name: '模型',
						path: '/main/model'

					}, 
					{
						name: '算法库',
						path: '/main/algorithm-lib'
					},
					{
						name: '图表库',
						path: '/main/chart'
					}
				]
			}
		},
		methods: {
			tab (item, index) {
				this.curIndex = index;
				this.$router.push(item.path);
			},
			logout () {
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

                    this.$router.push('/login');
                }).catch(() => {

                });
           	},
           	setProjectName () {
           	}
        },
        computed: {
        	projectStatus () {
        		return this.$store.state.projectStatus
        	}
        },
		mounted () {
			this.$store.commit('SET_PROJECT_STATUS', false);
			var user = localStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.nickname || '';
                this.sysUserAvatar = user.avatar || '';
            }
		}
	}
</script>
