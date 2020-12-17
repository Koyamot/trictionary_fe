import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const apiGet = (endpoint) => {
  return axios.get(`${apiUrl}${endpoint}`);
};

export const apiPut = (endpoint, changes) => {
  return axios.put(`${apiUrl}${endpoint}`, changes);
};
