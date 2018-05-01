<template>
	<div class="top">
		<div class="logo">
			<img src="../images/logo.png">
		</div>

		<div class="nav">
			<ul>
				<li v-for="(item, index) in nav" @click="tab(item, index)">
					<a v-if="index == curIndex" style="color: #1b7bdd;">{{ item.name }}</a>
					<a v-else>{{ item.name }}</a>
				</li>
			</ul>
		</div>
		<div class="info">
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
			  <el-dropdown-menu slot="dropdown" class="task-drop">
			    <el-dropdown-item :command="0">
			    	<div class="drop-label">
			    		<img style="width: 13px; height: 13px" src="../images/new-task.png">
			    		<span>创建新任务</span>
			    	</div>
			    </el-dropdown-item>
			    <el-dropdown-item :command="1">
			    	<div class="drop-label" style="border-bottom: 1px solid #eee;">
			    		<img style="width: 12px; height: 10px" src="../images/task-manage.png">  
			    		<span>任务管理</span>
			    	</div>
			    </el-dropdown-item>
			    <el-dropdown-item disabled>
			    	<span class="special-drop-label">最近的任务</span>
			    </el-dropdown-item>
			    <el-dropdown-item>
			    	<div class="nav-project-list" @click="taskClick">
				    	<div class="list-project-name">未命名任务1</div>
				    	<div class="running">正在运行中...</div>
				   	</div>
			    </el-dropdown-item>

			    <el-dropdown-item>
			    	<div class="nav-project-list">
			    		未命名任务2
			    	</div>			    	
			    </el-dropdown-item>
			    <el-dropdown-item>
			    	<div class="nav-project-list">
			    		未命名任务2
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
                    <el-dropdown-menu center slot="dropdown" class="logout">
                        <el-dropdown-item @click.native="logout">
                        <img src="../images/exit.png"> 退出登录
                    	</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
	.top {
		width: 94%;
		margin-left: 3%;
		background: #fff;
		height: 68px;
		.logo {
			display: inline-block;
			vertical-align: middle;
			margin-top: 20px;
		}
		.nav {
			display: inline-block;
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
			display: inline-block;
			height: 68px;
			display: inline-block;
			vertical-align: top;
			float: right;
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
			.el-dropdown {
				&:focus {
					outline: none;
				}
			}
		}
	}
	
	.nav-project-list {
		padding-left: 60px;
		font-size: 14px;
		color: #333;
		.list-project-name {
			height: 20px;
			line-height: 20px;
			font-size: 14px;
			color: #333;
		}
		.running {
			color: #e0952a; 
			font-size: 10px;
			height: 16px;
			line-height: 16px;
		}
	}
	.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
		color: #333;
	}
	.special-drop-label {
		margin-left: 30px;
		font-size: 12px; 
		color: #999;
	}
	.drop-label {
		padding-left: 38px;
		height: 42px;
		line-height: 42px;
	}
	.nav-drop-con {
		padding-bottom: 16px; 
		padding-top: 17px;
		font-size: 14px;
		color: #333;
	}
	.task-drop {
		padding: 0;
		width: 197px;
		.el-dropdown-menu__item {
			padding: 0;
		}
	}
	.logout {
		padding: 0;
		box-sizing: border-box;
		text-align: center;
		width: 136px;
		height: 50px;
		line-height: 50px;
		li {
			line-height: 50px;
			font-size: 14px;
			color: #333;
		}
	}
</style>
<script>
    import { logout, updateProject } from '../api/api';

	export default {
		name: 'top',
		data () {
			return {
				sysUserName: 'User',
				curIndex: 0,
				projectName: '',
				nav: [
					{
						name: '数据',
						path: '/main/data'
					}, 
					{
						name: '模型',
						path: '/main/model/'

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
			taskClick (event) {
				alert('hio');
			},
			tab (item, index) {
				this.curIndex = index;
				if (item.path == '/main/model/') {
					this.$router.push(item.path + this.$store.state.projectId);	
				}
				else {
					this.$router.push(item.path);	
				}
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
           		const projectName = this.projectName;
           		event.target.blur();
           		const param = {
           			name: projectName
           		};

           		const projectId = this.$store.state.projectId;

           		updateProject(projectId, param).then(data => {
           			if (!data.error) {		
	           			const { project } = data; 
	           			this.$store.commit('SET_PROJECT_NAME', project.name);
	           			// @TODO updateProjectList

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
        	},
        	_projectName: {
        		set (value) {
        			this.projectName = value;
        		},
        		get (value) {
        			return this.$store.state.projectName;
        		}
        	},
        	projectId () {
        		return this.$store.state.projectId;
        	}
        },
		mounted () {
			this.$store.commit('SET_PROJECT_STATUS', true);
			var user = localStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.nickname || '';
                this.sysUserAvatar = user.avatar || '';
            }
		}
	}
</script>
