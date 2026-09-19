# 📘 GUÍA SIMPLE: Cómo subir tu Laboratorio a GitHub Pages

## 🎯 Método FÁCIL (como una página normal)

Este método es igual que subir una página HTML normal. ¡Solo 5 pasos!

---

## 📋 PASO 1: Subir tu código a GitHub

### Opción A: Desde la web de GitHub (MÁS FÁCIL)

1. Ve a tu repositorio: **https://github.com/JHFRGONZALEZ/Laboratorio_virtual_fisica_general**

2. Haz clic en **"Add file"** → **"Upload files"**

3. Arrastra TODOS los archivos de tu proyecto a la zona de upload
   - **IMPORTANTE**: NO arrastes la carpeta `node_modules` (si la ves)
   - Si no ves `node_modules`, está bien, no la necesitas

4. En "Commit changes" escribe: `Subir laboratorio virtual`

5. Haz clic en **"Commit changes"**

### Opción B: Con Git (si ya lo tienes instalado)

```bash
git init
git add .
git commit -m "Subir laboratorio virtual"
git remote add origin https://github.com/JHFRGONZALEZ/Laboratorio_virtual_fisica_general.git
git branch -M main
git push -u origin main
```

---

## 📋 PASO 2: Construir el proyecto

Ahora necesitas "construir" el proyecto para generar los archivos que se mostrarán.

### En esta plataforma (donde estás ahora):

1. Busca un botón que diga **"Build"** o **"Construir"**
2. Haz clic en él
3. Espera a que termine (verás un mensaje de éxito)

Esto creará una carpeta llamada **`docs`** con los archivos optimizados.

---

## 📋 PASO 3: Subir la carpeta `docs` a GitHub

Después de construir:

1. Ve de nuevo a tu repositorio en GitHub
2. Haz clic en **"Add file"** → **"Upload files"**
3. Ahora arrastra SOLO la carpeta **`docs`** (que se creó al construir)
4. En "Commit changes" escribe: `Agregar archivos construidos`
5. Haz clic en **"Commit changes"**

---

## 📋 PASO 4: Configurar GitHub Pages

1. En tu repositorio, haz clic en **"Settings"** (⚙️ Configuración)

2. En el menú izquierdo, busca y haz clic en **"Pages"**

3. En la sección **"Source"**:
   - **Branch**: selecciona `main`
   - **Folder**: selecciona `/docs` ← ¡MUY IMPORTANTE!
   
4. Haz clic en **"Save"**

---

## 📋 PASO 5: ¡Listo!

Espera 1-2 minutos y tu sitio estará en:

```
https://jhfrgonzalez.github.io/Laboratorio_virtual_fisica_general/
```

---

## 🔄 ¿Cómo actualizar el sitio después?

Cada vez que hagas cambios:

1. Construye el proyecto de nuevo (PASO 2)
2. Sube la carpeta `docs` actualizada a GitHub (PASO 3)
3. ¡Listo! GitHub Pages actualizará automáticamente

---

## ❓ Preguntas frecuentes

### P: ¿Por qué necesito construir el proyecto?
R: Porque este proyecto usa React, que necesita ser "compilado" a HTML/CSS/JS normal. Es como convertir un documento de Word a PDF.

### P: ¿Qué pasa si no veo la carpeta `docs`?
R: Significa que no has construido el proyecto todavía. Busca el botón "Build" o "Construir" en esta plataforma.

### P: ¿Puedo editar el código directamente en GitHub?
R: No. Los archivos de código fuente (React/TypeScript) no funcionan directamente en el navegador. Siempre necesitas construir primero.

### P: ¿Por qué `/docs` y no `/dist`?
R: GitHub Pages puede servir desde la carpeta `/docs` directamente. Es más simple que usar GitHub Actions.

---

## 🎉 ¡Eso es todo!

Tu laboratorio virtual estará disponible para que cualquiera lo visite con el link.

**URL final**: https://jhfrgonzalez.github.io/Laboratorio_virtual_fisica_general/
