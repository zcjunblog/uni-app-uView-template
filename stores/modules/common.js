export const state = {
    launchPageUrl: '',
    isIphoneX: false, // 是否是iphone X系列
    menuButtonInfo: {} // 用来兼容刘海屏
};

export const mutations = {
    setData(state, {dataName, data}) {
        state[dataName] = data
    }
};

export const actions = {

};
