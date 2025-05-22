import { AxiosResponse } from "axios"
import commonAxiosInstance from "./axios/common-axios-instance"
import bLiveAxiosInstance from "./axios/blive-axios-instance"
import { fetchDrundData, fetchDrundGameData } from "./drund.service"
import { fetchSupabaseData } from "./supabase.service"

const get = <T>(url: string) => {
  return commonAxiosInstance
    .get<T>(url)
    .then((response: AxiosResponse<T>) => response.data)
}

const getAsync = async <T>(url: string) => {
  return await commonAxiosInstance
    .get<T>(url)
    .then((response: AxiosResponse<T>) => response.data)
}

const getByParams = <T>(url: string, params: any) => {
  return commonAxiosInstance
    .get<T>(url, {
      params: { ...params },
    })
    .then((response: AxiosResponse<T>) => response.data)
}

const post = <T>(url: string, data: any) => {
  return commonAxiosInstance.post<T>(url, data)
}

const postWithParams = (url: string, params: any) => {
  return commonAxiosInstance.post(url, null, {
    params: { ...params },
  })
}

const postWithParamsAndBody = (url: string, data: any, params: any) => {
  return commonAxiosInstance.post(url, data, {
    params: { ...params },
  })
}

const postFormUrlEncoded = (url: string, data: any) => {
  const params = new URLSearchParams()
  for (const key in data) {
    params.append(key, data[key])
  }
  return commonAxiosInstance.post(url, params)
}

const bLive = {
  get: <T>(url: string) =>
    bLiveAxiosInstance
      .get<T>(url)
      .then((response: AxiosResponse<T>) => response.data),
  getAsync: <T>(url: string) =>
    bLiveAxiosInstance
      .get<T>(url)
      .then((response: AxiosResponse<T>) => response.data),
}

export const apiService = {
  common: {
    get,
    getAsync,
    getByParams,
    post,
    postWithParams,
    postWithParamsAndBody,
    postFormUrlEncoded,
  },
  bLive,
  drund: {
    fetchDrundData,
    fetchDrundGameData,
  },
  supabase: {
    fetchSupabaseData,
  },
}
