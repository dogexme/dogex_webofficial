import _axios from 'axios'

export default _axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_BASE_URL : '',
})
