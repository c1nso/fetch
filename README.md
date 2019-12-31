### github 使用

* npm i
* npm run build
* 使用生成dist目录下的 fetch
* api 格式参考 `src/config`


### npm 使用,VUE 示例
* `npm i fetch_lanka`
* `import Fetch from "fetch_lanka";`
* main.js 引入
```
/**
 * @description
 *  url: 接口地址
 *  method: 请求类型 post/get 默认为get
 *  requestType: 请求数据类型 form/json  默认为form
 *  请求方式为post时，才会判断requestType数据类型
 */
export default [
    {
        prefix: '/api/',
        maps: {
            API_GET_DOWNLOAD: {
                url: 'GetDownload' // 下载功能数据
            },
        }
    }
]
 
npm i fetch_lanka
import Fetch from "fetch_lanka";
import ApiMaps from './config/api.config';
Vue.use({
	install: () => {
		Vue.prototype.$api = {
            request(url, params, headers) {
                const api = new Fetch(ApiMaps);
                let headerConfig = {};
                if (headers !== undefined && Object.keys(headers).length > 0) {
                    headerConfig = Object.assign(headerConfig, headers);
                }
                if (CookiesStorage.getCookie('s')) {
                    Reflect.set(headerConfig, 's', CookiesStorage.getCookie('s'));
                }
                return api.request(url, params, headerConfig);
            }
    };
	}
});

method: {
async getAppConfig() {
			// 获取app配置
			await this.$api.request("API_LOGIN").then(success => {
				const data = success.Data;
			});
		},
}
```
