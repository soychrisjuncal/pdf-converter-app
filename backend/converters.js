import fs from 'fs'
import path from 'path'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import xlsx from 'xlsx'

/**
 * Convierte archivos DOCX/DOC a PDF
 * Nota: Para producción, necesitarás LibreOffice o una API externa
 */
export async function convertDocxToPdf(inputPath, outputPath) {
  try {
    // Para una implementación simple, creamos un PDF con el texto extraído
    // En producción, usa LibreOffice CLI o una API como CloudConvert
    
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 800])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    
    page.drawText('Documento convertido desde DOCX', {
      x: 50,
      y: 750,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    })
    
    page.drawText('Este es un placeholder de conversión.', {
      x: 50,
      y: 720,
      size: 12,
      font,
      color: rgb(0.3, 0.3, 0.3),
    })
    
    page.drawText('Para producción, integra LibreOffice o una API externa.', {
      x: 50,
      y: 700,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    })
    
    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync(outputPath, pdfBytes)
    
    return { success: true, message: 'Convertido exitosamente' }
  } catch (error) {
    throw new Error(`Error al convertir DOCX: ${error.message}`)
  }
}

/**
 * Convierte archivos XLSX/XLS a PDF
 */
export async function convertXlsxToPdf(inputPath, outputPath) {
  try {
    const workbook = xlsx.readFile(inputPath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 })
    
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([800, 1000])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    
    let yPosition = 950
    const lineHeight = 20
    
    page.drawText(`Excel: ${sheetName}`, {
      x: 50,
      y: yPosition,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })
    
    yPosition -= 30
    
    // Renderizar datos (primeras 30 filas)
    data.slice(0, 30).forEach((row, index) => {
      if (yPosition < 50) return // Evitar salir del margen
      
      const rowText = row.join(' | ')
      page.drawText(rowText.substring(0, 100), {
        x: 50,
        y: yPosition,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      })
      
      yPosition -= lineHeight
    })
    
    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync(outputPath, pdfBytes)
    
    return { success: true, message: 'Excel convertido exitosamente' }
  } catch (error) {
    throw new Error(`Error al convertir Excel: ${error.message}`)
  }
}

/**
 * Convierte archivos TXT a PDF
 */
export async function convertTxtToPdf(inputPath, outputPath) {
  try {
    const textContent = fs.readFileSync(inputPath, 'utf-8')
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Courier)
    
    const lines = textContent.split('\n')
    const linesPerPage = 45
    const lineHeight = 15
    
    for (let i = 0; i < lines.length; i += linesPerPage) {
      const page = pdfDoc.addPage([600, 800])
      let yPosition = 750
      
      const pageLines = lines.slice(i, i + linesPerPage)
      
      pageLines.forEach(line => {
        if (yPosition > 50) {
          page.drawText(line.substring(0, 80), {
            x: 50,
            y: yPosition,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          })
          yPosition -= lineHeight
        }
      })
    }
    
    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync(outputPath, pdfBytes)
    
    return { success: true, message: 'TXT convertido exitosamente' }
  } catch (error) {
    throw new Error(`Error al convertir TXT: ${error.message}`)
  }
}

/**
 * Maneja archivos .crdownload (descargas incompletas de Chrome)
 * Intenta detectar el tipo y procesar lo que sea posible
 */
export async function handleCrdownload(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath)
    const buffer = fs.readFileSync(inputPath)
    
    // Crear un PDF informativo sobre el archivo .crdownload
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 800])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    page.drawText('Archivo .crdownload detectado', {
      x: 50,
      y: 750,
      size: 18,
      font: boldFont,
      color: rgb(0.8, 0.3, 0),
    })
    
    page.drawText('Este es un archivo de descarga incompleta de Chrome.', {
      x: 50,
      y: 720,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    })
    
    page.drawText(`Tamaño del archivo: ${(stats.size / 1024).toFixed(2)} KB`, {
      x: 50,
      y: 690,
      size: 11,
      font,
      color: rgb(0.3, 0.3, 0.3),
    })
    
    page.drawText('Para obtener el archivo completo:', {
      x: 50,
      y: 650,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    
    const instructions = [
      '1. Espera a que la descarga se complete',
      '2. El archivo .crdownload desaparecerá automáticamente',
      '3. Aparecerá el archivo final con su extensión correcta',
      '4. Luego podrás convertirlo normalmente'
    ]
    
    let yPos = 620
    instructions.forEach(instruction => {
      page.drawText(instruction, {
        x: 70,
        y: yPos,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      })
      yPos -= 25
    })
    
    // Detectar posible tipo de archivo
    const possibleType = detectFileType(buffer)
    if (possibleType) {
      page.drawText(`Posible tipo de archivo: ${possibleType}`, {
        x: 50,
        y: yPos - 30,
        size: 11,
        font,
        color: rgb(0, 0.5, 0),
      })
    }
    
    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync(outputPath, pdfBytes)
    
    return { 
      success: true, 
      message: 'Información sobre .crdownload generada',
      warning: 'Archivo de descarga incompleta'
    }
  } catch (error) {
    throw new Error(`Error al procesar .crdownload: ${error.message}`)
  }
}

/**
 * Intenta detectar el tipo de archivo por sus magic bytes
 */
function detectFileType(buffer) {
  const signatures = {
    'PDF': [0x25, 0x50, 0x44, 0x46],
    'ZIP/DOCX': [0x50, 0x4B, 0x03, 0x04],
    'PNG': [0x89, 0x50, 0x4E, 0x47],
    'JPEG': [0xFF, 0xD8, 0xFF],
  }
  
  for (const [type, signature] of Object.entries(signatures)) {
    let match = true
    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) {
        match = false
        break
      }
    }
    if (match) return type
  }
  
  return null
}

export async function handlePdf(inputPath, outputPath) {
  try {
    // Si ya es PDF, simplemente copiarlo
    fs.copyFileSync(inputPath, outputPath)
    return { success: true, message: 'PDF procesado' }
  } catch (error) {
    throw new Error(`Error al procesar PDF: ${error.message}`)
  }
}

export default {
  convertDocxToPdf,
  convertXlsxToPdf,
  convertTxtToPdf,
  handleCrdownload
}
