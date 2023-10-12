//封装axios
//实例化 请求拦截器 响应拦截器

import axios from "axios"

const http = axios.create({
  // baseURL: 'http://8.134.179.176:5000'
  baseURL: 'http://localhost:5000'
})
export { http }