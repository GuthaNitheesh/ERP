import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  data?: any;
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      withCredentials: config.withCredentials !== false,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // You can add auth token here if needed
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
  this.client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Safely handle cases where data might not have 'message'
    const errorData = error.response?.data as { message?: string } | undefined;

    const apiError: ApiError = {
      message: errorData?.message || error.message || 'An error occurred',
      statusCode: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(apiError);
  }
);

  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

export default ApiClient;

