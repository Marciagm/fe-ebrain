import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    // 文件
    filename: '',
    progressOk: true,
    failReason: '上传失败',

    // 任务
    projectName: '',
    projectId:'',
    projectStatus: true,
    originalData: {},

    tips: '1234',
    tipsStatus: false,
    // 特征详情
    selection: '',

    // step: 0-上传数据  1-生成数据画像 2-模型训练
    step: 0,
    // status: -1-失败 0-尚未开始 1-正在进行时 2-成功 
    
    // 上传数据
    uploadProgress: {
        name: '1.上传数据',
        percent: '0%',
        status: 1,
        failReason: ''
    },

    // 生成数据画像
    portraitProgress: {
        name: '2.生成数据画像',
        percent: '0%',
        status: 0  
    },
    // 训练模型 
    modelProgress: {

    },
    progressItems: [],
    eigenData: [],
    queryList: []
}

// 定义所需的 mutations
const mutations = {
    // 文件
    SET_FILE_NAME (state, name) {
        state.filename = name;
    },
    SET_PROGRESS_OK (state, isOK) {
        state.progressOk = isOK;
    },
    SET_FAILREASON (state, failReason) {
        state.failReason = failReason;
    },

    // 任务
    SET_PROJECT_NAME (state, projectName) {
        state.projectName = projectName;
    },
    SET_PROJECT_ID (state, projectId) {
        state.projectId = projectId;
    },
    SET_PROJECT_STATUS (state, projectStatus) {
        state.projectStatus = projectStatus;
    },
    SET_ORIGINAL_DATA (state, dataSet) {
        state.originalData = dataSet;
    },

    SET_TIPS (state, tips) {
        state.tips = tips;
    },
    SET_TIPS_STATUS (state, status) {
        state.tipsStatus = status;
    },
    // 特征详情
    SET_SELECTION (state, selection) {
        state.selection = selection;
    },

    SET_EIGEN_DATA (state, eigenData) {
        for (let i = 0, len = eigenData.length; i < len; i++) {
            state.eigenData[i] = eigenData[i];   
        }
    },
    SET_QUERY_LIST (state, queryList) {
        state.queryList.length = 0;
        for (let i = 0, len = queryList.length; i < len; i++) {
            state.queryList.push(queryList[i]);
        }
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})