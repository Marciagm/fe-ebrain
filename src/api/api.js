import axios from 'axios';
axios.interceptors.request.use(function (config) {    // 这里的config包含每次请求的内容
    //var token = sessionStorage.getItem('token');
    var token = localStorage.getItem('token');
    config.headers.Authorization = token;
    return config;
}, function (err) {
    return Promise.reject(err);
});

let base = process.env.API_ROOT;

export const login = params => { return axios.post(`${base}/auth`, params).then(res => res.data); };

export const  newProject = params => { return axios.post(`${base}/project/create`, params).then(res => res.data); };

export const getProjectListPage = params => { return axios.get(`${base}/project/list`, { params: params }).then(res => res.data); };

export const  newJob = (projectId,params) => { return axios.post(`${base}/project/new-job/${projectId}`, params).then(res => res.data); };

export const getJobInfo = params => { return axios.get(`${base}/project/get-jobinfo`, { params: params }).then(res => res.data); };

export const getJobList = params => { return axios.get(`${base}/project/get-job-list`, { params: params }).then(res => res.data); };

export const logout = params => { return axios.get(`${base}/auth/logout`, { params: params }); };

export const regist = params => { return axios.post(`${base}/user/signup`, params).then(res => res.data); };

export const getSourceFileDataResult = params => { return axios.get(`${base}/project/get-source-file-data`, { params: params }).then(res => res.data); };

export const getDataResult = params => { return axios.get(`${base}/project/get-data-result`, { params: params }).then(res => res.data); };

export const getModelDetail = params => { return axios.get(`${base}/model/detail/${params.modelId}`, {}).then(res => res.data); };

export const getModelExplain = params => { return axios.get(`${base}/project/get-model-explain`, { params: params }).then(res => res.data); };

export const getTrainResult = params => { return axios.get(`${base}/project/get-train-result`, { params: params }).then(res => res.data); };

export const getPredictResult = params => { return axios.get(`${base}/project/get-predict-result`, { params: params }).then(res => res.data); };

export const getPredictDetail = params => { return axios.get(`${base}/project/get-predict-detail`, { params: params }).then(res => res.data); };

export const downloadPredictReport = params => { return axios.get(`${base}/project/download-predict-result/${params.projectId}/${params.jobId}/${params.sequence}`, { params: params }).then(res => res.data); };

export const downloadModelReport = params => { return axios.get(`${base}/project/get-predict-result`, { params: params }).then(res => res.data); };

export const viewModelDetailReport = params => { return axios.get(`${base}/project/get-predict-result`, { params: params }).then(res => res.data); };

export const getModelDetailData = params => { return axios.get(`${base}/project/get-predict-result`, { params: params }).then(res => res.data); };

export const serverChoose = params => { return axios.get(`${base}/filelist/server-choose`, { params: params }).then(res => res.data); };


export const getHistoryFileList = params => { return axios.get(`${base}/filelist/list`, { params: params }).then(res => res.data); };


export const getFileData = params => { return axios.get(`${base}/project/get-file-data`, { params: params }).then(res => res.data); };
