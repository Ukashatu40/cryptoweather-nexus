import { WeatherData, CryptoData, NewsData, NewsDataResponse } from '@/types';

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    throw new Error('OpenWeatherMap API key is not defined');
  }

  let queryCity = city;
  if (city.toLowerCase() === 'new york') {
    queryCity = 'New York,US';
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(queryCity)}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch weather data');
  }

  const data: WeatherData = await response.json();
  return data;
};

export const fetchCrypto = async (): Promise<CryptoData[]> => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,ripple&order=market_cap_desc&per_page=5&page=1&sparkline=false'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch crypto data');
  }

  const data: CryptoData[] = await response.json();
  return data;
};

export const fetchNews = async (): Promise<NewsData[]> => {
  const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
  if (!apiKey) {
    throw new Error('NewsData API key is not defined');
  }

  const response = await fetch(
    `https://newsdata.io/api/1/news?apikey=${apiKey}&q=cryptocurrency&language=en`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch news data');
  }

  const data: NewsDataResponse = await response.json();
  if (data.status !== 'success') {
    throw new Error('News API request failed');
  }

  return data.results;
};