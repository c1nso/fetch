import { Driver, ApiConfigOption, Method, RequestDateType } from "../interface/types";
export declare class BaseDriver implements Driver {
    instance: any;
    readonly method: Method;
    readonly requestType: RequestDateType;
    private config;
    constructor(uri: string, option: ApiConfigOption, data?: object);
    _dynamicInstance(): void;
    _generatingTransformRequest(): void;
    _interceptorForResponse(): void;
}
