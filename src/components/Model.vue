<template>
	<left-right>
		<div slot="left">
			<div class="model-list">
				<el-row>
					<el-col :span="3" :offset="12">
						<div style="border-left: 1px solid #e6e6e6; border-top: 1px solid #e6e6e6; height: 25px; width: 50%; margin-top: 8px; margin-left: 50%;"> </div>
					</el-col>
					<el-col :span="3" style="height: 35px; color: #ccc; letter-spacing: 1px; font-size: 14px;">AUC</el-col>
					<el-col :span="3">
						<div style="border-right: 1px solid #e6e6e6; border-top: 1px solid #e6e6e6; height: 25px; width: 50%; margin-top: 8px;"> </div>
					</el-col>
				</el-row>
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
					<el-col :span="3" style="color: #0d68c4;">测试集</el-col>
				</el-row>
				<div v-for="item in showList">
					<div class="model-item" @click="showDetail(item)" v-if="!item.show">
						<el-col :span="3" >
							<div class="algorithm-name">{{ item.name }}</div>
							<span class="algorithm-desc">{{ item.desc }}</span>
						</el-col>
						<el-col :span="3" class="list-name">{{ item.listName }}</el-col>
						<el-col :span="3" class="model-time">{{ item.createTime}}</el-col>
						<el-col :span="3" class="model-time">{{ item.duration }}</el-col>
						<el-col :span="3" class="index-value">{{ item.validationSet }}</el-col>
						<el-col :span="3" class="index-value">{{ item.crossValidation }}</el-col>
						<el-col :span="3" class="index-value">{{ item.testSet }}</el-col>
					
					</div>
					<div v-else class="model-item" @click="showDetail(item)" style="background: #f3f4f6">
						<el-col :span="3" >
							<div class="algorithm-name">{{ item.name }}</div>
							<span class="algorithm-desc">{{ item.desc }}</span>
						</el-col>
						<el-col :span="3" class="list-name">{{ item.listName }}</el-col>
						<el-col :span="3" class="model-time">{{ item.createTime}}</el-col>
						<el-col :span="3" class="model-time">{{ item.duration }}</el-col>
						<el-col :span="3" class="index-value">{{ item.validationSet }}</el-col>
						<el-col :span="3" class="index-value">{{ item.crossValidation }}</el-col>
						<el-col :span="3" class="index-value">{{ item.testSet }}</el-col>
					</div>

					<div v-if="item.show" class="model-item-chart" :style="{height: charHeight}">
						<div class="model-item-nav">
							<div v-for="(nav, index) in itemNav" class="item-nav-con" @click="showChart(nav, item)">
								<span class="model-nav-sep" v-if="index != 0"></span>
								<span v-if="nav.id != item.curId">{{ nav.name }}</span>
								<span v-else style="color: #0d68c4" >{{ nav.name }}</span>
							</div>
							<!-- show chart part -->
							<track-chart :id="item.id" v-if="item.curId == 0"></track-chart>
							<roc-chart :id="item.id" v-if="item.curId == 1"></roc-chart>
							<recall-chart :id="item.id" v-if="item.curId == 2"></recall-chart>
							<ks-chart :id="item.id" v-if="item.curId == 3"></ks-chart>
							<significance-chart :id="item.id" v-if="item.curId == 4"></significance-chart>
							<predicts-chart :id="item.id" v-if="item.curId == 5"></predicts-chart>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div slot="right">
			right
		</div>
	</left-right>
</template>
<style lang="scss" scoped>
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
			border: solid 1px #e6e6e6;
			margin-top: 20px;
			padding-top: 19px;
			cursor: pointer;
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
			.list-name {
				height: 18px;
				line-height: 18px;
				font-size: 14px;
				color: #333;
			}
			.model-time {
				height: 18px;
				line-height: 18px;
				font-size: 14px;
				color: #666;
			}
			.index-value {
				height: 18px;
				line-height: 18px;
				font-size: 14px;
				color: #e0952a;
			}
		}
		.model-item-chart {
			background-color: #fafafa; 
			border-radius: 0 0 4px 4px;
		}
		.model-item-nav {
			height: 63px; 
			border-bottom: 1px solid #e6e6e6; 
			text-align: left;
			.item-nav-con {
				cursor: pointer;
				text-align: center;
				line-height: 63px;
				display: inline-block;
				margin-left: 24px;
				font-size: 12px;
				letter-spacing: 1px;
				color: #666;
			}
			.model-nav-sep {
				display: inline-block;
				vertical-align: middle;
				margin-right: 24px;
				width: 1px;
				height: 10px;
				background-color: #ccc;
			}
		}
	}
</style>
<script>
	import echarts from 'echarts'
	import leftRight from '@/components/LeftRight'
	import trackChart from '@/components/TrackChart'
	import rocChart from "@/components/RocChart"
	import recallChart from '@/components/RecallChart'
	import ksChart from '@/components/KsChart'
	import significanceChart from '@/components/SignificanceChart'
	import predictsChart from '@/components/PredictsChart'
	
	import { getModelList } from '../api/api'

	const chartHeights = ['555px', '858px', '554px', '554px', '554px', '318px'];

	export default {
		components: {
			leftRight,
			trackChart,
			recallChart,
			rocChart,
			ksChart,
			significanceChart,
			predictsChart
		},
		data () {
			return {
				projectId: this.$route.params.projectId,
				charHeight: '555px',
				itemNav: [
					{
						name: '训练足迹',
						id: 0
					},
					{
						name: 'ROC曲线',
						id: 1
					},
					{
						name: '准确&召回曲线',
						id: 2
					},
					{
						name: 'K-S曲线',
						id: 3
					},
					{
						name: '特征重要性',
						id: 4
					},
					{
						name: '批量预测',
						id: 5
					}
				],
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
						testSet: 0.5677,
						show: false,
						curId: 0,
						id: 0
					},
					{
						name: '算法2',
						listName: 'top20',
						createTime: '2018.04.03 10:50',
						duration: '12s',
						validationSet: 0.456,
						crossValidation: 0.45,
						testSet: 0.5677,
						show: false,
						curId: 0,
						id: 1
					},
					{
						name: '算法3',
						listName: 'top20',
						createTime: '2018.04.03 10:50',
						duration: '12s',
						validationSet: 0.456,
						crossValidation: 0.45,
						testSet: 0.5677,
						show: false,
						curId: 0,
						id: 2
					},
					{
						name: '算法1',
						listName: 'top10',
						createTime: '2018.04.03 10:50',
						duration: '12s',
						validationSet: 0.456,
						crossValidation: 0.45,
						testSet: 0.5677,
						show: false,
						curId: 0,
						id: 3
					},
					{
						name: '算法2',
						listName: 'top10',
						createTime: '2018.04.03 10:50',
						duration: '12s',
						validationSet: 0.456,
						crossValidation: 0.45,
						testSet: 0.5677,
						show: false,
						curId: 0,
						id: 4
					},
					{
						name: '算法3',
						listName: 'top10',
						createTime: '2018.04.03 10:50',
						duration: '12s',
						validationSet: 0.456,
						crossValidation: 0.45,
						testSet: 0.5677,
						show: false,
						curId: 0,
						id: 5
					}
				],
				showList: []
			}
		},
		mounted () {
			this.showList = this.modelList;
			this.modelList.length = 0;
			const timer = setInterval(() => {
				getModelList({project_id: this.projectId}).then(data => {
					console.log(data);
					const { error, models } = data;
					if (error) {
						this.$message.error(error.desc);
						return;
					}
					this.modelList.length = 0;
					let goOn = 0;
					for (let i = 0, len = models.length; i < len; i++) {
						const model = models[i];
						const item = {
							name: model.algorithm_name,
							listName: model.feature_list_name,
							createTime: '',
							duration: '',
							validationSet: model.valid_indicator_value,
							crossValidation: model.cv_indicator_value,
							testSet: model.test_indicator_value,
							desc: '',
							show: false,
							curId: 0,
							id: model.model_id
						};
						if (model.status !== 4) {
							goOn = 1;
						}

						this.modelList.push(item);
					}
	 				if (!goOn) {
	 					clearInterval(timer);
	 				}
				})
			}, 500);
			
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
			showDetail (item) {
				item.show = !item.show;
			},
			showChart (nav, item) {
				const id = nav.id;
				item.curId = id;
				this.charHeight = chartHeights[id];

				switch (id) {
					// 训练足迹
					case 0: 
						
						break;
					// ROC曲线
					case 1: 
						break;
					case 2: 
						break;
					case 3: 
						break;
					case 4: 
						break;
					case 5: 
						break;
				}
			}
		}
	}
</script>