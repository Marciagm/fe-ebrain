<template>
	<div class="data-deal">
		<el-upload
		  style="width: 100%"
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
		</el-upload>
		<div style="background: red; height: 2px; width: 0%" id="progress"></div>
	</div>	
</template>
<style lang="scss">
	.el-upload-dragger {
		width: 1400px;
		height: 686px;
		border: 2px dashed #ccc;
	}
	.data-deal {
		background: #fff;
	}
	.data-con { 
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
			border: 0;
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
			margin-right: 110px;
		}
		.data-deal-button {
			text-align: center;
		}
	}
</style>
<script>
	export default {
		data () {
			return {
				uploadApi: 'https://jsonplaceholder.typicode.com/posts/',
				uploadProgress: '0%',
				processProgress: '0%'
			}
		},
		methods: {
			goHDFS () {
				alert('hi');
			},
			goODBC () {
				alert('in ODBC');
			},
			beforeUpload (file) {
				this.$store.commit('SET_PROGRESS', 0);
				this.$store.commit('SET_FILE_NAME', file.name);
				this.$router.push('/main/data/loading');
				this.$store.commit('SET_PROJECT_STATUS', true);
				localStorage.setItem('projectId', '');
			},
			onUploadProgress (event, file, fileList) {
				//document.getElementById('progress').style.width = event.percent + '%';
				this.$store.commit('SET_PROGRESS', event.percent - 0.1);
			},
			handleUploadSuccess (response, file, fileList) {
				localStorage.setItem('projectId', 'abc');
				//alert('succ');
				//console.log(file);
				this.$store.commit('SET_PROGRESS', 100);
				this.$router.push('/main/data/info');

			},
			// @TODO 考虑失败的情况
			handleUploadError (err, file, fileList) {
				//console.log(err);
				//console.log(file);
			}


		},
		mounted () {
			this.$store.commit('SET_PROJECT_STATUS', false);
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		}
	}
</script>