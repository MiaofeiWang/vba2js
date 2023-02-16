/* eslint-disable @typescript-eslint/no-var-requires */
import axios, { AxiosRequestConfig } from "axios";
import qs = require('qs');
import { api } from "./config";

/* global process, console */

// 创建 axios 实例
axios.defaults.baseURL = api.baseUrl;
axios.defaults.timeout = 6000;
export const get = (url: string, config: AxiosRequestConfig = {}): Promise<any> =>
  new Promise((resolve) => {
    axios
      .get(url, {
        params: config.params,
        signal: config.signal,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
      })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error);
      });
  });

// post request
export const post = (url: string, data = {}, config: AxiosRequestConfig = {}): Promise<any> =>
  new Promise((resolve) => {
    axios
      .post(url, data, config)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.error(error);
      });
  });

const request = axios.create({
  // API 请求的默认前缀
  baseURL: api.baseUrl,
  timeout: 6000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error: { response: { data: any; status: number; }; }) => {
  console.log("@@@@@", error);
  if (error.response) {
    const data = error.response.data;
    // 从 localstorage 获取 token
    // const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      console.error({
        message: "Forbidden",
        description: data.message,
      });
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      console.error({
        message: "未登录",
        description: "权限验证失败",
      });
    }
  }
  return Promise.reject(error);
};

export default request;

export { request as axios };
