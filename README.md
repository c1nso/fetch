### github 使用

* npm i
* npm run build
* 使用生成dist目录下的 fetch
* api 格式参考 `src/config`


### npm 使用,VUE 示例
* `npm i fetch_lanka`
* `import { SingularityApi } from "fetch_lanka";`
* main.js 引入
```$xslt
npm i fetch_lanka
import { SingularityApi } from "fetch_lanka";
Vue.use({
	install: () => {
		Vue.prototype.$api = SingularityApi;
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
