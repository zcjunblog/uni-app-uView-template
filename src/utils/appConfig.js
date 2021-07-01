
const commonConfig = {
    appId: '',
    staticUrl: '',
    banner: [

    ],
    appSetting: {

    }
}
const policies = {// permission鉴权 权限名预设列表 各入口所需权限
    user: {
        setUserRole: 'BrightDentistry.User.SetUserRole', // 设置用户身份
    },
    rule: {
        setRuleCategory: 'BrightDentistry.Rule.SetRuleCategory', // 积分规则管理
    },
}

export default process.env.NODE_ENV === 'production'
    ? {
        env: 'production',
        baseUrl: 'https://',
        ...commonConfig,
        ...policies
    }
    : {
        env: 'development',
        baseUrl: 'https://xxx.xxx.xxx',
        ...commonConfig,
        ...policies
    }
