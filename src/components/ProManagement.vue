<template>
	<left-right isScroll="false">
		<div class="pro-management" slot="left">
			<div>
				<div class="pro-management-top">
					<div class="management-top-search">
						<img src="../images/other-search.png">
						<input placeholder="搜索" /> 
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
						<el-col :span="6">创建时间</el-col>
					</el-row>
					<el-row class="project-list-item">
						<el-col :span="6">任务名称1</el-col>
						<el-col :span="6">小花猫.esv</el-col>
						<el-col :span="6">2018.04.22 10:30</el-col>
						<el-col :span="6">
							<img src="../images/model-rubbish.png"  @click="deleteProject(0)" />
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div slot="right">
			yusdfasdf
		</div>
	</left-right>
	
</template>
<script>
	import { getProjectInfo, deleteProject, getProjectList } from '../api/api';
	import leftRight from '@/components/LeftRight.vue'

	export default {
		components: {
			leftRight
		},
		mounted () {
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			this.height = h - 88;
			console.log('in parent: ' + this.height);
			//const userId = this.$store.state.userId;
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
						console.log(data);
					}).catch (error => {
						console.log(error);
					})
				}
				catch (e) {
					console.log(e);
				}
			}
		},
		data () {
			return {
			}
		},
		methods: {
			goCreateProject () {
				this.$router.push('/main/data/upload');
			},
			deleteProject (item) {
				// const projectId = item.projectId;
				const projectId = this.$store.state.projectId;

				console.log('projectId: ' + projectId);
				deleteProject(projectId).then(data => {
					console.log(data);
				}).catch( error => {
					console.log(error);
				})
			}
		}
	}
</script>
<style lang="scss">
	.pro-management {
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
				input {
					width: 70px;
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
			.project-list-head {
				height: 52px;
				line-height: 52px;
				text-align: center;
			}
			.project-list-item {
				height: 65px;
				line-height: 65px;
				background-color: #fafafa;
				border-radius: 4px;
				border: solid 1px #e6e6e6;
				text-align: center;
			}
		}
	}

</style>