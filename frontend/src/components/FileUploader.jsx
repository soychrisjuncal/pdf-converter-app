import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, File, X } from 'lucide-react'

const FileUploader = ({ onFilesAccepted, files, converting }) => {
  const onDrop = useCallback((acceptedFiles) => {
    onFilesAccepted(acceptedFiles)
  }, [onFilesAccepted])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: converting,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt'],
      'application/octet-stream': ['.crdownload']
    }
  })

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    onFilesAccepted(newFiles)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div>
      <motion.div
        {...getRootProps()}
        whileHover={!converting ? { scale: 1.02 } : {}}
        whileTap={!converting ? { scale: 0.98 } : {}}
        className={`
          glass-effect rounded-2xl p-12 text-center cursor-pointer
          border-2 border-dashed transition-all duration-300
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50/50' 
            : 'border-gray-300 hover:border-blue-400'
          }
          ${converting ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          className="mb-4"
        >
          <Upload 
            size={64} 
            className={`mx-auto ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
          />
        </motion.div>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {isDragActive 
            ? '¡Suelta los archivos aquí!' 
            : 'Arrastra archivos o haz clic para seleccionar'
          }
        </h3>
        
        <p className="text-gray-600">
          Soporta: DOCX, DOC, XLSX, XLS, TXT, CRDOWNLOAD
        </p>
      </motion.div>

      {/* Files List */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-3"
        >
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Archivos seleccionados ({files.length})
          </h4>
          
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-xl p-4 flex items-center justify-between group hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <File className="text-white" size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              {!converting && (
                <button
                  onClick={() => removeFile(index)}
                  className="ml-4 p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={20} />
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default FileUploader
