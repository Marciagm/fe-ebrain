<template>
	<div>
		<div class="title">
			<el-col :span="8">
				重要性
				<el-dropdown trigger="click" @command="chooseSorttype">
					<span class="el-dropdown-link title-sort">
						<div class="sort-by">{{ sortBy }}</div>
						<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="desc">从大到小</el-dropdown-item>
						<el-dropdown-item command="nature">自然序</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>

			</el-col>
			<el-col :span="15">
				用前
				<input v-model="num" style="width: 40px; text-align: center;">
				位特征
				<input v-model="listName" placeholder="创建新的特征列表" id="listName">
				<button class="create-button" @click="createFeatureList">确定</button>
			</el-col>
		</div>
		<div :id="'significance' + id" class="chart">
		</div>
	</div>
</template>
<style lang="scss" scoped>
	.title {
		width: 60%; 
		margin-left: 15%; 
		margin-top: 49px; 
		height: 73px;
		font-size: 12px;
		letter-spacing: 1px;
		.title-sort {
			display: inline-block;
			background: #eee;
			height: 20px;
			width: 93px;
			padding-right: 2px;
			text-align: center;
			cursor: pointer;
		}
		.sort-by {
			display: inline-block;
			text-align: center;
			width: 60px;
			height: 20px;
			font-size: 12px;
			line-height: 20px;
		}
		.create-button {
			width: 50px;
			height: 20px;
			background-image: linear-gradient(90deg, 
				#0d65be 0%, 
				#1978d9 45%, 
				#248bf4 100%), 
			linear-gradient(
				#cccccc, 
				#cccccc);
			border-radius: 4px;
			letter-spacing: 1px;
			color: #fff;
			outline: none;
		}
		input {
			height: 20px;
			background-color: #eee;
			border: 0;
			color: #999;
			text-align: center;
			outline: none;
		}
	}
	.chart {
		height: 350px; 
		width: 60%; 
		margin-left: 5%
	}
	ul { 
		background: #eee;
		.popper__arrow {
			display: none;
		}
		.el-dropdown-menu__item:hover {
			background: #eee;
		}
		div {
			display: none;
		}
	}
</style>
<script>
	import echarts from 'echarts'
	import { getModelFeatureData, createFeatureList } from '@/api/api'

	function drawChart (id, data) {
		var chart = echarts.init(document.getElementById(id));
		chart.clear();
		var option = {
		    title: {
		        text: '特征名',
		        textStyle: {
		        	color: '#999',
		        	fontSize: '12px'
		        },
		        show: false,
		    },
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'shadow'
		        }
		    },
		    legend: {
		        //data: ['2011年', '2012年']
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: {
		    	splitLine: {
		    		// false 时没有网格线
		    		//show: true
		    		show: false
		    	},
		        type: 'value',
		        data: data.importance,
		        position: 'top',
		        //boundaryGap: [0, 1],
		        axisLabel: {
		        	color: '#ccc',
		        	textStyle: {
		        		color: '#ccc'
		        	}
		        },
		        axisLine: {
		        	lineStyle: {
		        		color: '#ccc',
		        		width: 2
		        	}
		        }
		    },
		    yAxis: {
		        type: 'category',
		        data: data.name,
		        axisLabel: {
		        	rotate: -45,
		        	textStyle: {
		        		color: '#999'
		        	}
		        },
		        axisLine: {
		        	lineStyle: {
		        		color: '#ccc',
		        		width: 2
		        	}
		        }
		    },
		    series: [
		        {
		            name: '特征重要性',
		            type: 'bar',
		            color: '#000',
		            data: data.importance,
		            itemStyle: {
		                normal: {
		                    color: new echarts.graphic.LinearGradient(
		                        0, 0, 0, 1,
		                        [
		                            {offset: 0, color: '#4f9eef'},
		                            {offset: 0.5, color: '#62a9f1'},
		                            {offset: 1, color: '#71b2f3'}
		                        ]
		                    )
		                },
		                emphasis: {
		                    color: new echarts.graphic.LinearGradient(
		                        0, 0, 0, 1,
		                        [
		                            {offset: 0, color: '#2378f7'},
		                            {offset: 0.7, color: '#2378f7'},
		                            {offset: 1, color: '#83bff6'}
		                        ]
		                    )
		                }
		            },
		            // 展示数据
		            label: {
		            	normal: {
		            		//show: true,
		            		position: 'right',
		            		width: '100',
		            		height: '100',
		            		backgroundColor: '#e0c82a',
		            		borderRadius: '25px',
		            	}
		            },
		            barWidth: 20,
		            barMaxWidth: 30
		        }
		    ]
		};
		chart.setOption(option);
	}

	export default {
		props: ['id'],
		data () {
			return {
				elId: '',
				sortBy: '从大到小',
				modelData: {},
				modelDescData: {},
				chartData: {},
				chartDescData: {},
				num: '',
				listName: '',
				projectId: this.$route.params.projectId
			}
		},
		mounted () {
			this.elId = `significance${this.id}`;
			const listName = document.getElementById('listName');

			listName.onkeypress = (event) => {
				if (event.charCode != 13) {
					return;
				}
				else {
					this.createFeatureList();
				}
			}

			getModelFeatureData(this.id).then(data => {
				const { error, features } = data;
				this.modelData = features;
				if (error) {
					this.$message.error(error.desc);
					return;
				}

				const importance = [], name = [];
				for (let i = 0, len = features.length; i < len; i++) {
					const item = features[i];
					importance.push(item.importance);
					name.push(item.feature.name);
				} 
				this.chartData = { importance, name };

				const sortFeatrues = features.sort((a, b) => {
					return a.importance - b.importance;
				})

				// 降序数据
				this.modelDescData = sortFeatrues;
				const descImportance = [], descName = [];
				for (let i = 0, len = sortFeatrues.length; i < len; i++) {
					const item = sortFeatrues[i];
					descImportance.push(item.importance);
					descName.push(item.feature.name);
				}
				this.chartDescData = { importance: descImportance, name: descName };

				drawChart(this.elId, this.chartDescData);
			})
		},
		methods: {

			/**
			 * 选择排序情况
			 *
			 * @param {Object} command command对象
			 */
			chooseSorttype (command) {
				if (command == 'desc') {
					this.sortBy = '从大到小';
					drawChart(this.elId, this.chartDescData);
				}
				else {
					this.sortBy = '自然序';
					drawChart(this.elId, this.chartData);
				}
			},

			/**
			 * 选择topn创建新的特征列表
			 */
			createFeatureList () {
				if (!this.listName) {
					this.$message({
						showClose: true,
          				message: '列表名填了吗？🙄️（白眼）',
          				type: 'warning'
					})
					return;
				}
				const features  = this.modelDescData;
				const ids = [];
				// @TODO 添加去重和包含操作
				for (let i = 0; i < this.num; i++) {
					ids.push(features[i].feature.feature_id);
				}
				
				const param = {
					project_id: this.projectId,
					name: this.listName,
					feature_ids: ids
				};
				createFeatureList(param).then(data => {
					const { error, feature_list } = data;
					if (error) {
						this.$message.error(error.desc);
						return;
					} 
					this.$message({
						message: '列表创建成功！',
						type: 'success'
					});
				})
			}
		}
	}
</script>







