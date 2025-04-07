export const setupWebSocket = (
  coinIds: string[],
  onPriceUpdate: (coinId: string, price: number) => void,
  onError: (error: string) => void
) => {
  let ws: WebSocket | null = null;
  let retryCount = 0;
  const maxRetries = 3;
  const baseDelay = 5000; // 5 seconds

  const connect = () => {
    ws = new WebSocket('wss://ws.coincap.io/prices?assets=' + coinIds.join(','));

    ws.onopen = () => {
      console.log('WebSocket connected');
      retryCount = 0; // Reset retry count on successful connection
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      Object.entries(data).forEach(([coinId, price]) => {
        if (typeof price === 'number') {
          onPriceUpdate(coinId, price);
        }
      });
    };

    ws.onerror = () => {
      console.error('WebSocket error occurred');
      onError('Failed to connect to WebSocket');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
        console.log(`Reconnecting in ${delay / 1000} seconds...`);
        setTimeout(() => {
          retryCount++;
          connect();
        }, delay);
      } else {
        onError('Max retries reached. Falling back to polling.');
      }
    };
  };

  connect();

  return () => {
    if (ws) {
      ws.close();
    }
  };
};