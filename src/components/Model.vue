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
					<el-col :span="3">测试集</el-col>
				</el-row>
				<div v-for="item in showList">
					<div class="model-item" @click="showDetail(item)" v-if="!item.show">
						<el-col :span="3" >
							<div class="algorithm-name">{{ item.name }}</div>
							<span class="algorithm-desc">descccccc</span>
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
							<span class="algorithm-desc">descccccc</span>
						</el-col>
						<el-col :span="3" class="list-name">{{ item.listName }}</el-col>
						<el-col :span="3" class="model-time">{{ item.createTime}}</el-col>
						<el-col :span="3" class="model-time">{{ item.duration }}</el-col>
						<el-col :span="3" class="index-value">{{ item.validationSet }}</el-col>
						<el-col :span="3" class="index-value">{{ item.crossValidation }}</el-col>
						<el-col :span="3" class="index-value">{{ item.testSet }}</el-col>
					</div>

					<div v-if="item.show" class="model-item-chart">
						<div class="model-item-nav">
							<div v-for="(nav, index) in itemNav" class="item-nav-con" @click="showChart(nav, item)">
								<span class="model-nav-sep" v-if="index != 0"></span>
								<span v-if="nav.id != item.curId">{{ nav.name }}</span>
								<span v-else style="color: #0d68c4" >{{ nav.name }}</span>
							</div>

							<div>
								<el-row style="margin-left: 36px;">
									<el-col :span="14" class="model-table-data">
										<el-col :span="3" v-for="item in basicIndex">
											<div class="basic-index-key">
												<div class="key">{{ item.key || "F score"}}</div>
											</div>
											
											<div class="basic-index-value">{{ item.value || 0.82111}} </div>
										</el-col>
									</el-col>
									<el-col :span="10" class="model-predict">
										<div>
											<table class="table" cellspacing="3">
												<tr>
													<td colspan="5" class="predict-label">模型预测</td>
												</tr>
												<tr>
													<td rowspan="4" class="predict-label">
														<div style="margin-right: 3px;">实<br>际</div>
													</td>
													<td class="td br bb"></td>
													<td class="td br" style="font-size: 18px;">+</td>
													<td class="td br" style="font-size: 18px;">-</td>
													<td class="td bb"></td>
												</tr>

												<tr>
													<td class="td bb" style="font-size: 18px;">+</td>
													<td>
														<div style="margin-right: 3px;" class="cross">123(TN)</div>
													</td>
													<td class="hilight">
														<div class="cross">123(FP)</div>
													</td>
													<td class="bb">num5</td>
												</tr>
												<tr>
													<td class="td bb" style="font-size: 18px;">-</td>
													<td class="hilight">
														<div style="margin-right: 3px;" class="crossN">123(FN)</div>
													</td>
													<td class="hilight">
														<div class="crossN">123(TP)</div>
													</td>
													<td class="bb">num4</td>
												</tr>
												<tr>
													<td class="td br"></td>
													<td class="br">num1</td>
													<td class="br">num2</td>
													<td class="td">num3</td>
												</tr>
											</table>
										</div>
									</el-col>
								</el-row>
								<div style="margin-top: 75px;">
									<el-col :span="11">
										<div id="roc" style="background: red; height: 350px;">
											
										</div>
									</el-col>
									<el-col :span="13">
										<div id="distribution" style="background: green; height: 350px;">
											
										</div>
									</el-col>
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
			min-height: 858px;
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
		.model-table-data {
			margin-top: 108px;
			text-align: center;
			border-right: 0;
			font-size: 12px;
			color: #666;
			.basic-index-key {
				border: 1px solid rgba(74, 150, 227, 0.2);
				height: 64px;
				position: relative;
				.key {
					position: absolute; 
					top: 50%; 
					left: 50%;
					transform: translate(-50%, -50%);
					
				}
			}
			.basic-index-value {
				border: 1px solid rgba(74, 150, 227, 0.2);
				height: 34px;
				line-height: 34px;
			}
		}
		.model-predict {
			margin-top: 62px;
			padding-left: 78px;
			text-align: center;
			.predict-label {
				font-size: 12px;
				color: #999;
				height: 33px;
			}
		}
		.table {
			border-spacing: 0;
			color: #666666;
			td {
				padding: 0;
				margin: 0;
			}
			.td {
				width: 50px;
				height: 29px;
				font-size: 12px;
				color: #666;

			}
			.bl {
				border-left: 1px solid rgba(74, 150, 227, 0.2);
			}
			.bb {
				border-bottom: 1px solid rgba(74, 150, 227, 0.2);
				font-size: 12px;
				color: #666;
			}
			.br {
				border-right: 1px solid rgba(74, 150, 227, 0.2);
				font-size: 12px;
				color: #666;
			}
			.hilight {
				width: 94px;
				height: 44px;
				font-size: 12px;
				color: #fff;
			}
			.cross {
				width: 94px;
				height: 42px;
				line-height: 42px;
				background-image: linear-gradient(90deg, 
					#1e64ac 0%, 
					#2c77c4 45%, 
					#3a8adb 100%), 
				linear-gradient(
					#589de2, 
					#589de2);
				background-blend-mode: normal, 
					normal;
				box-shadow: 2px 3px 4px 0px 
					rgba(0, 0, 0, 0.2);
				margin-bottom: 2px;
			}
			.crossN {
				width: 94px;
				height: 42px;
				line-height: 42px;
				background-image: linear-gradient(90deg, 
					#ce8910 0%, 
					#d19119 50%, 
					#d49720 100%), 
				linear-gradient(
					#d49720, 
					#d49720);
				background-blend-mode: normal, 
					normal;
				box-shadow: 2px 3px 4px 0px 
					rgba(0, 0, 0, 0.2);
				margin-top: 2px;
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
				basicIndex: [
					{
						key: 'F score',
						value: '0.8921'
					},
					{
						key: 'AUC',
						value: ''
					},
					{
						key: '真正类率(TPR)',
						value: ''
					},
					{
						key: '负正类率(TPR)',
						value: ''
					},
					{
						key: '',
						value: ''
					},
					{
						key: '',
						value: ''
					},
					{
						key: '',
						value: ''
					},
					{
						key: '',
						value: ''
					}
				],
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
						curId: 0
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
						curId: 0
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
						curId: 0
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
						curId: 0
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
						curId: 0
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
						curId: 0
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
			showDetail (item) {
				item.show = !item.show;
			},
			showChart (nav, item) {
				const id = nav.id;
				item.curId = id;
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
				}
			}
		}
	}
</script>