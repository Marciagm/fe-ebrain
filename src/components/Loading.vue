<template>
	<left-right>
		<div slot="left" class="uploading-left">
			<img class="uploadig-img" src="../images/Upload-data2.png">
		</div>

		<div slot="right" class="uploading-right">
			<div class="loading-progress">
				<div class="load-progress-border" style="top: 0;"></div>
				<div class="progress-bar" style="width: 100%; background: #eee;" v-if="progressOk">
					<div class="progress-bar" :style="{width: uploadProgress}"></div>
				</div>
				<div class="loading-progress-con progress-bg" :style="{width: uploadProgress}"></div>
				<div class="loading-progress-con offset">
					<div>1.上传数据</div>
					<span v-if="progressOk" class="load-progress-status">已完成{{ uploadProgress }}</span>
					<span v-else class="load-fail-tip">
						上传失败<a href="#/main/data/upload" style="color: #1b7bdd"> 请重试</a>
					</span>
				</div>
				<img v-if="progressOk" src="../images/loading.gif" class="load-effect">
				<img v-else src="../images/cuowu.png" class="load-effect">
				<div v-if="!progressOk" class="load-progress-border"></div>
			</div>
		</div>

	</left-right>
</template>
<style lang="scss">
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
	export default {
		components: {
			leftRight
		},
		data () {
			return {
				processProgress: '0%'
			}
		},
		methods: {
		},
		mounted () {
			// @TODO 如果已经有projectId了，就直接跳转到 data info界面
			if (localStorage.getItem('projectId')) {
				//this.$router.push('/main/data/info');
			}
            var fileInfo = localStorage.getItem('fileInfo');
            if (fileInfo) {
            	try {
            		fileInfo = JSON.parse(fileInfo);
            		if (fileInfo.finished) {
            			this.$store.commit('SET_PROGRESS_PERCENT', 100);
						this.$store.commit('SET_FILE_NAME', fileInfo.name);
            		}
            	}
            	catch (e) {}
            }
            // @TODO request data pic progress

			/*if (fileInfo && fileInfo.finished) {
				
			}*/
			
		},
		computed: {
			uploadProgress () {
				if (this.$store.state.progressPercent == 100) {
					var fileInfo = {
						name: this.$store.state.filename,
						finished: true,
						projectId: ''
					};
					localStorage.setItem('fileInfo', JSON.stringify(fileInfo));

				}
				return Math.max(Math.floor(this.$store.state.progressPercent), 0) + '%';
			},
			progressOk () {
				console.log(this.$store.state.progressOk);
				return this.$store.state.progressOk;
			}
		} 
	}
</script>