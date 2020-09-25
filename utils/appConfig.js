const commonConfig = {
    appName:'',
    appId: '',
    banner: [
        'http://yanxuan.nosdn.127.net/d362ee7f5610ee909d7e7ae096dc8181.jpg',
        'http://yanxuan.nosdn.127.net/8a637753130c6603360f9486b95430a4.jpg',
        'http://yanxuan.nosdn.127.net/71d54f9b463c93a4e62d430749b45a68.jpg',
    ],
    brandPic: 'http://yanxuan.nosdn.127.net/f602c8b6ccea506403d2d2d29821e21a.jpg',
}

export default process.env.NODE_ENV === 'production'
    ? {
        env: 'production',
        baseUrl: 'https://xxx.com/',
        ...commonConfig
    }
    : {
        env: 'development',
        baseUrl: 'https://x.xxx.com/',
        ...commonConfig
    }
