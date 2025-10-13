import {API_BASE_URL} from '@/constants/api-resources';
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';

/* Extend Axios types */
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

/* Create instance */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send cookies
});

/* Log outgoing requests (optional) */
api.interceptors.request.use(
  config => {
    console.log('[Request]', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => Promise.reject(error),
);

/* Simple refresh queue */
let isRefreshing = false;
let failedQueue: Array<[() => void, (err: unknown) => void]> = [];

const processQueue = (err: unknown) => {
  failedQueue.forEach(([res, rej]) => (err ? rej(err) : res()));
  failedQueue = [];
};

/* Handle expired access tokens */
api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const orig = error.config as AxiosRequestConfig;

    if (axios.isAxiosError(error)) {
      console.log('Interceptor caught error:', error.response?.status);
    }

    // Only handle 401s once
    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push([() => resolve(api(orig)), reject]);
        });
      }

      isRefreshing = true;
      try {
        const {data} = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          {withCredentials: true},
        );

        console.log(
          '%c[Auth]',
          'color: green',
          'Token refreshed successfully',
          data,
        );

        // Wait for cookies to update
        await new Promise(r => setTimeout(r, 100));

        processQueue(null);
        return api(orig);
      } catch (refreshErr) {
        console.error('[Auth] Refresh token failed:', refreshErr);
        processQueue(refreshErr);

        // Force logout
        if (typeof window !== 'undefined') {
          window.location.href = '/login?reason=sessionExpired';
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
