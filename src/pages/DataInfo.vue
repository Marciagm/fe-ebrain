<template>
	<div>
		<top-part ref="top" v-on:getStatus="init"></top-part>
		<left-right ref="leftRight">
			<div slot="left" ref="info-left">
				<div class="target" v-if="!inTrain">
					<div style="display: inline-block; width: 210px; margin-right: 1%; flex: 2">
						<div v-if="!dataPicFinished || fLId" class="target-label" style="color: #ccc;">输入预测目标</div>
						<div v-else class="target-label" for="target">输入预测目标</div>
						<el-autocomplete
					      v-model="targetInfo.value"
					      :fetch-suggestions="querySearch"
					      placeholder="输入预测目标"
					      @select="showBar"
					      @focus="focusOnTarget"
					      @blur="blurTarget"
					      class="target-input"
					      :disabled="targetDisabled"
					      :select-when-unmatched=true
					    ></el-autocomplete>	
					</div>

					<div class="chart-con">
						<div id="bar-chart" v-show="targetId"></div>
					</div>

					<div style="display: inline-block; flex: 2;">
						<el-button v-if="!targetId" type="info" class="start-run run-default" disabled>启动训练</el-button>
						<button v-else class="start-run run-hilight" @click="startRun">启动训练</button>
					</div>
					<div class="tips" v-if="tipsStatus && tips">
						{{ tips }}
					</div>
				</div>

				<!-- 显示高级选项 -->
				<div class="data-info-avo" v-if="!inTrain">
					<div @click="advancedOption" class="info-avo-option">
						<span class="info-avo-label">
							{{ optionStatus }}
						</span>
						<img v-if="!showOption" src="../images/Down-arrow-small.png">
						<img v-else src="../images/Down-arrow-small.png" style="transform:rotate(180deg);">
					</div>
					<div v-show="showOption" class="info-avo-con">
						<advanced-option ref="option"></advanced-option>			
					</div>
				</div> 

				<!-- 表格 -->
				<core-data style="margin-top: 20px;" :inTrainStep="inTrain" :maxHeight="maxHeight" v-on:setTarget="showBar" ref="coreData"></core-data>
			</div>
		</left-right>
	</div>
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
		display: flex;
		.target-label {
			margin-top: 87px;
			font-size: 20px;
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
			margin: 0 auto;
			width: 0;
			height: 190px;
			flex: 10;
			text-align: center;
			margin-top: 50px;
			#bar-chart {
				margin-left: 10%;
				margin-right: 10%;
				width: 80%;
				height: 230px;
			}
		}
		.run-default {
			background-color: #ccc;
		}
		.run-hilight {
			padding: 12px 20px;
			box-shadow: 2px 3px 6px 0px rgba(5, 0, 50, 0.2);
			background-image: linear-gradient(90deg, 
				#0d65be 0%, 
				#1978d9 45%, 
				#248bf4 100%), 
			linear-gradient(
				#cccccc, 
				#cccccc);
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
			right: 2%;
			float: right;
			flex: 1;
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
	
	.el-tooltip__popper.is-dark {
		background: #187fe8;
	}
	.el-dropdown-menu__item {
		font-size: 12px;
	}
</style>
<script>
	import topPart from '@/components/Top.vue'
	import echarts from 'echarts'
	import advancedOption from '@/components/AdvancedOption'
	import leftRight from '@/components/LeftRight.vue'
	import coreData from '@/components/CoreData'

	import { poll, train, getFeatureDistr } from "@/api/api"
	/**
	 * 绘制图表
	 *
	 * @param {string} id 图表展示的区域
	 * @param {Object} data 绘制图表的数据 
	 */
	function drawChart(id, data) {
		console.log(data.freq);
		console.log('in drawChart');
		console.log(data.type);
		// @TODO 时间类型
		const type = data.type == 1 ? 'line' : 'bar';
		console.log('type: ' + type);
		//const titleText = '共150个特征，显示前10个特征';
		const titleText = data.titleText;
		const chart = echarts.init(document.getElementById(id));
		chart.clear();
		var option = {
			color: '#71b2f3',
            title: {
                text: titleText,
                left: 'center',
                textStyle: {
                	color: '#ccc',
                	fontSize: 10,
                	align: 'center'
                }
            },
            tooltip: {},
            
            xAxis: [
            	{
                    splitLine:{show: false},//去除网格线
                    type : 'category',
                	data: data.value,
                	//data: data.freq,
                	show: true,
                	color: '#fff',
	                axisLabel: {
	                	//rotate: -45,
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
            	//x: '25%',
            	x: data.margin,
            	y: 60,
            	//x2: '25%',
            	x2: data.margin,
            	y2: 60,
            	show: 'true',
            	borderWidth:'0'
            },
            series: [
		        {
		            //type: 'bar',
		            type: type,
		            symbol:'circle',
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
		            barWidth: '30%',
		            //data: [5, 20, 36, Math.random() * 20 + 10, 10]
		            data: data.freq
		            //data: data.value
		        }
            ]
        };
		chart.setOption(option);
	}
  
	export default {
		components: {
			topPart,
			advancedOption,
			leftRight,
			coreData
		},
		data () {
			return {
				optionStatus: '显示高级选项',
				targetDisabled: true,
				isEigenActive: false,
				showOption: false,
				fLId: '',
				targetId: '',
				targetName: '',
				inTrain: false,
				projectId: this.$route.params.projectId,
				featureList: [],
				dataPicFinished: false,
				testPercent: 0,
				maxHeight: '500',
				targetInfo: {
					value: '',
					id: ''
				}
			}
		},
		methods: {
			blurTarget () {
				if (!this.targetInfo.value) {
					return;
				}
				this.showBar(this.targetInfo);
				for (let i = 0, len = this.queryList.length; i < len; i++ ) {
					const item = this.queryList[i];
					if (this.targetInfo.id == item.id && this.targetInfo.value == item.value) {
						//this.targetId = this.targetInfo.id;
						break;
					}
				}
			},
			focusOnTarget () {
				console.log('in focus');
				this.targetId = '';
			},

			/**
			 * toggle高级选项
			 */
			advancedOption () {
				if (!this.dataPicFinished) {
					return;
				}
            	this.$refs.option.updateTimeTypeList();
            	this.showOption = !this.showOption;
            	if (this.showOption) {
            		this.optionStatus = '隐藏高级选项';
            	}
            	else {
            		this.optionStatus = '显示高级选项';
            	}
			},

			/**
			 * 展示目标
			 *
			 * @param {string} target 特征目标
			 */
			showBar (target) {
				console.log('in showBar000000');
				console.log(target);
				if (!target.id) {
					for (let i = 0, len = this.queryList.length; i < len; i++) {
						const item = this.queryList[i];
						if (target.value == item.value) {
							target.id = item.id;
							break;
						}
					}
				}
				this.targetId = target.id;
				this.targetInfo.value = target.value;
				this.targetInfo.id = target.id;
				
				getFeatureDistr(target.id).then (data => {
					// console.log(data);
					const { error, histogram } = data;
					if (error) {
						this.$message.error(error.desc);
						return;
					}
					if (histogram && histogram.length) {
						const xData = {
							type: target.type,
							freq: [],
							value: [],
							//margin: '25%'
						};
						const len = histogram.length;
						// @TODO length不同margin不同
						xData.margin = Math.max((25 - (len - 2) * 2), 5) + '%';
						xData.titleText = len > 10 ? `共${len}个特征，显示前10个特征` : '';
						const sortHistogram = histogram.sort((a, b) => {
							return b.value - a.value;
						});

						for (let i = 0; i < Math.min(len, 10); i++) {
							const item = sortHistogram[i];
							xData.freq.push(item.freq);
							xData.value.push(item.value);	 
						}
						drawChart('bar-chart', xData);
					}
					return;
				})
				
				if (target) {
					this.target = target.value;
					// 置空
					if (!this.target) {
						//this.dataPicFinished = false;
						return;
					}
				}

				this.$store.state.trainObj.targetFeatureId = target.feature_id;
				this.$store.state.trainObj.targetId = target.feature_id;
				this.$store.state.trainObj.targetName = this.targetInfo.value;
				this.$store.commit('SET_TRAIN_OBJ', this.$store.state.trainObj);
				// console.log('*****************name: ' + this.$store.state.trainObj.targetName);
				this.dataPicFinished = true;
			},

			/**
			 * 开始训练 @TODO
			 *
			 * @params {}
			 */
			startRun () {
				const trainObj = this.$store.state.trainObj;
				const featureListId = trainObj.featureListId || -1;
				const targetId = trainObj.targetId || this.targetId;
				const params = {
					project_id: this.projectId,
                	feature_list_id: featureListId,
                	target_feature_id: targetId,
                	config: {
                		// split_method: 0-unknown 1-交叉验证 2-训练测试验证   
                		split_method: trainObj.splitMethod,
                		// cross_valid_fold: trainObj.varifyNum / 10,
        				cross_valid_fold: trainObj.crossValidFold,
        				// 当选择“随时间划分”时出现 @TODO 标示区分方法
        				//time_serial_feature_id: trainObj.timeSerialFeatureId,
        				// 测试百分比
        				test_ratio: trainObj.testRatio,// 百分位
        				//max_run_time: 2,
                	},
				};
				if (trainObj.timeSerialFeatureId) {
					params.config.time_serial_feature_id = trainObj.timeSerialFeatureId;
				}
				console.log('params: ');
				console.log(params);
				train(params).then(data => {
					const { error, task } = data;
					if (error) {
						this.$message.error(error.desc);
						return;
					}
					if (task) {
						const { task_id } = task;
						console.log(`task_id: ${task_id}`);
						this.inTrain = true;
						this.maxHeight = '1000px';
						this.$router.push({
							path: `/main/data/train/${this.projectId}`
						})
						this.$store.commit('SET_FL_ID', featureListId);
						this.$store.commit('SET_TASK_ID', task_id);
						this.$store.commit('SET_TARGET_ID', targetId);
						this.$store.commit('SET_TARGET_NAME', this.targetInfo.value);
						// this.$store.state.progressItems.length = 0;
						//this.pollTrainTask(this.projectId, 500);
						console.log(data);
					}
					
				})
			},
			querySearch(queryString, cb) {
		        var queryList = this.queryList;
		        var results = queryString ? queryList.filter(this.createFilter(queryString)) : queryList;
		        // 调用 callback 返回建议列表的数据
		        console.log(results);
		        console.log('before callback');
		        console.log(queryList);
		        cb(results);
		    },

			createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
		        };
		    },

			/**
			 * 状态栏轮询
			 *
			 * @param {string} projectId 任务id
			 * @param {number} interval 间隔
			 */
			pollTask (projectId,  interval) {
				console.log('in pollTask: ' + this.curStatus);
				let initCoreData = false;
				
				clearInterval(window.infoTimer);

				window.infoTimer = setInterval ( () => {
					
					poll(projectId).then(data => {
						let { error,target_feature_id, target_feature_name, dataset_task, portrait_task, preprocessing_task, training_task } = data;
						
						if (error) {
							this.$message.error('');
							clearInterval(infoTimer);
							return;
						}

						const preProcessingTask = preprocessing_task;

						if (preProcessingTask) {
							this.$refs.coreData.setEigenActive(true);
							this.targetInfo.id = target_feature_id;
							this.targetInfo.value = target_feature_name;
							this.$refs.leftRight.setStyles({
								showTarget: true,
								showFeatureNum: true,
								showFeatureList: true
							});
							this.targetDisabled = true;
							this.showBar(this.targetInfo);
							const { stages, preprocess_info } = preProcessingTask;
							this.taskId = preProcessingTask.task_id;
							this.fLId = preprocess_info.feature_list_id;

							// @TODO curStatus
							// this.$store.commit('SET_CUR_STATUS', 2);
							this.$refs.top.setColors(['#1b7bdd', '#666', '#666']);
						}

						const datasetStatus = dataset_task.status;
						const uploadProgress = this.$store.state.uploadProgress;


						// 上传数据
						switch (datasetStatus) {
							case 0:
							case 1:
							case 2: 
							case 3:break;
							// 上传成功后再判断数据画像
							case 4: 
								this.$store.state.uploadProgress.percent = '100%';
								this.$store.state.uploadProgress.duration = Math.max(dataset_task.duration, 1) + 's';
								this.$store.state.uploadProgress.status = 2;

								// 第一次执行
								if (this.curStatus < 2) {
									this.$store.commit('SET_CUR_STATUS', 2);	
								}
								
								if (!portrait_task) {
									return;
								}
								// 数据画像阶段判断
								const portraitstatus = portrait_task.status;
								const portraitProgress = this.$store.state.portraitProgress;
								portraitProgress.percent = portrait_task.percentage + '%';

								
								// 数据画像
								switch (portraitstatus) {
									case 3: 
										if (this.curStatus <= 2.5) {
											// 正在生成数据画像
											this.$store.commit('SET_CUR_STATUS', 2.5);
										}
										break;
									case 4: 
										clearInterval(infoTimer);
										console.log('curStatus: ' + this.curStatus);
										// 第一次训练
										if (this.curStatus >= 2.5 && this.curStatus <= 3) {
											this.$store.commit('SET_CUR_STATUS', 3);
										}
										else {
											this.$store.commit('SET_CUR_STATUS', 5);
										}
										console.log('this.curStatus: ' + this.curStatus);
										console.log((this.curStatus >= 3) && (this.curStatus <=4));
										if ((this.curStatus >= 3) && (this.curStatus <=4)) {
											this.targetDisabled = false;
											console.log(this.targetDisabled);
										}
										if (this.curStatus > 4) {
											this.targetDisabled = true;
										}

										portraitProgress.percent = '100%';
										portraitProgress.status = 2;
										portraitProgress.duration = portrait_task.duration + 's';
										this.dataPicFinished = true;
										this.$refs.coreData.init(this.fLId || -1, {project_id: this.projectId});
										this.$store.commit('SET_TARGET_TIPS', true);
										this.$refs.coreData.initCoreData({
											taskId: this.taskId,
											targetId: this.targetId,
											fLId: this.fLId,
											isEigenActive: true
										});
										break;
									case 5: 
										clearInterval(infoTimer);
										break;
								}	
								break;
							case 5: 
								clearInterval(infoTimer);
								uploadProgress.percent = '0%';
								uploadProgress.status = -1;
								uploadProgress.failReason = dataset_task.failed_reason;
							break;
								break;
						}
					}).catch((error) => {
						console.log(error);
						clearInterval(infoTimer);
						//clientHeight(infoTimer);
					})
				}, interval);
			},

			/**
			 * 状态栏初始化
			 */
			progressInit () {
            	this.$store.state.progressItems.length = 0;
            	const uploadProgress = this.$store.state.uploadProgress;
            	this.$store.state.uploadProgress.percent = '100%';
				this.$store.state.uploadProgress.status = 2;


            	const portraitProgress = this.$store.state.portraitProgress;
            	portraitProgress.status = 1;
            	portraitProgress.percent = '0%';
				this.$store.state.progressItems.push(uploadProgress, portraitProgress);
			},
			styleInit () {
				let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            	this.maxHeight = (h - 100) + 'px';
			},
			init () {
				console.log('targetDisabled: ' + this.targetDisabled);
				this.styleInit();
				this.$refs.leftRight.setStyles({
					showFeatureList: true,
					showFeatureNum: true,
					showTarget: false
				});
				this.$refs.top.setColors(['#1b7bdd', '#ccc', '#666']);
	            this.$store.commit('SET_PROJECT_STATUS', true);
	            this.$store.commit('SET_PROJECT_ID', this.projectId);
	          
				if (this.targetId && this.fLId && this.targetName) {
					this.targetInfo.value = this.targetName;
					this.targetInfo.id = this.targetId;
					if (this.targetInfo.value) {
						this.showBar(this.targetInfo);
					}
				}

	           	// 状态栏初始化
	            this.progressInit();
				// 轮询
				this.pollTask(this.projectId, 500);
			}
 		},
		mounted () {
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
			},
			curStatus () {
				return this.$store.state.curStatus;
			}
		}
	}
</script>


















