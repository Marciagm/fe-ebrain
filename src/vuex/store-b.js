import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    projectId:'',
    projectStatus: false,
    progressPercent: 0,
    filename: '',
    progressOk: true
}

// 定义所需的 mutations
const mutations = {
    SET_PROJECT_ID (state,projectId) {
        state.projectId = projectId;
    },
    SET_PROJECT_STATUS (state, projectStatus) {
    	state.projectStatus = projectStatus;
    },
    SET_PROGRESS (state, percent) {
        state.progressPercent = percent;
    },
    SET_FILE_NAME (state, name) {
        state.filename = name;
    },
    SET_PROGRESS_OK (state, isOK) {
        state.progressOk = isOK;
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})