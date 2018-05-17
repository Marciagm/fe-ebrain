<template>
	<div>
		<top-part ref="top" v-on:init="init"></top-part>
		<left-right>
			<div class="pro-management" slot="left">
				<div>
					<div class="pro-management-top">
						<div class="management-top-search">
							<img src="../images/other-search.png">
							<el-autocomplete
						      v-model="searchCon"
						      :fetch-suggestions="querySearch"
						      placeholder="搜索"
						      @select="search"
						    ></el-autocomplete>	
						</div>
						<div class="management-top-task" @click="goCreateProject">
							<img src="../images/new-task.png"> 创建新任务
						</div>
					</div>
					<div class="project-list">
						<el-row class="project-list-head" justify="center">
							<el-col :span="6">任务名称</el-col>
							<el-col :span="8">文件名</el-col>
							<el-col :span="6">创建时间</el-col>
							<el-col :span="4">删除</el-col>
						</el-row>
						<div class="project-list-item"  v-for="project in projects" :id="project.project_id" @click="openProject(project)">
							<el-col :span="6">{{ project.name || '未命名任务'}}</el-col>
							<el-col :span="8">{{ project.train_dataset_name || '--' }}</el-col>
							<el-col :span="6">{{ project.createTime }}</el-col>
							<el-col :span="4" >
								<div style="width: 30px;" @click.stop="deleteProject(project.project_id)">
									<img src="../images/model-rubbish.png"/>
								</div>
							
							</el-col>
						</div>
					</div>
				</div>
			</div>
			<div slot="right">
				
			</div>
		</left-right>
	</div>
</template>
<script>
	import { getProjectInfo, deleteProject, getProjectList } from '../api/api';
	import leftRight from '@/components/LeftRight.vue'
	import topPart from '@/components/Top.vue'
	
	function getDate (dateStr) {
		// @attention: unix时间戳换算成js的时间戳，要乘以1000
		const date = new Date(dateStr * 1000);
		const year = date.getFullYear();
		const month = ('0' + (date.getMonth() - 0 + 1)).slice(-2);
		const day = ('0' + date.getDate()).slice(-2);
		const hour = ('0' + date.getHours()).slice(-2);
		const minute = ('0' + date.getMinutes()).slice(-2);
		
		return `${year}.${month}.${day} ${hour}:${minute}`;
	}

	function requestProjectList (obj) {
		let user = localStorage.getItem('user');
		if (user) {
			try {
				user = JSON.parse(user);
				const userId = user.userId;
				const params = {
					user_id: userId
				};

				getProjectList(params).then(data => {
					if(!data.error) {
						const { projects }= data;
						obj.projects = projects;
						obj.names.length = 0;

				        for (let project of obj.projects) {
				        	let { name, project_id } = project;
				        	obj.names.push({
				        		value: name, 
				        		id: project_id
				        	});
				        	project.createTime = getDate(project.created_at);
				        }
					}
					console.log(data);
				}).catch (error => {
					console.log(error);
				})
			}
			catch (e) {
				console.log(e);
			}
		}
	}

	export default {
		components: {
			topPart,
			leftRight
		},
		data () {
			return {
				projects: [],
				searchCon: '',
				names: []
			}
		},
		methods: {
			init () {
				let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
				this.height = h - 88;
				console.log('in parent: ' + this.height);
				//const userId = this.$store.state.userId;
				requestProjectList(this);
				if (this.curStatus > 1) {
					this.$refs.top.setColors(['#666', '#666', '#666']);		
				}
				else {
					this.$refs.top.setColors(['#666', '#ccc', '#666']);		
				}
			},
			openProject (project) {
				this.$store.commit('initTimer');
				// 跳转到哪儿
				console.log(project);
				this.$router.push({
					path: `/main/model/${project.project_id}`,
					query: {
						from: 1
					}
				});
			},
			createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
		        };
		    },
			querySearch(queryString, cb) {
		        console.log(this.names);
		        var results = queryString ? this.names.filter(this.createFilter(queryString)) : this.names;
		        // 调用 callback 返回建议列表的数据
		        cb(results);
		    },
			search (item) {
				if (item && item.id) {
					const currentItem = document.getElementById(item.id);
					currentItem.scrollIntoView();
				}
			},
			goCreateProject () {
				this.$router.push('/main/data/upload');
			},
			deleteProject (projectId) {
				this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteProject(projectId).then(data => {
						if (!data.error) {
							this.$message({
					          	message: '删除成功！',
					          	type: 'success'
					        });
					        // 删除的是当前的任务时
							if (this.projectId == projectId) {
								this.init();
								this.$router.push('/main/project');
							}
							else {
								requestProjectList(this);
							}
						}
					}).catch( error => {
						console.log(error);
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
				// const projectId = item.projectId;
				//const projectId = this.$store.state.projectId;
				console.log(projectId);
				console.log('projectId: ' + projectId);
				
			}
		},
		mounted () {
			this.init();
		},
		watch: {
			'$route' (route) {
				console.log('ini initttttt');
				this.init();
			}
		}
	}
</script>
<style lang="scss">
	.pro-management {
		padding-bottom: 20px;
		.pro-management-top {
			padding-left: 5%;
			box-sizing: border-box;
			height: 73px;
			padding-top: 39px;
			border-bottom: 1px solid #e6e6e6;
			.management-top-search {
				font-size: 14px;
				letter-spacing: 1px;
				color: #333333;
				display: inline-block;
				.el-input__inner {
					height: 20px;
				}
				input {
					width: 120px;
					border: 0;
					font-size: 14px;
					outline: none;
				}
			}
			.management-top-task {
				cursor: pointer;
				display: inline-block;
			}
		}
		.project-list {
			padding-left: 5%;
			width: 90%;
			/* text-align: center; */
			.project-list-head {
				padding-left: 30px;
				height: 52px;
				line-height: 52px;
			}
			.project-list-item {
				cursor: pointer;
				padding-left: 30px;
				height: 65px;
				line-height: 65px;
				background-color: #fafafa;
				border-radius: 4px;
				border: solid 1px #e6e6e6;
				margin-bottom: 20px;
			}
		}
	}

</style>