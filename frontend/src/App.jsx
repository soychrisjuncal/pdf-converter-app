import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FileUploader from './components/FileUploader'
import ConversionStatus from './components/ConversionStatus'
import { FileText, Github, Heart, AlertCircle } from 'lucide-react'
import api from './services/api'

function App() {
  const [files, setFiles] = useState([])
  const [converting, setConverting] = useState(false)
  const [converted, setConverted] = useState([])
  const [error, setError] = useState(null)
  const [serverStatus, setServerStatus] = useState('checking')

  useEffect(() => {
    checkServerHealth()
  }, [])

  const checkServerHealth = async () => {
    try {
      const health = await api.checkHealth()
      setServerStatus(health.status === 'ok' ? 'online' : 'offline')
    } catch (err) {
      setServerStatus('offline')
    }
  }

  const handleFilesAccepted = (acceptedFiles) => {
    setFiles(acceptedFiles)
    setConverted([])
    setError(null)
  }

  const handleConvert = async () => {
    setConverting(true)
    setError(null)
    
    try {
      const response = await api.convertFiles(files)
      
      if (response.success) {
        setConverted(response.conversions)
      } else {
        setError('Error al convertir algunos archivos')
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor')
      console.error('Error en conversión:', err)
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = async (filename) => {
    try {
      await api.downloadFile(filename)
    } catch (err) {
      console.error('Error al descargar:', err)
    }
  }

  const handleReset = () => {
    setFiles([])
    setConverted([])
    setConverting(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-effect sticky top-0 z-50 border-b"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PDF Converter
                </h1>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  Convierte archivos fácilmente
                  <span className={`inline-block w-2 h-2 rounded-full ml-1 ${
                    serverStatus === 'online' ? 'bg-green-500' : 
                    serverStatus === 'offline' ? 'bg-red-500' : 
                    'bg-yellow-500'
                  }`} title={serverStatus === 'online' ? 'Servidor en línea' : 'Servidor fuera de línea'} />
                </p>
              </div>
            </div>
            <a 
              href="https://github.com/soychrisjuncal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              <Github size={20} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            >
              Convierte tus archivos a PDF
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Soporta Word, Excel, archivos incompletos (.crdownload) y más. 
              Rápido, seguro y fácil de usar.
            </motion.p>
          </div>

          {/* Supported Formats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {['DOCX', 'DOC', 'XLSX', 'XLS', 'TXT', 'CRDOWNLOAD'].map((format) => (
              <span 
                key={format}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 shadow-md"
              >
                .{format.toLowerCase()}
              </span>
            ))}
          </motion.div>

          {/* File Uploader Component */}
          <FileUploader 
            onFilesAccepted={handleFilesAccepted}
            files={files}
            converting={converting}
          />

          {/* Convert Button */}
          <AnimatePresence>
            {files.length > 0 && !converting && converted.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={handleConvert}
                  disabled={serverStatus === 'offline'}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Convertir {files.length} {files.length === 1 ? 'archivo' : 'archivos'} a PDF
                </button>
                {serverStatus === 'offline' && (
                  <p className="text-red-600 text-sm mt-2 flex items-center justify-center gap-1">
                    <AlertCircle size={16} />
                    Servidor no disponible. Verifica la conexión.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 glass-effect rounded-xl p-4 bg-red-50/80 border-2 border-red-200"
              >
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={20} />
                  <p className="font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversion Status */}
          <ConversionStatus 
            converting={converting}
            converted={converted}
            onReset={handleReset}
            onDownload={handleDownload}
          />

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: '⚡',
                title: 'Súper Rápido',
                description: 'Conversión en segundos sin complicaciones'
              },
              {
                icon: '🔒',
                title: 'Seguro',
                description: 'Tus archivos se procesan localmente'
              },
              {
                icon: '🎨',
                title: 'Múltiples Formatos',
                description: 'Soporta Word, Excel, .crdownload y más'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glass-effect p-6 rounded-2xl text-center"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="glass-effect border-t mt-16"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm flex items-center gap-2">
              Hecho con <Heart className="text-red-500" size={16} fill="currentColor" /> por Christian Juncal
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com/in/soychrisjuncal" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                LinkedIn
              </a>
              <a href="https://github.com/soychrisjuncal" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                GitHub
              </a>
              <a href="https://behance.net/soychrisjuncal" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors">
                Behance
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default App
