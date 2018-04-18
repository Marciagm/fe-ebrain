<template>
	<div class="data-loading">
		<div class="uploading">
			<div ref="info-left" class="uploading-left">
				<div class="target">
					<div style="display: inline-block; width: 210px; margin-right: 80px;">
						<div class="target-label" for="target">输入预测目标</div>
						<input class="target-input" v-model="target" type="" placeholder="输入预测目标" name="target" @change="showBar">
					</div>

					<div class="chart-con">
						<div id="bar-chart"></div>
					</div>					
					<button class="start-run">启动训练</button>
				</div>

				<!-- 显示高级选项 -->
				<div style="margin-bottom: 21px; text-align: center;">
					<div @click="advancedOption" style="cursor: pointer; width: 20%; margin-left: 40%">
						<span style="font-size: 12px; color: #666; letter-spacing: 1px;">显示高级选项</span>
						<img v-if="!showAdvancedOption" src="../images/Down-arrow-small.png">
						<img v-else src="../images/Down-arrow-small.png" style="transform:rotate(180deg);">
					</div>

					<div v-show="showAdvancedOption" style="width: 100%; height: 642px; padding-top: 57px;">
						<div style="text-align: left; width: 40%; padding-left: 30%;">
							<advanced-option></advanced-option>
						</div>						
					</div>
				</div>

				<div id="tables">
					<div style="text-align: left; padding-left: 2%;">
						<div style="padding-left: 14px;padding-right: 14px;display: inline-block; border: 1px solid #eee; border-bottom: 0px; height: 41px; line-height: 41px;" >
							<img src="../images/All-features.png" style="width: 13px; height: 13px;margin-right: 5px;">
							<span style="color: #333; font-size: 14px;letter-spacing: 1px;" @click="tab('detail')">特征详情</span>
							<el-autocomplete
						      v-model="state1"
						      :fetch-suggestions="querySearch"
						      placeholder="搜索"
						      @select="search"
						      style="height: 15px; border: 0; text-align: center; font-size: 12px;"
						    ></el-autocomplete>	
							<el-dropdown style="cursor: pointer;">
							  <span class="el-dropdown-link">
							    <span>全部特征</span>
							    <span style="color: #666; font-size: 10px;">(特征列表)</span>
							    <i class="el-icon-arrow-down el-icon--right"></i>
							  </span>
							  <el-dropdown-menu slot="dropdown">
							    <el-dropdown-item>全部特征</el-dropdown-item>
							    <el-dropdown-item divided>特征列表二</el-dropdown-item>
							    <el-dropdown-item>特征列表三</el-dropdown-item>
							    <el-dropdown-item>特征列表四</el-dropdown-item>
							    <el-dropdown-item>特征列表五</el-dropdown-item>
							  </el-dropdown-menu>
							</el-dropdown>
						</div>
						<div style="width: 50%;display: inline-block; vertical-align: top; border-bottom: 1px solid #eee; height: 41px; line-height: 41px; padding-left: 45px; cursor: pointer" @click="tab('original')">
							<img src="../images/Original-data.png" style="margin-right: 5px;" >
							<span style="color: #333; font-size: 14px;letter-spacing: 1px;" >原始数据</span>
						</div>
					</div>
					<div style="margin-top: 19px; margin-bottom: 20px;height: 500px;">
						<!-- 特征详情 -->
						<div v-if="!isOriginal">
							<eigenvalue-table v-on:setTarget="showBar"></eigenvalue-table>
						</div>
						
						<!-- 表格部分 -->
						<div style="width: 94%; margin-left: 3%;" v-if="isOriginal">
							<original-data :max-height="maxHeight"></original-data>
						</div>
					</div>
					
				</div>
				<div class="data-foot">
					{{ filename }}
				</div>
			</div>

			<div ref="info-right" class="uploading-right">
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
					<div class="progress-bar" style="width: 100%; background: #eee;" v-if="progressOk">
						<div class="progress-bar" :style="{width: uploadProgress}"></div>
					</div>
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
	table {
		border: 0;
	}
	.el-autocomplete-suggestion li {
		font-size: 12px;
	}
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
			font-size: 14px;
			color: #333;
			padding-left: 18px;
			margin-top: 24px;
			width: 192px;
			height: 50px;
			background-color: #ffffff;
			box-shadow: 0px 4px 6px 0px 
				rgba(0, 0, 0, 0.06);
			border-radius: 4px;
			border: solid 1px #eeeeee;
		}
		.chart-con {
			display: inline-block;
			vertical-align: top;
			width: 678px;
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
		
		.start-run {
			width: 127px;
			height: 51px;
			outline: none;
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
			border-radius: 4px;
			font-size: 20px;
			letter-spacing: 2px;
			color: #ffffff;
		}
	}
	#tables {
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
			background: #fafafa
		}
		.el-table--striped .el-table__body tr.el-table__row--striped td {
			background-color: #f5f5f5;
			border: 0;
		}
		.el-table td, .el-table th.is-leaf {
			border: 0;
		}
		.target-tip {
			float: right;
			font-size: 12px;
			color: #1b7bdd;
			cursor: pointer;
			height: 100%;
		}
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
	import advancedOption from '@/components/AdvancedOption'
	import originalData from '@/components/OriginalData'
    import eigenvalueTable from '@/components/EigenvalueTable'

	export default {
		components: {
			advancedOption,
			originalData,
			eigenvalueTable
		},
		data () {
			return {
				isOriginal: false,
				progressOk: true,
				testPercent: 0,
				varifyNum: 0,
				showAdvancedOption: false,
				restaurants: [],
				state1: '',
				filename: '',
				searchItem: '',
				maxHeight: 500,
				uploadProgress: '0%',
				target: ''
			}
		},
		methods: {
			querySearch(queryString, cb) {
		        var restaurants = this.restaurants;
		        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
		        // 调用 callback 返回建议列表的数据
		        cb(results);
		    },
			search (item) {
				if (item && item.value) {
					document.getElementById(item.value).scrollIntoView();
				}
			},
			advancedOption () {
            	this.showAdvancedOption = !this.showAdvancedOption;
			},
			tab (tag) {
				if (tag === 'detail') {
					this.isOriginal = false;
				}
				else {
					this.isOriginal = true;
				}
			},
			showBar (target) {
				this.target = target;
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
				            data: [5, 20, 36, 10, 10]
				        }
		            ]
		        };
				barChart.setOption(option);

			}
		},
		mounted () {
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            //this.$refs.left.style.height = (h - 88) + 'px';
            //this.$refs.right.style.height = (h - 88) + 'px';
            this.maxHeight = (h - 500);
            this.uploadProgress = '30%';
            this.filename = this.$store.state.filename;
            this.$store.commit('SET_PROJECT_STATUS', true);
		}
	}
</script>



