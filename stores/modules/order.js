export const state = {
    cartData: [],// 购物车数据
    cartTotal: 0,// 购物车数量
    storeId: '', // 商户id
    paySucTipShow: {show: false, txt: ''},
    pendingOrder: {}, // 待支付订单 包含选中的OrderLineIds和订单数据
    curSelectedProcessor: {}, // 订单当前选中的加工商
};

export const mutations = {
    pushCart(state, {item}) {
        state.cartData.push(item)
        state.cartTotal++
    },
    deleteCart(state, {key}) {
        state.cartTotal--
        state.cartData.splice(key, 1)
    }
};

export const actions = {

};

