const axios = require('axios');

const axiosInstance = axios;

exports.get = async (url) => axiosInstance.get(url);

exports.head = async (url) => axiosInstance.head(url);
