#!/bin/bash

# Briamco Strapi - Docker Helper Script
# Usage: ./docker-helper.sh [command]

COMMAND=$1

case $COMMAND in
  # View logs
  logs)
    docker-compose logs -f ${2:-}
    ;;
  
  # Strapi shell
  shell)
    docker-compose exec strapi sh
    ;;
  
  # PostgreSQL shell
  db)
    docker-compose exec postgres psql -U strapi -d briamco_db
    ;;
  
  # Status
  status)
    echo "🔍 Container Status:"
    docker-compose ps
    ;;
  
  # Restart services
  restart)
    echo "🔄 Restarting containers..."
    docker-compose restart
    ;;
  
  # Backup database
  backup)
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    echo "💾 Backing up database to $BACKUP_FILE..."
    docker-compose exec -T postgres pg_dump -U strapi -d briamco_db > $BACKUP_FILE
    echo "✓ Backup completed: $BACKUP_FILE"
    ;;
  
  # Restore database
  restore)
    if [ -z "$2" ]; then
      echo "Usage: ./docker-helper.sh restore <backup-file.sql>"
      exit 1
    fi
    echo "♻️  Restoring database from $2..."
    docker-compose exec -T postgres psql -U strapi -d briamco_db < $2
    echo "✓ Restore completed"
    ;;
  
  # Clean up (remove containers and volumes)
  clean)
    echo "🧹 Cleaning up containers and volumes..."
    docker-compose down -v
    echo "✓ Cleanup completed"
    ;;
  
  # Show help
  *)
    echo "Briamco Strapi - Docker Helper"
    echo ""
    echo "Usage: ./docker-helper.sh [command]"
    echo ""
    echo "Commands:"
    echo "  logs [service]      View container logs (strapi, postgres)"
    echo "  shell              Enter Strapi container shell"
    echo "  db                 Enter PostgreSQL database shell"
    echo "  status             Show container status"
    echo "  restart            Restart all containers"
    echo "  backup             Backup PostgreSQL database"
    echo "  restore <file>     Restore database from backup file"
    echo "  clean              Remove all containers and volumes"
    echo ""
    echo "Examples:"
    echo "  ./docker-helper.sh logs"
    echo "  ./docker-helper.sh logs strapi"
    echo "  ./docker-helper.sh shell"
    echo "  ./docker-helper.sh backup"
    echo "  ./docker-helper.sh restore backup_20240101_120000.sql"
    ;;
esac
