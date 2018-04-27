<template>
	<div :id="elId">
		recall
	</div>
</template>
<style lang="scss">
	
</style>
<script>
	import echarts from 'echarts'

	function drawChart (id, data) {
		const chart = echats.init(document.getElementById(id));
		const option = {

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