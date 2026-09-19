#!/bin/bash

# Script para subir el Laboratorio Virtual a GitHub
# Usuario: JHFRGONZALEZ
# Repositorio: Laboratorio_virtual_fisica_general

echo "🔬 Subiendo Laboratorio Virtual de Física a GitHub..."
echo ""

# Verificar si git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado. Por favor instálalo primero:"
    echo "   - Windows: https://git-scm.com/download/win"
    echo "   - Mac: brew install git"
    echo "   - Linux: sudo apt install git"
    exit 1
fi

# Configurar git (si no está configurado)
if [ -z "$(git config user.name)" ]; then
    echo "📝 Configura tu nombre de Git:"
    read -p "Tu nombre: " git_name
    git config --global user.name "$git_name"
fi

if [ -z "$(git config user.email)" ]; then
    echo "📧 Configura tu email de Git:"
    read -p "Tu email: " git_email
    git config --global user.email "$git_email"
fi

# Inicializar repositorio si no existe
if [ ! -d .git ]; then
    echo "📦 Inicializando repositorio Git..."
    git init
fi

# Agregar todos los archivos
echo "📂 Agregando archivos..."
git add .

# Commit
echo "💾 Creando commit..."
git commit -m "🔬 Laboratorio Virtual de Física - MRU - Versión inicial"

# Agregar remote
echo "🔗 Conectando con GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/JHFRGONZALEZ/Laboratorio_virtual_fisica_general.git

# Cambiar a main
echo "🌿 Cambiando a rama main..."
git branch -M main

# Push
echo "🚀 Subiendo a GitHub..."
echo ""
echo "⚠️  Te pedirá tu usuario y contraseña/token de GitHub"
echo ""
git push -u origin main

echo ""
echo "✅ ¡Listo! Tu código está en GitHub"
echo ""
echo "📍 URL del repositorio:"
echo "   https://github.com/JHFRGONZALEZ/Laboratorio_virtual_fisica_general"
echo ""
echo "🌐 Ahora activa GitHub Pages:"
echo "   1. Ve a Settings → Pages"
echo "   2. En Source selecciona: GitHub Actions"
echo "   3. Espera 2 minutos"
echo "   4. Tu sitio estará en:"
echo "      https://jhfrgonzalez.github.io/Laboratorio_virtual_fisica_general/"
echo ""
