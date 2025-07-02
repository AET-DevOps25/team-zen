const rawUrl = "__VITE_API_URL__";
// TODO: I dont know why and how is this used for
export const API_BASE_URL = rawUrl !== "__VITE_API_URL__" ? rawUrl : 'http://localhost:8085';
// export const API_BASE_URL = import.meta.env.API_URL || 'http://localhost:8085';

export type ApiResponse<T> = {
  data: T;
  message?: string;
};
