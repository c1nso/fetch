import { Api, ApiConfigCollection, ApiResponse, ApiConfigOption, Driver } from "./interface/types";
export default class Courier extends Api {
    private readonly isSupportFetch;
    constructor(configs: ApiConfigCollection[]);
    _queryRequestOption(uri: string): ApiConfigOption;
    _bindDriver(data: object, option: ApiConfigOption, headers?: object): Driver;
    request(uri: string, data?: object, headers?: object): Promise<ApiResponse>;
}
