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
		<el-col justify="right" :md="{span: 8, offset: 6}" :sm="{span:8, offset: 3}" :xs="{span: 8, offset: 0}" class="info">
			<div class="top-project-name" v-show="projectStatus">
				<el-tooltip class="item" effect="light" :hide-after=1000 content="命名该任务" placement="bottom-end">
			      	<input type="text" placeholder="未命名任务" v-model="projectName" class="project-name" @change="setProjectName">
			    </el-tooltip>
				<div class="sep"></div>
			</div>
			<img class="icon" src="../images/message.png">
			<img class="icon" src="../images/help.png">
			
			<el-dropdown  @command="chooseTask">
			  <span class="el-dropdown-link">
			    <img class="icon" src="../images/project.png" >
			  </span>
			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item :command="0">
			    	<img style="width: 13px; height: 13px" src="../images/new-task.png">
			    	<span class="nav-project-label">创建新任务</span>
			    </el-dropdown-item>
			    <el-dropdown-item :command="1">
			    	<img style="width: 12px; height: 10px" src="../images/task-manage.png">  
			    	<span class="nav-project-label">任务管理</span>
			    </el-dropdown-item>
			    <el-dropdown-item divided disabled>
			    	<span class="nav-drop-label">最近的任务</span>
			    	<div class="nav-drop-con">
				    	<div class="nav-project-list">
				    		未命名任务1<br>
				    		<span class="running">正在运行中...</span>
				    	</div>
				    	<div class="nav-project-list">
				    		未命名任务2
				    	</div>
				    	<div class="nav-project-list">
				    		未命名任务3
				    	</div>
			    	</div>
			    	
			    </el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
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
			.nav-project-label {
				font-size: 14px;
				color: #333;
			}
			.el-dropdown {
				&:focus {
					outline: none;
				}
			}
			

		}	
	}
	.nav-project-list {
		height: 30px;
		line-height: 15px;
		font-size: 14px;
		margin-left: 30px;
		color: #333;
		margin-bottom: 17px;
		.running {
			color: #e0952a; 
			font-size: 10px;
		}
	}
	.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
		color: #333;
	}
	.nav-drop-label {
		font-size: 12px; 
		color: #999;
	}
	.nav-drop-con {
		padding-bottom: 16px; 
		padding-top: 17px;
	}
</style>
<script>
    import { logout, updateProject } from '../api/api';

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
           	setProjectName (event) {
           		event.target.blur();
           		const param = {
           			name: this.projectName
           		};

           		const projectId = this.$store.state.projectId;

           		updateProject(projectId, param).then(data => {
           			if (!data.error) {		
	           			const { project } = data; 
	           			this.$store.commit('SET_PROJECT_NAME', project.name);
           			}
           			else {
           				this.$message.error(error.desc);
           			}
           		}).catch(error => {

           		})
           	},
           	chooseTask (tag) {
           		if (tag === 0) {
           			this.$router.push('/main/data/upload');
           		}
           		else if (tag === 1) {
           			this.$router.push('/main/project')
           		}
           	}
        },
        computed: {
        	projectStatus () {
        		return this.$store.state.projectStatus;
        	}
        },
		mounted () {
			this.$store.commit('SET_PROJECT_STATUS', false);
			this.projectName = this.$store.state.projectName;

			var user = localStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.nickname || '';
                this.sysUserAvatar = user.avatar || '';
            }
		}
	}
</script>
