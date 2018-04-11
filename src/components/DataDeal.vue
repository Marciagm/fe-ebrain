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
			<div ref="left" class="uploading-left">
				<img src="../images/Upload-data2.png">
			</div>
			<div ref="right" class="uploading-right">
				<div style="width: 100%; height: 1px; background: #eee;margin-top: 18px;"></div>
				<div class="loading-progress" style="width: 10%">
					<div style="display: inline-block">
						<div style="padding-top: 15px;">1.上传数据</div>
						<span style="font-size: 12px;">已完成{{ uploadProgress }}</span>
					</div>
					<img src="../images/loading.gif" style="right: 20%;top: 20px; position: absolute;">
				</div>
				<div style="width: 100%; height: 1px; background: #eee;margin-top: 7px; margin-bottom: 19px;"></div>
				<div class="data-process" style="color: #666">
					<div>2.生成数据画像</div>
					<span style="font-size: 12px;">已完成 {{ processProgress }}</span>
				</div>
				<div style="width: 100%; height: 1px; background: #eee;margin-top: 20px;"></div>
			</div>
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
		display: flex;
		.uploading-left {
			background: #fff;
			flex: 4;
			margin-right: 20px;
			border-radius: 0px 8px 0px 0px;
			text-align: center;
			img {
				margin-top: 206px;
			}
		}
		.uploading-right {
			flex: 1;
			background: #fff;
			border-radius: 8px 0px 0px 8px;
			text-align: center;
			position: relative;
		}
		.loading-progress {
			margin-top: 7px;
			text-align: center;
			height: 63px;
			background-image: linear-gradient(90deg, 
				#569de6 0%, 
				#3281d2 45%, 
				#0d65be 100%), 
			linear-gradient(
				#86c0fb, 
				#86c0fb);
			font-size: 15px;
			letter-spacing: 1px;
			color: #fff;
			border-radius: 0px 4px 4px 0px;
		}
	}

</style>
<script>
	import config from '../../config'

	export default {
		data () {
			return {
				uploadApi: 'https://jsonplaceholder.typicode.com/posts/',
				isUploading: true,
				uploadProgress: '0%',
				processProgress: '0%'
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
				this.$store.commit('setProjectStatus', true);
			},
			onUploadProgress (event, file, fileList) {
				console.log(file.percentage);

			},
			handleUploadSuccess () {
				alert('succ');
			},
		},
		mounted () {
			this.$store.commit('setProjectStatus', false);
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.$refs.left.style.height = (h - 88) + 'px';
            this.$refs.right.style.height = (h - 88) + 'px';
		}
	}
</script>