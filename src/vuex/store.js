import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
import * as getters from './getters'


Vue.use(Vuex)

const actions = {
    SET_EIGEN_DATA (state, eigenData) {
        state.eigenData.length = 0;
        for (let i = 0, len = eigenData.length; i < len; i++) {
            state.eigenData[i] = eigenData[i];   
        }
        //state.eigenData = eigenData;
    },
    SET_CUR_STATUS ({commit}, status) {
        commit('SET_CUR_STATUS', status);
        // state.curStatus = status;
    }
};

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

    tips: '',
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
    modelProgressItems: [],
    eigenData: [],
    queryList: [],
    trainObj: {
        featureName: '全部特征',
        featureNum: 0,
        featureListId: -1,
        targetFeatureId: '',
        targetId: '',
        targetName: '',
        timeSerialFeatureId: '',
        varifyNum: 0,
        splitMethod: 1,
        // 默认20% 最小5%
        testRatio: 20
    },
    timeTypeList: [],
    allTrainFinished: false,
    allModelFinished: false,
    fLId: '',
    targetId: '',
    taskId: '',
    targetName: '',
    modelStatus: false,

    // 0:初始化状态 1:数据操作过程中 2: 模型可点击时 3:重新训练状态
    curStatus: 0
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
        state.eigenData.length = 0;
        for (let i = 0, len = eigenData.length; i < len; i++) {
            state.eigenData[i] = eigenData[i];   
        }
        //state.eigenData = eigenData;
    },
    SET_QUERY_LIST (state, queryList) {
        state.queryList = queryList;
    },
    SET_TYPE_LIST (state, timeTypeList) {
        state.timeTypeList = timeTypeList;
    },
    SET_TRAIN_STATUS (state, status) {
        state.allTrainFinished = status;
    },

    // ids
    SET_FL_ID (state, id) {
        state.fLId = id;
    },
    SET_TARGET_ID (state, id) {
        state.targetId = id;
    },
    SET_TARGET_NAME (state, name) {
        state.targetName = name;
    },
    SET_TASK_ID (state, id) {
        state.taskId = id;
    },
    SET_MODEL_STATUS (state, status) {
        state.modelStatus = status;
    },
    SET_CUR_STATUS (state, status) {
        state.curStatus = status;
    },
    SET_ALLMODEL_STATUS (state, status) {
        state.allModelFinished = status;
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})