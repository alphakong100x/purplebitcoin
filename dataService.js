// Data service to fetch and manage PBTC market data

// Helper function for API calls with retry logic
async function fetchWithRetry(url, options = {}, retries = 3, delayMs = 1000, attempt = 1) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      let errorData = { message: `HTTP error! status: ${response.status}` };
      try {
        // Try to parse error response if it's JSON
        const jsonError = await response.json();
        errorData = { ...errorData, ...jsonError }; // Merge with more specific error if available
      } catch (e) {
        // If not JSON, use text
        errorData.responseText = await response.text().catch(() => "Could not read error response body.");
      }
      throw new Error(JSON.stringify(errorData));
    }
    return await response.json();
  } catch (error) {
    if (attempt >= retries) {
      console.error(`Failed to fetch ${url} after ${retries} attempts:`, error.message);
      showNotification('API Error', `Failed to fetch data for ${url.split('/').pop()} after ${retries} attempts.`, 'error');
      throw error; // Re-throw the error to be caught by the calling function
    }
    console.warn(`Attempt ${attempt} for ${url} failed. Retrying in ${delayMs / 1000}s... Error: ${error.message}`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return fetchWithRetry(url, options, retries, delayMs * 2, attempt + 1); // Exponential backoff
  }
}


// Fetch PBTC market data - This function orchestrates calls to various data sources.
// For V1.1, these are simulated backend calls.
async function fetchPBTCMarketData() {
  console.log("Attempting to fetch PBTC market data...");
  try {
    // In a real application, you would call your backend which aggregates this data.
    // For simulation, we mimic fetching different pieces of data that a backend might provide.

    // Example: Fetching price, volume, etc., from a DexScreener-like source via backend
    // const dexscreenerData = await fetchWithRetry('/api/market-data/dexscreener/PBTC_SOL_PAIR_ADDRESS');
    // Example: Fetching market cap, ATH from a CoinGecko-like source via backend
    // const coingeckoData = await fetchWithRetry('/api/market-data/coingecko/purple-bitcoin');
    // Example: Fetching on-chain data (holders, total supply, burns) via backend connected to Solana node/explorer API
    // const onChainData = await fetchWithRetry('/api/on-chain-data/pbtc');

    // SIMULATED RESPONSE (as if fetched from a backend that aggregates data)
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700)); // Simulate network delay

    const currentPrice = 0.00028 + (Math.random() - 0.5) * 0.00005;
    const yesterdayPrice = 0.00025; // This should ideally come from historical data
    const priceChange24h = ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100;

    const initialSupply = 10000000000;
    // totalBurned should come from a reliable on-chain data source or trusted API
    const totalBurned = 283650000 + Math.floor(Math.random() * 50000); // Simulate ongoing burns
    const circulatingSupply = initialSupply - totalBurned;

    const marketData = {
      price: currentPrice,
      priceChange: priceChange24h, // Renamed from priceChange to be more specific
      volume: 387540 + Math.floor(Math.random() * 50000),
      marketCap: currentPrice * circulatingSupply,
      holders: 15875 + Math.floor(Math.random() * 100), // Should come from on-chain data
      initialSupply: initialSupply,
      totalBurned: totalBurned,
      circulatingSupply: circulatingSupply, // Calculated
      allTimeHigh: 0.00035, // Should come from historical data source
      liquidity: 185000 + Math.floor(Math.random() * 10000), // From DEX data
      exchanges: 3, // Number of exchanges (simulated, could be fetched)

      latestBurn: {
        amount: 10000 + Math.floor(Math.random() * 5000),
        time: 'Just now', // This should be a timestamp processed into relative time
        txId: generateRandomTxHash(64) // Simulate a Solana transaction ID
      },
      burnData: {
        weeklyRate: 450000 + Math.floor(Math.random() * 100000), // PBTC per week
        timeToHalfSupply: '~3.5 years', // Complex projection
        labels: ['W-5', 'W-4', 'W-3', 'W-2', 'Last Week', 'This Week (est.)'], // More dynamic labels
        amounts: Array.from({length: 6}, () => 300000 + Math.floor(Math.random() * 200000)) // Simulated weekly burn amounts
      },
      tradingPairs: [
        {
          exchange: 'Raydium', pair: 'PBTC/SOL', price: currentPrice * 0.999, // Simulate slight price variation
          volume: 125800 + Math.floor(Math.random() * 10000),
          link: 'https://raydium.io/swap/?inputCurrency=sol&outputCurrency=ATH32PbLRUPJq8YnUhqWAJBGBGprBrW2gzw5jdZXiRr&fixed=in'
        },
        {
          exchange: 'Jupiter', pair: 'PBTC/USDC', price: currentPrice,
          volume: 98450 + Math.floor(Math.random() * 10000),
          link: 'https://jup.ag/swap/USDC-PBTC_ATH32PbLRUPJq8YnUhqWAJBGBGprBrW2gzw5jdZXiRr' // Assuming PBTC mint address in URL
        },
        {
          exchange: 'MEXC', pair: 'PBTC/USDT', price: currentPrice * 1.001, // Simulate slight price variation
          volume: 163290 + Math.floor(Math.random() * 10000),
          link: 'https://www.mexc.com/exchange/PBTC_USDT' // Example link
        }
      ],
      priceHistory: {
        labels: generateDateLabels(14),
        prices: Array.from({length: 13}, () => 0.0001 + Math.random() * 0.00015).concat([currentPrice]) // 13 random historical + current
      }
    };
    console.log("Market data fetched/simulated successfully:", marketData);
    return marketData;

  } catch (error) {
    console.error('Failed to fetch PBTC market data:', error);
    // The error notification is handled by fetchWithRetry, but we might want a general one if the orchestration fails.
    // showNotification('Market Data Error', 'Could not load market data. Please try again later.', 'error');
    // Return null or last known good data, or throw to be handled by caller in dashboard.js
    throw error; // Let dashboard.js handle this
  }
}

// Generate date labels for charts
function generateDateLabels(days) {
  return Array.from({length: days}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  });
}

// Generate a random hash (for simulating transaction IDs, etc.)
function generateRandomTxHash(length = 64) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Note: `fetchOnChainData` and `getWalletTransactions` from original dataService.js are omitted here
// as their functionality (if needed) would be part of the broader `fetchPBTCMarketData` aggregation
// or specific wallet-related services. If they are distinct top-level needs, they'd follow similar patterns
// of calling backend APIs.


