import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
}

const envSchema = Joi.object({
  PORT: Joi.number().required(),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Envs validation error: ${error.message}`);
}

const envs: EnvVars = value;

export const config = {
  PORT: envs.PORT,
};
