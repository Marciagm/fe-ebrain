<template>
	<div class="data-deal">
		<div class="uploading">

			<div ref="left" class="uploading-left">
				<div class="target">
					<div style="display: inline-block; width: 210px; margin-right: 80px;">
						<div class="target-label" for="target">输入预测目标</div>
						<input class="target-input" v-model="target" type="" placeholder="输入预测目标" name="target">
					</div>
					<div id="bar-chart"></div>
					<button>启动训练</button>
				</div>

				<div>
					<div>数据报告 搜索 全部特征 原始数据</div>
					<div style="margin-top: 30px">
						<label>
							<button @click="search">搜索</button>
							<input type="" name="" v-model="searchItem">
						</label>
						<el-table
							align="center"
							stripe
						    ref="multipleTable"
						    :data="tableData3"
						    tooltip-effect="light"
						    style="width: 94%; margin-left: 1%;"
						    :max-height="maxHeight"
						    @cell-mouse-enter="showTip"
						    @cell-mouse-leave="hideTip"
						    show-overflow-tooltip
						    >
						    <el-table-column
						      type="selection">
						    </el-table-column>
						     <el-table-column
						      type="expand"
						    >
						    <template slot-scope="props">
						        <el-form label-position="left" inline class="demo-table-expand">
						          <el-form-item label="商品名称">
						            <span>{{ props.row.name }}</span>
						          </el-form-item>
						          <el-form-item label="店铺地址">
						            <span>{{ props.row.address }}</span>
						          </el-form-item>
						          <el-form-item label="商品描述">
						            <span>{{ props.row.desc }}</span>
						          </el-form-item>
						        </el-form>
						      </template>
						    </el-table-column>
						    <el-table-column
						      prop="date"
						      label="特征名称"
						      sortable
						      width="220"
						     >
						      <template slot-scope="props" style="text-align: left;">
						      	<span :id="props.row.date">{{ props.row.date }}</span>
						      	<span v-show="props.row.showTip" class="target-tip" @click="chooseTarget(props.row.date)">选该特征值为目标</span>
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
					</div>
				</div>
			</div>
			<div ref="right" class="uploading-right">
				<div class="loading-progress">
					<div class="load-progress-border" style="top: 0;"></div>
					<div class="loading-progress-con progress-bg"></div>
					<div class="loading-progress-con offset">
						<div>1.上传数据</div>
						<span class="load-progress-status">(2.5s)</span>
					</div>
					<img src="../images/finish.png" class="load-effect">
					<div class="load-progress-border"></div>
				</div>
				
				<div class="loading-progress">
					<div class="load-progress-border" style="top: 0;"></div>
					<div class="loading-progress-con progress-bg"></div>
					<div class="loading-progress-con offset">
						<div>2.生产数据画像</div>
						<span class="load-progress-status">(2.5s)</span>
					</div>
					<img src="../images/finish.png" class="load-effect">
					<div class="load-progress-border"></div>
				</div>
				<div class="loading-progress">
					<div class="load-progress-border" style="top: 0;"></div>
					<div class="progress-bar" :style="{width: uploadProgress}"></div>
					<div class="loading-progress-con progress-bg" :style="{width: uploadProgress}"></div>
					<div class="loading-progress-con offset">
						<div>2.生成数据画像</div>
						<span class="load-progress-status">已完成{{ uploadProgress }}</span>
					</div>
					<img src="../images/loading.gif" class="load-effect">
				</div>


			</div>
		</div>
	</div>	
</template>
<style lang="scss">

	.target {
		height: 300px;
		width: 100%;
		text-align: left;
		padding-left: 1%;
		.target-label {
			margin-top: 87px;
			font-size: 20px;
			font-weight: normal;
			letter-spacing: 2px;
			color: #333;
		}
		.target-input {
			margin-top: 24px;
			width: 210px;
			height: 50px;
			background-color: #ffffff;
			box-shadow: 0px 4px 6px 0px 
				rgba(0, 0, 0, 0.06);
			border-radius: 4px;
			border: solid 1px #eeeeee;
		}
		#bar-chart {
			text-align: center;
			display: inline-block; 
			vertical-align: top; 
			width: 678px; 
			height: 200px;
			background: red;
		}
	}
	.el-table {
		color:  #333;
		font-size: 12px;
	}
	.el-table thead {
		color: #333;
		letter-spacing: 1px;
		text-align: center;
		font-weight: normal;
	}
	.el-table tr {
		background: #fafafa
	}
	.el-table--striped .el-table__body tr.el-table__row--striped td {
		background-color: #f5f5f5;
		border: 0;
	}
	.el-table td, .el-table th.is-leaf {
		border: 0;
	}
	.data-con { 
		padding-top: 60px;
		height: 686px;
		text-align: center;
		img {
			margin-top: 38px;
			width: 306px;
			height: 296px;
			margin-bottom: 55px;
		}
		button {
			border: 0;
			width: 116px;
			height: 47px;
			background-image: linear-gradient(90deg, 
				#0d65be 0%, 
				#1978d9 45%, 
				#248bf4 100%), 
			linear-gradient(
				#cccccc, 
				#cccccc);
			border-radius: 4px;
			color: #ffffff;
			font-size: 16px;
			margin-right: 110px;
		}
		.data-deal-button {
			text-align: center;
		}
	}
	.target-tip {
		float: right;
		font-size: 12px;
		color: #1b7bdd;
		cursor: pointer;
		height: 100%;
	}
	.info-feature {
		display: inline-block;
		overflow: hidden; 
		width: 80px; 
		white-space:nowrap; 
		text-overflow: ellipsis;
	}
	.info-feature:hover {
		text-overflow:inherit;
		overflow:visible;
	}
	.el-tooltip__popper.is-dark {
		background: #187fe8;
	}
	.el-dropdown-menu__item {
		font-size: 12px;
	}
</style>
<script>
	import echarts from 'echarts'

	export default {
		data () {
			return {
				searchItem: '',
				maxHeight: 500,
				uploadProgress: '0%',
				processProgress: '0%',
				target: '',
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
		          fnum: 12,
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
		        }],
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
				this.target = value;
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
				            barWidth: '60%',
				            data: [5, 20, 36, 10, 10]
				        }
		            ]
		        };
				barChart.setOption(option);
			},
			selectDataType (command) {
				command.n.dataType = command.v;
				// 此处有接口
			},
			search () {
				document.getElementById(this.searchItem).scrollIntoView();

			}
		},
		mounted () {
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.$refs.left.style.height = (h - 88) + 'px';
            this.$refs.right.style.height = (h - 88) + 'px';
            this.maxHeight = (h - 388);
            console.log(this.maxHeight);
            this.chooseTarget('1222')
            this.uploadProgress = '30%';
		}
	}
</script>