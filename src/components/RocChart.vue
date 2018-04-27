<template>
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
				<div :id="'roc' + id" style="background: red; height: 350px;">
					
				</div>
			</el-col>
			<el-col :span="13">
				<div :id="'distribution' + id" style="background: green; height: 350px;">
				</div>
			</el-col>
		</div>
	</div>
</template>
<style lang="scss">
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
			color: #fff;
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
</style>
<script>
	import echarts from 'echarts'

	function drawChart (id, data) {
		const chart = echarts.init(document.getElementById(id));
		const option ={
			xAxis: {
		        type: 'category',
		        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
		    },
		    yAxis: {
		        type: 'value'
		    },
		    series: [{
		        data: [820, 932, 901, 934, 1290, 1330, 1320],
		        type: 'line'
		    }]
		};
		chart.setOption(option);
	}
	function drawDistr (id, data) {
		const chart = echarts.init(document.getElementById(id));
		var colors = ['#5793f3', '#d14a61', '#675bba'];

		const option ={
			color: colors,

		    tooltip: {
		        trigger: 'none',
		        axisPointer: {
		            type: 'cross'
		        }
		    },
		    legend: {
		        data:['2015 降水量', '2016 降水量']
		    },
		    grid: {
		        top: 70,
		        bottom: 50
		    },
		    xAxis: [
		        {
		            type: 'category',
		            axisTick: {
		                alignWithLabel: true
		            },
		            axisLine: {
		                onZero: false,
		                lineStyle: {
		                    color: colors[1]
		                }
		            },
		            axisPointer: {
		                label: {
		                    formatter: function (params) {
		                        return '降水量  ' + params.value
		                            + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
		                    }
		                }
		            },
		            data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
		        },
		        {
		            type: 'category',
		            axisTick: {
		                alignWithLabel: true
		            },
		            axisLine: {
		                onZero: false,
		                lineStyle: {
		                    color: colors[0]
		                }
		            },
		            axisPointer: {
		                label: {
		                    formatter: function (params) {
		                        return '降水量  ' + params.value
		                            + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
		                    }
		                }
		            },
		            data: ["2015-1", "2015-2", "2015-3", "2015-4", "2015-5", "2015-6", "2015-7", "2015-8", "2015-9", "2015-10", "2015-11", "2015-12"]
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value'
		        }
		    ],
		    series: [
		        {
		            name:'2015 降水量',
		            type:'line',
		            xAxisIndex: 1,
		            smooth: true,
		            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
		        },
		        {
		            name:'2016 降水量',
		            type:'line',
		            smooth: true,
		            data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
		        }
		    ]
		};
		chart.setOption(option);
	}
	export default {
		props: ['id'],
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
				]
			}
		},
		mounted () {
			console.log('in roc');
			// data
			drawChart('roc' + this.id);
			drawDistr('distribution' + this.id);
		},
		methods: {

		}
	}
</script>





