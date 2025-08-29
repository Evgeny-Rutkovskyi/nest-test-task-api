import * as dotenv from 'dotenv';
import * as Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DB_URL: Joi.string(),
  TYPE_DB: Joi.string(),
  HOST_DB: Joi.string(),
  PORT_DB: Joi.number(),
  USERNAME_DB: Joi.string(),
  PASSWORD_DB: Joi.string(),
  NAME_DB: Joi.string(),
  JWT_SECRET: Joi.string().min(32),
  PROVIDE_DB: Joi.string(),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  port: envVars.PORT,
  db_url: envVars.DB_URL,
  type_db: envVars.TYPE_DB,
  host_db: envVars.HOST_DB,
  port_db: envVars.PORT_DB,
  username_db: envVars.USERNAME_DB,
  password_db: envVars.PASSWORD_DB,
  name_db: envVars.NAME_DB,
  jwt_secret: envVars.JWT_SECRET,
  provide_db: envVars.PROVIDE_DB
};