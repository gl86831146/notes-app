import axios from 'axios'

const axiosInstance = axios.create ({
 baseURL: 'http://localhost:3000/api/',
//  baseURL: 'http://8.136.110.222:3001/api',
 withCredentials: true,
});

export default axiosInstance
