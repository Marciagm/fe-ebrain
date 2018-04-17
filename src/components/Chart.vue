<template>
	<div>
		<div>{{ name }}</div>
		<div id="lineChart"></div>
		<div id="barChart"></div>
		<div id="flowChart"></div>
	</div>
</template>
<style lang="scss">
	#lineChart, #barChart, #flowChart {
		width: 500px;
		height: 500px;
	}
</style>
<script>
	import echarts from 'echarts'
	function drawChart () {
		var chart = echarts.init(document.getElementById('barChart'));
		var option = {
		    title: {
		        text: '世界人口总量',
		        subtext: '数据来自网络'
		    },
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'shadow'
		        }
		    },
		    legend: {
		        data: ['2011年', '2012年']
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: {
		        type: 'value',
		        boundaryGap: [0, 0.01]
		    },
		    yAxis: {
		        type: 'category',
		        data: ['巴西','印尼','美国','印度','中国','世界人口(万)']
		    },
		    series: [
		        {
		            name: '2011年',
		            type: 'bar',
		            data: [18203, 23489, 29034, 104970, 131744, 630230]
		        },
		        {
		            name: '2012年',
		            type: 'bar',
		            data: [19325, 23438, 31000, 121594, 134141, 681807]
		        }
		    ]
		};
		chart.setOption(option);
	}

	function drawFlowChart () {
		var flowChart = echarts.init(document.getElementById('flowChart'));
		var option = {
		    title: {
		        text: 'Graph 简单示例',
		        x: 'center',
		        y: 'top'
		    },
		    tooltip: {
		    	formatter (data) {
		    		return Math.random() + '<br/>' + Math.random() + '<br/>' + Math.random();
		    	}
		    },
		    animationDurationUpdate: 1500,
		    animationEasingUpdate: 'quinticInOut',
		    series : [
		        {
		            type: 'graph',
		            layout: 'none',
		            color: '#fff',
		            symbol: 'roundRect',
		            symbolSize: [110, 50],
		            backgroundColor: 'red',
		            roam: true,
		            label: {
		                normal: {
		                    show: true
		                }
		            },
		            edgeSymbol: ['', 'arrow'],
		            edgeSymbolSize: [4, 10],
		            edgeLabel: {
		                normal: {
		                    textStyle: {
		                        fontSize: 20
		                    }
		                }
		            },
		            data: [{
		                name: '节点1\n节点1节点1节点1\n节点1\n节点1',
		                x: 300,
		                y: 300,
		                symbolSize: 100
		            }, {
		                name: '节点2',
		                x: 800,
		                y: 300
		            }, {
		                name: '节点3',
		                x: 550,
		                y: 100
		            }, {
		                name: '节点4',
		                x: 550,
		                y: 500
		            }, {
		                name: '节点5',
		                x: 550,
		                y: 800
		            }, {
		            	name: '节点6',
		            	x: 700,
		            	y: 800
		            }, {
		            	name: '节点7',
		            	x: 1000,
		            	y: 800
		            }, {
		            	name: '节点8',
		            	x: 1100,
		            	y: 300
		            }

		            ],
		            // links: [],
		            links: [{
		                source: 0,
		                target: 1,
		                symbolSize: [15, 20],
		                label: {
		                    normal: {
		                        //show: true
		                    }
		                },
		                lineStyle: {
		                    normal: {
		                        width: 5,
		                        curveness: 0.2
		                    }
		                }
		            }, {
		                source: '节点2',
		                target: '节点1',
		                label: {
		                    normal: {
		                        show: true
		                    }
		                },
		                lineStyle: {
		                    normal: { curveness: 0.2 }
		                }
		            }, {
		                source: '节点1',
		                target: '节点3'
		            }, {
		                source: '节点2',
		                target: '节点3'
		            }, {
		                source: '节点2',
		                target: '节点4'
		            }, {
		                source: '节点1',
		                target: '节点4'
		            }, {
		                source: '节点4',
		                target: '节点5'
		            }, {
		                source: 6,
		                target: 7,
		                symbolSize: [5, 20],
		                label: {
		                    normal: {
		                        show: false
		                    }
		                },
		                lineStyle: {
		                    normal: {
		                        width: 5,
		                        curveness: 0.2
		                    }
		                }
		            }, {
		                source: 5,
		                target: 6,
		                symbolSize: [5, 20],
		                label: {
		                    normal: {
		                        show: false
		                    }
		                },
		                lineStyle: {
		                    normal: {
		                        width: 5,
		                        curveness: 0.2
		                    }
		                }
		            }, {
		                source: 1,
		                target: 7,
		                symbolSize: [5, 20],
		                label: {
		                    normal: {
		                        show: false
		                    }
		                },
		                lineStyle: {
		                    normal: {
		                        width: 5,
		                        curveness: 0.2
		                    }
		                }
		            }],
		            lineStyle: {
		                normal: {
		                    opacity: 0.9,
		                    width: 2,
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
		}
	}
</script>