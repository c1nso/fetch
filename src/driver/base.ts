import axios from "axios"
import * as Qs from 'qs'
import {Promise} from 'es6-promise'
import {Driver, DriverConfig, ContentType, ApiConfigOption, Method, RequestDateType} from "../interface/types";

export class BaseDriver implements Driver {
    public instance;
    readonly method: Method = 'get';
    readonly requestType: RequestDateType = 'form';
    private config: DriverConfig = {};

    constructor(uri: string, option: ApiConfigOption, data?: object) {
        this.config.baseURL = uri || "";
        this.method = option.config.hasOwnProperty("method") ? option.config.method : "get";
        this.requestType = option.config.hasOwnProperty("requestType") ? option.config.requestType : "form";
        if (option.headers !== undefined && Object.keys(option.headers).length > 0) {
            this.config.headers = {...option.headers}
        } else {
            this.config.headers = {};
        }
        this._dynamicInstance();
    }

    _dynamicInstance(): void {
        if (this.method === "post") {
            this.config.withCredentials = true;
            this.config.headers["Content-Type"] = ContentType[this.requestType];
            this._generatingTransformRequest();
        }
        this.instance = axios.create(this.config);
        this._interceptorForResponse();
    }

    _generatingTransformRequest(): void {
        this.config.transformRequest = [
            data => {
                switch (this.requestType) {
                    case 'json':
                        return JSON.stringify(data);
                    case 'form':
                        return Qs.stringify({...data});
                    default:
                        return data;
                }
            }
        ]
    }

    _interceptorForResponse(): void {
        this.instance.interceptors.response.use(
            success => success,
            error => {
                let timeoutMessage = `请求错误，请稍后重试.`;
                if (error.status) timeoutMessage += `错误码：${error.status}`;
                return Promise.reject(timeoutMessage);
            }
        )
    }

}
