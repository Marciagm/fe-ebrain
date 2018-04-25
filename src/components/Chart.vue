<template>
	<div>
		<div id="treeChart"></div>
		<div id="flowChart"></div>
		<div>{{ name }}</div>
		<div id="lineChart"></div>
		<div id="barChart"></div>
	</div>
</template>
<style lang="scss">
	#lineChart, #barChart {
		width: 500px;
		height: 500px;
	}
	#flowChart, #treeChart {
		width: 60%;
		height: 800px;
	}
</style>
<script>
	import echarts from 'echarts'
	function drawTreeChart () {
		var treeChart =  echarts.init(document.getElementById('treeChart'));
		var option = {
			title: {
				text: '树形流程图',
				x: 'center',
				y: 'top'
			},
			series: [
				{
					type: 'tree',
					data: [
						{
							name: 'a1啦啦啦',
							children:[
								{
									name: 'a2',
									children: [
										{
											name: 'a3'
										},
										{
											name: 'a3'
										},
										
									]
								},
								{
									name: 'a5',
									children: [
										{
											name: 'a3'
										}
									]
								}
							]
						}
					]
				}
			]

		}
		treeChart.setOption(option);
	}
	function drawChart () {
		var chart = echarts.init(document.getElementById('barChart'));
		var option = {
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
		            		position: 'right',
		            		width: '100',
		            		height: '100',
		            		backgroundColor: '#e0c82a',
		            		borderRadius: '25px',
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

	function drawFlowChart () {
		var flowChart = echarts.init(document.getElementById('flowChart'));
		var option = {
		    title: {
		        text: '流程图',
		        x: 'center',
		        y: 'top'
		    },
		    tooltip: {
		    	formatter (data) {
		    		return '这是一个长长的故事<br/>你想知道什么<br/>娃哈哈哈哈';
		    	}
		    },

		    draggable: false,
		    animationDurationUpdate: 1500,
		    animationEasingUpdate: 'quinticInOut',
		    series : [
		        {
		            type: 'graph',
		            layout: 'none',
		            symbol: 'rect',
		            symbolSize: [100, 50],
		            itemStyle: {
		            	normal: {
		            		color: 'rgba(102, 102, 102, 0.6)',
		            		align: 'left',
		            	}
		            },
		            roam: false,
		            label: {
		                normal: {
		                	position: 'left',
		                	offset: [20, 0],
		                    show: true,
		                    align: 'left',
		                	color: '#fff',
		                	fontSize: 12
		                }
		            },
		            edgeSymbol: ['circle', 'arrow'],
		            edgeSymbolSize: [2, 5],
		            edgeLabel: {
		                normal: {
		                    textStyle: {
		                        fontSize: 10
		                    }
		                }
		            },
		            data: [{
		                name: '节点1\n节点1节点1节点1\n节点1\n节点1',
		                x: 200,
		                y: 300,
		                symbolSize: 80,
		                symbol: 'circle'

		            }, {
		                name: '节点2',
		                x: 300,
		                y: 300
		            }, {
		                name: '节点3',
		                x: 300,
		                y: 200
		            }, {
		                name: '节点4',
		                x: 300,
		                y: 400
		            }, {
		                name: '节点5',
		                x: 350,
		                y: 350
		            }, {
		            	name: '节点6',
		            	x: 400,
		            	y: 300
		            }, {
		            	name: '节点7',
		            	x: 350,
		            	y: 200
		            }, {
		            	name: '节点8',
		            	x: 550,
		            	y: 300,
		            	symbol: 'roundRect'
		            }

		            ],
		            // links: [],
		            links: [{
		                source: 0,
		                target: 2,
		                label: {
		                    normal: {
		                        //show: true
		                    }
		                },
		                lineStyle: {
		                    normal: {
		                    	color: 'rgba(85, 155, 227, 0.8)',
		                        width: 1,
		                        curveness: 0.4
		                    }
		                }
		            }, {
		                source: 0,
		                target: 3,
		                label: {
		                    normal: {
		                        show: false
		                    }
		                },
		                lineStyle: {
		                    normal: {
		                    	width: 1,
								color: 'rgba(85, 155, 227, 0.8)',
		                    	curveness: -0.4
		                    }
		                }
		            }, {
		                source: '节点1',
		                target: '节点3'
		            }, {
		                source: '节点2',
		                target: '节点3',
		                lineStyle: {
		                    normal: {
		                    	width: 1,
								color: 'rgba(85, 155, 227, 0.8)',
		                    	curveness: 0
		                    }
		                }
		            }, {
		                source: '节点2',
		                target: '节点4',
		                lineStyle: {
		                    normal: {
		                    	width: 1,
								color: 'rgba(85, 155, 227, 0.8)',
		                    	curveness: 0
		                    }
		                }
		            }, {
		                source: '节点1',
		                target: '节点4',
		                lineStyle: {
		                    normal: {
		                        width: 1,
		                        color: 'rgba(85, 155, 227, 0.8)',
		                        curveness: 0.2
		                    }
		                }
		            }, {
		                source: '节点4',
		                target: '节点5',
		                lineStyle: {
		                    normal: {
		                        width: 1,
		                        color: 'rgba(85, 155, 227, 0.8)',
		                        curveness: 0.2
		                    }
		                }
		            }, {
		                source: 5,
		                target: 7,
		                label: {
		                    normal: {
		                        show: false
		                    }
		                }
		            }, {
		                source: 5,
		                target: 6,
		                label: {
		                    normal: {
		                        show: false
		                    }
		                },
		                lineStyle: {
		                    normal: {
		                        curveness: 0.2
		                    }
		                }
		            }, {
		                source: 1,
		                target: 5,
		                label: {
		                    normal: {
		                        show: false
		                    }
		                }
		            }, {
		                source: 4,
		                target: 5,
		                label: {
		                    normal: {
		                        show: false
		                    }
		                },
		                lineStyle: {
		                    normal: {
		                        curveness: 0.2
		                    }
		                }
		            }],
		            lineStyle: {
		                normal: {
		                    opacity: 0.9,
		                    color: 'rgba(85, 155, 227, 0.8)',
		                    width: 1,
		                    curveness: 0
		                }
		            }
		        }
		    ]
		};
		flowChart.setOption(option);
	}
	export default {
		data () {
			return {
				name: ''
			}
		},
		mounted () {
			var _this = this;
			var chart = echarts.init(document.getElementById('lineChart'));
			var option = {
				// 数据指示
				tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'cross'
			        },
			        formatter (data) {
			        	console.log(data[0].value);
			        	_this.name = data[0].value;
			        	return data[0].value;
			        },
			        color : ['#1e90ff','#22bb22','#4b0082','#d2691e'],
        			backgroundColor: '#000', // 工具箱背景颜色
			    },
			    xAxis: {
			        type: 'category',
			        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
			    yAxis: {
			    	splitLine: {
			    		// false 时没有网格线
			    		//show: true
			    		show: false
			    	},
			        type: 'value',
			        color: '#fff',
			        axisLine: {
			        	lineStyle: {
			        		color: '#ccc',
			        		width: 2
			        	}
			        }
			    },
			    // 渐变色彩
			    visualMap: {
			     	show: false,
		            top: 10,
		            right: 10,
		            pieces: [{
		                gt: 0,
		                lte: 50,
		                color: '#368ae0'
		            }, {
		                gt: 50,
		                lte: 100,
		                color: '#7f5adb'
		            }, {
		                gt: 100,
		                lte: 150,
		                color: '#c729d5'
		            }, {
		                gt: 150,
		                lte: 200,
		                color: '#368ae0'
		            }, {
		                gt: 200,
		                lte: 300,
		                color: '#660099'
		            }, {
		                gt: 300,
		                color: '#7e0023'
		            }],
		            outOfRange: {
		                color: '#999'
		            }
		        },
			    series: [{
			    	//symbol:'star',//拐点样式
			    	symbol:'circle', 
                	symbolSize: 8,//拐点大小
			        data: [14, 32, 90, 34, 129, 133, 152],
			        itemStyle:{  
	                    normal:{  
	                        color:'orange',  
	                        borderColor:'orange',  
	                    }  
	                },  
			        type: 'line',
			        color: 'red',
			        lineStyle: {
		                normal: {
		                    width: 3,
		                    shadowColor: 'rgba(0,0,0,1)',
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
		            renderItem: function (params, api) {
		            	console.log(params);
		            	console.log(api);
		            }
			    }]
			};
			chart.setOption(option);
			drawChart();
			drawFlowChart();
			drawTreeChart();
		}
	}
</script>