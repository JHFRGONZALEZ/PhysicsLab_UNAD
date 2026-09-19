# PowerShell Script para subir el Laboratorio Virtual a GitHub
# Usuario: JHFRGONZALEZ
# Repositorio: Laboratorio_virtual_fisica_general

Write-Host "🔬 Subiendo Laboratorio Virtual de Física a GitHub..." -ForegroundColor Cyan
Write-Host ""

# Verificar si git está instalado
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git no está instalado." -ForegroundColor Red
    Write-Host "Por favor descárgalo de: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Después de instalarlo, CIERRA y ABRE PowerShell de nuevo." -ForegroundColor Yellow
    pause
    exit
}

# Configurar git (si no está configurado)
$gitName = git config user.name
$gitEmail = git config user.email

if (-not $gitName) {
    $gitName = Read-Host "📝 Escribe tu nombre completo"
    git config --global user.name "$gitName"
}

if (-not $gitEmail) {
    $gitEmail = Read-Host "📧 Escribe tu email de GitHub"
    git config --global user.email "$gitEmail"
}

# Inicializar repositorio si no existe
if (-not (Test-Path .git)) {
    Write-Host "📦 Inicializando repositorio Git..." -ForegroundColor Green
    git init
}

# Agregar todos los archivos
Write-Host "📂 Agregando archivos..." -ForegroundColor Green
git add .

# Commit
Write-Host "💾 Creando commit..." -ForegroundColor Green
git commit -m "🔬 Laboratorio Virtual de Física - MRU - Versión inicial"

# Agregar remote
Write-Host "🔗 Conectando con GitHub..." -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin https://github.com/JHFRGONZALEZ/Laboratorio_virtual_fisica_general.git

# Cambiar a main
Write-Host "🌿 Cambiando a rama main..." -ForegroundColor Green
git branch -M main

# Push
Write-Host "🚀 Subiendo a GitHub..." -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Te pedirá tu usuario y contraseña/token de GitHub" -ForegroundColor Yellow
Write-Host ""
git push -u origin main

Write-Host ""
Write-Host "✅ ¡Listo! Tu código está en GitHub" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URL del repositorio:" -ForegroundColor Cyan
Write-Host "   https://github.com/JHFRGONZALEZ/Laboratorio_virtual_fisica_general" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Ahora activa GitHub Pages:" -ForegroundColor Cyan
Write-Host "   1. Ve a Settings → Pages" -ForegroundColor White
Write-Host "   2. En Source selecciona: GitHub Actions" -ForegroundColor White
Write-Host "   3. Espera 2 minutos" -ForegroundColor White
Write-Host "   4. Tu sitio estará en:" -ForegroundColor White
Write-Host "      https://jhfrgonzalez.github.io/Laboratorio_virtual_fisica_general/" -ForegroundColor Green
Write-Host ""
pause
