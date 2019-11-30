const axios = require('axios');

const axiosInstance = axios;

export const get = async (url: string) => axiosInstance.get(url);

export const head = async (url: string) => axiosInstance.head(url);
