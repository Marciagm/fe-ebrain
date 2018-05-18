<template>
	<div id="tables">
		<div id="tablePart">
			<div id="eigenPart" :class="[isEigenActive ? active : notActive]" @click="showEigen">
				<div class="eigen-label" @click="tab('detail')">
					<img src="../images/All-features.png">
					<span>特征详情</span>
				</div>
				<el-autocomplete
			      v-model="state"
			      :fetch-suggestions="querySearch"
			      placeholder="搜索"
			      @select="search"
			      style="height: 15px; border: 0; text-align: center; font-size: 12px;"
			    ></el-autocomplete>	

				<el-dropdown style="cursor: pointer;" @command="getList" trigger="click" :disabled="true"><div id="list">
					<span class="el-dropdown-link">
					    <span style="display: inline-block; width: 80px; text-align: center;">{{ curFeatureObj.name }}</span>
					    <span style="color: #666; font-size: 10px;">(特征列表)</span>
					    <i class="el-icon-arrow-down el-icon--right"></i>
					</span></div>
					<el-dropdown-menu slot="dropdown">
					    <el-dropdown-item v-for="(item, index) in featureList" :divided="index==1" :command="item">
					    	{{ item.name }}
					    </el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<div class="eigen-list" v-show="isListNameShow"> 
					<input placeholder="新建特征列表" class="eigen-list-input" v-model="listName" id="setListInput" />
					<button class="eigen-list-button" @click="setList">确定</button>
				</div>
			</div>

			<div id="originalPart" :class="[isEigenActive ? originalNotActive : originalActive]" :style="{width: originalPartwidth + 'px'}" @click="tab('original')">
				<div class="original-label" >
					<img src="../images/Original-data.png" style="margin-right: 5px;" >
					原始数据
				</div>
			</div>
		</div>

		<div id="core-data">

			<!-- 特征详情 -->
			<!-- <eigenvalue-table :max-height="maxHeight" v-if="isEigenActive" v-on:setTarget="showBar" v-on:setList="showSetList"></eigenvalue-table> -->
			
			<el-table
				v-show="isEigenActive"
			 	width="0"
				align="center"
				stripe
			    ref="multipleTable"
			    :data="eigenData"
			    tooltip-effect="light"
			    :max-height="maxHeight"
			    @select="select"
			    @select-all="select"
			    @cell-mouse-enter="showTip"
			    @cell-mouse-leave="hideTip"
			    @expand-change="expand"
			    show-overflow-tooltip
			    style="border-radius: 4px;"
			    >
			    <el-table-column
			      type="selection"
			      :selectable="checkboxInit"
			    >
			    
			    </el-table-column>
			    <el-table-column
			      type="expand"
			    >
			    <template slot-scope="props">
			    	<!-- nav part -->
			    	<div class="eigen-detail-nav">
			    		<button class="nav-item" :style="{color: dataDistr}" @click="showData('dataDistr', props.row)">数据分布</button>
			    		<div class="nav-sep"></div>
			    		<button class="nav-item" :style="{color: topn}" @click="showData('topn', props.row)">
			    			TopN (N<=50)	 
			    		</button>
			    	</div>
			    	<div class="dataShow" :id='"dataShow" + props.row.feature_id'></div>

			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="特征名称"
			      sortable
			      width="200"
			     >
			      <template slot-scope="props" style="text-align: left;">
			      	<div :id="props.row.feature_id" style=" height: 49px; line-height: 49px;">
			      		<span >{{ props.row.name }}</span>
			      		<span v-show="props.row.showTip" class="target-tip" @click="chooseTarget(props.row)">
			      			选该特征值为目标
			      		</span>
			      	</div>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="column_index"
			      label="列号"
			      sortable
			    >
			    </el-table-column>
			     <el-table-column
			      prop="importance"
			      sortable
			      label="特征重要性"
			      width="120"
			      v-if="importanceShow"
			    >
			    <template slot-scope="props">
			    	<span v-if="props.row.isTarget">目标</span>
			    	<el-progress v-else :percentage="props.row.importance" :show-text="false"></el-progress>
			    </template>
			    </el-table-column>
			    <el-table-column
			      prop="typeValue"
			      sortable
			      label="数据类型"
			      width="100"
			      show-overflow-tooltip>
			      <template slot-scope="props" style="text-align: left;">
			      	<span v-if="fLId">{{ props.row.typeValue }}</span>
			      	<el-dropdown trigger="click"  style="font-size: 12px; color: #333; cursor: pointer;" @command="selectDataType" v-else>
				      	<span>
						    {{ props.row.typeValue }}
						    <i class="el-icon-arrow-down el-icon--right"></i>
						</span>
				      	<el-dropdown-menu slot="dropdown">
						    <el-dropdown-item :command="{v: '2', n: props.row}"> 离散</el-dropdown-item>
						    <el-dropdown-item :command="{v: '1', n: props.row}"> 连续</el-dropdown-item>
						    <el-dropdown-item :command="{v: '3', n: props.row}"> 时间</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="values_count"
			      label="特征个数"
			      sortabl
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="missed_instances_count"
			      sortable
			      label="缺失值"
			      width="100"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="valid_instances_count"
			      sortable
			      label="有效样本数"
			      width="120"
			      show-overflow-tooltip>
			    </el-table-column>							    
			    <el-table-column
			      prop="max"
			      label="最大值"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="min"
			      label="最小值"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="mode"
			      label="众数"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="mean"
			      label="平均数"
			      show-overflow-tooltip
			      >
			    </el-table-column>
			    <el-table-column
			      prop="sum"
			      label="取值加和"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="std"
			      label="方差"
			      show-overflow-tooltip>
			    </el-table-column>
			</el-table>
			<!-- 表格部分 -->
			<div style="" v-show="!isEigenActive">
				<original-data :max-height="maxHeight"></original-data>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
	#tables {
		table {
			background-color: #fafafa;
			box-shadow: inset 0px 0px 4px 0px rgba(4, 15, 69, 0.2);
		}

		.el-input.is-disabled .el-input__inner {
			background: #fff;
		}
		margin-left: 5%;
		width: 90%;
		overflow: hidden;
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
		#eigenPart {
			button {
				border: 0;
			}
			button:hover {
				background: #fff;
			}
			padding-left: 14px;
			padding-right: 14px;
			display: inline-block;
			height: 41px; 
			line-height: 41px;
			.eigen-list { 
				display: inline-block;
				margin-left: 30px;
				.eigen-list-input {
					height: 18px;
					background-color: #e6e6e6;
					border: 0;
				}
				.eigen-list-button {
					background-image: linear-gradient(90deg, 
						#0d65be 0%, 
						#1978d9 45%, 
						#248bf4 100%), 
					linear-gradient(
						#e0952a, 
						#e0952a);
					border-radius: 2px;
					color: #fff;
					font-size: 10px;
					outline: none;
					&:hover {
						opacity: 0.7;
					}
					&:active {
						opacity: 1;
					}
				}
			}
		}
		.active {
			border-top: 1px solid #eee;
			border-left: 1px solid #eee;
		}
		.not-active {
			border-bottom: 1px solid #eee;
		}
		.original-active {
			border-bottom: 1px solid #eee;
			.original-label {
				cursor: pointer;
				border: 1px solid #eee; 
				height: 41px; 
				width: 128px;
				color: #333; 
				font-size: 14px;
				letter-spacing: 1px; 
				padding-left: 45px; 
				border-bottom: 0; 
				background: #fff;
			}
			
		}
		.original-not-active {
			border-bottom: 1px solid #eee;
			.original-label {
				width: 128px;
				color: #333; 
				cursor: pointer;
				border-left: 1px solid #eee;
				padding-left: 45px;
				font-size: 14px;
				letter-spacing: 1px; 
			}
		}
		#originalPart {
			display: inline-block; 
			vertical-align: top; 
			height: 41px; 
			line-height: 41px;
			margin-left: -3px;
		}
		.active {
			border-top: 1px solid #eee;
			//border-bottom: 1px solid #eee;
		}
		.not-active {
			border-bottom: 1px solid #eee;
		}
		.el-table {
			color:  #333;
			font-size: 12px;
		}
		.el-input__inner {
			border: 0px;
			width: 100px;
			font-size: 12px;
		}
		.el-table thead {
			color: #333;
			letter-spacing: 1px;
			text-align: center;
			margin-bottom: 20px;
		}
		.el-table tr {
			background: #fafafa;
			height: 53px;
			box-sizing: border-box;
		}
		.el-table--striped .el-table__body tr.el-table__row--striped td {
			background-color: #f5f5f5;
			border: 0;
		}
		.el-table td, .el-table th.is-leaf {
			padding: 0;
			border: 0;
			height: 53px;
			box-sizing: border-box;
		}
		.target-tip {
			float: right;
			font-size: 12px;
			color: #1b7bdd;
			cursor: pointer;
			height: 100%;
		}
		
		#core-data {
			margin-top: 19px; 
			margin-bottom: 20px; 
			width: 100%;
			.eigen-detail-nav {
				margin-top: 28px;
				margin-left: 28px;
				.nav-item {
					cursor: pointer;
					border: 0;
					outline: none;
					background: transparent;
					font-size: 12px;
				}
				.nav-sep {
					display: inline-block;
					vertical-align: middle;
					width: 1px;
					height: 10px;
					background-color: #ccc;
					margin-left: 30px;
					margin-right: 30px;
				}
				
			}
			.dataShow {
				width: 40%;
				max-width: 100%;
				height: 300px;
				padding-left: 30px;
				padding-bottom: 20px;
			}
		}
	}
