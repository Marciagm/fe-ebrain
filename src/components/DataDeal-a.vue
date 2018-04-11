<template>
	<div class="data-deal">
		<el-upload
		  class="data-con"
		  drag
		  :show-file-list=false 
		  :before-upload="beforeUpload"
		  :on-progress="onUploadProgress"
		  :on-success="handleUploadSuccess"
		  :action="uploadApi"
		  v-show="isUploading"
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


		<div v-show="!isUploading" class="uploading">
			<div class="uploading-left">a</div>
			<div class="uploading-right">b</div>
		</div>
	</div>	
</template>
<style lang="scss">
	.el-upload-dragger {
		width: 1000px;
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
	.uploading {
		overflow: hidden;
		background: #f4f4f6;
		min-height: 100%;
		.uploading-left {
			background: #fff;
			flex: 8;
			margin-right: 20px;
		}
		.uploading-right {
			flex: 1;
			background: red;
		}
	}

</style>
<script>
	export default {
		data () {
			return {
				uploadApi: 'https://jsonplaceholder.typicode.com/posts/',
				isUploading: true
			}
		},
		methods: {
			chooseLocalFile () {
				this.$refs.file.click();
			},
			goHDFS () {
				alert('hi');
			},
			goODBC () {
				alert('in ODBC');
			},
			beforeUpload () {
				this.isUploading = false;
			},
			onUploadProgress (event, file, fileList) {
				console.log(file.percentage);
			},
			handleUploadSuccess () {
				alert('succ');
			},
		}
	}
</script>