import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

if (!process.env.OPENWEATHERMAP_API_KEY) {
  throw new Error('OPENWEATHERMAP_API_KEY is not defined in .env');
}
if (!process.env.NEWSDATA_API_KEY) {
  throw new Error('NEWSDATA_API_KEY is not defined in .env');
}

export const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
export const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;