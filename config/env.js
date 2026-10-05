const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const rawEnv = { ...process.env };

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3999),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  PASSWORD_RESET_EXPIRES_IN: z.string().default("15m"),
  APP_BASE_URL: z.string().url().default("https://tblingkarjaya.com"),
  CORS_ORIGINS: z.string().default(""),
  DEFAULT_OWNER_EMAIL: z.string().email().default("ghefiras19@gmail.com"),
  EMAIL_PROVIDER: z.enum(["stub", "brevo_smtp"]).default("stub"),
  EMAIL_PROVIDER_API_KEY: z.string().default(""),
  EMAIL_FROM: z.string().default("Toko Bangunan Lingkar Jaya <noreply@tblingkarjaya.com>"),
  EMAIL_SMTP_HOST: z.string().default("smtp-relay.brevo.com"),
  EMAIL_SMTP_PORT: z.coerce.number().int().positive().default(587),
  EMAIL_SMTP_USER: z.string().default(""),
  EMAIL_SMTP_PASSWORD: z.string().default("")
});

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

module.exports = parsed.data;
