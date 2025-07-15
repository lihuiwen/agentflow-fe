import axios, { AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8088',
});

apiClient.interceptors.response.use(
  ({ data }: AxiosResponse) => {
    if(data.status === 200) {
      return data.data;
    }
    return data;
  },
  error => Promise.reject(error),
);

export default apiClient;
