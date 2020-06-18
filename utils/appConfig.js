const commonConfig = {
    appId: '',
    appSetting: {

    }
}

export default process.env.NODE_ENV === 'production'
    ? {
        env: 'development',
        baseUrl: '开发环境url',
        ...commonConfig
    }
    : {
        env: 'production',
        baseUrl: '生产环境url',
        ...commonConfig
    }
