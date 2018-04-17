<template>
	<div class="data-deal">
		<div class="uploading">
			<div ref="left" class="uploading-left">
				<img class="uploadig-img" src="../images/Upload-data2.png">
				<div class="data-foot">
					{{ filename }}
				</div>
			</div>
			<div ref="right" class="uploading-right">

				<div class="loading-progress">
					<div class="load-progress-border" style="top: 0;"></div>
					<div class="progress-bar" :style="{width: uploadProgress}"></div>
					<div class="loading-progress-con progress-bg" :style="{width: uploadProgress}"></div>
					<div class="loading-progress-con offset">
						<div>1.上传数据</div>
						<span class="load-progress-status">已完成{{ uploadProgress }}</span>
					</div>
					<img src="../images/loading.gif" class="load-effect">
				</div>

				<div class="loading-progress">
					<!-- <div class="progress-bar" ></div> -->
					<div class="loading-progress-con progress-bg"></div>
					<div class="loading-progress-con offset">
						<div>2.生成数据画像</div>
						<!-- <span class="load-progress-status">已完成 {{ processProgress }}</span> -->
					</div>
					<!-- <img src="../images/loading.gif" class="load-effect"> -->
					<div class="load-progress-border"></div>
				</div>
			</div>
		</div>
	</div>	
</template>
<style lang="scss">
	.data-deal {
		background: #fff;
	}
	.uploading {
		overflow: hidden;
		background: #f4f4f6;
		display: flex;
		.uploading-left {
			position: relative;
			background: #fff;
			flex: 4;
			margin-right: 20px;
			border-radius: 0px 8px 0px 0px;
			text-align: center;
			.uploadig-img {
				margin-top: 206px;
			}
			.data-foot {
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
		}
	}

</style>
<script>
	export default {
		data () {
			return {
				processProgress: '0%'
			}
		},
		methods: {
		},
		mounted () {
			// @TODO 如果已经有projectId了，就直接跳转到 data info界面
			console.log('projectId:' + localStorage.getItem('projectId'));
			if (localStorage.getItem('projectId')) {
				this.$router.push('/main/data/info');
			}
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.$refs.left.style.height = (h - 88) + 'px';
            this.$refs.right.style.height = (h - 88) + 'px';

            var fileInfo = localStorage.getItem('fileInfo');
            if (fileInfo) {
            	try {
            		fileInfo = JSON.parse(fileInfo);
            		if (fileInfo.finished) {
            			this.$store.commit('SET_PROGRESS', 100);
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
			filename () {
				return this.$store.state.filename;
			}
		} 
	}
</script>