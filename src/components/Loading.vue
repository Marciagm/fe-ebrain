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
	.uploading-right {
		box-sizing: border-box;
		padding-top: 20px;
		flex: 1;
		background: #fff;
		border-radius: 8px 0px 0px 8px;
		text-align: center;
		position: relative;
		color: #666;
		
		.offset {
			margin-left: 20%;
		}
		.progress-bg {
			background: #eff3f5;
		}
		.progress-bar {
			height: 6px;
			border-radius: 0px 3px 3px 0px;
			background-image: linear-gradient(90deg, 
				#a0cfff 0%, 
				#5ca7f4 45%, 
				#187fe8 100%), 
			linear-gradient(
				#86c0fb, 
				#86c0fb);
		}
		.data-process {
			background: #eff3f5;
			height: 68px;
			position: relative;
			.data-process-con {
				position: absolute;
				top: 15px; 
				left: 20%
			}
		}
		.load-effect {
			right: 20%; 
			top: 24px; 
			position: absolute;
		}
		.loading-progress {
			text-align: center;
			height: 74px;
			font-size: 15px;
			letter-spacing: 1px;
			border-radius: 0px 4px 4px 0px;
			position: relative;
			.loading-progress-con {
				padding-top: 12px; 
				height: 56px;
				position: absolute;
				color: #666666;
				font-size: 15px;
			    letter-spacing: 1px;
			}
			.load-progress-border {
				width: 100%;
				height: 1px;
				position: absolute;
				top: 74px;
				background-color: #eeeeee;
			}
			.load-progress-status {
				font-size: 12px;
			}
		}
		.load-fail-tip {
			font-size: 12px;
			letter-spacing: 1px;
			color: #e00202;
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






