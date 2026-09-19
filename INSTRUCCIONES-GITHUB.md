# 📘 GUÍA COMPLETA: Cómo subir tu código a GitHub

## ⚠️ IMPORTANTE: Aclaración

Yo (Claude) **NO tengo acceso a tu cuenta de GitHub**. No puedo subir archivos por ti. 
Pero te voy a guiar paso a paso para que lo hagas tú mismo de forma muy fácil.

---

## 📋 ¿Qué necesitas antes de empezar?

### 1. Instalar Git en tu computadora

**Windows:**
1. Ve a: https://git-scm.com/download/win
2. Descarga el instalador
3. Ejecútalo y acepta todas las opciones por defecto (solo "Next", "Next", "Install")
4. **IMPORTANTE**: Después de instalar, CIERRA todas las ventanas de PowerShell/CMD y ábrelas de nuevo

**Verificar que Git está instalado:**
- Abre PowerShell (busca "PowerShell" en el menú de inicio)
- Escribe: `git --version`
- Debe mostrar algo como: `git version 2.43.0.windows.1`

### 2. Tener tu repositorio creado en GitHub

Ya tienes uno creado: **Laboratorio_virtual_fisica_general**

---

## 🚀 MÉTODO 1: Usar el script automático (MÁS FÁCIL)

### Paso 1: Abrir PowerShell en la carpeta del proyecto

1. Abre el explorador de archivos
2. Navega a la carpeta donde está tu proyecto
3. En la barra de direcciones, escribe `powershell` y presiona Enter

### Paso 2: Ejecutar el script

En PowerShell, escribe:
```powershell
.\deploy.ps1
```

Si te da error de permisos, ejecuta primero:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Luego intenta de nuevo:
```powershell
.\deploy.ps1
```

### Paso 3: Seguir las instrucciones

El script te pedirá:
- Tu nombre (puedes poner tu nombre real)
- Tu email (usa el mismo email de GitHub)
- Tu usuario de GitHub: `JHFRGONZALEZ`
- Tu contraseña o token de GitHub (ver sección "Token de acceso" abajo)

---

## 🚀 MÉTODO 2: Comandos manuales (si el script no funciona)

### Paso 1: Abrir PowerShell en la carpeta del proyecto

Mismo procedimiento que arriba.

### Paso 2: Ejecutar estos comandos uno por uno

```powershell
# 1. Configurar Git (solo la primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"

# 2. Inicializar el repositorio
git init

# 3. Agregar todos los archivos
git add .

# 4. Crear el primer commit
git commit -m "🔬 Laboratorio Virtual de Física - MRU"

# 5. Conectar con tu repositorio de GitHub
git remote add origin https://github.com/JHFRGONZALEZ/Laboratorio_virtual_fisica_general.git

# 6. Cambiar a la rama main
git branch -M main

# 7. Subir todo a GitHub
git push -u origin main
```

### Paso 3: Autenticarte

Cuando te pida credenciales:
- **Username**: `JHFRGONZALEZ`
- **Password**: Usa un Token (ver abajo)

---

## 🔑 ¿Cómo crear un Token de GitHub?

GitHub ya no acepta contraseñas normales. Necesitas crear un token:

### Paso 1: Ir a la configuración de tokens

1. Ve a: https://github.com/settings/tokens
2. O haz clic en tu foto de perfil → Settings → Developer settings → Personal access tokens → Tokens (classic)

### Paso 2: Generar un nuevo token

1. Haz clic en **"Generate new token"** → **"Generate new token (classic)"**
2. En **"Note"** escribe: `Laboratorio Virtual`
3. En **"Expiration"** selecciona: `90 days` (o lo que prefieras)
4. En **"Select scopes"** marca: ✅ `repo` (la primera opción)
5. Haz clic en **"Generate token"** (botón verde abajo)

### Paso 3: Copiar el token

⚠️ **MUY IMPORTANTE**: 
- El token se muestra UNA SOLA VEZ
- Cópialo inmediatamente (algo como: `ghp_xxxxxxxxxxxxxxxxxxxx`)
- Guárdalo en un lugar seguro
- Úsalo como "contraseña" cuando Git te lo pida

---

## 🌐 Activar GitHub Pages

Una vez que tu código esté en GitHub:

### Paso 1: Ir a Settings

1. Ve a tu repositorio: https://github.com/JHFRGONZALEZ/Laboratorio_virtual_fisica_general
2. Haz clic en la pestaña **"Settings"** (Configuración) - icono de engranaje ⚙️

### Paso 2: Ir a Pages

1. En el menú lateral izquierdo, busca y haz clic en **"Pages"**
2. Está en la sección "Code and automation"

### Paso 3: Configurar el Source

1. Donde dice **"Source"**, verás un dropdown
2. Cambia de **"Deploy from a branch"** a **"GitHub Actions"**
3. No necesitas configurar nada más

### Paso 4: Esperar el deploy

1. Ve a la pestaña **"Actions"** en tu repositorio
2. Verás un workflow llamado "Build and Deploy to GitHub Pages"
3. Espera a que aparezca un ✅ verde (toma ~2 minutos)

### Paso 5: ¡Tu sitio está listo!

Tu laboratorio estará disponible en:
```
https://jhfrgonzalez.github.io/Laboratorio_virtual_fisica_general/
```

---

## 🔄 ¿Cómo actualizar el sitio después?

Cada vez que hagas cambios en el código:

```powershell
# En PowerShell, en la carpeta del proyecto:
git add .
git commit -m "Descripción de los cambios"
git push
```

GitHub Actions actualizará automáticamente el sitio en ~2 minutos.

---

## ❓ Solución de problemas comunes

### Error: "fatal: not a git repository"
**Solución**: No estás en la carpeta correcta. Navega a la carpeta del proyecto primero:
```powershell
cd C:\ruta\a\tu\proyecto
```

### Error: "Authentication failed"
**Solución**: Estás usando tu contraseña normal de GitHub. Usa un Token en su lugar (ver sección "Token de GitHub" arriba).

### Error: "remote origin already exists"
**Solución**: Elimina el remote y vuelve a agregarlo:
```powershell
git remote remove origin
git remote add origin https://github.com/JHFRGONZALEZ/Laboratorio_virtual_fisica_general.git
```

### El sitio muestra 404 después del deploy
**Solución**: 
1. Verifica que el workflow se completó (pestaña Actions)
2. Verifica que en Pages el Source es "GitHub Actions"
3. Espera 5 minutos más (a veces tarda)

### Los estilos no cargan
**Solución**: Verifica que `vite.config.js` tiene `base: "./"`

---

## 📞 ¿Necesitas más ayuda?

Si tienes algún problema específico:
1. Copia el mensaje de error completo
2. Describe qué paso estabas haciendo
3. Comparte la información y te ayudo a resolverlo

---

## ✅ Checklist final

- [ ] Git instalado en mi computadora
- [ ] Token de GitHub creado
- [ ] Código subido a GitHub (con `git push`)
- [ ] GitHub Pages activado con "GitHub Actions"
- [ ] Workflow completado (✅ verde en Actions)
- [ ] Sitio accesible en https://jhfrgonzalez.github.io/Laboratorio_virtual_fisica_general/

¡Listo! Tu laboratorio virtual está compartido con el mundo 🌍
