# Briamco CMS - Strapi dengan PostgreSQL dan Docker

Sebuah project CMS modern menggunakan Strapi, PostgreSQL, dan Docker. Project ini menyediakan setup lengkap untuk development dan production dengan infrastruktur yang containerized.

## 📋 Fitur

- **Strapi CMS v5**: Headless CMS yang powerful dan fleksibel
- **PostgreSQL 16**: Database relasional yang robust
- **Docker & Docker Compose**: Containerization untuk consistency di berbagai environment
- **Environment Configuration**: Easy configuration dengan file .env
- **Health Checks**: Automated health monitoring untuk services
- **Volume Management**: Persistent data storage untuk database dan aplikasi
- **Production Ready**: Multi-stage build, non-root user, security best practices

## 🚀 Prerequisites

- Docker Desktop (atau Docker + Docker Compose)
- Git (optional)
- RAM minimal 2GB
- Disk space minimal 1GB

## 📦 Project Structure

```
briamco-strapi/
├── src/
│   └── config/
│       ├── database.js      # Database configuration
│       └── server.js        # Server configuration
├── public/                  # Static files
├── .env                     # Environment variables
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore rules
├── .dockerignore            # Docker ignore rules
├── Dockerfile               # Docker image definition
├── docker-compose.yml       # Docker Compose orchestration
├── init.sql                 # PostgreSQL initialization script
├── package.json             # NPM dependencies
└── README.md               # Documentation
```

## 🔧 Setup dan Installation

### 1. Clone atau Download Project

```bash
cd briamco-strapi
```

### 2. Konfigurasi Environment Variables

File `.env` sudah tersedia dengan konfigurasi default:

```bash
# Database Configuration
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=briamco_db
DATABASE_USER=strapi
DATABASE_PASSWORD=strapi_password
DATABASE_SSL=false

# Server Configuration
HOST=0.0.0.0
PORT=1337

# Security Keys
APP_KEYS=testKey1,testKey2,testKey3,testKey4
API_TOKEN_SALT=testKeySalt
ADMIN_JWT_SECRET=testJWTSecret
JWT_SECRET=testJWTSecret
```

**Penting:** Untuk production, ubah semua keys dengan nilai yang aman!

### 3. Build dan Start Containers

```bash
# Build images dan start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4. Initialize Admin User

Setelah containers running:

1. Buka browser: http://localhost:1337/admin
2. Buat admin user pertama Anda
3. Login ke Strapi admin panel

## 🎮 Command yang Tersedia

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f strapi
docker-compose logs -f postgres

# Rebuild images
docker-compose build --no-cache

# Access container shell
docker-compose exec strapi sh
docker-compose exec postgres psql -U strapi -d briamco_db

# Remove everything (images, containers, volumes)
docker-compose down -v
```

## 🌐 URLs dan Access Points

- **Strapi Admin Panel**: http://localhost:1337/admin
- **Strapi API**: http://localhost:1337/api
- **PostgreSQL**: localhost:5432
  - User: `strapi`
  - Password: `strapi_password`
  - Database: `briamco_db`

## 📊 Database Management

### Akses PostgreSQL Shell

```bash
docker-compose exec postgres psql -U strapi -d briamco_db
```

### Useful SQL Commands

```sql
-- List all tables
\dt

-- Describe table structure
\d table_name

-- List all databases
\l

-- Connect to specific database
\c database_name

-- Exit psql
\q
```

### Backup Database

```bash
docker-compose exec postgres pg_dump -U strapi -d briamco_db > backup.sql
```

### Restore Database

```bash
docker-compose exec -T postgres psql -U strapi -d briamco_db < backup.sql
```

## 📁 Volumes

Project menggunakan docker volumes untuk persistent storage:

- **postgres_data**: Menyimpan semua data PostgreSQL
- **./src**: Strapi source code (mounted untuk development)
- **./public**: Static files Strapi (mounted untuk development)

Untuk cleanup volumes:

```bash
docker-compose down -v
```

## 🔐 Security Considerations

### Development vs Production

**Development Setup** (saat ini):
- Default credentials dalam .env
- Tidak ada SSL/TLS
- Debug mode enabled

**Production Setup**:
- Generate strong random keys untuk APP_KEYS
- Gunakan environment variables yang aman
- Enable SSL/TLS
- Gunakan managed database services
- Update NODE_ENV ke `production`
- Use strong passwords

### Generating Secure Keys

```bash
# Generate random keys di development environment
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📝 Environment Variables Penjelasan

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_HOST | postgres | PostgreSQL host |
| DATABASE_PORT | 5432 | PostgreSQL port |
| DATABASE_NAME | briamco_db | Database name |
| DATABASE_USER | strapi | Database user |
| DATABASE_PASSWORD | strapi_password | Database password |
| HOST | 0.0.0.0 | Strapi host |
| PORT | 1337 | Strapi port |
| APP_KEYS | testKey1,testKey2... | Application security keys |
| API_TOKEN_SALT | testKeySalt | API token salt |
| ADMIN_JWT_SECRET | testJWTSecret | Admin JWT secret |
| JWT_SECRET | testJWTSecret | JWT secret |

## 🐛 Troubleshooting

### Strapi tidak bisa connect ke PostgreSQL

```bash
# Check PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Verify connection
docker-compose exec postgres pg_isready
```

### Port sudah digunakan

```bash
# Change ports di docker-compose.yml
# atau kill process yang menggunakan port

# macOS/Linux
lsof -i :1337
kill -9 <PID>

# Windows
netstat -ano | findstr :1337
taskkill /PID <PID> /F
```

### Container di-restart terus

```bash
# Check logs untuk error details
docker-compose logs strapi

# Verify .env configuration
cat .env
```

## 📚 Dokumentasi

- [Strapi Documentation](https://docs.strapi.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Development Workflow

### Membuat Collection Type

1. Login ke Strapi Admin Panel
2. Navigate ke Content-Type Builder
3. Klik "Create new collection type"
4. Define fields sesuai kebutuhan
5. Save dan publish

### API Access

```bash
# Get all entries
curl http://localhost:1337/api/collection-name

# Get single entry
curl http://localhost:1337/api/collection-name/1

# Create entry
curl -X POST http://localhost:1337/api/collection-name \
  -H "Content-Type: application/json" \
  -d '{"data": {"field": "value"}}'
```

## 📦 NPM Scripts

```bash
# Di dalam container atau local (jika Node.js installed)
npm run develop    # Development mode dengan hot reload
npm run start      # Production start
npm run build      # Build untuk production
npm run strapi     # Strapi CLI commands
```

## 🔄 Updating Dependencies

```bash
# Update packages
npm update

# Rebuild containers
docker-compose build --no-cache

# Restart services
docker-compose up -d
```

## 📄 License

ISC License

## 👨‍💻 Author

Briamco Development Team

## 📞 Support

Untuk issues dan questions, silakan buat issue di repository atau contact tim development.

---

**Happy Coding! 🎉**

./docker-helper.sh logs       # View logs
./docker-helper.sh shell      # Masuk Strapi container
./docker-helper.sh db         # Akses PostgreSQL
./docker-helper.sh backup     # Backup database
./docker-helper.sh status     # Status containers