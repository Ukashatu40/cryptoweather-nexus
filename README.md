# CryptoWeather Nexus

CryptoWeather Nexus is a modern, multi-page dashboard combining weather data, cryptocurrency information, and real-time notifications via WebSocket. Built with Next.js, React, Redux, and Tailwind CSS, it provides a responsive and interactive user experience.

## Live Demo

[https://yourapp.vercel.app](https://yourapp.vercel.app) (Replace with your actual Vercel URL)

## Features

- **Dashboard**: Displays weather data for New York, London, and Tokyo, cryptocurrency prices for Bitcoin, Ethereum, and others, and the top five crypto-related news headlines.
- **Detail Pages**: City details with recent weather history and crypto details with recent price history.
- **Real-Time Updates**: Live price updates for Bitcoin and Ethereum via CoinCap WebSocket, with simulated weather alerts.
- **Notifications**: Toast notifications for significant price changes (≥5%) and weather alerts.
- **Favorites**: Users can mark cities and cryptos as favorites, which are visually highlighted.
- **Responsive Design**: Adapts seamlessly from mobile to desktop using Tailwind CSS.
- **State Management**: Uses Redux for global state, including data fetching, loading/error states, and user preferences.

## Challenges and Resolutions

- **Hydration Errors**: Encountered hydration mismatches due to theme updates. Initially resolved by deferring rendering in `ThemeProvider`, but the error persisted with `className="dark"` and `style={{colorScheme:"dark"}}` appearing in the server-rendered HTML. Simplified the theme handling by setting the initial theme from `localStorage` in `ThemeProvider` and persisting the theme to `localStorage` for consistency. Later removed the `ThemeProvider` to focus on core functionality, then reintroduced it with a toggle button using moon (dark) and sun (light) icons. Fixed a hydration mismatch by ensuring the theme is only applied after the component mounts on the client.
- **Dynamic Routes**: Faced warnings about direct `params` access in dynamic routes. Fixed by using `useParams` hook for Client Components. Later encountered a "City not found" error on city detail pages due to URL encoding issues and potential API request failures. Fixed by ensuring proper URL encoding in `Link` components and adding detailed error logging in `fetchWeather`. Resolved a 404 "city not found" error for "New York" by appending the country code "US" specifically for "New York" in `fetchWeather`, while keeping "London" and "Tokyo" unchanged.
- **WebSocket Integration**: Integrated CoinCap WebSocket for live price updates. Encountered persistent failures with an empty error object (`WebSocket error: {}`). Added a retry mechanism with exponential backoff (5s, 10s, 20s delays) and a 10-minute cooldown for "Failed to connect" notifications. If all retries fail, the app falls back to polling every 60 seconds, ensuring continuous functionality. Improved error logging to diagnose the issue, which might be due to network restrictions or temporary server downtime. Temporarily disabled the WebSocket and relied on polling for submission due to persistent issues. Removed `websocket.ts` to resolve type errors, then reintroduced it with proper types and error handling for real-time crypto price updates.
- **Notification Overload**: The app initially generated too many notifications for price updates and weather alerts. Throttled price update notifications to once every 5 minutes per coin and increased the weather alert interval from 2 minutes to 10 minutes, improving the user experience.
- **Build Errors**: Encountered TypeScript errors during `npm run build` due to `no-explicit-any`. Created a `src/types.ts` file to define interfaces for weather, crypto, news, and WebSocket data, and applied these types across all files. Also addressed a `useEffect` dependency warning by adding missing dependencies to the dependency array. Fixed a `no-explicit-any` error in `fetchNews` by defining a `NewsDataResponse` interface for the NewsData.io API response.
- **Performance Warnings**: Addressed `no-img-element` warnings by replacing `<img>` tags with `next/image` for optimized image loading. Fixed a `useEffect` dependency warning by wrapping `fetchData` in `useCallback` to prevent unnecessary re-renders.
- **Image Loading Error**: Encountered a runtime error during build due to unconfigured hostnames for `next/image`. Fixed by adding `openweathermap.org` and `coin-images.coingecko.com` to `images.remotePatterns` in `next.config.ts`, allowing external images to load correctly. Later encountered a protocol mismatch error because the weather icon URL used `http` instead of `https`. Updated the `Image` component to use `https` to match the `remotePatterns` configuration.
- **API Fetch Errors**: Encountered `Failed to fetch news data` and `Failed to fetch weather data` errors due to potentially invalid API keys. Improved error handling in `fetchWeather` and `fetchNews` to log detailed error messages. Fixed environment variable issues by adding `NEXT_PUBLIC_OPENWEATHERMAP_API_KEY` and `NEXT_PUBLIC_NEWSDATA_API_KEY` to a `.env` file and simplifying `next.config.ts`.
- **Limited Cryptocurrencies**: The cryptocurrency section initially showed only Bitcoin and Ethereum. Updated `fetchCrypto` to fetch the top 5 cryptocurrencies by market cap and adjusted the CoinCap WebSocket URL to listen for price updates for all 5 coins.
- **Weather Details Page Enhancement**: The weather details page lacked visual appeal and interactivity compared to the cryptocurrency details page. Enhanced the design with a gradient background, modern card layout, and a grid for weather stats. Added a refresh button for interactivity. Applied similar styling to the crypto details page for consistency. Later reverted these changes to focus on functionality, then restored the enhanced design as per user preference. Updated both details pages to a simpler, centered card style with Framer Motion animations.
- **TypeScript Errors**: Encountered multiple TypeScript errors:
  - Fixed `string | undefined` error in `crypto/[id]/page.tsx` by handling the `undefined` case for `id`.
  - Fixed missing `Providers` module by creating `Providers.tsx` to wrap the app with Redux `Provider`.
  - Fixed `react-toastify` type errors by replacing `duration` with `autoClose` and removing the `icon` prop.
  - Fixed missing type imports (`WeatherData`, `CryptoData`, `NewsData`) in `page.tsx` by importing from `types.ts`.
  - Fixed incorrect type name `NewsItem` in `api.ts` by using `NewsData`.
  - Fixed missing `WebSocketData` type by removing the unused `websocket.ts` file, then reintroduced it with proper types.
  - Fixed `Cannot find module '@/components/Providers'` by creating the `Providers` component and ensuring the store is imported from `src/store.ts`.
  - Fixed type errors in `src/store.ts` for the `favorites` reducer by using `createSlice` to properly define the slice and generate action creators.
  - Fixed dispatch errors in `src/app/page.tsx` for `toggleFavoriteCity` by importing the action creator and dispatching it correctly.
- **Historical Data**: OpenWeatherMap and CoinGecko free tiers don’t provide historical data, so simulated history by storing recent fetches in Redux. Added price history to the crypto details page by storing WebSocket price updates in Redux, limited to the last 5 entries.
- **Favorites Persistence**: Implemented in Redux; didn’t persist to local storage due to time constraints but could be added. Later removed the favorites functionality to simplify the app and avoid complexity, then reintroduced it with a proper Redux slice for favorite cities. Extended the favorites functionality to include cryptocurrencies with a star toggle button.
- **Jest Setup**: Faced issues with Jest configuration. Fixed a syntax error in `jest.setup.js` by using `require` instead of `import`, and updated `jest.config.js` to properly transform TypeScript files with `ts-jest`.
- **Module Not Found Error**: Encountered a `Module not found: Can't resolve 'store'` error in `ReduxProvider.tsx`. Fixed by updating the import path to use the `@/store` alias defined in `tsconfig.json`, and ensured all files importing `store` used the correct path.
- **Restored Features**: Reintroduced the theme toggle with moon/sun icons, added a Twitter icon in the header, restored the enhanced weather and crypto details pages, and reintroduced real-time crypto price updates via WebSocket. Added a professional footer, `Toaster` for notifications, Twitter share button, Framer Motion animations, favorite cities functionality, and error handling with retry buttons.
- **News Section Overload**: The news section displayed full-length stories, making it cluttered. Truncated titles to 60 characters and descriptions to 100 characters, adding an ellipsis for longer content to improve readability. Further simplified the news section to show only the titles of the top 5 articles. Adjusted the font size of news titles from `text-lg` to `text-base` for better balance, then further reduced to `text-sm` for a more compact appearance.
- **Theme Toggle Issue**: The toggle theme button wasn’t functioning as expected. Fixed a hydration mismatch by ensuring the theme is only applied after the component mounts on the client, and verified that dark mode styles are correctly applied via Tailwind CSS.
- **Details Page Styling**: Updated the crypto and weather details pages to use a simpler, centered card style with Framer Motion animations, matching the provided design. Added a price history table to the crypto details page using simulated data from WebSocket updates.
- **Favorites for Cryptocurrencies**: Added a favorite toggle button to the cryptocurrency section, mirroring the weather section’s functionality, with a star icon and yellow star indicator for favorited coins.
- **Footer Enhancement**: Merged the existing footer with a new design, adding a title, description, and data source links (OpenWeatherMap, CoinGecko, NewsData.io) while retaining the social links (Twitter, GitHub, Contact) and updating the copyright year to 2025.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- API keys for:
  - OpenWeatherMap (`OPENWEATHERMAP_API_KEY`)
  - CoinGecko (not required, but used for initial data)
  - NewsData.io (`NEWSDATA_API_KEY`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cryptoweather-nexus.git
   cd cryptoweather-nexus