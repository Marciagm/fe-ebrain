<template>
	<div class="data-upload">
		<el-upload
		  ref="upload"
		  class="data-con"
		  drag
		  :data="formData"
		  :show-file-list=false
		  :headers="apiHeader"
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
		text-align: center;
		.data-con {
			margin-left: 10%;
			width: 80%;
			padding-top: 60px;
			height: 586px;
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
				height: 586px;
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
    import { createProject, uploadFile, poll, showOriginalData, getFeatureData, getFeatureList } from '../api/api';
    class Progress {
    	constructor (progress) {
    		this.progress = progress;
    	}
    	setProgress (progress) {

    		this.progress = progress;
    	}
    }

	export default {
		data () {
			var token = localStorage.getItem('token');
			return {
				projectId: '',
				apiHeader: {
					Authorization: 'Bearer ' +  token
				},
				uploadApi: uploadFile,
				formData: {
					type: 1
				}
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
				this.$router.push('/main/data/loading');
				//const param = { name: this.$store.state.projectName || '未命名任务'};
			},
			onUploadProgress (event, file, fileList) {
				this.$store.state.uploadProgress.percent = Math.floor((event.percent - 0.1) / 1.1) + '%';
			},
			handleUploadSuccess (response, file, fileList) {
				this.$store.state.uploadProgress.percent = Math.floor(Math.random() * 10 + 90) + '%';
				if (response.error) {
					console.log(response.error);
					return;
				}
				let { task } = response;
				console.log('in task');
				const projectId = task.project_id;
				this.$store.commit('SET_PROJECT_ID', projectId);

				let pollTask = setInterval(() => {
					// 轮训
					poll(projectId).then(data => {
						//let { task} = data;
						let { dataset_task } = data;
						let task = dataset_task;
						console.log(data);
						console.log(task.status);
						switch (task.status) {
							case 0: 
								console.log(0);
								break;
							case 1: 
								console.log(1);
								break;
							case 2: 
								console.log(2);
								break;
							// running
							case 3: 
								this.$store.state.uploadProgress.percent = Math.floor(Math.random() * 8 + 92) + '%';
								break;
							case 4: 
								clearInterval(pollTask);
								this.$store.state.uploadProgress.percent = '100%';
								this.$store.state.uploadProgress.duration = '10s';
								this.$store.state.uploadProgress.status = 2;
								
								this.$router.push(`/main/data/info/${projectId}`);
								//let OriginalDataId = task.dataset_id;
								let OriginalDataId = this.$store.state.projectId;
								console.log('OriginalDataId: ' + OriginalDataId);
								// 查看原始数据
								showOriginalData(OriginalDataId).then(data => {
									let { dataset } = data;
									console.log(dataset);
									if (dataset) {
										let { sampled_data } = dataset; 
						                try {
						                    const sampledData = JSON.parse(sampled_data);
						                    const originalData = [];
						                    const rowLength = sampledData.length;
						                    const columnLength = sampledData[0] && sampledData[0].length;
						                    for (let i = 0; i < Math.min(rowLength, 100); i++) {
						                        const item = {};
						                        for (let j = 0; j < columnLength; j++) {
						                            item['a' + j] = sampledData[i][j];
						                        }
						                        originalData.push(item);
						                    }
						                  	this.$store.commit('SET_ORIGINAL_DATA', originalData);

						                }
						                catch (e) {
						                    console.log(e);
						                }
									}
								})
								// 轮询数据画像状态
								const timer = setInterval(() => {
									poll(projectId).then(data => {
										let { portrait_task } = data;
										this.$store.state.portraitProgress.percent = portrait_task.percentage + '%';
										const status = portrait_task.status;
										switch(status) {
											case 3:
												break; 
											case 4: 
											clearInterval(timer);
											this.$store.state.portraitProgress.percent = '100%';
											this.$store.state.portraitProgress.status = 2;
											this.$store.state.portraitProgress.duration = '20s';
											
											getFeatureData({ project_id: projectId }).then(data => {
												console.log('data in getFeatureData');
												// @TODO add feature data
												console.log(data);
											})
											// 获取列表list
											getFeatureList({ project_id: projectId }).then(data => {
												console.log(data);
												// @TODO add feature list

											})
											break;
											case 5: 
												clearInterval(timer);
												break;
										}
									})				
								}, 500)
						
								// 获取特征列表
								break;
							
							// fail
							case 5: 
								clearInterval(pollTask);
								this.$store.state.uploadProgress.percent = '0%';
								this.$store.state.uploadProgress.status = -1;
								this.$store.state.uploadProgress.failReason = task.failed_reason;
								break;
						}
						//console.log(data);
					})
				}, 500)
				
				//this.$router.push('/main/data/info');
			},
			// @TODO 考虑失败的情况
			handleUploadError (err, file, fileList) {
				console.log('fail');
				this.$store.state.uploadProgress.percent = '0%';
				this.$store.state.uploadProgress.status = -1;
				this.$store.state.uploadProgress.failReason = '上传失败';
				this.$store.commit('SET_PROGRESS_OK', false);
			}
		},
		mounted () {
			// init
			this.$store.commit('SET_PROJECT_STATUS', false);
			this.$store.commit('SET_PROGRESS_OK', true);
			this.$store.commit('SET_PROJECT_NAME', '未命名任务');
		}
	}
</script>