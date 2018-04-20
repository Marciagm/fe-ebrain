<template>
	<div class="left-right">
		<div class="left" ref="left">
			<slot name="left"></slot>
		</div>

		<div class="right" ref="right">
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
			flex: 4;
			display: inline-block;
			background: #fff;
			margin-right: 20px;
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
	export default {
		props: ['isScroll'],
		mounted () {
			if (this.isScroll == 0) {
				let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

				this.$refs.left.style.height = (h - 88) + 'px';
				this.$refs.right.style.height = (h - 88) + 'px';
				console.log('height: ' + h);
			}
		}
	}
</script>