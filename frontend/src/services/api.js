import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class PDFConverterAPI {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  async convertFiles(files) {
    try {
      const formData = new FormData()
      
      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await this.api.post('/api/convert', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          console.log(`Upload Progress: ${percentCompleted}%`)
        }
      })

      return response.data
    } catch (error) {
      console.error('Error al convertir archivos:', error)
      throw new Error(
        error.response?.data?.error || 
        'Error al conectar con el servidor'
      )
    }
  }

  async downloadFile(filename) {
    try {
      const response = await this.api.get(`/api/download/${filename}`, {
        responseType: 'blob'
      })

      // Crear URL temporal para descarga
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      console.error('Error al descargar archivo:', error)
      throw new Error('Error al descargar el archivo')
    }
  }

  async checkHealth() {
    try {
      const response = await this.api.get('/api/health')
      return response.data
    } catch (error) {
      console.error('Error al verificar salud del servidor:', error)
      return { status: 'error' }
    }
  }
}

export default new PDFConverterAPI()
