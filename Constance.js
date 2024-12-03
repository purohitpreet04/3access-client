import axios from 'axios'
const url = import.meta.env.VITE_API_url
// const url = 'http://localhost:8000/'

const API = axios.create({ baseURL: url })

API.interceptors.request.use(async (req) => {
    // const { user } = useSelector(state => state.auth)
    let token = await JSON.parse(localStorage.getItem('authToken'))
    let userdata = JSON.parse(localStorage.getItem('persist:root'))
    let user = JSON.parse(userdata?.user)
    // console.log(userdata)
    if (token) {
        req.headers.authorization = `Bearer ${token}`
        req.headers['user'] = String(user?._id);
    }
    return req
})

API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors globally
        if (error.response?.status === 409) {
            // Redirect unauthorized users to login
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);
export default API


