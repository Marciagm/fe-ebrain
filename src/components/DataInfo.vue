<template>
	<left-right>
		<div slot="left" ref="info-left">
			<div class="target">
				<div style="display: inline-block; width: 210px; margin-right: 80px;">
					<div v-if="!dataPicFinished" class="target-label" style="color: #ccc;">输入预测目标</div>
					<div v-else class="target-label" for="target">输入预测目标</div>
					<el-autocomplete
				      v-model="target"
				      :fetch-suggestions="querySearch"
				      placeholder="输入预测目标"
				      @select="showBar(target)"
				      class="target-input"
				    ></el-autocomplete>	
				</div>

				<div class="chart-con">
					<div id="bar-chart"></div>
				</div>					
				<el-button v-if="!dataPicFinished" type="info" class="start-run run-default" disabled>启动训练</el-button>
				<button v-else class="start-run run-hilight" @click="startRun">启动训练</button>
				<div class="tips" v-if="tipsStatus">
					{{ tips }}
				</div>
			</div>

			<!-- 显示高级选项 -->
			<div class="data-info-avo">
				<div @click="advancedOption" class="info-avo-option">
					<span class="info-avo-label">显示高级选项</span>
					<img v-if="!showAdvancedOption" src="../images/Down-arrow-small.png">
					<img v-else src="../images/Down-arrow-small.png" style="transform:rotate(180deg);">
				</div>
				<div v-show="showAdvancedOption" class="info-avo-con">
					<advanced-option></advanced-option>			
				</div>
			</div> 

			<!-- 表格 -->
			<core-data :maxHeight="maxHeight" v-on:setTarget="showBar"></core-data>

			<!-- 下标 -->
			<div class="data-foot">
				{{ filename }}
			</div>
		</div>
	</left-right>
