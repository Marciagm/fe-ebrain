<template>
	<left-right>
		<div slot="left">
			<div class="model-list">
				<el-row class="model-list-head">
					<el-col :span="3">模型&算法描述</el-col>
					<el-col :span="3">
						<el-dropdown trigger="click" style="cursor: pointer;" @command="chooseEigenList">
							<span class="el-dropdown-link">
						    	特征列表<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
							    <el-dropdown-item v-for="eigenItem in eigenList" :command="eigenItem">
							    	{{ eigenItem.name }}
							    </el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
					<el-col :span="3">创建时间</el-col>
					<el-col :span="3">训练时长</el-col>
					<el-col :span="3">验证集</el-col>
					<el-col :span="3">交叉验证</el-col>
					<el-col :span="3">测试集</el-col>
				</el-row>
				<div>
					<el-row class="model-item" v-for="item in showList" @click="showDetail(item)">
						<el-col :span="3" >
							<div class="algorithm-name">{{ item.name }}</div>
							<span class="algorithm-desc">descccccc</span>
						</el-col>
						<el-col :span="3">{{ item.listName }}</el-col>
						<el-col :span="3">{{ item.createTime}}</el-col>
						<el-col :span="3">{{ item.duration }}</el-col>
						<el-col :span="3">{{ item.validationSet }}</el-col>
						<el-col :span="3">{{ item.crossValidation }}</el-col>
						<el-col :span="3">{{ item.testSet }}</el-col>
					</el-row>
					<div>
						
					</div>
				</div>
			</div>
		</div>
		<div slot="right">
			right
		</div>
	</left-right>
</template>
<style lang="scss">
	.model-list {
		margin-top: 56px;
		width: 90%;
		margin-left: 5%;
		text-align: center;
		.model-list-head {
			font-size: 14px;
			letter-spacing: 1px;
			color: #666;
		}
		.model-item {
			height: 86px;
			background-color: #fafafa;
			border-radius: 4px;
			border: solid 1px #e6e6e6;
			margin-top: 20px;
			padding-top: 19px;
			.algorithm-name {
				font-size: 16px;
				letter-spacing: 1px;
				color: #333;
				height: 20px;
				margin-bottom: 15px;
			}
			.algorithm-desc {
				font-size: 12px;
				letter-spacing: 1px;
				color: #666;
			}
		}
	}
</style>
<script>
	import leftRight from '@/components/LeftRight.vue'
	export default {
		components: {
			leftRight
		},
		data () {
			return {
				eigenList: [
					{
						name: '全部',
						id: 0
					}, {
						name: 'top10',
						id: 1
					}, {
						name: 'top20',
						id: 2
					}, {
						name: 'new',
						id: 3
					}],
				modelList: [
					{
						name: '算法1',
						listName: 'top20',
						createTime: '2018.04.03 10:50',
						duration: '12s',
						validationSet: 0.456,
						crossValidation: 0.45,
						testSet: 0.5677
					},
					{
						name: '算法2',
						listName: 'top20',
						createTime: '2018.04.03 10:50',
						duration: '12s',
						validationSet: 0.456,
						crossValidation: 0.45,
						testSet: 0.5677
					},
					{
						name: '算法3',
						listName: 'top20',
						createTime: '2018.04.03 10:50',
						duration: '12s',
						validationSet: 0.456,
						crossValidation: 0.45,
						testSet: 0.5677
					},
					{
						name: '算法1',
						listName: 'top10',
						createTime: '2018.04.03 10:50',
						duration: '12s',
						validationSet: 0.456,
						crossValidation: 0.45,
						testSet: 0.5677
					},
					{
						name: '算法2',
						listName: 'top10',
						createTime: '2018.04.03 10:50',
						duration: '12s',
						validationSet: 0.456,
						crossValidation: 0.45,
						testSet: 0.5677
					},
					{
						name: '算法3',
						listName: 'top10',
						createTime: '2018.04.03 10:50',
						duration: '12s',
						validationSet: 0.456,
						crossValidation: 0.45,
						testSet: 0.5677
					}
				],
				showList: []
			}
		},
		mounted () {
			this.showList = this.modelList;
		},
		methods: {
			chooseEigenList (command) {
				console.log(command);
				if (!command.id) {
					this.showList = this.modelList;
					return;
				}
				const option = command.name;
				this.showList = this.modelList.filter((value, index) => {
					console.log(value);
					return value.listName === command.name;
				})
			},
			showDetail () {

			}
		}
	}
</script>