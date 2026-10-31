-- PostgreSQL initialization script for Briamco CMS
-- This script creates the initial database setup

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create JSON extension if not exists
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Grant privileges
GRANT CONNECT ON DATABASE briamco_db TO strapi;
GRANT USAGE ON SCHEMA public TO strapi;
GRANT CREATE ON SCHEMA public TO strapi;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO strapi;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO strapi;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO strapi;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO strapi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO strapi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO strapi;

-- Log initialization complete
-- Database is ready for Strapi to create tables
