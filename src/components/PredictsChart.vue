<template>
	<div class="upload-predict">
		<div style="width: 100%;">
			<div class="upload-predict-label">批量预测</div>
			<el-upload
				ref="upload"
				:show-file-list=false
			  	class="upload-demo"
			  	:before-upload="beforeUpload"
			  	drag
			  	action="https://jsonplaceholder.typicode.com/posts/"
			>
			  	<div class="upload-predict-block">
			  		<el-col :span="10" v-if="!isUploading" class="upload-text">拖拽文件至虚线部分或点击右侧按钮上传并预测</el-col>
			  		<el-col :span="6" v-else class="predict-upload-progress">
			  			<el-col :span="5" style="font-size: 12px; color: #666;">{{ filename }}</el-col>
			  			<el-col :span="17">
			  				<el-progress :percentage="70" style="height: 70px; line-height: 70px;"></el-progress>
			  			</el-col>
			  		</el-col>
			  		<div style="float: right; line-height: 70px; padding-right: 20px;">
			  			<button class="upload-and-predict">上传并预测</button>
			  			<button class="upload-predict-download" @click.stop="download">下载预测报告</button>
			  			<div style="width: 30px;vertical-align: middle; height: 70px; display: inline-block;" @click.stop="deleteFile">
			  				<img src="../images/model-rubbish.png">
			  			</div>
			  		</div>
			  	</div>
			</el-upload>
		</div>
	</div>
</template>
<style lang="scss">
	.upload-predict {
		text-align: center;
		width: 100%;
		.el-upload {
			width: 80%;
		}
		.el-upload-dragger {
			background: #fafafa;
			width: 100%; 
			height: 70px;
			border: 1px dashed #ccc;
		}
		.upload-predict-label {
			text-align: left; 
			width: 80%; 
			margin-left: 10%;
			margin-top: 50px; 
			margin-bottom: 19px;
			font-size: 14px;
			letter-spacing: 1px;
			color: #333333;
		}
		.upload-predict-block {
			text-align: left;
			width: 100%;
			.upload-text {
				margin-left: 10%;
				height: 70px;
				line-height: 70px;
				font-size: 12px;
				letter-spacing: 1px;
				color: #cccccc;
			}
			.upload-and-predict {
				cursor: pointer;
				outline: none;
				padding-left: 15px;
				padding-right: 15px;
				height: 33px;
				background: #ccc;
				background-image: linear-gradient(90deg, 
					#0d65be 0%, 
					#1978d9 45%, 
					#248bf4 100%);
				border-radius: 4px;
				font-size: 12px;
				letter-spacing: 1px;
				color: #fff;
				margin-right: 22px;
			}
			.upload-predict-download {
				cursor: pointer;
				outline: none;
				padding-left: 15px;
				padding-right: 15px;
				height: 33px;
				background-color: #ccc;
				border-radius: 4px;
				letter-spacing: 1px;
				color: #fff;
				margin-right: 22px;
			}
			.predict-upload-progress {
				margin-left: 5%;
				display: inline-block; 
				width: 55%; 
				line-height: 70px; 
				height: 70px;
			}
		}
		
	}
</style>
<script>
	export default {
		data () {
			return {
				filename: '',
				isUploading: false
			}
		},
		methods: {
			beforeUpload (file) {
				this.filename = file.name;
				this.isUploading = true;
			},
			download () {
				alert('download');
			},
			deleteFile () {
				this.$refs.upload.clearFiles();
				this.filename = '';
				this.isUploading = false;
			}
		},
		mounted () {

		}
	}
</script>