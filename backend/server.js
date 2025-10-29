import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { convertDocxToPdf, convertXlsxToPdf, convertTxtToPdf, handleCrdownload } from './converters.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Crear directorios para uploads y conversiones
const uploadsDir = path.join(__dirname, 'uploads')
const outputsDir = path.join(__dirname, 'outputs')

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true })

// Configurar Multer para recibir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB límite
})

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    message: 'PDF Converter API',
    version: '1.0.0',
    endpoints: {
      convert: 'POST /api/convert',
      health: 'GET /api/health'
    }
  })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/api/convert', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se recibieron archivos' })
    }

    const conversions = []

    for (const file of req.files) {
      try {
        const ext = path.extname(file.originalname).toLowerCase()
        const outputFilename = path.basename(file.originalname, ext) + '.pdf'
        const outputPath = path.join(outputsDir, outputFilename)

        let converted = false

        // Determinar tipo de archivo y convertir
        switch (ext) {
          case '.docx':
          case '.doc':
            await convertDocxToPdf(file.path, outputPath)
            converted = true
            break
          
          case '.xlsx':
          case '.xls':
            await convertXlsxToPdf(file.path, outputPath)
            converted = true
            break
          
          case '.txt':
            await convertTxtToPdf(file.path, outputPath)
            converted = true
            break
          
          case '.crdownload':
            const result = await handleCrdownload(file.path, outputPath)
            converted = result.success
            break
          
          default:
            throw new Error(`Formato no soportado: ${ext}`)
        }

        if (converted) {
          conversions.push({
            original: file.originalname,
            pdf: outputFilename,
            size: file.size,
            status: 'success',
            downloadUrl: `/api/download/${outputFilename}`
          })
        }

        // Eliminar archivo temporal
        fs.unlinkSync(file.path)

      } catch (error) {
        console.error(`Error convirtiendo ${file.originalname}:`, error)
        conversions.push({
          original: file.originalname,
          status: 'error',
          error: error.message
        })
        
        // Limpiar archivo temporal si existe
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path)
        }
      }
    }

    res.json({ 
      success: true,
      conversions,
      message: `${conversions.filter(c => c.status === 'success').length} de ${conversions.length} archivos convertidos exitosamente`
    })

  } catch (error) {
    console.error('Error en conversión:', error)
    res.status(500).json({ 
      success: false,
      error: 'Error en el servidor al convertir archivos',
      details: error.message
    })
  }
})

app.get('/api/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filepath = path.join(outputsDir, filename)

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' })
    }

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error al descargar:', err)
      }
      // Eliminar archivo después de descarga
      setTimeout(() => {
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath)
        }
      }, 5000)
    })

  } catch (error) {
    console.error('Error en descarga:', error)
    res.status(500).json({ error: 'Error al descargar archivo' })
  }
})

// Limpiar archivos antiguos cada hora
setInterval(() => {
  const now = Date.now()
  const maxAge = 60 * 60 * 1000 // 1 hora

  [uploadsDir, outputsDir].forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
      const filepath = path.join(dir, file)
      const stats = fs.statSync(filepath)
      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filepath)
        console.log(`Archivo antiguo eliminado: ${file}`)
      }
    })
  })
}, 60 * 60 * 1000)

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📁 Directorio de uploads: ${uploadsDir}`)
  console.log(`📄 Directorio de outputs: ${outputsDir}`)
})
