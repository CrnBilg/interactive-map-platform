/**
 * JWT signing secret. Must be set via JWT_SECRET in production.
 * Development fallback avoids cryptic jsonwebtoken errors when .env is incomplete.
 */
function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_SECRET environment variable is required in production. Add it to backend/.env (see .env.example).'
    );
  }

  console.warn(
    '[citylore] JWT_SECRET is not set; using a development-only default. Add JWT_SECRET to backend/.env.'
  );
  return 'citylore_development_jwt_secret_not_for_production';
}

module.exports = { getJwtSecret };
