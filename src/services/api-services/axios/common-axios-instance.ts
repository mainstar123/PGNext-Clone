//import { AxiosRequestConfig } from "axios";
import { commonAxiosService } from "./common-axios-service";
import { PG_TPA_API_BASE_URL, API_URLS } from "../../../constants";
import { localStorageService } from "../../local-storage-service";

// The current source will be configured with tpa API as base.
// For any new API source an instance need to be created with respective base URL
const commonAxiosInstance = commonAxiosService.createAxiosInstance(
  // process.env.PGNEXT_APP_API_URL || ""
  PG_TPA_API_BASE_URL || ""
);

// request interceptor
commonAxiosInstance.interceptors.request.use(
  (requestConfig: any) => {
    commonAxiosService.increaseAPICallCountAndShowLoader();

    // If the request is login, complete it with out further header additions
    if (requestConfig.url === API_URLS.GetAccessToken) {
      // requestConfig.headers = {
      //   "content-type": "application/x-www-form-urlencoded",
      // };
      return requestConfig;
    } else {
      
      const userAuthInfo = localStorageService.getUserAuthInfo();
      const accessToken = userAuthInfo?.accessToken;
      // // const accessToken =  UserAuthInfo.accessToken;
      requestConfig.headers = {
        Authorization: "Bearer " + accessToken,
      };
    }
    return requestConfig;
  }
);

const unAuthorizedHandler = (error: any) => {
  // Need to be used to handle the unauthorized error globally
};

// response interceptor
commonAxiosInstance.interceptors.response.use(
  commonAxiosService.successResponseHandler,
  (error: any) => commonAxiosService.errorResponseHandler(error, unAuthorizedHandler)
);

export default commonAxiosInstance;
