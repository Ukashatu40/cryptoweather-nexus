"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { FiArrowLeft } from 'react-icons/fi';
import Image from 'next/image';
import { CryptoData } from '@/types';
import { motion } from 'framer-motion';
import { PriceHistoryEntry } from '@/slices/cryptoSlice'; // Import the type

export default function CryptoDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = useParams();
  const decodedId = Array.isArray(id)
    ? id[0]
    : id
    ? decodeURIComponent(id)
    : '';
  const cryptoData = useSelector((state: RootState) =>
    state.crypto.data.find((c: CryptoData) => c.id === decodedId)
  );
  const coinHistory = useSelector((state: RootState) => state.crypto.priceHistory[decodedId] || []);
  const { loading, error } = useSelector((state: RootState) => state.crypto);

  useEffect(() => {
    if (decodedId && !cryptoData) {
      dispatch({ type: 'crypto/getCrypto' });
    }
  }, [dispatch, decodedId, cryptoData]);

  if (!decodedId) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Error: Cryptocurrency ID not provided</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 flex items-center mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error || !cryptoData) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Error: {error || 'Cryptocurrency not found'}</p>
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
            src={cryptoData.image}
            alt={cryptoData.name}
            width={40}
            height={40}
            className="mr-3 rounded-full"
          />
          <h1 className="text-2xl font-semibold">{cryptoData.name}</h1>
        </div>
        <div className="mb-4">
          <p className="text-lg">${cryptoData.current_price.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
            <p>${cryptoData.market_cap.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">24h Change</p>
            <p className={cryptoData.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
              {cryptoData.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">24h High</p>
            <p>${cryptoData.high_24h.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">24h Low</p>
            <p>${cryptoData.low_24h.toLocaleString()}</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Recent Price History</h2>
          {coinHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="py-2">Time</th>
                    <th className="py-2">Price ($)</th>
                  </tr>
                </thead>
                <tbody>
                {coinHistory.map((entry: PriceHistoryEntry, index: number) => (
  <tr key={index} className="border-b dark:border-gray-700">
    <td className="py-2">{new Date(entry.timestamp).toLocaleTimeString()}</td>
    <td className="py-2">${entry.price.toLocaleString()}</td>
  </tr>
))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No price history available yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}