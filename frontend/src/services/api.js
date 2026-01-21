import axios from 'axios'

const base = import.meta.env.VITE_API_URL || 'http://localhost:8787'
axios.defaults.baseURL = base
axios.defaults.headers.common['Content-Type'] = 'application/json'

export default axios