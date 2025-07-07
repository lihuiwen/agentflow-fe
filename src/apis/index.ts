import axios, { AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8007/',
});

apiClient.interceptors.response.use(
  ({ data }: AxiosResponse) => {
    return data;
  },
  error => Promise.reject(error),
);

export default apiClient;
