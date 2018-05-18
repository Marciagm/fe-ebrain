<template>
	<div class="upload-predict">
		<div style="width: 100%;">
			<div class="upload-predict-label">批量预测</div>
			<el-upload
				ref="upload"
				:data="formData"
				:show-file-list=false
				:headers="apiHeader"
			  	class="upload-demo"
			  	:before-upload="beforeUpload"
			  	:on-progress="onUploadProgress"
		  		:on-success="handleUploadSuccess"
		  		:on-error="handleUploadError"
			  	drag
			  	:action="uploadApi"
			>
			  	<div class="upload-predict-block">
			  		<el-col :span="10" v-if="!isUploading" class="upload-text">拖拽文件至虚线部分或点击右侧按钮上传并预测</el-col>
			  		<el-col v-else :span="12" class="predict-upload-progress">
			  			<el-col :span="8" style="font-size: 12px; color: #666;">{{ filename }}</el-col>
			  			<el-col :span="16" style="text-align: center;" v-if="isUploading && !finished">
			  				<el-progress :percentage="percent" style="height: 70px; line-height: 70px;"></el-progress>
			  			</el-col>
			  			<div class="upload-predict-tip" v-if="isUploading && !finished">{{ tips }}</div>
			  			<div style="float: right; font-size: 12px; color: #666;">
			  				完成
			  				<img src="../images/finish.png">
			  			</div>
			  		</el-col>
			  		<div style="float: right; line-height: 70px; padding-right: 20px;">
			  			<button class="upload-and-predict">上传并预测</button>
			  			<button class="upload-predict-download" v-if="!downloadAble" disabled>下载预测报告</button>
			  			<button class="upload-and-predict" v-else @click.stop="download">下载预测报告</button>
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
				padding-left: 10px;
				padding-right: 10px;
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
				margin-left: 2%;
				display: inline-block; 
				line-height: 70px; 
				height: 70px;
			}
		}
		.upload-predict-tip {
			position: absolute; 
			top: 15px; 
			left: 20%; 
			font-size: 10px;
			height: 14px;
			line-height: 14px;
			color: #999999;
		}
	}
</style>
<script>
	import { uploadPredicFile } from '@/api/api'
	import { pollTaskStatus, downloadPredictReport, deletePreditiction, showPrediction } from '@/api/api'

	var token = localStorage.getItem('token');

	export default {
		props: ['id'],
		data () {
			return {
				finished: false,
				downloadAble: false,
				projectId: this.$route.params.projectId,
				filename: '',
				isUploading: false,
				percent: 0,
				uploadApi: uploadPredicFile,
				formData: {
					model_id: this.id,
					project_id: this.$route.params.projectId
				},
				apiHeader: {
					Authorization: 'Bearer ' +  token
				},
				tips: '文件上传中...',
				predictionId: ''
			}
		},
		methods: {
			beforeUpload (file) {
				this.finished = false;
				this.filename = file.name;
				this.isUploading = true;
				this.downloadAble = false;
			},

			// progress
			onUploadProgress (event, file, fileList) {
				this.percent = Math.floor((event.percent - 0.1) / 11);
			},

			// 
			handleUploadSuccess (response, file, fileList) {
				const { error, task } = response;
				if (error) {
					this.$message.error(error.desc);
					return;
				}
				if (task && task.task_id) {
					// 开始轮询预测状态
					this.tips = '文件处理中...';
					this.poll(task.task_id, 500);
				}
			},

			poll (taskId, interval) {
				const timer = setInterval(() => {
					pollTaskStatus(taskId).then(data => {
						const { error, task } = data;
						if (error) {
							this.$message.error(error.desc);
							return;
						}
						const { next_task } = task;
						if (next_task) {
							const { stages, status, predict_info } = next_task;
							console.log(stages);
							if (stages.length) {
								this.tips = stages[stages.length - 1].stage_name;
								this.percent = (stages.length + 2) * 10;
							}
							if (status == 4) {
								this.percent = 100;
								// 可下载
								this.downloadAble = true;
								if (predict_info && predict_info.prediction_id) {
									this.predictionId = predict_info.prediction_id;
								}
								this.finished = true;
								clearInterval(timer);
							}
							else if (status == 5) {
								// 
							}
						}
					})
				}, interval);
			},

			// @TODO error
			handleUploadError (err, file, fileList) {

			},
			download () {
				downloadPredictReport(this.predictionId).then(data => {
					const { error } = data;
					if (error) {
						this.$message.error(error.desc);
						return;
					}
					console.log(data);
					let url = window.URL.createObjectURL(new Blob([data]))
					let link = document.createElement('a')
			        link.style.display = 'none'
			        link.href = url
			        link.setAttribute('download', `预测报告-${this.predictionId}`)
			        
			        document.body.appendChild(link)
			        link.click()
				});
			},
			deleteFile () {
				this.$refs.upload.clearFiles();
				this.filename = '';
				this.isUploading = false;
				this.downloadAble = false;
				if (this.predictionId) {
					deletePreditiction(this.predictionId).then(data => {
						const { error } = data;
						if (error) {
							this.$message.error(error.desc);
						}
						else {
							this.predictionId = '';
						}
 					})
				}
			}
		},
		mounted () {
			const params = {
				model_id: this.id
			}
			showPrediction(params).then(data => {
				// @TODO  
				const { error, prediction } = data;
				if (error) {
					this.$message.error(error.desc);
					return;
				}
				// 
				if (prediction) {
					this.filename = prediction.dataset_name;
					if (prediction.status == 4) {
						this.finished = true;
						this.isUploading = true;
						this.predictionId = prediction.prediction_id;
						this.downloadAble = true;
					}
					else if (prediction.status == 3) {
						this.isUploading = true;
						this.finished = false;
						this.taskId = prediction.task_id;
						this.poll(this.taskId, 1000);
					}
					
				}
				console.log(data);
			})
		}
	}
</script>








