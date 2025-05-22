import Axios, { AxiosResponse } from "axios"
// import { alertServices } from "../../alert-service";
// import { isLoadingService } from "../../is-loading-service";
import { utilService, isLoadingService, alertServices } from "../.."
// import { alertServices } from "../alert-service";
// import { isLoadingService } from "../is-loading-service";
// import { utilService } from "../util-service";

let apiCallCount = 0 //variable to store api call counts

const createAxiosInstance = (baseURL: string) => {
  return Axios.create({
    baseURL: baseURL,
    responseType: "json",
  })
}
const successResponseHandler = (response: AxiosResponse) => {
  decreaseAPICallCountAndHideLoader()
  return response
}

const errorResponseHandler = (error: any, unAuthorizedHandler: any) => {
  decreaseAPICallCountAndHideLoader()
  let errorDetail = ""
  if (!error.response) {
    // server unavailable
    if (error.message === "Network Error") errorDetail = "Server unavailable"
    else {
      // errorDetail = 'Unhandled error';
      console.error(error.toString())
      console.log(error.toJson())
    }
  } else if (error.response.status === 401) {
    return unAuthorizedHandler(error)
  } else if (error.response.status === 400 || error.response.status === 500) {
    if (!utilService.isNullOrEmpty(error?.response?.data?.errorCode)) {
      if (error?.response?.data?.errorCode == "ERR") {
        // Handle custom error codes here globally
      }

      return Promise.reject(error)
    } else if (error.response.data?.traceId) {
      const keys = Object.keys(error.response.data.errors)
      if (!utilService.isNullOrEmpty(keys))
        errorDetail = error.response.data.errors[keys[0]][0] // First error message for first error property
    } else if (!utilService.isNullOrEmpty(error.response.data?.errorMessage)) {
      errorDetail = error.response.data.errorMessage
    } else {
      errorDetail = "An error occurred, please try again."
    }
  } else if (error.response.status === 403) {
    //     errorDetail = "You are not authorized to access this part of the application.";
  } else if (error.response.status === 404) {
    errorDetail =
      "The requested resource was not found. Please reload and try again."
  } else {
    errorDetail = error?.response?.data?.errorMessage
  }

  if (errorDetail) {
    console.log(errorDetail)
    //let errorDialoguePromise = alertServices.error(errorDetail);
  }

  return Promise.reject(error)
}

const increaseAPICallCountAndShowLoader = () => {
  apiCallCount++
  isLoadingService.isLoading.next(true)
}

const decreaseAPICallCountAndHideLoader = () => {
  apiCallCount--
  if (apiCallCount === 0) isLoadingService.isLoading.next(false)
}
export const commonAxiosService = {
  createAxiosInstance,
  successResponseHandler,
  errorResponseHandler,
  increaseAPICallCountAndShowLoader,
}
