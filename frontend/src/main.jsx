import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios' // ← make sure this is imported

// Set base URL from env var
axios.defaults.baseURL = import.meta.env.VITE_API_URL

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)