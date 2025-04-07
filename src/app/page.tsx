"use client";

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, toggleFavoriteCity, toggleFavoriteCrypto } from '@/store';
import { getWeather } from '@/slices/weatherSlice';
import { getCrypto, updateCryptoPrice } from '@/slices/cryptoSlice';
import { getNews } from '@/slices/newsSlice';
import { WeatherData, CryptoData, NewsData } from '@/types';
import { setupWebSocket } from '@/lib/websocket';
import Link from 'next/link';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import { FiSun, FiMoon, FiTwitter, FiStar, FiCloud, FiDollarSign, FiRss } from 'react-icons/fi';
import { useTheme } from '@/components/ThemeProvider';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import { motion } from 'framer-motion';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const weather = useSelector((state: RootState) => state.weather.data);
  const weatherLoading = useSelector((state: RootState) => state.weather.loading);
  const weatherError = useSelector((state: RootState) => state.weather.error);
  const crypto = useSelector((state: RootState) => state.crypto.data);
  const cryptoLoading = useSelector((state: RootState) => state.crypto.loading);
  const cryptoError = useSelector((state: RootState) => state.crypto.error);
  const news = useSelector((state: RootState) => state.news.data);
  const newsLoading = useSelector((state: RootState) => state.news.loading);
  const newsError = useSelector((state: RootState) => state.news.error);
  const favoriteCities = useSelector((state: RootState) => state.favorites.cities);
  const favoriteCryptos = useSelector((state: RootState) => state.favorites.cryptos);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();


  const fetchData = useCallback(() => {
    const weatherPromise = Promise.all(
      ['New York', 'London', 'Tokyo'].map((city) => dispatch(getWeather(city)))
    );
    const cryptoPromise = dispatch(getCrypto());
    const newsPromise = dispatch(getNews());

    Promise.all([weatherPromise, cryptoPromise, newsPromise]).catch(() => {
      toast.error('Failed to update data.', {
        position: 'top-right',
      });
    });
  }, [dispatch]);

  const handleRetry = (type: 'weather' | 'crypto' | 'news') => {
    if (type === 'weather') {
      Promise.all(
        ['New York', 'London', 'Tokyo'].map((city) => dispatch(getWeather(city)))
      ).catch(() => {
        toast.error('Failed to retry weather data.', { position: 'top-right' });
      });
    } else if (type === 'crypto') {
      dispatch(getCrypto()).catch(() => {
        toast.error('Failed to retry crypto data.', { position: 'top-right' });
      });
    } else if (type === 'news') {
      dispatch(getNews()).catch(() => {
        toast.error('Failed to retry news data.', { position: 'top-right' });
      });
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchData();

    const coinIds = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple'];
    const cleanupWebSocket = setupWebSocket(
      coinIds,
      (coinId, price) => {
        dispatch(updateCryptoPrice({ coinId, price }));
      },
      (error) => {
        toast.error(error, {
          position: 'top-right',
        });
      }
    );

    const weatherAlertInterval = setInterval(() => {
      const cities = ['New York', 'London', 'Tokyo'];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const alertMessage = `Weather Alert: Heavy rain expected in ${randomCity} at ${new Date().toLocaleTimeString()}!`;
      toast(alertMessage, {
        position: 'top-right',
        style: {
          background: '#fff3cd',
          color: '#856404',
        },
      });
    }, 600 * 1000);

    const pollingInterval = setInterval(() => {
      fetchData();
    }, 60 * 1000);

    return () => {
      cleanupWebSocket();
      clearInterval(weatherAlertInterval);
      clearInterval(pollingInterval);
    };
  }, [dispatch, fetchData]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">CryptoWeather Nexus</h1>
          <div className="flex items-center space-x-4">
            <a
              href="https://twitter.com/CoinDesk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 transition-all"
              aria-label="Follow us on Twitter"
            >
              <FiTwitter size={24} />
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <TwitterShareButton
            url="https://your-app-name.vercel.app"
            title="Check out CryptoWeather Nexus - a real-time dashboard for weather, crypto prices, and news!"
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weather Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <div className="flex items-center mb-4">
              <FiCloud className="mr-2" size={24} />
              <h2 className="text-2xl font-semibold">Weather Updates</h2>
            </div>
            {weatherLoading && <p className="animate-pulse">Loading weather...</p>}
            {weatherError && (
              <div className="text-red-500">
                <p>Error: {weatherError}</p>
                <button
                  onClick={() => handleRetry('weather')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                >
                  Retry
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3">
              {weather.map((city: WeatherData, index: number) => {
                const isFavorite = favoriteCities.includes(city.name.toLowerCase());
                return (
                  <div key={index} className="flex items-center justify-between">
                    <Link href={`/city/${encodeURIComponent(city.name)}`}>
                      <div className="flex items-center p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                        <Image
                          src={`https://openweathermap.org/img/wn/${city.weather[0].icon}.png`}
                          alt={city.weather[0].description}
                          width={40}
                          height={40}
                          className="mr-3"
                        />
                        <div>
                          <h3 className="text-lg font-medium">
                            {city.name} {isFavorite && <span className="text-yellow-500">★</span>}
                          </h3>
                          <p className="text-sm">
                            {city.main.temp}°C, {city.weather[0].description}, Humidity: {city.main.humidity}%
                          </p>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => dispatch(toggleFavoriteCity(city.name))}
                      className="p-2 hover:text-yellow-500"
                    >
                      <FiStar className={isFavorite ? 'text-yellow-500' : 'text-gray-500'} />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Crypto Section */}
          <motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  className="card"
>
  <div className="flex items-center mb-4">
    <FiDollarSign className="mr-2" size={24} />
    <h2 className="text-2xl font-semibold">Cryptocurrency Prices</h2>
  </div>
  {cryptoLoading && <p className="animate-pulse">Loading crypto...</p>}
  {cryptoError && (
    <div className="text-red-500">
      <p>Error: {cryptoError}</p>
      <button
        onClick={() => handleRetry('crypto')}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
      >
        Retry
      </button>
    </div>
  )}
  <div className="grid grid-cols-1 gap-3">
    {crypto.map((coin: CryptoData, index: number) => {
      const isFavorite = favoriteCryptos.includes(coin.id.toLowerCase());
      return (
        <div key={index} className="flex items-center justify-between">
          <Link href={`/crypto/${coin.id}`}>
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              <Image
                src={coin.image}
                alt={coin.name}
                width={40}
                height={40}
                className="mr-3"
              />
              <div>
                <h3 className="text-lg font-medium">
                  {coin.name} {isFavorite && <span className="text-yellow-500">★</span>}
                </h3>
                <p className="text-sm">
                  ${coin.current_price.toLocaleString()} |{' '}
                  <span
                    className={
                      coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </p>
              </div>
            </div>
          </Link>
          <button
            onClick={() => dispatch(toggleFavoriteCrypto(coin.id))}
            className="p-2 hover:text-yellow-500"
          >
            <FiStar className={isFavorite ? 'text-yellow-500' : 'text-gray-500'} />
          </button>
        </div>
      );
    })}
  </div>
</motion.section>

          {/* News Section */}
          <motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.4 }}
  className="card"
>
  <div className="flex items-center mb-4">
    <FiRss className="mr-2" size={24} />
    <h2 className="text-2xl font-semibold">Latest News</h2>
  </div>
  {newsLoading && <p className="animate-pulse">Loading news...</p>}
  {newsError && (
    <div className="text-red-500">
      <p>Error: {newsError}</p>
      <button
        onClick={() => handleRetry('news')}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
      >
        Retry
      </button>
    </div>
  )}
  <div className="grid grid-cols-1 gap-3">
    {news.slice(0, 5).map((article: NewsData, index: number) => (
      <a
        key={index}
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      >
        <h3 className="text-sm font-medium">{article.title}</h3>
      </a>
    ))}
  </div>
</motion.section>
        </div>

        {/* Professional Footer */}
        <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
  <div className="max-w-4xl mx-auto text-center">
    <h3 className="text-lg font-semibold mb-2">CryptoWeather Nexus</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
      A real-time dashboard for weather updates, cryptocurrency prices, and crypto news, built with AI to deliver meaningful insights.
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
      Data provided by{' '}
      <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">
        OpenWeatherMap
      </a>
      ,{' '}
      <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">
        CoinGecko
      </a>
      , and{' '}
      <a href="https://newsdata.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">
        NewsData.io
      </a>
      .
    </p>
    <div className="flex justify-center space-x-4 mb-4">
      <a
        href="https://twitter.com/CoinDesk"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600 transition-all"
      >
        Twitter
      </a>
      <a
        href="https://github.com/Ukashatu40/your-repo"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
      >
        GitHub
      </a>
      <a
        href="mailto:your-email@example.com"
        className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
      >
        Contact
      </a>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      © 2025 CryptoWeather Nexus. All rights reserved.
    </p>
  </div>
</footer>
      </div>
    </div>
  );
}