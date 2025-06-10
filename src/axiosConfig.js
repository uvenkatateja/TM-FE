import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://tm-be.vercel.app';

export default axios;