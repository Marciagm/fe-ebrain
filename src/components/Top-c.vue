<template>
	<div>
		<div class="top">
		<div class="logo">
			<img src="../images/logo.png">
		</div>
		<div class="nav">
			<ul v-if="curStatus==0">
				<li v-for="(item, index) in nav" @click="tab(item, index)">
					<a :style="{color: item.color}"> {{ item.name }}</a>
				</li>
			</ul>
			<ul v-else>
				<li v-for="(item, index) in nav" @click="tab(item, index)">
					<a :style="{color: item.color}"> {{ item.name }}</a>
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
			    <el-dropdown-item v-for="item in recentProjects">
			    	<div class="nav-project-list">
			    		{{ item.name }}
			    	</div>	
			    </el-dropdown-item>
			    <el-dropdown-item>
			    	<div class="nav-project-list" @click="taskClick">
				    	<div class="list-project-name">未命名任务1</div>
				    	<div class="running">正在运行中...</div>
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
		<div style="height: 20px; background: #f4f4f6;"></div>
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
    import { getProjectInfo, updateProject, getRecentProjects, getProfile } from '../api/api';

	export default {
		name: 'top',
		data () {
			return {
				recentProjects: [],
				currentRoute: this.$router.currentRoute,
				sysUserName: 'User',
				userId: '',
				curIndex: 0,
				projectName: '',
				nav: [
					{
						name: '数据',
						path: '/main/data/',
						color: '#ccc'
					}, 
					{
						name: '模型',
						path: '/main/model/',
						color: '#ccc'

					}, 
					{
						name: '算法库',
						path: '/main/algorithm-lib',
						color: '#666'
					},
					/*{
						name: '图表库',
						path: '/main/chart'
					}*/
				]
			}
		},
		methods: {
			taskClick (event) {
				alert('hio');
			},

			/**
			 * 设置导航条样式
			 *
			 * @param {number} index 下标
			 */ 
			setStyle (index) {
				if (index == 2) {
					if (this.curStatus == 0) {
						this.nav[this.curIndex].color = '#ccc';
					}
					else {
						this.nav[this.curIndex].color = '#666';
					}
					this.nav[index].color = '#1b7bdd';
					this.curIndex = index;
				}
				else if (index == 0) {
					if (this.curStatus === 0) {
						this.nav[this.curIndex].color = '#666';
						this.nav[index].color = '#ccc';
					}
					else {
						this.nav[this.curIndex].color = '#666';
						this.nav[index].color = '#1b7bdd';
					}
				}
				else {
					if (this.curStatus > 1) {
						this.nav[this.curIndex].color = '#666';
						this.nav[index].color = '#1b7bdd';
					}
					else {
						return;
					}
				}
			},
			tab (item, index) {
				this.setStyle(index);
				console.log('curStatus: ' + this.curStatus);
				if (index == 1) {
					if (this.curStatus < 2) {
						return;
					}
					else {
						this.$router.push(`/main/model/${this.projectId}`);
					}
				}
				if (index == 0) {
					if (this.curStatus == 0) {
						this.$router.push('/main/data/upload');
					}
					else if (this.curStatus == 1) {
						this.$router.push(`/main/data/info/${this.projectId}`);
					}
					else {
						this.$router.push(`/main/data/train/${this.projectId}`)
					}
				}
				if (index == 2) {
					const obj = {
						path: item.path
					};
					if (this.projectId) {
						obj.projectId = this.projectId;
					}
					this.$router.push(obj);
				} 
				return;

				if (index == 0) {
					if (this.curStatus == 0) {
						this.$router.push('/main/data/upload');
					}
					else if (this.curStatus == 1) {
						this.$router.push(`/main/data/info/${this.projectId}`);
					}
					else {
						this.$router.push(`/main/data/train/${this.projectId}`)
					}
				}
				if (index == 1) {

				}
				if (this.curStatus === 0) {
					if (index == 2) {
						const obj = {
							path: item.path
						};
						if (this.projectId) {
							obj.projectId = this.projectId;
						}
						this.$router.push(obj);
					}
					if (index == 0) {
						this.$router.push('/main/data/upload');
					}
					else {
						return;	
					}
					
				}
				if (this.curStatus === 1 ) {
					if (item.path == '/main/model') {
						return;
					}
				}
				//const { path, query, params } = this.currentRoute;
				const path = location.hash;
				console.log(this.currentRoute);
				// 模型
				if (item.path == '/main/model/') {
					if (!this.modelStatus) {
						//alert('不能点');
						return;
					}

					// 从模型到模型
					if (path.indexOf('/main/model') > -1) {
						return;
					}
					else {
						const taskId = this.taskId || this.$route.query.lastTaskId;		
						const urlObj = {
							path: `/main/model/${this.projectId}`,
							query: {
								taskId: taskId,
								fLId: this.fLId,
								targetId: this.targetId,
								targetName: this.targetName
							}
						}
						console.log(urlObj);
						this.curIndex = index;
						this.$router.push(urlObj);
					}
				}
				// 当前为数据
				else if(item.path == '/main/data/') {
					// 从数据到数据
					console.log(path);
					if (path.indexOf('/main/data') > -1) {
						return;
					}
					else {
						this.curIndex = index;
						this.$router.push({
							path: `/main/data/train/${this.projectId}`,
							query: {
								taskId: this.taskId,
								fLId: this.fLId,
								targetId: this.targetId,
								targetName: this.targetName
							}
						})
					}
				}
				else {
					this.curIndex = index;
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
                    /*logout({}).then(data => {
                        console.log("logou success");
                    });*/

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
           			this.$store.commit('SET_CUR_STATUS', 0);
           			this.$router.push('/main/data/upload');
           		}
           		else if (tag === 1) {
           			this.$router.push(`/main/project/${this.projectId}`);
           		}
           	},
           	/**
           	 * 导航条颜色初始化
           	 *
           	 */
           	navColorInit () {

           	},
           	init () {
				// 模型
				const curHash = location.hash;
				console.log(curHash);
				for (let i = 0, len = this.nav.length; i < len; i++) {
					const item = this.nav[i];
					if (curHash.indexOf(item.path) > -1) {
						this.curIndex = i;
						console.log(this.curIndex);
						this.setStyle(i);
						break;
					}
				}

				var user = localStorage.getItem('user');
				// 如果本地有缓存直接取用
	            if (user) {
	                user = JSON.parse(user);
	                this.sysUserName = user.nickname || '';
	                this.sysUserAvatar = user.avatar || '';
	                this.userId = user.userId || '';
	            }
	            else {
	            	getProjectInfo(this.projectId).then(data => {
		            	const { error, project } = data;
		            	if (error) {
	           				this.$message.error(error.desc);
	           				return;
	           			}
	           			this.projectName = project.name;
	           			
	           			this.userId = project.user_id;

	           			getProfile(this.userId).then(data => {
	           				const { error, user } = data;
	           				if (error) {
	           					this.$message.error(error.desc);
	           					return;
	           				}
	           				const { nickname } = user;
	           				this.sysUserName = nickname;
	           				console.log(data);
	           			})
		            })
	            }
	            this.$store.state.progressItems.length = 0;
	            
	            const params = {
	            	user_id: this.userId,
	            	page_size: 5,
	            	page: 1
	            };
	            this.getRecentProjects(params);
           	},

           	// 获取最近的任务
           	getRecentProjects (params) {
           		getRecentProjects(params).then(data => {
           			const { error, projects } = data;
           			if (error) {
           				this.$message.error(error.desc);
           				return;
           			}
           			// 排序
           			let sortProjects = projects.sort((a, b) => {
           				return a.created_at - b.created_at;
           			})
           			for (let i = 0, len = Math.min(5, sortProjects.length); i < len; i++) {
           				const item = sortProjects[i];
           				this.recentProjects.push({
           					name: item.name || '未命名任务',
           					id: item.project_id,
           					isRunning: false
           				})
           			}
           			console.log(data);
           		})
           	}
        },
        computed: {
        	curStatus () {
        		return this.$store.state.curStatus;
        	},
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
        		return this.$route.params.projectId || this.$store.state.projectId;
        	},
        	fLId () {
        		return this.$route.query.fLId || this.$store.state.fLId;
        	},
        	targetId () {
        		return this.$route.query.targetId || this.$store.state.targetId;
        	},
        	targetName () {
        		return this.$route.query.targetName || this.$store.state.targetName;	
        	},
        	taskId () {
        		return this.$route.query.taskId || this.$store.state.taskId;
        	},
        	modelStatus () {
        		return true;
        		//return this.$store.state.modelStatus;
        	}
        },
        watch: {
		    '$route' (to, from) {
		    	for (let i = 0, len = this.nav.length; i < len; i++) {
		    		const item = this.nav[i];
		    		if (to.path.indexOf(item.path) > -1) {
		    			this.curIndex = i;
		    			this.setStyle(i);
		    		}
		    	}
		    }
		},
		mounted () {
			// 开始
			this.init();
		}
	}
</script>
