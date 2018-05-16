<template>
	<div>
		<top-part></top-part>
		<left-right>
			<div slot="left" class="uploading-left">
				<img class="uploadig-img" src="../images/Upload-data2.png">
			</div>
		</left-right>
	</div>
</template>
<style lang="scss" scoped>
	.uploading-left {
		height: 100%;
		position: relative;
		background: #fff;
		flex: 4;
		margin-right: 20px;
		border-radius: 0px 8px 0px 0px;
		text-align: center;
		.uploadig-img {
			margin-top: 206px;
		}
	}
</style>
<script>
	import topPart from '@/components/Top.vue'
	import leftRight from '@/components/LeftRight.vue'
	// @TODO 需要优化
	function initUploadProgress (progress) {
		progress.percent = '0%';
		progress.status = 1;
		return progress;
	}
	
	export default {
		components: {
			topPart,
			leftRight
		},
		methods: {
		},
		mounted () {
			// 数据阶段
			this.$store.commit('SET_CUR_STATUS', 1);
			// @TODO

			/*if (this.curStatus > 1) {
				this.$router.push(`/main/data/info/${this.$store.state.projectId}`);
			}
			else {
				this.$router.push(`/main/data/upload`);
			}*/
            
			const uploadProgress = this.$store.state.uploadProgress;
			
			uploadProgress.status = 1;
			uploadProgress.percent = '0%';
			const portraitProgress = this.$store.state.portraitProgress;
			// 
			portraitProgress.status = 0;

			// 上传数据进度开始
			this.$store.state.progressItems.length = 0;
			this.$store.state.progressItems.push(uploadProgress, portraitProgress);
				
		},
		computed: {
			curStatus () {
				return this.$store.state.curStatus;
			}
		} 
	}
</script>






