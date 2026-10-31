#!/bin/bash

# Briamco Strapi - Startup Script

echo "================================"
echo "Briamco CMS - Strapi Startup"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✓ Docker and Docker Compose are installed"
echo ""

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running. Please start Docker."
    exit 1
fi

echo "✓ Docker daemon is running"
echo ""

# Build images
echo "📦 Building Docker images..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✓ Build completed successfully"
echo ""

# Start containers
echo "🚀 Starting containers..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start containers!"
    exit 1
fi

echo "✓ Containers started successfully"
echo ""

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if Strapi is running
echo "🔍 Checking Strapi health..."
if docker-compose exec -T strapi wget --quiet --tries=1 --spider http://localhost:1337/admin 2>/dev/null; then
    echo "✓ Strapi is running"
else
    echo "⚠️  Strapi might still be starting..."
fi

echo ""
echo "================================"
echo "✅ Startup Complete!"
echo "================================"
echo ""
echo "📍 Access your CMS at:"
echo "   Admin Panel: http://localhost:1337/admin"
echo "   API Base:    http://localhost:1337/api"
echo ""
echo "🗄️  Database Details:"
echo "   Host:     localhost:5432"
echo "   User:     strapi"
echo "   Password: strapi_password"
echo "   Database: briamco_db"
echo ""
echo "📚 Useful commands:"
echo "   View logs:     docker-compose logs -f"
echo "   Stop:          docker-compose down"
echo "   Restart:       docker-compose restart"
echo ""
echo "For more help, see README.md"
