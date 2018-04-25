import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    // 文件
    filename: '',
    progressPercent: 0,
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
    selection: ''
}

// 定义所需的 mutations
const mutations = {
    // 文件
    SET_FILE_NAME (state, name) {
        state.filename = name;
    },
    SET_PROGRESS_PERCENT (state, percent) {
        state.progressPercent = percent;
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
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})