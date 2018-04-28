<template>
	<div :id="'recall' + id" style="height: 400px; width: 60%; margin-left: 10%">
	</div>
</template>
<style lang="scss">
	
</style>
<script>
	import echarts from 'echarts'

	function drawChart (id, data) {
		console.log(id);
		console.log(document.getElementById(id));
		const chart = echarts.init(document.getElementById(id));
		
		const option = {
		    title: {
		        text: '折线图堆叠',
		        show: false
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['邮件营销','联盟广告'],
		        orient: 'vertical',
		        x: 'right',
		        y: 'center',
		        padding: [0, 0, 150, 0]
		    },
		    dataRange: {
		    	x: 'left',
		    	y: 'bottom'
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    toolbox: {
		        feature: {
		            //saveAsImage: {}
		        }
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: ['周一','周二','周三','周四','周五','周六','周日']
		    },
		    yAxis: {
		        type: 'value'
		    },
		    series: [
		        {
		            name:'邮件营销',
		            type:'line',
		            stack: '总量',
		            data:[120, 132, 101, 134, 90, 230, 210]
		        },
		        {
		            name:'联盟广告',
		            type:'line',
		            stack: '总量',
		            data:[220, 182, 191, 234, 290, 330, 310]
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
			drawChart(this.elId, {});
		}
	}
</script>