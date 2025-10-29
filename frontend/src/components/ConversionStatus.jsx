import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle, Download, RotateCcw } from 'lucide-react'

const ConversionStatus = ({ converting, converted, onReset, onDownload }) => {
  return (
    <AnimatePresence mode="wait">
      {/* Loading State */}
      {converting && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="mt-8 glass-effect rounded-2xl p-12 text-center"
        >
          <Loader2 className="mx-auto text-blue-500 mb-4 animate-spin" size={64} />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Convirtiendo tus archivos...
          </h3>
          <p className="text-gray-600">
            Por favor espera, esto tomará solo unos segundos
          </p>
        </motion.div>
      )}

      {/* Success State */}
      {converted.length > 0 && !converting && (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="glass-effect rounded-2xl p-8">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                ¡Conversión exitosa!
              </h3>
              <p className="text-gray-600">
                Tus archivos han sido convertidos a PDF
              </p>
            </div>

            <div className="space-y-3">
              {converted.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/50 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {file.original}
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <CheckCircle size={12} />
                      Convertido a {file.pdf}
                    </p>
                  </div>

                  <button 
                    onClick={() => onDownload(file.pdf)}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <Download size={16} />
                    Descargar
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={onReset}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
              >
                <RotateCcw size={20} />
                Convertir más archivos
              </button>
              
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow flex items-center gap-2 font-medium">
                <Download size={20} />
                Descargar todos
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ConversionStatus
