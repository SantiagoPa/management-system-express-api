import 'dotenv/config';

import joi from 'joi';

interface EnvVars {
    PORT?: number;
    POSTGRES_URL: string;
    PUBLIC_PATH: string;
}

const envsSchema = joi.object({
    PORT: joi.number().optional(),
    POSTGRES_URL: joi.string().required(),
    PUBLIC_PATH: joi.string().required(),
}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT || 3000,
    postgresUrl: envVars.POSTGRES_URL,
    publicPath: envVars.PUBLIC_PATH,
}