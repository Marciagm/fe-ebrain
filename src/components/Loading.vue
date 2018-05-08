<template>
	<left-right>
		<div slot="left" class="uploading-left">
			<img class="uploadig-img" src="../images/Upload-data2.png">
		</div>
	</left-right>
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
	import leftRight from '@/components/LeftRight.vue'
	// @TODO 需要优化
	function initUploadProgress (progress) {
		console.log(progress);
		progress.percent = '0%';
		progress.status = 1;
		return progress;
	}
	
	export default {
		components: {
			leftRight
		},
		methods: {
		},
		mounted () {
			// @TODO 如果已经有projectId了，就直接跳转到 data info界面
			if (localStorage.getItem('projectId')) {
				//this.$router.push('/main/data/info');
			}
			if (this.$store.state.projectId) {
				this.$router.push(`/main/data/info/${this.$store.state.projectId}`);
			}
			else {
				this.$router.push(`/main/data/upload`);
			}
            
			const uploadProgress = this.$store.state.uploadProgress;
			// 
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
			
		} 
	}
</script>