</template>
<style lang="scss">
	table {
		border: 0;
	}
	.el-autocomplete-suggestion li {
		font-size: 12px;
	}
	.target {
		position: relative;
		height: 300px;
		width: 90%;
		margin-left: 5%;
		text-align: left;
		.target-label {
			margin-top: 87px;
			font-size: 20px;
			font-weight: normal;
			letter-spacing: 2px;
			color: #333;
		}
		.target-input {
			font-size: 14px;
			color: #333;
			margin-top: 24px;
			width: 210px;
			height: 50px;
			background-color: #fff;
			box-shadow: 0px 4px 6px 0px 
				rgba(0, 0, 0, 0.06);
			border-radius: 4px;
			border: solid 1px #eeeeee;
			input {
				border: 1px;
				height: 50px;
				font-size: 14px;
			}
		}
		::-webkit-input-placeholder { /* WebKit browsers */
		    color:    #ccc;
		}
		:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
		    color:    #ccc;
		}
		::-moz-placeholder { /* Mozilla Firefox 19+ */
		    color:    #ccc;
		}
		:-ms-input-placeholder { /* Internet Explorer 10+ */
		    color:    #ccc;
		}
		.chart-con {
			display: inline-block;
			vertical-align: top;
			max-width: 677px;
			height: 300px;
			text-align: center;
			#bar-chart {
				margin-left: 189px;
				margin-top: 50px;
				text-align: center;
				width: 300px;
				height: 200px;
			}	
		}
		.run-default {
			background-color: #ccc;
		}
		.run-hilight {
			background-image: linear-gradient(90deg, 
				#0d65be 0%, 
				#1978d9 45%, 
				#248bf4 100%), 
			linear-gradient(
				#cccccc, 
				#cccccc);
			background-blend-mode: normal, 
				normal;
			box-shadow: 0px 4px 6px 0px 
				rgba(5, 0, 50, 0.2);
			&:hover {
				opacity: 0.7;
			}
			&:active {
				opacity: 1;
			}
		}
		.start-run {
			position: absolute;
			top: 107px;
			right: 87px;
			float: right;
			width: 127px;
			height: 51px;
			outline: none;
			border-radius: 4px;
			font-size: 20px;
			letter-spacing: 2px;
			color: #ffffff;
		}
		.tips {
			position: absolute;
			right: 20px;
			top: 20px;
			height: 33px;
			line-height: 33px;
			background-color: #fafafa;
			border-radius: 4px;
			border: 1px solid #eee;
			font-size: 12px;
			letter-spacing: 1px;
			color: #e09e2a;
			padding-left: 24px;
			padding-right: 24px;
		}
	}
	// 高级选项
	.data-info-avo {
		margin-bottom: 21px; 
		text-align: center;
		.info-avo-option {
			cursor: pointer; 
			width: 20%; 
			margin-left: 40%;
			margin-bottom: 21px;
		}
		.info-avo-label {
			font-size: 12px; 
			color: #666; 
			letter-spacing: 1px;
		}
		.info-avo-con {
			width: 100%; 
			height: 642px;
			padding-top: 57px; 
			background-color: #fafafa;
		}
	}

	.data-process {
		background: #eff3f5;
		height: 68px;
		position: relative;
	    
		.data-process-con {
			position: absolute;
			top: 15px; 
			left: 20%
		}
	}
	.load-effect {
		right: 20%; 
		top: 24px; 
		position: absolute;
	}
	.loading-progress {
		text-align: center;
		height: 74px;
		font-size: 15px;
		letter-spacing: 1px;
		border-radius: 0px 4px 4px 0px;
		position: relative;
		.loading-progress-con {
			padding-top: 12px; 
			height: 56px;
			position: absolute;
			color: #666666;
			font-size: 15px;
		    letter-spacing: 1px;
		}
		.load-progress-border {
			width: 100%;
			height: 1px;
			position: absolute;
			top: 74px;
			background-color: #eeeeee;
		}
		.load-progress-status {
			font-size: 12px;
		}
	}
	.load-fail-tip {
		font-size: 12px;
		letter-spacing: 1px;
		color: #e00202;
	}
	
	
	.el-tooltip__popper.is-dark {
		background: #187fe8;
	}
	.el-dropdown-menu__item {
		font-size: 12px;
	}
	.eigen-label {
		display: inline-block; 
		height: 100%;
		cursor: pointer; 
		color: #333; 
		font-size: 14px;
		letter-spacing: 1px; 
		img {
			width: 13px; 
			height: 13px;
			margin-right: 5px;
		}
	}
</style>
<script>
	import echarts from 'echarts'
	import advancedOption from '@/components/AdvancedOption'
	import leftRight from '@/components/LeftRight.vue'
	import coreData from '@/components/CoreData'

	import { getFeatureData, getFeatureList, poll, showOriginalData, train } from "@/api/api"

    const values = ['未知', '连续', '离散', '时间'];
    let obj = {};
    function $ (id) {
    	return document.getElementById(id);
    }
    window.onresize = () => {
    	const tablePart = $('tablePart');
    	const eigenPart = $('eigenPart');
    	if (tablePart && eigenPart) {
    		obj.originalPartwidth = (tablePart.offsetWidth - eigenPart.offsetWidth - 100);
    	}
    	
    }
    
	export default {
		components: {
			advancedOption,
			leftRight,
			coreData
		},
		data () {
			return {
				projectId: '',
				featureList: [],
				isListNameShow: false,
				listName: '',
				dataPicFinished: false,
				progressOk: true,
				testPercent: 0,
				varifyNum: 0,
				showAdvancedOption: false,
				filename: '',
				maxHeight: '374px',
				uploadProgress: '0%',
				target: ''
			}
		},
		methods: {
			
			
			advancedOption () {
            	this.showAdvancedOption = !this.showAdvancedOption;
			},
			showBar (target) {
				if (target) {
					this.target = target;	
				}
				this.dataPicFinished = true;
				var barChart = echarts.init(document.getElementById('bar-chart'));
				var option = {
					color: '#71b2f3',
		            title: {
		                text: 'ECharts 入门示例'
		            },
		            tooltip: {},
		            legend: {
		                data:['销量']
		            },
		            xAxis: [
		            	{
		                    splitLine:{show: false},//去除网格线
		                    type : 'category',
		                	data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋"],
		                	show: true,
		                	color: '#fff',
			                axisLabel: {
			                	rotate: -45,
			                	textStyle:{
                            		color: "#999"  
                        		}  
			                },
			                axisLine: {
			                	lineStyle: {
			                		color: '#fff',
			                		width: 1
			                	}
			                }
		                }
		            ],
		            yAxis: [
		            	{
		                    splitLine:{show: false},//去除网格线
		                    type : 'value',
		                    axisLine: {
			                	lineStyle: {
			                		color: '#ccc',
			                		width: 2
			                	}
			                },
			                nameTextStyle: {
			                	color: '#b3b3b3'
			                }
		                }
		        	],
		            grid: {
		            	show: 'true',
		            	borderWidth:'0'
		            },
		            series: [
				        {
				            type: 'bar',
				            itemStyle: {
				                normal: {
				                    color: new echarts.graphic.LinearGradient(
				                        0, 0, 0, 1,
				                        [
				                            {offset: 0, color: '#83bff6'},
				                            {offset: 0.5, color: '#188df0'},
				                            {offset: 1, color: '#188df0'}
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
				            barWidth: '80%',
				            data: [5, 20, 36, Math.random() * 20 + 10, 10]
				        }
		            ]
		        };
				barChart.setOption(option);
			},
			/**
			 * 开始训练 @TODO
			 *
			 * @params {}
			 */
			startRun () {
				const params = {
					project_id: this.projectId,
                	feature_list_id: this.featureListId || 2,
                	target_feature_id: this.targetFeatureId || 2,
                	config: {
                		split_method: this.splitMethod,
                		cross_valid_fold: 2,
        				time_serial_feature_id: 2,
        				test_ratio:  2,// 百分位
        				max_run_time: 2,
                	},
				};
				train(params).then(data => {

					console.log(data);
				})
			},
			querySearch(queryString, cb) {
		        var queryList = this.queryList;
		        var results = queryString ? queryList.filter(this.createFilter(queryString)) : queryList;
		        // 调用 callback 返回建议列表的数据
		        console.log(results);
		        cb(results);
		    },

			createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
		        };
		    },
			// 状态栏轮询
			pollTask (projectId,  interval) {
				const timer = setInterval ( () => {
					poll(projectId).then(data => {

						let { dataset_task, portrait_task } = data;
						
						const datasetStatus = dataset_task.status;
						const uploadProgress = this.$store.state.uploadProgress;

						// 上传数据
						switch (datasetStatus) {
							case 0:
								break; 
							case 1:
								break;
							case 2:
								break; 
							case 3:
								
								break;
							// 上传成功后再判断数据画像
							case 4: 
								const portraitstatus = portrait_task.status;
								const portraitProgress = this.$store.state.portraitProgress;
								this.$store.state.uploadProgress.percent = '100%';
								this.$store.state.uploadProgress.duration = '10s';
								this.$store.state.uploadProgress.status = 2;

								portraitProgress.percent = portrait_task.percentage + '%';
								// 数据画像
								switch (portraitstatus) {
									case 0: 
										break;
									case 4: 
										clearInterval(timer);
										portraitProgress.percent = '100%';
										portraitProgress.status = 2;
										portraitProgress.duration = portrait_task.duration + 's';
										// 获取特征列表
										getFeatureList({project_id: projectId}).then(data => {
											let { feature_lists } = data;
											this.featureList.length = 0;
											for (let i = 0, len = feature_lists.length; i < len; i++) {
												const item = feature_lists[i];

												this.featureList.push({
													name: item.name || '全部特征',
													id: item.feature_list_id
												});
											}
											console.log('in feature_lists');
											console.log(this.featureList);
										})
										break;
									case 5: 
										clearInterval(timer);
										break;
								}	
								break;
							case 5: 
								clearInterval(timer);
								uploadProgress.percent = '0%';
								uploadProgress.status = -1;
								uploadProgress.failReason = task.failed_reason;
							break;
								break;
						}

						
					})
				}, interval);
			}
		},
		mounted () {
			obj = this;
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.maxHeight = (h - 100);
            this.uploadProgress = '30%';
            this.filename = this.$store.state.filename;
            this.$store.commit('SET_PROJECT_STATUS', true);

            this.originalPartwidth = ($('tablePart').offsetWidth - $('eigenPart').offsetWidth - 100);
            this.$store.state.portraitProgress.status = 1;
        
            const projectId = this.$route.params.projectId;
            this.projectId = projectId;

            this.$store.state.progressItems.length = 0;
            const uploadProgress = this.$store.state.uploadProgress;
            const portraitProgress = this.$store.state.portraitProgress;
			this.$store.state.progressItems.push(uploadProgress, portraitProgress);

			// 轮询
			this.pollTask(projectId, 500);
		},
		computed: {
			tips () {
				return this.$store.state.tips;
			},
			tipsStatus () {
				return this.$store.state.tipsStatus;
			},
			queryList () {
				return this.$store.state.queryList;
			}
		}
	}
</script>


















