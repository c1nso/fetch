import {Promise} from "es6-promise";

export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch'; // 请求模式
export type RequestType = 'json'| 'form' | 'formData'; // 请求数据格式

// Api变压器
export interface ApiTransformer {
    (data: any, headers?: any): any;
}

// 请求选项
export interface RequestOption {
    url: string;
    method?: Method;
    requestType?: RequestType;
    urlParams?: string[]
}

// 请求配置
export interface RequestConfig {
    baseURL?: string;
    credentials?: string;
    headers?: any;
    transformRequest?: any;
    transformResponse?: ApiTransformer | ApiTransformer[]
}

export interface RequestApiConfig {
    uri: string;
    content: RequestOption
}

// api 响应格式
export interface ApiResponse<T = any> {
    Code?: string;
    Data?: T;
    IsDemo?: number;
    IsLogin?: number;
    Msg?: string;
    Time?: number
}

// 远程api实例泛型接口
export interface RemoteApiInstance {
    <T = any> (uri: string, params: object, option?: any): Promise<ApiResponse<T>>;
}


export enum ContentType {
    json = 'application/json;charset=UTF-8',
    form = 'application/x-www-form-urlencoded; charset=UTF-8',
    formData = "multipart/form-data;charset=UTF-8"
}

export enum HttpMethod {
    get = 'GET',
    post = 'POST',
    put = 'PUT',
    patch = 'PATCH',
    delete = 'DELETE'
}
