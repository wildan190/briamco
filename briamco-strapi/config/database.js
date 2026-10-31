module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'postgres'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'briamco_db'),
      user: env('DATABASE_USER', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi_password'),
      ssl: env.bool('DATABASE_SSL', false),
    },
    acquireConnectionTimeout: 60000,
    useNullAsDefault: true,
  },
});
