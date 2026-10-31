# 🚀 QUICK START GUIDE - Briamco CMS Strapi

## 📋 Project Successfully Created!

Your Briamco CMS project with Strapi, PostgreSQL, and Docker has been set up successfully.

### ✅ What Has Been Set Up

- **Strapi v5.52.2** - Headless CMS
- **PostgreSQL 16** - Database
- **Docker & Docker Compose** - Containerization
- **Environment Configuration** - `.env` file with defaults
- **Helper Scripts** - Automated setup and management scripts

### 📁 Project Location

```
/Users/wildanbelfiore/briamco/briamco-strapi/
```

### 🎯 Quick Start (3 Steps)

#### Step 1: Navigate to Project Directory
```bash
cd /Users/wildanbelfiore/briamco/briamco-strapi
```

#### Step 2: Start the Project
```bash
# Option A: Using the startup script (Recommended)
./start.sh

# Option B: Using docker-compose directly
docker-compose up -d
```

#### Step 3: Access Your CMS
- **Admin Panel**: http://localhost:1337/admin
- **API Base**: http://localhost:1337/api
- **Database**: postgres on localhost:5432

### 🔧 Useful Commands

```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f strapi
docker-compose logs -f postgres

# Stop containers
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Access Strapi container
docker-compose exec strapi sh

# Access PostgreSQL database
docker-compose exec postgres psql -U strapi -d briamco_db

# Backup database
./docker-helper.sh backup

# View more commands
./docker-helper.sh
```

### 📊 Database Access

- **Host**: localhost:5432 (or `postgres` inside containers)
- **Username**: strapi
- **Password**: strapi_password
- **Database**: briamco_db

### 📝 Configuration Files

All key configuration files are in the project root:

- `.env` - Environment variables (production settings)
- `.env.example` - Example environment variables
- `docker-compose.yml` - Docker services configuration
- `Dockerfile` - Strapi image definition
- `package.json` - Node.js dependencies
- `README.md` - Full documentation

### 🔐 Important Security Notes

⚠️ **For Development Only**: The current `.env` has default credentials.

**For Production**:
1. Change all passwords in `.env`
2. Generate strong keys for APP_KEYS, API_TOKEN_SALT, etc.
3. Set NODE_ENV to `production`
4. Use environment variables or secrets management service

### 📚 Next Steps

1. **Start the project** using `./start.sh` or `docker-compose up -d`
2. **Create first admin user** by accessing http://localhost:1337/admin
3. **Create content types** in Strapi Content-Type Builder
4. **Start building your CMS** with collections and single types
5. **Read the full README.md** for advanced configuration

### 🆘 Troubleshooting

**Port already in use?**
```bash
# Stop using the port
lsof -i :1337  # Check what's using port 1337
kill -9 <PID>   # Kill the process
```

**PostgreSQL won't connect?**
```bash
# Check if containers are running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Restart services
docker-compose restart
```

**Container keeps restarting?**
```bash
# Check full logs for errors
docker-compose logs strapi
```

### 📖 Documentation

- [Strapi Docs](https://docs.strapi.io)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Docs](https://docs.docker.com/)

### 💡 Tips

- Strapi is very extensible - add plugins via npm
- Use the Content-Type Builder for visual schema design
- Leverage Strapi's role-based permissions system
- Set up webhooks for integration with external services

---

**Happy Building! 🎉**

For detailed information, see `README.md` in the project directory.
