<template>
	<div :id="'significance' + id" style="height: 400px; width: 60%; margin-left: 10%">
	</div>
</template>
<style lang="scss">
	
</style>
<script>
	import echarts from 'echarts'

	function drawChart (id, data) {
		var chart = echarts.init(document.getElementById(id));
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

	export default {
		props: ['id'],
		data () {
			return {
				elId: ''
			}
		},
		mounted () {
			this.elId = `significance${this.id}`;
			drawChart(this.elId, {});
		}
	}
</script>