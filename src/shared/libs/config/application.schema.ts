import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ApplicationSchema = {
  PORT: number,
  DATABASE_URI: string,
  SALT: string
}

export const configApplicationSchema = convict<ApplicationSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  DATABASE_URI: {
    doc: 'Database connection uri',
    format: 'url',
    env: 'DATABASE_URI',
    default: null
  },
  SALT: {
    doc: 'Salt for data encryption',
    format: String,
    env: 'SALT',
    default: null
  },
});
