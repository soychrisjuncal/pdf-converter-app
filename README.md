# 🚀 PDF Converter App

Aplicación web moderna para convertir archivos a PDF, con soporte para Word, Excel, archivos de texto y archivos `.crdownload` (descargas incompletas de Chrome).

![Made with React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Características

- 📄 **Conversión múltiple de formatos**: DOCX, DOC, XLSX, XLS, TXT, CRDOWNLOAD
- 🎨 **UI/UX moderna y elegante**: Diseñada con Tailwind CSS y Framer Motion
- 🖱️ **Drag & Drop intuitivo**: Arrastra archivos o haz clic para seleccionar
- ⚡ **Rápido y eficiente**: Conversiones en segundos
- 📱 **Responsive**: Funciona perfectamente en móviles, tablets y desktop
- 🔒 **Seguro**: Procesamiento en el servidor con limpieza automática

## 🛠️ Tecnologías

### Frontend
- **React 18** con **Vite**
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **React Dropzone** para carga de archivos
- **Lucide React** para iconos

### Backend
- **Node.js** con **Express**
- **Multer** para manejo de archivos
- **pdf-lib** para generación de PDFs
- **xlsx** para procesamiento de Excel

## 📦 Instalación

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### Backend

```bash
cd backend
npm install
npm start
```

El backend estará disponible en `http://localhost:3000`

## 🚀 Despliegue

### Frontend (GitHub Pages)

1. Actualiza el `base` en `vite.config.js` con el nombre de tu repositorio
2. Ejecuta:

```bash
cd frontend
npm run build
```

3. Sube la carpeta `dist` a GitHub Pages o usa GitHub Actions

### Backend (Vercel/Railway)

Para **Vercel**:
```bash
cd backend
vercel
```

Para **Railway**:
1. Conecta tu repositorio en Railway
2. Configura la carpeta raíz como `backend`
3. Deploy automático

## 📝 Variables de Entorno

### Backend

Crea un archivo `.env` en la carpeta `backend`:

```env
PORT=3000
NODE_ENV=production
MAX_FILE_SIZE=52428800
```

### Frontend

Crea un archivo `.env` en la carpeta `frontend`:

```env
VITE_API_URL=http://localhost:3000
```

## 🎯 Uso

1. Abre la aplicación en tu navegador
2. Arrastra archivos o haz clic en el área de carga
3. Selecciona los archivos que deseas convertir
4. Haz clic en "Convertir a PDF"
5. Descarga tus archivos convertidos

## 📋 Formatos Soportados

| Formato | Extensión | Estado |
|---------|-----------|--------|
| Word | `.docx`, `.doc` | ✅ |
| Excel | `.xlsx`, `.xls` | ✅ |
| Texto | `.txt` | ✅ |
| Chrome Downloads | `.crdownload` | ⚠️ Parcial |

## 🔄 Mejoras Futuras

- [ ] Integración con LibreOffice para mejor conversión de Word
- [ ] Soporte para imágenes (JPG, PNG)
- [ ] Soporte para PowerPoint
- [ ] Conversión batch mejorada
- [ ] Preview de archivos antes de convertir
- [ ] Compresión de PDFs
- [ ] Modo oscuro

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👨‍💻 Autor

**Christian Fernández Juncal**
- LinkedIn: [linkedin.com/in/soychrisjuncal](https://linkedin.com/in/soychrisjuncal)
- GitHub: [github.com/soychrisjuncal](https://github.com/soychrisjuncal)
- Behance: [behance.net/soychrisjuncal](https://behance.net/soychrisjuncal)

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub
