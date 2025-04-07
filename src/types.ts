export interface WeatherData {
    name: string;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
  }
  
  export interface CryptoData {
    id: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    price_change_percentage_24h: number;
    high_24h: number;
    low_24h: number;
    last_updated: string;
  }
  
  export interface NewsData {
    title: string;
    description: string | null;
    link: string;
  }
  
  // Define the NewsData.io API response structure
  export interface NewsDataResponse {
    status: string;
    totalResults: number;
    results: NewsData[];
  }