<template>
	<div>
		<el-row style="margin-left: 36px;">
			<el-col :span="14" class="model-table-data">
				<el-col :span="3" v-for="item in basicIndex">
					<div class="basic-index-key">
						<div class="key">{{ item.key || "F score"}}</div>
					</div>
					
					<div class="basic-index-value">{{ item.value }} </div>
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
								<div style="margin-right: 3px;" class="cross">{{ predictValues.tp }}(TP)</div>
							</td>
							<td class="hilight">
								<div class="cross">{{ predictValues.fn }}(FN))</div>
							</td>
							<td class="bb">{{ predictValues.num5 }}</td>
						</tr>
						<tr>
							<td class="td bb" style="font-size: 18px;">-</td>
							<td class="hilight">
								<div style="margin-right: 3px;" class="crossN">{{predictValues.fp}}(FP))</div>
							</td>
							<td class="hilight">
								<div class="crossN">{{predictValues.tn}}(TN)</div>
							</td>
							<td class="bb">{{predictValues.num4}}</td>
						</tr>
						<tr>
							<td class="td br"></td>
							<td class="br">{{ predictValues.num1 }}</td>
							<td class="br">{{ predictValues.num2 }}</td>
							<td class="td">{{ predictValues.num3 }}</td>
						</tr>
					</table>
				</div>
			</el-col>
		</el-row>
		<div style="margin-top: 75px;">
			<el-col :span="11">
				<div :id="'roc' + id" style="height: 350px;">
					
				</div>
			</el-col>
			<el-col :span="13">
				<div :id="'distribution' + id" style="height: 350px;">
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
		background: '#fff';
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
	import { getModelData } from '@/api/api'
	let obj;
	function drawChart (id, data, matrices, disData) {
		console.log(data);
		const chart = echarts.init(document.getElementById(id));
		const option = {
			color: ['#589de2', '#deac2c'],
		    title: {
		        text: 'ROC曲线',
		        textStyle: {
		        	color: '#333',
		        	fontSize: 14
		        },
		        padding: [0, 0, 20, 50],
		        subtext: '数据源：测试集'
		    },
		    extra: data.tprs,
		    tooltip: {
		        trigger: 'axis',
		        formatter (data) {
		        	const dataIndex = data[0].dataIndex;
		        	const item = matrices[dataIndex];
		        	obj.setBasicIndex(item);		        	
		        	let tn = parseInt(item.tn);
		        	let tp = parseInt(item.tp);
		        	let fn = parseInt(item.fn);
		        	let fp = parseInt(item.fp);

		        	obj.predictValues.tn = tn;
		        	obj.predictValues.fp = fp;
					obj.predictValues.fn = fn;
		        	obj.predictValues.tp = tp;

		        	obj.predictValues.num1 = tp + fp;
					obj.predictValues.num2 = fn + tn;
					
					obj.predictValues.num4 = tn + fp;
					obj.predictValues.num5 = fn + tp;
					obj.predictValues.num3 = tn + tp + fn + fp;

		        	disData.poniter = dataIndex;
		        	disData.probability = item.probability;

		        	drawDistr('distribution' + obj.id, disData, matrices);
		        	return `fpr: ${item.fpr} <br> tpr: ${item.tpr}`;
		        },
		    },
		    legend: {
		        //data:['K值', 'S值'],
		        itemGap: 15,
		        align: 'left',
		        orient: 'vertical',
		        x: 'right',
		        y: 'center',
		        itemWidth: 10,  //图例标记的图形宽度
    			itemHeight: 10, //图例标记的图形高度
		        padding: [0, 0, 150, 0],
		        textStyle: {
		        	color: '#333',
		        	fontSize: '14'
		        },
		        show: false
		    },
		    grid: {
		        left: '13%',
		        right: '26%',
		        bottom: '15%',
		        containLabel: true,
		        show: false
		    },
		    toolbox: {
		        feature: {
		            //saveAsImage: {}
		        }
		    },
		    xAxis: {
		        //type: 'category',
		        boundaryGap: false,
		        //data: data.fprs,
		        name: '负正类率（FPR）',
		        nameLocation: 'middle',
		        nameGap: 25,
		        min: 0,
		        max: 1,
		        splitNumber: 10,
		        splitLine: {
		            show: false
		        },
		        //data: [0, 0.3, 0.8, 0.9],
		        axisLabel: {
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
		    yAxis: {
		        splitLine: {
		    		// false 时没有网格线
		    		//show: true
		    		show: false
		    	}, 
		    	//data: data.tprs,
		        name: '真正类率（TPR）',
		        nameLocation: 'middle',
		        nameGap: 35,
		        nameRotate: -90,
		        type: 'value',
		        color: '#fff',
		        axisLine: {
		        	lineStyle: {
		        		color: '#ccc',
		        		width: 2
		        	}
		        }
		    },
		    series: [
		        {
		            type:'line',
		            smooth: true,
		            //data: data.tprs,
		            data: data,
		            //data: data.fprs,
		            symbol: 'circle',
		            symbolSize: 2,
		            lineStyle: {
		                normal: {
		                	color: '#589de2',
		                    width: 2,
		                    shadowColor: 'rgba(50, 19, 0, 0.2)',
		                    shadowBlur: 10,
		                    shadowOffsetY: 10
		                },
		                emphasis: {
			                // color: 各异,
			                label: {
			                    show: false
			                    // position: 默认自适应，水平布局为'top'，垂直布局为'right'，可选为
			                    //           'inside'|'left'|'right'|'top'|'bottom'
			                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
			                }
			            }
		            },

		        }
		    ]
		};
		chart.setOption(option);
	}

	function drawDistr (id, data, matrices) {
		console.log(data.blue);
		const chart = echarts.init(document.getElementById(id));
		var colors = ['#5793f3', '#d14a61', '#675bba'];

		const option = {
			color: ['#589de2', '#deac2c'],
		    title: {
		        text: '目标分布图',
		        textStyle: {
		        	color: '#333',
		        	fontSize: 14
		        },
		        padding: [0, 0, 20, 50],
		        subtext: '预估概率（0～1): ' + data.probability,
		    },
		    tooltip: {
		        trigger: 'axis',
		        formatter (param) {
		        	return `ppr: ${param[0].value[1]}<br>pnr: ${param[1].value[1]}`;
		        },
		        axisPointer: { 
		            value: data.poniter,
		            snap: true,
		            lineStyle: {
		                color: '#ccc',
		                opacity: 1,
		                width: 1
		            },
		            label: {
		                show: false,
		                formatter: function (params) {

		                    return params.value;
		                },
		                //backgroundColor: 'red'
		            },
		            handle: {
		                show: true,
		                size: 0,
		                //show: false,
		                //color: '#004E52'
		                color: '#fff'
		            }
		        },
		    },
		    legend: {
		        //data:['K值', 'S值'],
		        itemGap: 15,
		        align: 'left',
		        orient: 'vertical',
		        x: 'right',
		        y: 'center',
		        itemWidth: 10,  //图例标记的图形宽度
    			itemHeight: 10, //图例标记的图形高度
		        padding: [0, 0, 150, 0],
		        textStyle: {
		        	color: '#333',
		        	fontSize: '14'
		        },
		        show: false
		    },
		    grid: {
		        left: '13%',
		        right: '26%',
		        bottom: '13%',
		        containLabel: true,
		        show: false
		    },
		    toolbox: {
		        feature: {
		            //saveAsImage: {}
		        }
		    },
		    xAxis: {
		        //type: 'category',
		        boundaryGap: false,
		        //data: data.probabilities,
		        //name: '预估概率',
		        nameLocation: 'middle',
		        nameGap: 25,
		        min: 0,
		        max: 1,
		        splitLine: {
		        	show: false,
		        },
		        splitNumber: 10,
		        //data: [0, 0.3, 0.8, 0.9],
		        axisPointer: { 
		            value: data.poniter,
		            snap: true,
		            //snap: false,
		            lineStyle: {
		                color: '#ccc',
		                opacity: 1,
		                width: 1
		            },
		            label: {
		            	fontSize: 8,
		                show: false,
		                formatter: function (params) {

		                	return params.value;
		                }
		            },
		            handle: {
		                show: true,
		                size: 0,
		                //show: false,
		                //color: '#004E52'
		                color: '#fff'
		            }
		        },
		        axisLabel: {
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
		    yAxis: {
		        splitLine: {
		    		// false 时没有网格线
		    		//show: true
		    		show: false
		    	},
		        name: '样本比例',
		        nameLocation: 'middle',
		        nameGap: 35,
		        nameRotate: -90,
		        type: 'value',
		        color: '#fff',
		        axisLine: {
		        	lineStyle: {
		        		color: '#ccc',
		        		width: 2
		        	}
		        }
		    },
		    series: [
		        {
		            name:'样本比例',
		            type:'line',
		            //data: data.ratios,
		            data: data.blue,
		            symbol: 'circle',
		            symbolSize: 2,
		            lineStyle: {
		                normal: {
		                	color: '#589de2',
		                    width: 2,
		                    shadowColor: 'rgba(50, 19, 0, 0.2)',
		                    shadowBlur: 10,
		                    shadowOffsetY: 10
		                },
		                emphasis: {
			                // color: 各异,
			                label: {
			                    show: false
			                    // position: 默认自适应，水平布局为'top'，垂直布局为'right'，可选为
			                    //           'inside'|'left'|'right'|'top'|'bottom'
			                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
			                }
			            }
		            }
		        },
		        {
		            name:'预估概率',
		            type:'line',
		            //data: data.probabilities,
		            data: data.yellow,
		            symbol: 'circle',
		            symbolSize: 2,
		            lineStyle: {
		                normal: {
		                	color: '#deac2c',
		                    width: 2,
		                    shadowColor: 'rgba(5, 0, 50, 0.2)',
		                    shadowBlur: 10,
		                    shadowOffsetY: 10
		                },
		                emphasis: {
			                // color: 各异,
			                label: {
			                    show: false
			                    // position: 默认自适应，水平布局为'top'，垂直布局为'right'，可选为
			                    //           'inside'|'left'|'right'|'top'|'bottom'
			                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
			                }
			            }
		            },
		        },
		        {
		        	type: 'line',
		        	markLine: {
		        		symbol: 'diamond',
		        		symbolSize: 0,
		                itemStyle: {
		                    normal: {
		                        borderWidth: 1,
		                        lineStyle: {
		                            type: 'dash',
		                            //color: '#333 ',
		                            color: '#ed0101',
		                            width: 1,
		                        },

		                        label: {
		                            formatter: '',
		                            textStyle: {
		                                fontSize: 16,
		                                fontWeight: "bolder",
		                            },
		                        }
		                    },

		                },
		                data:  [
		                    [{
		                        coord: [data.index, 0]
		                    }, {
		                        coord: [data.index, 1]
		                    }]
		                ]
		            }
		        }
		    ]
		};
		chart.setOption(option);
	}

	export default {
		props: ['id'],
		data () {
			return {
				predictValues: {
					fn: '',
					fp: '',
					tn: '',
					tp: '',
					num1: '1',
					num2: '2',
					num3: '3',
					num4: '4',
					num5: '5'
				},
				auc: '',
				maxFscoreIndex: '',
				basicIndex: [
					{
						key: 'F score',
						id: 0,
						value: ''
					},
					{
						key: 'AUC',
						id: 1,
						value: ''
					},
					{
						key: '真正类率(TPR)',
						id: 2,
						value: ''
					},
					{
						key: '负正类率(FPR)',
						id: 3,
						value: ''
					},
					{
						key: '真负类率',
						id: 4,
						value: ''
					},
					{
						key: '阳性预测值',
						id: 5,
						value: ''
					},
					{
						key: '阴性预测值',
						id: 6,
						value: ''
					},
					{
						key: '准确率',
						id: 7,
						value: ''
					}
				]
			}
		},
		mounted () {
			obj = this;
			// data
			getModelData(this.id).then(data => {
				const { error, confusion_matrices, auc, max_fscore_index } = data;

				const rocData = {
					tprs: [],
					fprs: []
				};
				const newRocdata = [];
				/*const disData = {
					probabilities: [],
					ratios: []
				};*/

				if (error) {
					this.$message.error(error.desc);
					return;
				}
				this.auc = auc;
				const matricesSortByFpr = confusion_matrices.sort((a, b) => {
					return a.fpr - b.fpr;
				});
				let matricesAsc = [];
				for (let i = 0, len = matricesSortByFpr.length; i < len; i++) {
					const item = matricesSortByFpr[i];
					rocData.tprs.push(item.tpr);
					rocData.fprs.push(item.fpr);
					newRocdata.push([item.fpr, item.tpr]);
					matricesAsc.push(item);
				}
				this.setBasicIndex(matricesAsc[0]);

				/*const matricesSortByp = confusion_matrices.sort((a, b) => {
					return a.probability - b.probability;
				});*/
				const matricesSortByp = confusion_matrices;
				console.log(matricesSortByp);
				const disData = {
					blue: [],
					yellow: []
				}
				for (let i = 0, len = matricesSortByp.length; i < len; i++) {
					const item = matricesSortByp[i];
					//disData.probabilities.push(item.probability);
					// @TODO check
					//disData.ratios.push(item.tpr);
					console.log('pp: ' + item.probability + ' ppr: ' + item.ppr + '  pnr: ' + item.pnr);
					
					disData.blue.push([item.probability, item.ppr]);
					disData.yellow.push([item.probability, item.pnr]);

				}
				disData.poniter = '0';
				disData.probability = matricesSortByp[0].probability;
				disData.index = confusion_matrices[max_fscore_index].probability;
				
				//drawChart('roc' + this.id, rocData, matricesAsc, disData);
				drawChart('roc' + this.id, newRocdata, matricesAsc, disData);
				drawDistr('distribution' + this.id, disData, matricesSortByp);
			})
		},
		methods: {
			/**
			 * 基本指标
			 *
			 * @param {Object} item 数据对象
			 */
			setBasicIndex (item) {
				// F score
				this.basicIndex[0].value = item.f1_score;
	        	// auc
	        	this.basicIndex[1].value = this.auc;
	        	// tpr
	        	this.basicIndex[2].value = item.tpr;
	        	// fpr
	        	this.basicIndex[3].value = item.fpr;
	        	// 真负类率
	        	this.basicIndex[4].value = item.tnr;
	        	// 阳性预测值
	        	this.basicIndex[5].value = item.fnr;
	        	// 阴性预测值 @TODO 
	        	this.basicIndex[6].value = item.npv;
	        	// 准确率
	        	this.basicIndex[7].value = item.acc;
			}
		}
	}
</script>





