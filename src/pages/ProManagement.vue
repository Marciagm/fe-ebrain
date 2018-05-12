<template>
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
					<el-row class="project-list-head">
						<el-col :span="6">任务名称</el-col>
						<el-col :span="6">文件名</el-col>
						<el-col :span="6">创建时间</el-col>
						<el-col :span="6">删除</el-col>
					</el-row>
					<div class="project-list-item"  v-for="project in projects" :id="project.project_id">
						<el-col :span="6">{{ project.name || '未命名任务'}}</el-col>
						<el-col :span="6">dd.svg</el-col>
						<el-col :span="6">2018.04.22 10:30</el-col>
						<el-col :span="6" >
							<img src="../images/model-rubbish.png"  @click="deleteProject(project.project_id)"/>
						</el-col>
					</div>
				</div>
			</div>
		</div>
		<div slot="right">
			
		</div>
	</left-right>
	
</template>
<script>
	import { getProjectInfo, deleteProject, getProjectList } from '../api/api';
	import leftRight from '@/components/LeftRight.vue'

	function requestProjectList (obj) {
		let user = localStorage.getItem('user');
		if (user) {
			try {
				user = JSON.parse(user);
				const userId = user.userId;
				console.log('userId: ' + user.userId);
				const params = {
					user_id: userId
				};

				getProjectList(params).then(data => {
					if(!data.error) {
						const { projects }= data;
						obj.projects = projects;
						obj.names.length = 0;

				        for (let project of projects) {
				        	let { name, project_id } = project;
				        	obj.names.push({value: name, id: project_id});
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
			leftRight
		},
		data () {
			return {
				projects: [],
				searchCon: '',
				names: []
			}
		},
		mounted () {
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			this.height = h - 88;
			console.log('in parent: ' + this.height);
			//const userId = this.$store.state.userId;
			requestProjectList(this);
			
		},
		methods: {
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
							requestProjectList(this);
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