<template>
	<div>
		<top-part ref="top"></top-part>
		<div style="text-align: center; margin-top: 100px">
			算法库
		</div>
	</div>
</template>
<style lang="scss">
	
</style>
<script>
	import topPart from '@/components/Top.vue'
	export default {
		components: {
			topPart
		},
		mounted () {
			console.log(this.curStatus);
			if (this.curStatus < 1) {
				this.$refs.top.setColors(['#ccc', '#ccc', '#1b7bdd']);
			}
			else if (this.curStatus >= 4) {
				this.$refs.top.setColors(['#666', '#666', '#1b7bdd']);
			}
			else {
				this.$refs.top.setColors(['#666', '#ccc', '#1b7bdd']);
			}
		},
		computed: {
			curStatus () {
				return this.$store.state.curStatus;
			} 
		}
	}
</script>