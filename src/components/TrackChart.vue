<template>
	<div>
		<div :id="'track' + id" style="width: 100%; height: 400px; padding-top: 50px;">
			
		</div>
	</div>
</template>
<style lang="scss">
	
</style>
<script>
	import echarts from 'echarts'
	import { getBluePrint } from '@/api/api'
	/**
	 * 绘制足迹图
	 *
	 * @param {string} id 区域id
	 * @param {Object} data 原始
	 */
	function drawChart (id, data) {
		console.log(data.links);
		const chart = echarts.init(document.getElementById(id));
		const option = {
		    title: {
		        text: '流程图',
		        x: 'center',
		        y: 'top',
		        show: false
		    },
		    tooltip: {
		    	formatter (data) {
		    		return data.data.des;
		    		// return '这是一个长长的故事<br/>你想知道什么<br/>娃哈哈哈哈';
		    	}
		    },
		    toolbox: {
		    	feature: {
		    		
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
		            //roam: false,
		            roam: true,
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
		            data: data.stages,
		            data1: [{
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
		            	x: 420,
		            	y: 300
		            }, {
		            	name: '节点7',
		            	x: 450,
		            	y: 200
		            }, {
		            	name: '节点8',
		            	x: 600,
		            	y: 300,
		            	symbol: 'roundRect'
		            }

		            ],
		            links: data.links,
		            links1: [{
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
		chart.setOption(option);
	}

	export default {
		props: ['id'],
		data () {
			return {

			}
		},
		methods: {

		},
		mounted () {
			console.log('in track');
			getBluePrint(this.id).then(data => {
				const { error, links, stages } = data;
				if (error) {
					this.$message.error(error.desc);
					return;
				}
				
				const chartLinks = [], chartStages = [];
				for (let i = 0, len = links.length; i < len; i++) {
					chartLinks.push({
						source: links[i].src - 1,
						target: links[i].dst - 1
					})
				}
				for (let i = 0, len = stages.length; i < len; i++) {
					chartStages.push({
						name: stages[i].name,
						des: stages[i].description,
						x: (300 + i * 50),
						y: 300
					})
				}
				drawChart('track' + this.id, { links: chartLinks, stages: chartStages});
				console.log(data);
				
			}).catch(error => {
				console.log(error);
			})
		}
	}
</script>