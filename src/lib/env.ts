import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Export the API keys to use in your app
export const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
export const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;