// import { InternalAxiosRequestConfig } from "axios";
import { commonAxiosService } from "./common-axios-service";
import { B_LIVE_API_BASE_URL } from "../../../constants";

// The current source will be configured with B-Live API as base.
// For any new API source an instance need to be created with respective base URL
const bLiveAxiosInstance = commonAxiosService.createAxiosInstance(
  B_LIVE_API_BASE_URL || ""
);

// request interceptor
bLiveAxiosInstance.interceptors.request.use(
  (requestConfig: any) => {
    commonAxiosService.increaseAPICallCountAndShowLoader();

    return requestConfig;
  }
);

const unAuthorizedHandler = (error: any) => {
  // Need to be used to handle the unauthorized error globally
};

// response interceptor
bLiveAxiosInstance.interceptors.response.use(
  commonAxiosService.successResponseHandler,
  (error: any) => commonAxiosService.errorResponseHandler(error, unAuthorizedHandler)
);

export default bLiveAxiosInstance;
