export const API_BASE_URL = import.meta.env.API_URL || 'http://localhost:8085';

export type ApiResponse<T> = {
  data: T;
  message?: string;
};
