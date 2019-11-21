import axios from 'axios'

const httpClient = axios.create({
  baseURL: 'http://localhost:8000',
  // baseURL: 'http://phpstack-260915-1013924.cloudwaysapps.com',
  headers: {
    'Content-Type': 'application/json'
    // anything you want to add to the headers
  }
})

// inject auth header
const tokenType = 'Bearer '
const getAuthToken = () => localStorage.getItem('token')
if(getAuthToken) {
  const authInterceptor = (config) => {
    config.headers['Authorization'] = tokenType + getAuthToken()
    return config
  }
  httpClient.interceptors.request.use(authInterceptor)
}

export default httpClient
