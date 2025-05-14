import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
  })
  // Ésto significa que al objeto final le podemos
  // agregar otras propiedades que no estén definidas
  // en el schema (ya que al evaluar process.env van
  // a haber muchas más propiedades que no estén
  // definidas en el schema):
  .unknown(true);

const { error, value: env } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Renombro la variable destructurada para poder typarla y usar
// los beneficios de TS al asignar las propiedades a `envs`:
export const envs: EnvVars = env;
