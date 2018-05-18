<template>
	<div :id="'recall' + id" style="height: 400px; width: 80%; margin-left: 5%; margin-top: 60px;">
	</div>
</template>
<style lang="scss">
	
</style>
<script>
	import echarts from 'echarts'
	import { getModelData } from '@/api/api'
	
	function drawChart (id, data) {
		console.log(data);
		const chart = echarts.init(document.getElementById(id));
		
		const option = {
			color: ['#589de2', '#deac2c'],
		    title: {
		        text: '准确&召回曲线',
		        show: false
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data:[ 
		        	{
		        		name: '准确率'
		        	}, 
		        	{
		        		name: '召回率'
		        	}
		        ],
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
		        }
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
		        //data: data.xAxis,
		        min: 0,
		        max: 1, 
		        splitNumber: 10,
		        name: '阈值',
		        nameLocation: 'middle',
		        nameGap: 25,
		        splitLine: {
		        	show: false,
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
		    	min: 0,
		    	max: 1,
		        name: '概率',
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
		            name:'准确率',
		            type:'line',
		            data: data.ppvs,
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

		        },
		        {
		            name:'召回率',
		            type:'line',
		            data: data.tprs,
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
		        }
		    ]
		};
		chart.setOption(option);
	}

	export default {
		props: ['id'],
		data () {
			return {
				elId: ''
			}
		},
		mounted () {
			this.elId = `recall${this.id}`;
			
			getModelData(this.id).then(data => {
				const { error, confusion_matrices } = data;
				if (error) {
					this.$message.error(error.desc);
					return;
				}
				const matrices = confusion_matrices.sort((a, b) => {
					return a.probability - b.probability;
				});
				const ppvs = [], tprs = [], xAxis = [];

				for (let i = 0, len = matrices.length; i < len; i++) {
					ppvs.push([matrices[i].probability, matrices[i].ppv]);
					tprs.push([matrices[i].probability, matrices[i].tpr]);
					//xAxis.push(matrices[i].probability);
					//ppvs.push([matrices[i].probability, matrices[i].ppv]);
					//tprs.push([matrices[i].probability, matrices[i].tpr]);
				}
				drawChart(this.elId, {ppvs: ppvs, tprs: tprs, xAxis: xAxis});
			})
		}
	}
</script>