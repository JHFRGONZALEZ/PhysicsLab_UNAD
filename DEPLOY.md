# 🚀 Guía de Despliegue - Laboratorio Virtual de Física

## ✅ Tu proyecto está listo para compartir

Esta guía te explica paso a paso cómo publicar tu laboratorio virtual en GitHub Pages para que cualquier persona pueda acceder con un link.

---

## 📋 Paso 1: Crear el repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repositorio: `laboratorio-virtual-fisica` (o el que prefieras)
3. **NO** marques "Add a README file" (ya lo tenemos)
4. Haz clic en **Create repository**

---

## 📋 Paso 2: Subir tu código

Abre la terminal en la carpeta de tu proyecto y ejecuta:

```bash
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "🔬 Laboratorio Virtual de Física - MRU"

# Conectar con GitHub (cambia TU-USUARIO por tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/laboratorio-virtual-fisica.git

# Subir el código
git branch -M main
git push -u origin main
```

---

## 📋 Paso 3: Activar GitHub Pages con Actions

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, haz clic en **Pages**
4. En **"Source"**, cambia de "Deploy from a branch" a **"GitHub Actions"**
5. ¡Eso es todo! No necesitas configurar nada más.

---

## 📋 Paso 4: Esperar el despliegue

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás el workflow "Build and Deploy" ejecutándose
3. Espera ~2 minutos
4. Cuando aparezca ✅ verde, tu sitio está en línea

---

## 📋 Paso 5: ¡Compartir!

Tu sitio estará disponible en:

```
https://TU-USUARIO.github.io/laboratorio-virtual-fisica/
```

### Ejemplo:
Si tu usuario es `jhfrgonzalez` y el repo se llama `laboratorio-virtual-fisica`:

```
https://jhfrgonzalez.github.io/laboratorio-virtual-fisica/
```

---

## 🔄 Actualizaciones automáticas

Cada vez que hagas push a la rama `main`, el sitio se actualizará automáticamente:

```bash
# Hacer cambios...
git add .
git commit -m "Mejoras en la simulación"
git push
```

En ~2 minutos, los cambios estarán en línea.

---

## 📱 Compartir en redes sociales

Cuando compartas el link, se verá así gracias a las meta tags:

- **Título**: 🔬 Laboratorio Virtual de Física - MRU
- **Descripción**: Experimenta, mide y analiza el Movimiento Rectilíneo Uniforme
- **Color del tema**: Azul (#2563eb)

---

## ❓ Solución de problemas

### El sitio muestra 404
- Verifica que el workflow se ejecutó correctamente en Actions
- Asegúrate de que Pages está configurado con "GitHub Actions" como Source

### Los estilos no cargan
- Verifica que `vite.config.js` tiene `base: "./"`

### El build falla
- Ejecuta `npm run build` localmente para ver errores
- Asegúrate de que `node_modules` está en `.gitignore`

---

## 🎯 URL personalizada (Opcional)

Si tienes un dominio propio, puedes configurarlo en:
**Settings → Pages → Custom domain**

---

## 📊 Estadísticas

Para ver cuántas personas visitan tu sitio:
- GitHub no provee analytics directamente
- Puedes agregar Google Analytics o Plausible editando `index.html`

---

¡Listo! Tu laboratorio virtual está compartido con el mundo 🌍
