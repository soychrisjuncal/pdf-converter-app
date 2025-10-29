# 📚 Guía Paso a Paso - Deployment en GitHub

## 🎯 Objetivo
Subir tu proyecto a GitHub y desplegarlo en GitHub Pages (frontend) y Vercel (backend).

---

## 📝 Paso 1: Preparar el Proyecto Localmente

### 1.1 Instalar Dependencias

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 1.2 Probar Localmente

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Debería ver: `🚀 Servidor corriendo en http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Debería ver: `Local: http://localhost:5173`

Abre `http://localhost:5173` en tu navegador y prueba la aplicación.

---

## 🔧 Paso 2: Ajustar Configuración para Producción

### 2.1 Frontend - Actualizar API URL

Crea el archivo `frontend/.env.production`:

```env
VITE_API_URL=https://tu-backend.vercel.app
```

### 2.2 Frontend - Actualizar vite.config.js

Abre `frontend/vite.config.js` y cambia el `base`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/nombre-de-tu-repositorio/', // ⚠️ Cambia esto
  build: {
    outDir: 'dist',
  }
})
```

**Ejemplo:** Si tu repo se llama `pdf-converter`, usa `base: '/pdf-converter/'`

---

## 🚀 Paso 3: Crear Repositorio en GitHub

### 3.1 Crear Nuevo Repositorio

1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repositorio: `pdf-converter-app` (o el que prefieras)
3. Descripción: "Aplicación web para convertir archivos a PDF"
4. Mantén en **Público**
5. NO inicialices con README (ya tenemos uno)
6. Click en "Create repository"

### 3.2 Subir Código a GitHub

Abre la terminal en la carpeta raíz del proyecto:

```bash
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: PDF Converter App"

# Agregar el repositorio remoto (cambia 'soychrisjuncal' por tu usuario)
git remote add origin https://github.com/soychrisjuncal/pdf-converter-app.git

# Subir a GitHub
git push -u origin main
```

Si te pide credenciales, usa tu **Personal Access Token** de GitHub.

---

## 🌐 Paso 4: Desplegar Backend en Vercel

### 4.1 Instalar Vercel CLI

```bash
npm install -g vercel
```

### 4.2 Login en Vercel

```bash
vercel login
```

### 4.3 Desplegar Backend

```bash
cd backend
vercel
```

Responde las preguntas:
- **Set up and deploy?** → Yes
- **Which scope?** → Tu cuenta
- **Link to existing project?** → No
- **Project name?** → `pdf-converter-backend`
- **Directory?** → `./` (carpeta actual)
- **Override settings?** → No

Vercel te dará una URL como: `https://pdf-converter-backend.vercel.app`

### 4.4 Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Agrega:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`

### 4.5 Actualizar Frontend con URL del Backend

Edita `frontend/.env.production`:

```env
VITE_API_URL=https://pdf-converter-backend.vercel.app
```

---

## 📦 Paso 5: Desplegar Frontend en GitHub Pages

### 5.1 Crear GitHub Action

Crea el archivo `frontend/.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
        
      - name: Build
        working-directory: ./frontend
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

### 5.2 Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: **Deploy from a branch**
4. Branch: **gh-pages** → `/root`
5. Save

### 5.3 Push y Deploy

```bash
# En la raíz del proyecto
git add .
git commit -m "Add: GitHub Pages deployment"
git push
```

Espera 2-3 minutos y tu sitio estará en:
```
https://soychrisjuncal.github.io/pdf-converter-app/
```

---

## ✅ Paso 6: Verificar Deployment

### 6.1 Verificar Backend

Abre en el navegador:
```
https://tu-backend.vercel.app/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2025-10-27T..."
}
```

### 6.2 Verificar Frontend

Abre:
```
https://tu-usuario.github.io/tu-repo/
```

Prueba subir un archivo y convertirlo.

---

## 🔄 Paso 7: Hacer Cambios y Actualizar

### Para actualizar el código:

```bash
# Hacer cambios en el código
# ...

# Agregar cambios
git add .

# Commit
git commit -m "Update: descripción del cambio"

# Push
git push
```

**Frontend:** Se desplegará automáticamente con GitHub Actions

**Backend:** Actualiza con:
```bash
cd backend
vercel --prod
```

---

## 🐛 Troubleshooting

### Problema: El frontend no encuentra el backend

**Solución:** Verifica que la URL en `frontend/.env.production` sea correcta y que el backend esté funcionando.

### Problema: Error 404 en GitHub Pages

**Solución:** Verifica que el `base` en `vite.config.js` coincida con el nombre de tu repositorio.

### Problema: CORS errors

**Solución:** Asegúrate que el backend tenga configurado CORS correctamente (ya está incluido en `server.js`).

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Revisa las GitHub Actions
3. Abre un issue en el repositorio

---

## 🎉 ¡Listo!

Tu aplicación está desplegada y funcionando. Ahora puedes compartir el enlace con tu amigo.

**Frontend:** `https://tu-usuario.github.io/tu-repo/`  
**Backend:** `https://tu-backend.vercel.app`
