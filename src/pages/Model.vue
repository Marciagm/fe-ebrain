<template>
	<div>
		<top-part ref="top"></top-part>
		<left-right ref="leftRight" v-on:endTask="endTask">
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
					<div v-for="item in showList" style="padding-bottom: 50px;">
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
								<div v-if=item.finished>
									<!-- show chart part -->
									<track-chart :id="item.id" v-if="item.curId == 0"></track-chart>
									<roc-chart :id="item.id" v-if="item.curId == 1"></roc-chart>
									<recall-chart :id="item.id" v-if="item.curId == 2"></recall-chart>
									<ks-chart :id="item.id" v-if="item.curId == 3"></ks-chart>
									<significance-chart :id="item.id" v-if="item.curId == 4"></significance-chart>
									<predicts-chart :id="item.id" v-if="item.curId == 5"></predicts-chart>
								</div>
								<div v-else>
									<div style="height: 400px; line-height: 400px; text-align: center; font-size: 20px;">
										正在运行中...
									</div>
									
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div slot="right">
				right
			</div>
		</left-right>
	</div>
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
	import topPart from '@/components/Top.vue'
	import leftRight from '@/components/LeftRight'
	import trackChart from '@/components/TrackChart'
	import rocChart from "@/components/RocChart"
	import recallChart from '@/components/RecallChart'
	import ksChart from '@/components/KsChart'
	import significanceChart from '@/components/SignificanceChart'
	import predictsChart from '@/components/PredictsChart'
	
	import { getModelList, poll, killTask } from '../api/api'

	const chartHeights = ['555px', '858px', '554px', '554px', '554px', '318px'];
	function getDate (dateStr) {
		const date = new Date(dateStr * 1000);
		const year = date.getFullYear();
		const month = ('0' + (date.getMonth() - 0 + 1)).slice(-2);
		const day = ('0' + date.getDate()).slice(-2);
		return year + '.' + month + '.' + day;
	}

	export default {
		components: {
			topPart,
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
						name: '全部特征',
						id: 0
					}
				],
				modelList: [],
				showList: []
			}
		},
		mounted () {
			this.$refs.top.setColors(['#666', '#1b7bdd', '#666']);
			this.$refs.leftRight.setStyles({
				showTarget: true,
				showFeatureNum: true,
				showFeatureList: false
			});
			this.showList = this.modelList;
			this.modelList.length = 0;
			this.$store.commit('SET_TRAIN_STATUS', true);
			this.$store.commit('SET_ALLMODEL_STATUS', false);

			const timer = setInterval(() => {
				getModelList({project_id: this.projectId}).then(data => {
					this.$store.state.modelProgressItems.length = 0;
					let progressItems = [];

					const { error, models } = data;
					if (error) {
						this.$message.error(error.desc);
						clearInterval(timer);
						return;
					}
					let goOn = 0;

					for (let i = 0, len = models.length; i < len; i++) {
						const model = models[i];
						const item = {
							name: model.algorithm_name,
							listName: model.feature_list_name || '全部特征',
							createTime: getDate(model.created_at),
							duration: model.duration + 's',
							validationSet: model.valid_status == 4 ? model.valid_indicator_value : '训练中',
							crossValidation: model.cv_status == 4 ? model.cv_indicator_value : '训练中',
							testSet: model.test_status == 4 ? model.test_indicator_value : '训练中',
							desc: model.algorithm_desc,
							show: false,
							curId: 0,
							id: model.model_id,
							percentage: model.percentage,
							taskId: model.task_id
						};
						if (model.status !== 4) {
							goOn = 1;
							item.finished = 0;
							progressItems.push({
								taskId: item.taskId,
								id: item.id,
								name: item.name,
								status: 1,
								duration: item.duration,
								percent: item.percentage || 0,
							})
						}
						else {
							item.finished = 1;
						}
						// 如果已经存在就直接更新
						let exists = false;
						
						for (let k = 0, len = this.modelList.length; k < len; k++) {
							let oldModel = this.modelList[k];
							if (oldModel.id == item.id && !oldModel.finished) {
								oldModel.duration = item.duration;
								oldModel.validationSet = item.validationSet;
								oldModel.crossValidation = item.crossValidation;
								oldModel.testSet = item.testSet;
								oldModel.finished = item.finished;
								exists = true;
								break;
							}
							if (oldModel.id == item.id && oldModel.finished) {
								exists = true;
							}
						}
						// 没有就直接塞进来
						if (!exists) {
							// 如果已经有了就更新
							this.modelList.push(item);
						}
					}

	 				if (!goOn) {
	 					this.eigenList.length = 0;
	 					let name = [];
	 					let id = [];
	 					for (let i = 0, len = this.modelList.length; i < len; i++) {
	 						const item = this.modelList[i];
	 						name.push(item.listName);
	 						id.push(item.id);
	 					}
	 					name = [...new Set(name)];
	 					id = [...new Set(id)];
	 					for (let i = 0, len = name.length; i < len; i++) {
	 						this.eigenList.push({
	 							name: name[i],
	 							id: id[i]
	 						})
	 					}
	 					// 训练完成
	 					//this.$store.commit('SET_TRAIN_STATUS', true);
	 					this.$store.commit('SET_ALLMODEL_STATUS', true);
	 					clearInterval(timer);
	 				}
	 				else {
	 					this.$store.state.modelProgressItems = progressItems;
	 				}
	 				
				})
			}, 500);
		},
		methods: {
			/**
			 * 展示信息
			 *
			 * @param { Object } command 操作对象 
			 */
			chooseEigenList (command) {
				if (!command.id) {
					this.showList = this.modelList;
					return;
				}
				const option = command.name;
				this.showList = this.modelList.filter((value, index) => {
					return value.listName === command.name;
				})
			},

			/**
			 * 显示数据详情
			 *
			 * @param {Object} item 数据对象
			 */
			showDetail (item) {
				if (!item.finished) {
					// return;
				}
				item.show = !item.show;
			},

			/**
			 * 展示图表详情
			 *
			 * @param {Object} nav 具体哪块信息数据
			 * @param {Object} item 数据信息 
			 */
			showChart (nav, item) {
				if (!item.finished) {
					return;
				}
				const id = nav.id;
				item.curId = id;
				this.charHeight = chartHeights[id];
			},

			/**
			 * 结束任务
			 *
			 * @param {Object} item 
			 */
			endTask (item) {
				killTask(item.taskId).then(data => {
					const { error } = data;
					if (error) {
						this.$message.error(error.desc);
						return;
					}
					this.$router.push(`/main/model/${this.projectId}`);
				})
			}
		},
		computed: {
			// 当前进度状态
			curStatus () {
				return this.$store.state.curStatus;
			}
		}
	}
</script>