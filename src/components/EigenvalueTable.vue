<template>
	<el-table
		align="center"
		stripe
	    ref="multipleTable"
	    :data="tableData3"
	    tooltip-effect="light"
	    style="width: 94%; margin-left: 2%;"
	    :max-height="maxHeight"
	    @cell-mouse-enter="showTip"
	    @cell-mouse-leave="hideTip"
	    @expand-change="expand"
	    show-overflow-tooltip
	    >
	    <el-table-column
	      type="selection">
	    </el-table-column>
	     <el-table-column
	      type="expand"
	    >
	    <template slot-scope="props">
	    	<!-- nav part -->
	    	<div class="eigen-detail-nav">
	    		<button class="nav-item" :style="{color: dataDistr}" @click="showData('dataDistr', props.row)">数据分布</button>
	    		<div class="nav-sep"></div>
	    		<button class="nav-item" :style="{color: topn}" @click="showData('topn', props.row)">TopN</button>
	    	</div>
	    	<div id="dataShow"></div>

	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="date"
	      label="特征名称"
	      sortable
	      width="220"
	     >
	      <template slot-scope="props" style="text-align: left;">
	      	<div :id="props.row.date" style=" height: 49px; line-height: 49px;">
	      		<span >{{ props.row.date }}</span>
	      		<span v-show="props.row.showTip" class="target-tip" @click="chooseTarget(props.row.date)">选该特征值为目标</span>
	      	</div>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="name"
	      label="列号"
	      sortable
	    >
	    </el-table-column>
	    <el-table-column
	      prop="dataType"
	      sortable
	      label="数据类型"
	      width="120"
	      show-overflow-tooltip>
	      <template slot-scope="props" style="text-align: left;">
	      	<el-dropdown trigger="click"  style="font-size: 12px; color: #333; cursor: pointer;" @command="selectDataType">
		      	<span>
				    {{ props.row.dataType }}
				    <i class="el-icon-arrow-down el-icon--right"></i>
				</span>
		      	<el-dropdown-menu slot="dropdown">
				    <el-dropdown-item :command="{v: '离散', n: props.row}"> 离散</el-dropdown-item>
				    <el-dropdown-item :command="{v: '连续', n: props.row}"> 连续</el-dropdown-item>
				    <el-dropdown-item :command="{v: '时间', n: props.row}"> 时间</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      label="特征个数"
	      width="120"
	      sortable
	      show-overflow-tooltip>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      sortable
	      label="缺失值"
	      show-overflow-tooltip>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      sortable
	      label="总和"
	      show-overflow-tooltip>
	    </el-table-column>							    
	    <el-table-column
	      prop="fnum"
	      label="最大值"
	      show-overflow-tooltip>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      label="最小值"
	      show-overflow-tooltip>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      label="众数"
	      show-overflow-tooltip>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      label="平均数"
	      show-overflow-tooltip
	      >
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      label="方差"
	      show-overflow-tooltip>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      label="偏度"
	      show-overflow-tooltip>
	    </el-table-column>
	</el-table>		
</template>
<style lang="scss">
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
	#dataShow {
		width: 400px;
		height: 316px;
	}
</style>
<script>
	import echarts from 'echarts'

	export default {
		mounted () {
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            //this.$refs.left.style.height = (h - 88) + 'px';
            //this.$refs.right.style.height = (h - 88) + 'px';
            this.maxHeight = 600;
		},
		data () {
			return {
				dataDistr: '#0d68c4',
				topn: '#666',
				maxHeight: 0,
				tableData3: [{
			          date: 'gender',
			          name: '张小虎',
			          dataType: '离散',
			          fnum: 15,
			          showTip: false
			        }, {
			          date: '-02',
			          name: 'a小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '3016-04',
			          name: 'b小虎',
			          dataType: '离散',
			          fnum: 122,
			          showTip: false
			        }, {
			          date: '-01',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '-08',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '-06',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 120,
			          showTip: false
			        }, {
			          date: '-07',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '-06',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 120,
			          showTip: false
			        }, {
			          date: '2016-07',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '2016-06',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 120,
			          showTip: false
			        }, {
			          date: '2016-07',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '2016-06',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 120,
			          showTip: false
			        }, {
			          date: '2016-07',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '2016-06',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 120,
			          showTip: false
			        }, {
			          date: '2016-05-07',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 120000,
			          showTip: false
			        }
			    ],
		        multipleSelection: []
			}
		},
		methods: {
			showTip (row, column, cell, event) {
				//if (!row.showTip && column.property === 'date') {
					row.showTip = true;	
				//}
				//else {
				//	row.showTip = false;
				//}
			},
			hideTip (row, column, cell, event) {
				row.showTip = false;
			},
			chooseTarget (value) {
				this.$emit('setTarget', value);
			},
			selectDataType (command) {
				command.n.dataType = command.v;
				// 此处有接口
			},
			expand (row, expandRows) {
				console.log(row);
				console.log(expandRows);
				setTimeout(() => {
					this.showData('dataDistr', expandRows);
				}, 0)
				
			},
			showData (tag, row) {
				
				if (tag !== 'topn') {
					var dataShow = document.getElementById('dataShow');
					let chart = echarts.init(dataShow);
					this.topn = '#666';
					this.dataDistr = '#0d68c4';
					let option = {
						color: '#71b2f3',
			            title: {
			                text: 'ECharts 入门示例',
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
					            barWidth: '40%',
					            data: [5, 20, 36, Math.random() * 20 + 10, 10],
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
				else {
					var dataShow = document.getElementById('dataShow');
					let chart = echarts.init(dataShow);
					this.dataDistr = '#666';
					this.topn = '#0d68c4';
					let option = {
					    title: {
					        text: '特征名',
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
					        boundaryGap: [0, 0.01],
					        axisLabel: {
					        	color: '#ccc',
					        	textStyle: {
					        		color: '#fff'
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
					        data: ['巴西','印尼','美国','印度','中国','世界人口(万)'],
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
					            name: '2011年',
					            type: 'bar',
					            color: '#000',
					            data: [18203, 23489, 29034, 104970, 131744, 630230],
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
					            barWidth: 10,
					            barMaxWidth: 30
					        }/*,
					        {
					            name: '2012年',
					            type: 'bar',
					            data: [19325, 23438, 31000, 121594, 134141, 681807]
					        }*/
					    ]
					};
					chart.setOption(option);
				}

			}
		}
	}
</script>




