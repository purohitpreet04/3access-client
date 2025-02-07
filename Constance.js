import axios from 'axios'
const url = import.meta.env.VITE_API_url
// const url = 'http://localhost:8000/'
const API = axios.create({ baseURL: url })

API.interceptors.request.use(async (req) => {
    let token = await JSON.parse(localStorage.getItem('authToken'))
    let userdata = JSON.parse(localStorage.getItem('user'))
    if(token && userdata){
        let user = userdata
        req.headers.authorization = `Bearer ${token}`
        req.headers['user'] = String(user?._id);
        const commonParams = {
            addedByModel: ['company', 'agent'].includes(user?.role) ? "User" : "Staff",
        };
    
        if (req.params) {
            req.params = { ...req.params, ...commonParams };
        } else {
            req.params = commonParams;
        }
    }
    return req
})

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 409) {
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default API


