import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  PRODUCTS_MS_HOST: string;
  PRODUCTS_MS_PORT: number;
}

const envSchema = Joi.object({
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),
  PRODUCTS_MS_HOST: Joi.string().required(),
  PRODUCTS_MS_PORT: Joi.number().required(),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envs: EnvVars = value;

export const config = {
  PORT: envs.PORT,
  DATABASE_URL: envs.DATABASE_URL,
  PRODUCTS_MS_HOST: envs.PRODUCTS_MS_HOST,
  PRODUCTS_MS_PORT: envs.PRODUCTS_MS_PORT,
};
