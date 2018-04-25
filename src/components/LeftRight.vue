<template>
	<div class="left-right">
		<div class="left" :style="{minHeight: minHeight}">
			<slot name="left" :style="{minHeight: minHeight - 20}"></slot>
			<div class="data-foot">
				{{ filename }}
			</div>
		</div>

		<div class="right" :style="{minHeight: minHeight}">
			<slot name="right"></slot>
		</div>
	</div>
</template>
<style lang="scss">
	.left-right {
		background: #f4f4f6;
		display: flex;
		.left {
			border-radius: 0px 8px 0px 0px;
			width: 0;
			flex: 4;
			display: inline-block;
			background: #fff;
			margin-right: 20px;
			position: relative;
			.data-foot {
				background: #fff;
				z-index: 1000;
				letter-spacing: 1px; 
				color: #999; 
				position: absolute; 
				bottom: 0; 
				height: 28px; 
				line-height: 28px; 
				box-shadow: 0px -1px 2px 0px rgba(5, 0, 50, 0.1); 
				width: 100%;
				box-sizing: border-box;
				padding-left: 39px;
				text-align: left;
			}
		}
		.right {
			border-radius: 8px 0px 0px 8px;
			flex: 1;
			display: inline-block;
			background: #fff;
		}
	}
</style>
<script>
	let obj = {};
	window.onresize = function () {
		console.log('in resize');
		let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		obj.minHeight = (h - 88) + 'px';
	}
	export default {
		data () {
			return {
				minHeight: ''
			}
		},
		mounted () {
			obj = this;
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			this.minHeight = (h - 88) + 'px';
		},
		computed: {
			filename () {
				return this.$store.state.filename;
			}
		}
	}
</script>