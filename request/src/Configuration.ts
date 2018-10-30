
/**
 * Request Configuration
 */
export interface Configuration {
    /**
     * Base URL for request
     */
    baseURL?: string;

    /**
     * retry times
     * retry when fail
     */
    retry?: number;

    /**
     * response data type
     */
    responseType?: "json" | "text" | "arraybuffer";

    /**
     * auth setting
     */
    auth?: string | Function;


    headers?: {};

    transformRequest?: Function;
    transformResponse?: Function;

    onprogress?: Function;

    cancelToken?: Function;
};