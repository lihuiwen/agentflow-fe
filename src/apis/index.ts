import axios, { AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/',
  // 禁用代理，避免系统HTTP代理干扰
  proxy: false,
  timeout: 10000, // 10秒超时
});

// 添加请求拦截器来处理本地开发环境
apiClient.interceptors.request.use(
  (config) => {
    // 在开发环境中，确保请求不走代理
    if (process.env.NODE_ENV === 'development') {
      // 设置请求头指示这是本地API调用
      // config.headers['X-Local-API'] = 'true';
    }
    return config;
  },
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  ({ data }: AxiosResponse) => {
    if(data.status === 200) {
      return data.data;
    }
    return data;
  },
  error => {
    // 增强错误信息
    if (error.response?.status === 502) {
      console.warn('🚨 检测到502错误，可能是系统HTTP代理导致的问题');
      console.warn('💡 建议：临时禁用HTTP代理或配置NO_PROXY=localhost');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
