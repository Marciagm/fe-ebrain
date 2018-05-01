import axios from 'axios';
axios.interceptors.request.use(function (config) {    // 这里的config包含每次请求的内容
    //var token = sessionStorage.getItem('token');
    var token = localStorage.getItem('token');
    config.headers.Authorization = 'Bearer ' +  token;
    return config;
}, function (err) {
    return Promise.reject(err);
});

let base = process.env.API_ROOT;

// regist
export const regist = params => { 
	return axios.post(`${base}/account/register`, params).then(res => res.data); 
};

// login
export const login = params => { 
	return axios.post(`${base}/account/login`, params).then(res => res.data); 
};

// create project
export const createProject = params => { 
	return axios.post(`${base}/projects/create`, params).then(res => res.data); 
}

// update project
export const updateProject = (projectId, params) => {
	return axios.post(`${base}/projects/update/${projectId}`, params).then(res => res.data); 
}

// delete project
export const deleteProject = (projectId, params) => {
	return axios.post(`${base}/projects/delete/${projectId}`, params).then(res => res.data); 
}

// get project data
export const getProjectInfo = (projectId, params) => {
	return axios.get(`${base}/projects/show/${projectId}`, params).then(res => res.data); 
}

// upload file
export const uploadFile = `${base}/tasks/create_dataset_from_file`;
/*export const uploadFile = (params) => {
	return axios.post(`${base}/tasks/create_dataset_from_file`, params).then(res => res.data);
}*/

export const poll = (projectId, params) => {
	return axios.get(`${base}/projects/status/${projectId}`, params).then(res => res.data);
}

// 
export const showOriginalData = (dataSetId, params) => {
	return axios.get(`${base}/projects/show_dataset/${dataSetId}`, params).then(res => res.data);
}

// feature data
export const getFeatureData = (featureListId, params) => {
	// featureListId: -1 全部特征 
	// return axios.get(`${base}/features/list`, { params: params }).then(res => res.data); 
	return axios.get(`${base}/feature_lists/show/${featureListId}`, { params: params }).then(res => res.data); 
}

// get feature list
export const getFeatureList = (params) => {
	return axios.get(`${base}/feature_lists/list`, { params: params }).then(res => res.data); 
}

export const createFeatureList = (params) => {
	return axios.post(`${base}/feature_lists/create`, params).then(res => res.data); 
}

export const showFeatureData = (featureListId, params) => {
	return axios.get(`${base}/datasets/show/${featureListId}`, params).then(res => res.data);
}

// @TODO id是什么鬼？
export const updateFeature = () => {
	return axios.post(`${base}/features/update/`, params).then(res => res.data); 
}
// get project list
export const getProjectList = (params) => {
	// return axios.get(`${base}/projects/list`, params).then(res => res.data); 
	return axios.get(`${base}/projects/list`, { params: params }).then(res => res.data); 
}

// start to train
export const train = (params) => {
	return axios.post(`${base}/tasks/train`, params).then(res => res.data); 
}

// models list
export const getModelList = (params) => {
	return axios.get(`${base}/models/list`, { params: params }).then(res => res.data); 
}

// train track 
export const getBluePrint = (modelId, params) => {
	return axios.get(`${base}/models/blueprint/${modelId}`, { params: params }).then(res => res.data); 
}

// get model data 
export const getModelData = (modelId, params) => {
	return axios.get(`${base}/models/metrics/${modelId}`, { params: params }).then(res => res.data); 
}





export const logout = params => { return axios.get(`${base}/auth/logout`, { params: params }); };

export const getProjectListPage = params => { return axios.get(`${base}/project/list`, { params: params }).then(res => res.data); };

export const  newProject = params => { return axios.post(`${base}/project/create`, params).then(res => res.data); };


export const  createModel = params => { return axios.post(`${base}/model/create`, params).then(res => res.data); };

export const getProject = params => { return axios.get(`${base}/project/detail/${params.projectId}`, { }).then(res => res.data); };


export const getModelExplainList = params => { return axios.get(`${base}/model/explain/list/${params.jobId}`, { }).then(res => res.data); };

export const getJobList = params => { return axios.get(`${base}/project/get-job-list`, { params: params }).then(res => res.data); };

export const  newJob = (projectId,params) => { return axios.post(`${base}/model/new-job/${projectId}`, params).then(res => res.data); };

export const getJobFiles = params => { return axios.get(`${base}/model/jobFiles/${params.jobId}/${params.sequence}`,{}).then(res => res.data); };

export const  updateJobFiles = (params) => { return axios.post(`${base}/model/update-jobfiles`, params).then(res => res.data); };

export const  validateFiles = (params) => { return axios.get(`${base}/filelist/validate`, { params: params }).then(res => res.data); };

export const  runJobStep = (params) => { return axios.post(`${base}/project/run-step`, params).then(res => res.data); };

export const getJobInfo = params => { return axios.get(`${base}/project/get-jobinfo`, { params: params }).then(res => res.data); };

export const getTrainResult = params => { return axios.get(`${base}/project/get-train-result`, { params: params }).then(res => res.data); };

//export const getPredictHistory = params => { return axios.post(`${base}/predict/history`,params).then(res => res.data); };

export const savePredictHistory = params => { return axios.post(`${base}/predict/save`,params).then(res => res.data); };

export const getPredictResultAndDetail = params => { return axios.get(`${base}/predict/result/${params.tid}`,{}).then(res => res.data); };

export const getPredictHistory = params => { return axios.get(`${base}/model/predict-history`,{ params: params }).then(res => res.data); };

export const getJobProgress = params => { return axios.get(`${base}/project/get-job-progress`,{ params: params }).then(res => res.data); };

export const deleteJobFile = params => { return axios.get(`${base}/model/delete-job-file`,{ params: params }).then(res => res.data); };

export const getSourceFileDataResult = params => { return axios.get(`${base}/project/get-source-file-data`, { params: params }).then(res => res.data); };

export const getDataResult = params => { return axios.get(`${base}/project/get-data-result`, { params: params }).then(res => res.data); };

export const getModelDetail = params => { return axios.get(`${base}/model/detail/${params.modelId}`, {}).then(res => res.data); };

export const getModelExplain = params => { return axios.get(`${base}/project/get-model-explain`, { params: params }).then(res => res.data); };


export const getPredictResult = params => { return axios.get(`${base}/project/get-predict-result`, { params: params }).then(res => res.data); };

export const getPredictDetail = params => { return axios.get(`${base}/project/get-predict-detail`, { params: params }).then(res => res.data); };

export const downloadPredictReport = params => { return axios.get(`${base}/project/download-predict-result/${params.projectId}/${params.jobId}/${params.sequence}`, { params: params }).then(res => res.data); };

export const downloadModelReport = params => { return axios.get(`${base}/project/get-predict-result`, { params: params }).then(res => res.data); };

export const viewModelDetailReport = params => { return axios.get(`${base}/project/get-predict-result`, { params: params }).then(res => res.data); };

export const getModelDetailData = params => { return axios.get(`${base}/project/get-predict-result`, { params: params }).then(res => res.data); };

export const serverChoose = params => { return axios.get(`${base}/filelist/server-choose`, { params: params }).then(res => res.data); };


export const getHistoryFileList = params => { return axios.get(`${base}/filelist/list`, { params: params }).then(res => res.data); };


export const getFileData = params => { return axios.get(`${base}/project/get-file-data`, { params: params }).then(res => res.data); };
