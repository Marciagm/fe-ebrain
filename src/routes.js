import Login from '@/components/Login.vue'
import NotFound from '@/components/404.vue'
import Main from '@/components/Main.vue'
import Regist from '@/components/Regist.vue'
import UploadView from '@/components/UploadView'
import ResultView from '@/components/ResultView'
import ModelDetailView from '@/components/ModelDetailView'
import ModelList from '@/components/ModelList'
import Help from '@/components/Help'
import FileSelectView from '@/components/FileSelectView'
import DataCheckView from '@/components/DataCheckView'
import TrainingView from '@/components/TrainingView'
import ModelDetail from '@/components/ModelDetail'
import DataView from '@/components/DataView'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/',
        redirect: '/main/uploadView',
        hidden: true
    },
    {
        path: '/regist',
        component: Regist,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/main',
        component: Main,
        redirect: '/main/modelList',
        children: [
            { path: '/main/modelList', component: ModelList, name: '模型列表' },
            { path: '/main/fileSelectView/:projectId', component: FileSelectView, name: '选择文件' },
            { path: '/main/dataCheckView/:modelId', component: DataCheckView, name: '数据检测页' },
            { path: '/main/trainingView/:modelId', component: TrainingView, name: '训练页' },
            { path: '/main/modelDetail/:modelId', component: ModelDetail, name: '模型详情' },
            { path: '/main/resultView/:projectId/:jobId/:sequence/:fileId', component: ResultView, name: '模型结果' },
            { path: '/main/modelDetailView/:projectId/:jobId/:sequence', component: ModelDetailView, name: '模型结果' },
            { path: '/main/uploadView', component: UploadView, name: '文件上传' },
            { path: '/main/help', component: Help, name: '帮助' },
            { path: '/main/dataView', component: DataView, name: '帮助' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

export default routes;