</style>
<script>
	import echarts from 'echarts'
	import { getFeatureData, createFeatureList, getFeatureList, updateFeature, getFeatureDistr } from '../api/api'
	import originalData from '@/components/OriginalData'

	const values = ['未知', '连续', '离散', '时间'];
	let obj = {};
    function $ (id) {
    	return document.getElementById(id);
    }
    window.onresize = () => {
    	const tablePart = $('tablePart');
    	const eigenPart = $('eigenPart');
    	if (tablePart && eigenPart) {
    		//obj.originalPartwidth = (tablePart.offsetWidth - eigenPart.offsetWidth - 100);
    	}
    }

    /**
     * 绘制图表
     *
     * @param {string} id 绘制区域id
     * @param {Object} data 数据
     */
    function drawChart (id, data) {
    	const type = data.type == 1 ? 'line' : 'bar';
    	const chartCon = document.getElementById(id);
    	
    	const len = data.value.length;
    	chartCon.style.width = Math.min(40 + len / 2 * 1, 80) + '%';
    	// chartCon.style.height = '316px';
    	const chart = echarts.init(chartCon);
    	chart.clear();
    	const option = {
			color: '#71b2f3',
            title: {
            	text: '数据分布',
                show: false
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: [
            	{
                    splitLine:{show: false},//去除网格线
                    type : 'category',
                	data: data.value,
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
		            //type: 'bar',
		            type: type,
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
		            barMaxWidth: 30,
		            //data: [5, 20, 36, Math.random() * 20 + 10, 10],
		            data: data.freq,
		            label: {
		            	normal: {
		            		show: false
		            	}
		            }
		        }
            ]
        };
    	chart.setOption(option);
    }

	/**
     * 绘制图表
     *
     * @param {string} id 绘制区域id
     * @param {Object} data 数据
     */
    function drawDistr (id, data) {
    	const type = data.type == 1 ? 'line' : 'bar';
    	console.log(data);
    	const barWidth = data.barWidth;
    	const chartCon = document.getElementById(id);
    	const len = data.value.length;
    	//chartCon.style.height = (316 + len * 10) + 'px';
    	const chart = echarts.init(chartCon);
    	chart.clear();
    	const option = {
		    title: {
		        text: '特征名',
		        show: false,
		        textStyle: {
		        	color: '#999',
		        	fontSize: '12px'
		        }
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
		        right: '14%',
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
		        name: '频次',
		        nameLocation: 'end',
		        color: '#ccc',
		        nameGap: 15,
		        //nameLocation: 'end',
		        // boundaryGap: [0, 0.01],
		        axisLabel: {
		        	color: '#ccc',
		        	textStyle: {
		        		color: '#fff',
		        		opacity: 0
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
		        data: data.value,
		        name: '特征名',
		        nameLocation: 'end',
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
		            name: '特征频次',
		            type: 'bar',
		            color: '#000',
		            //data: [18203, 23489, 29034, 104970, 131744, 630230],
		            data: data.freq,
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
		            		show: true,
		            		position: 'right'
		            	}
		            },
		            //barWidth: barWidth,
		            barMaxWidth: 30
		        }
		    ]
		};
    	chart.setOption(option);
    }

	export default {
		props: ['maxHeight', 'inTrainStep'],
		components: {
			originalData
		},
		data () {
			return {
				isEigenActive: false,
				importanceShow: false,
				taskId: '',
				fLId: '',
				targetId: '',
				curFeatureObj: {
					name: '全部特征',
					id: ''
				},
				projectId: this.$route.params.projectId,

				// 样式
				active: 'active',
				notActive: 'not-active',
				originalActive: 'original-active',
				originalNotActive: 'original-not-active',

				originalPartwidth: '',
				eigenData: [],
				
				dataDistr: '#0d68c4',
				topn: '#666',

				multipleSelection: [],
				queryList: [],
				state: '',
				featureList: [],
				isListNameShow: false,
				listName: '',
				dataPicFinished: false,
				showAdvancedOption: false,
				target: ''
			}
		},
		methods: {
			setEigenActive (status) {
				this.isEigenActive = status;
			},
			initCoreData (data) {
				this.taskId = data.taskId;
				this.fLId = data.fLId;
				this.targetId = data.targetId;
				if (data.isEigenActive === false || data.isEigenActive === true) {
					this.isEigenActive = data.isEigenActive;
				}
			},
			showImportance () {
				this.importanceShow = true;
			},
			checkboxInit (row, index) {
				// if target already been set, change impossiblely
				if (this.targetId == row.feature_id) {
					return false;
				}
				else {
					return true;
				}
			},
			tab (tag) {
				const projectId = this.projectId;
				if (tag === 'detail') {
					this.isEigenActive = true;
					if (!this.eigenData || !this.eigenData.length) {
						const params = {
							project_id: this.projectId,
							train_task_id: this.taskId
						}
						this.getFeatureData(-1, params);
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
						})	
					}
					else {
						/*setTimeout(() => {
							const selection = this.$store.state.selection;
							if (selection && selection.length) {
								this.isListNameShow = true;
								selection.forEach( row => {
					            	this.$refs.multipleTable.toggleRowSelection(this.eigenData[row.order]);
								})
							}
						}, 0)*/
					}
				}
				else {
					this.isEigenActive = false;
					//this.isOriActive = true;
					//this.isListNameShow = false;
				}
			},
			setList () {
				if (this.listName) {
					const ids = [];
					console.log('targetId: ' + this.targetId);
					if (this.targetId) {
						ids.push(this.targetId);
					}
					console.log(this.$store.state.selection);
					this.$store.state.selection.forEach((value, index) => {
						ids.push(value.feature_id);
					})
					console.log(ids);
					const param = {
						project_id: this.projectId,
						name: this.listName,
						feature_ids: ids
					};
					createFeatureList(param).then(data => {
						const { error, feature_list } = data;
						if (error) {
							this.$message.error('创建失败！' + error.desc);
							return;
						}
						/*else {

							this.$store.commit('SET_TIPS_STATUS', true);
							this.$store.commit('SET_TIPS', '创建成功');
							setTimeout(() => {
		                        this.$store.commit('SET_TIPS_STATUS', false);
		                    }, 2000)
						}*/
						//this.init(feature_list.feature_list_id);
						this.init(feature_list.feature_list_id, { project_id: this.projectId });
					})

				}
				else {
					this.$message.error('填列表名字啊！');
				}
			},
			init (featureListId, params) {
				console.log('featureListId: ' + featureListId);
				this.getFeatureData(featureListId, params);

				getFeatureList({ project_id: params.project_id }).then(data => {
					let { feature_lists } = data;
					this.featureList.length = 0;
					for (let i = 0; i < feature_lists.length; i++) {
						const item = feature_lists[i];
						this.featureList.push({
							name: item.name || '全部特征',
							id: item.feature_list_id
						})
					}
				})
			},
			getList (item) {
				this.isEigenActive = true;
				this.isListNameShow = false;
				this.curFeatureObj.name = item.name;
				this.curFeatureObj.id = item.id;

				const params = {
					project_id: this.projectId
				}
				if (item.id == this.fLId) {
					params.train_task_id = this.taskId;
					this.importanceShow = true;
				}
				else {
					this.importanceShow = false;
				}
				this.getFeatureData(item.id, params);
			},

			/**
			 * 获取特征数据
			 *
			 * @param { string } featureListId 特征列表id
			 * @param { Object } params 参数对象
			 */
			getFeatureData (featureListId, params) {
				this.isListNameShow = false;
				const timeTypeList = [];
				getFeatureData(featureListId, params).then(data => {
					let { error, feature_list } = data;
					if (error) {
						this.$message.error(error.desc);
						return;
					}
					if (!feature_list) {
						this.$store.commit('SET_EIGEN_DATA', []);
						return;
					}
					let { features } = feature_list;
					if (!feature_list && !features) {
						this.$store.commit('SET_EIGEN_DATA', []);
						return;
					}
					this.queryList.length = 0;
					const len = features.length;
					// @TODO 固定第一个
					let targetIndex;
					//timeTypeList.length = 0;
					for (let i = 0; i < len; i++) {
						const item = features[i];
						item.showTip = false;
						item.typeValue = values[item.type];

						if (item.type == 3) {
							timeTypeList.push({name: item.name, id: item.feature_id});	
						}
						if (item.instance_feature_analysis && item.instance_feature_analysis.importance) {
							item.importance = item.instance_feature_analysis.importance * 100;
							console.log(item.importance);
						}
						item.order = i;
						item.isTarget = false;
						if (item.feature_id == this.targetId) {
							item.isTarget = true;
							targetIndex = i;
						}
						this.queryList.push({value: item.name, id: item.feature_id})
					}
					this.$store.commit('SET_TYPE_LIST', timeTypeList);
					console.log(this.$store.state.timeTypeList);
					this.$store.commit('SET_QUERY_LIST', this.queryList);
					this.eigenData = features;
					// 固定第一行
					if (this.fLId) {
						this.eigenData.splice(0, 0, this.eigenData.splice(targetIndex, 1)[0]);
						
					}
					this.curFeatureObj.name = feature_list.name || '全部特征';
					this.curFeatureObj.id = featureListId;
					const trainObj = this.$store.state.trainObj;
					trainObj.featureName = feature_list.name || '全部特征';
					trainObj.featureNum = len;
					trainObj.featureListId = featureListId;

					this.$store.commit('SET_EIGEN_DATA', features);
				})
			},
			createFilter(queryString) {
		        return (queryList) => {
		          return (queryList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
		        };
		    },
			querySearch(queryString, cb) {
		        var queryList = this.queryList;
		        var results = queryString ? queryList.filter(this.createFilter(queryString)) : queryList;
		        // 调用 callback 返回建议列表的数据
		        cb(results);
		    },

		    /**
		     * 搜索
		     *
		     * @param {Object} item 搜索项
		     */
			search (item) {
				this.isEigenActive = true;
				if (item && item.id) {
					document.getElementById(item.id).scrollIntoView();
				}
			},

			/**
			 * 勾选
			 *
			 * @param {Object} selection 选项数据 
			 * @param {Object} row 行信息
			 */
			select (selection, row) {
				if (!selection.length) {
					this.isListNameShow = false;
				}
				else {
					this.isListNameShow = true;
				}
				// 样式
				/*if (isShow) {
					this.originalPartwidth = ($('tablePart').offsetWidth - $('eigenPart').offsetWidth - 305);
				}
				else {
					this.originalPartwidth = this.originalPartwidth + 202;
				}*/
				this.$store.commit('SET_SELECTION', selection);
			},

			/**
			 * 显示tip
			 * 
			 * @param {Object} row 行信息
			 * @param {Object} column 列信息
			 * @param {Object} cell 单元信息
			 * @param {Object} event 事件对象
			 */
			showTip (row, column, cell, event) {
				if (this.targetId) {
					return;
				}
				setTimeout(() => {
					row.showTip = true;
				}, 0)
				
			},

			/**
			 * 隐藏tip
			 *
			 * @param {Object} row 行信息
			 * @param {Object} column 列信息
			 * @param {Object} cell 单元信息
			 * @param {Object} event 事件对象
			 */
			hideTip (row, column, cell, event) {
				row.showTip = false;
			},

			/**
			 * 选择目标
			 *
			 * @param {Object} row 行信息
			 */
			chooseTarget (row) {
				this.$emit('setTarget', {value: row.name, id: row.feature_id, type: row.type });
			},

			/**
			 * 设置数据类型
			 *
			 * @param {Object} command 数据类型对象
			 */
			selectDataType (command) {
				const row = command.n;
				row.type = command.v;
				row.typeValue = values[command.v];

				const params = {
					type: parseInt(row.type)
				};

				// 更新数据类型
				updateFeature(row.feature_id, params).then(data => {
					const { error } = data;
					if (error) {
						this.$message.error('修改失败！' + error.desc);
						return;
					}
					this.getFeatureData(this.$store.state.trainObj.featureListId, { project_id: this.projectId });
				})
			},

			/**
			 * 展开显示图标等数据详情
			 *
			 * @param {Object} row 行信息
			 * @param {Object} expandRows 展开行信息
			 */
			expand (row, expandRows) {
				console.log('uuu');
				console.log(expandRows);
				setTimeout(() => {
					row.isShow = row.isShow || false;
					if (row.isShow) {
						row.isShow = false;
						return;
					}
					row.isShow = true;
					this.showData('dataDistr', row);
				}, 0)
				
			},

			/**
			 * 显示数据信息，数据分布或者topn
			 *
			 * @param {string} tag 展示部分标识
			 * @param {Object} row 行信息
			 */
			showData (tag, row) {
				const id = `dataShow${row.feature_id}`;
				if (tag !== 'topn') {
					this.topn = '#666';
					this.dataDistr = '#0d68c4';
					// @TODO task_id
					const params = {};
					if (this.taskId) {
						params.task_id = this.taskId;
					}
					getFeatureDistr(row.feature_id, params).then(data => {
						const { error, histogram, topn } = data;
						if (error) {
							this.$message.error(error.desc);
							return;
						}
						const xData = {
							type: row.type,
							value: [],
							freq: []
						};
						const len = histogram.length;
						for (let i = 0; i < len; i++) {
							const item = histogram[i];
							xData.value.push(item.value);
							xData.freq.push(item.freq);
						}
						drawChart(id, xData);
					})
				}
				else {
					this.dataDistr = '#666';
					this.topn = '#0d68c4';
					const params = {};
					if (this.taskId) {
						params.task_id = this.taskId;
					}
					getFeatureDistr(row.feature_id, params).then(data => {
						const { error, histogram, topn } = data;
						if (error) {
							this.$message.error(error.desc);
							return;
						}
						console.log(data);
						const xData = {
							type: row.type,
							value: [],
							freq: [],
							barWidth: '20%'
						};
						const len = histogram.length;
						xData.barWidth = (40 - (len - 2) * 2) + '%';
						const histogramSort = histogram.sort((a, b) => {
							return a.freq - b.freq;
						})

						for (let i = 0; i < Math.min(len, 50); i++) {
							const item = histogramSort[i];
							xData.value.push(item.value);
							xData.freq.push(item.freq);
						}
						drawDistr(id, xData);
					})
				}
			},
			showEigen (event) {
				console.log(event.target);
				this.isEigenActive = true;
			}
		},
		mounted () {
			console.log('height: ' + this.maxHeight);
			obj = this;
			this.$store.commit('SET_PROJECT_ID', this.projectId);
			this.eigenData = this.$store.state.eigenData;
			this.$store.commit('SET_TRAIN_STATUS', false);
			//this.originalPartwidth = ($('tablePart').offsetWidth - $('eigenPart').offsetWidth - 100);
			const setListInput = document.getElementById('setListInput');
			setListInput.onkeypress = (event) => {
				if (event.charCode != 13) {
					return;
				}
				this.setList();
			}
		}
	}
</script>




