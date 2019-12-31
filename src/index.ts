import * as Qs from 'qs'
import {Api, ApiConfigCollection, ApiResponse, ApiConfigOption, Driver} from "./interface/types";
import {BaseDriver} from "./driver/base";
import  FetchDriver  from "./driver/fetch";

export default class Fetch extends Api {
    private readonly isSupportFetch: boolean = false;

    constructor(configs: ApiConfigCollection[]) {
        super(configs);
        this.isSupportFetch = !!window.fetch;
    }

    // 查找api配置
    _queryRequestOption(uri: string): ApiConfigOption {
        for (let config of this.configs) {
            if (config.maps.hasOwnProperty(uri)) {
                return {
                    prefix: config.prefix,
                    config: config.maps[uri]
                }
            }
        }
        throw new Error(`uri of ${uri} no found`);
    }

    // 生成Url
    _bindDriver(data: object = {}, option: ApiConfigOption, headers?: object): Driver {
        const keys = Object.keys(data), urlParams: Object = {};
        let url: string = option.prefix + option.config.url;
        keys.forEach(i => {
            if (i !== "params") {
                urlParams[i] = data[i];
                delete data[i]
            }
        });
        if (headers !== undefined && Object.keys(headers).length > 0) {
            option.headers = {...headers};
            // if (headers.hasOwnProperty("s")) urlParams["s"] = headers["s"]
        }
        if (Object.keys(urlParams).length > 0) url += `?${Qs.stringify(urlParams)}`;
        return this.isSupportFetch
            ? new FetchDriver(url, option, data.hasOwnProperty("params") ? data["params"] : {})
            : new BaseDriver(url, option);
    }

    request(uri: string, data: object = {}, headers?: object): Promise<ApiResponse> {
        const api = this._bindDriver(data, this._queryRequestOption(uri), headers);
        return new Promise((resolve, reject) => {
            if (this.isSupportFetch) {
                api.instance.then(
                    success => {
                        return resolve(success);
                    },
                    error => reject(error)
                );
            } else {
                api.instance[api.method]('', data.hasOwnProperty("params") ? data["params"] : {}).then(
                    success => {
                        if (success.status !== 200) return reject(success.data);
                        return resolve(success.data);
                    },
                    error => reject(error)
                )
            }
        });

    }
}
