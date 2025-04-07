"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getWeather } from '@/slices/weatherSlice';
import { RootState, AppDispatch } from '@/store';
import { FiArrowLeft } from 'react-icons/fi';
import Image from 'next/image';
import { WeatherData } from '@/types';
import { motion } from 'framer-motion';

export default function CityDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { city } = useParams();
  const decodedCity = Array.isArray(city)
    ? city[0]
    : city
    ? decodeURIComponent(city)
    : '';

  const weatherData = useSelector((state: RootState) =>
    state.weather.data.find((w: WeatherData) => w.name.toLowerCase() === decodedCity.toLowerCase())
  );
  const { loading, error } = useSelector((state: RootState) => state.weather);

  useEffect(() => {
    if (decodedCity) {
      dispatch(getWeather(decodedCity));
    }
  }, [dispatch, decodedCity]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error || !weatherData) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Error: {error || 'City not found'}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 flex items-center mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={() => router.back()}
        className="flex items-center mb-4 text-blue-500 hover:text-blue-700"
      >
        <FiArrowLeft className="mr-2" /> Back
      </button>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card max-w-md mx-auto"
      >
        <div className="flex items-center mb-4">
          <Image
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            alt={weatherData.weather[0].description}
            width={40}
            height={40}
            className="mr-3"
          />
          <h1 className="text-2xl font-semibold">{weatherData.name}</h1>
        </div>
        <div className="mb-4">
          <p className="text-lg">{weatherData.main.temp}°C</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {weatherData.weather[0].description}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Feels Like</p>
            <p>{weatherData.main.feels_like}°C</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
            <p>{weatherData.main.humidity}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</p>
            <p>{weatherData.wind.speed} m/s</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pressure</p>
            <p>{weatherData.main.pressure} hPa</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}