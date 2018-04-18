<template>
	<div class="data-upload">
		<el-upload
		  class="data-con"
		  drag
		  :show-file-list=false 
		  :before-upload="beforeUpload"
		  :on-progress="onUploadProgress"
		  :on-success="handleUploadSuccess"
		  :on-error="handleUploadError"
		  :action="uploadApi"
		>
		  <img src="../images/Upload-data1.png">
		  <el-row>
				<el-col :span="20" :offset="2">
					<div>
						<button>本地数据</button>
						<button @click.stop="goHDFS">HDFS</button>
						<button @click.stop="goODBC" style="margin-right: 0;">ODBC</button>
					</div>
				</el-col>
			</el-row>
			<div class="data-upload-tips">
				可直接拖拽文件至主界面,支持逗号分隔的文本文件，建议UTF-8格式编码
			</div>
		</el-upload>
	</div>	
</template>
<style lang="scss">
	.data-upload {
		min-width: 880px;
		width: 100%;
		.data-con { 
			width: 100%;
			padding-top: 60px;
			height: 686px;
			text-align: center;
			img {
				margin-top: 38px;
				width: 306px;
				height: 296px;
				margin-bottom: 55px;
			}
			button {
				cursor: pointer;
				outline: none;
				width: 116px;
				height: 47px;
				background-image: linear-gradient(90deg, 
					#0d65be 0%, 
					#1978d9 45%, 
					#248bf4 100%), 
				linear-gradient(
					#cccccc, 
					#cccccc);
				border-radius: 4px;
				color: #ffffff;
				font-size: 16px;
				margin-right: 109px;
				&:hover {
					opacity: 0.7;
				}
				&:active {
					opacity: 1;
				}
			}

			.el-upload {
				width: 80%;
			}
			.el-upload-dragger {
				width: 100%; 
				height: 686px;
				border: 2px dashed #ccc;
			}
			.data-upload-tips {
				margin-top: 50px;
				font-size: 16px;
				letter-spacing: 1px;
				color: #cccccc;
			}
		}
	}
</style>
<script>
	export default {
		data () {
			return {
				uploadApi: 'https://jsonplaceholder.typicode.com/posts/'
			}
		},
		methods: {
			goHDFS () {
				alert('goHDFS');
			},
			goODBC () {
				alert('goODBC');
			},
			beforeUpload (file) {
				localStorage.removeItem('fileInfo');
				this.$store.commit('SET_PROGRESS_PERCENT', 0);
				this.$store.commit('SET_FILE_NAME', file.name);
				this.$router.push('/main/data/loading');
				this.$store.commit('SET_PROJECT_STATUS', true);
				localStorage.setItem('projectId', '');
			},
			onUploadProgress (event, file, fileList) {
				this.$store.commit('SET_PROGRESS_PERCENT', event.percent - 0.1);
			},
			handleUploadSuccess (response, file, fileList) {
				localStorage.setItem('projectId', 'abc');
				this.$store.commit('SET_PROGRESS_PERCENT', 100);
				this.$router.push('/main/data/info');
			},
			// @TODO 考虑失败的情况
			handleUploadError (err, file, fileList) {
				this.$store.commit('SET_PROGRESS', 0);
				this.$store.commit('SET_PROGRESS_OK', false);
			}
		},
		mounted () {
			this.$store.commit('SET_PROJECT_STATUS', false);
			this.$store.commit('SET_PROGRESS_OK', true);
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		}
	}
</script>