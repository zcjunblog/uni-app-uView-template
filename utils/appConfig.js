const commonConfig = {
    appName:'义齿＋',
    appId: 'wxf21bdcaa5efec3ca',
    banner: [
        'http://yanxuan.nosdn.127.net/d362ee7f5610ee909d7e7ae096dc8181.jpg',
        'http://yanxuan.nosdn.127.net/8a637753130c6603360f9486b95430a4.jpg',
        'http://yanxuan.nosdn.127.net/71d54f9b463c93a4e62d430749b45a68.jpg',
    ],
    brandPic: 'http://bpic.588ku.com/element_origin_min_pic/19/04/23/443c29e942989bdd15419c43ef46b049.jpg',
}

export default process.env.NODE_ENV === 'production'
    ? {
        env: 'production',
        baseUrl: 'https://dp.duotai.tech',
        ...commonConfig
    }
    : {
        env: 'development',
        baseUrl: 'https://dps.duotai.tech',
        ...commonConfig
    }
