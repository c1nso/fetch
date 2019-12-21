/**
 * @description
 *  url: 接口地址
 *  method: 请求类型 post/get 默认为get
 *  requestType: 请求数据类型 form/json  默认为form
 *  urlParams： url 传参
 *  请求方式为post时，才会判断requestType数据类型
 */
export default {
    API: {
        API_LOGIN: {
            url: 'UserLogin',
            method: 'post',
            urlParams: ['params1', 'params2']
        },
        API_LOGIN_TEST: { // 注册试玩会员
            url: 'UserLogin',
            method: 'post',
            requestType: 'json'
        }
    }
}
