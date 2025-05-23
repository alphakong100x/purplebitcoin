// Dashboard functionality for charts and market data

let priceChart = null;
let burnChart = null;

function initializeDashboard() {
  console.log('Initializing dashboard...');
  // Charts are created once market data is available to avoid empty rendering.
  // Initial market data fetch will trigger chart creation.
  refreshMarketData(); // Initial fetch
}

// Create the price chart with Chart.js
function createPriceChart(priceHistory) {
  const ctx = document.getElementById('price-chart');
  if (!ctx) return;
  if (priceChart) priceChart.destroy(); // Destroy existing chart if recreating

  const data = {
    labels: priceHistory.labels,
    datasets: [{
      label: 'PBTC Price (USD)',
      data: priceHistory.prices,
      borderColor: '#9333EA', // Purple
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 0, // Hide points by default
      pointHoverRadius: 5,
    }]
  };

  priceChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { display: true, labels: { color: '#E5E7EB' } },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)', // bg-gray-900
          borderColor: '#4B5563', // border-gray-600
          borderWidth: 1,
          titleFont: { size: 14 },
          bodyFont: { size: 12 },
          padding: 10,
          callbacks: {
            label: function(context) {
              return `Price: $${context.parsed.y.toFixed(6)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(75, 85, 99, 0.2)' }, // gray-600/20
          ticks: { color: '#9CA3AF', maxRotation: 0, autoSkip: true, maxTicksLimit: 7 } // gray-400
        },
        y: {
          grid: { color: 'rgba(75, 85, 99, 0.2)' },
          ticks: {
            color: '#9CA3AF',
            callback: function(value) { return '$' + value.toFixed(5); }
          }
        }
      }
    }
  });
  document.getElementById('chart-loading').classList.add('hidden');
}

// Create the burn statistics chart
function createBurnChart(burnStats) {
  const ctx = document.getElementById('burn-chart');
  if (!ctx) return;
  if (burnChart) burnChart.destroy(); // Destroy existing chart if recreating

  const data = {
    labels: burnStats.labels,
    datasets: [{
      label: 'Tokens Burned',
      data: burnStats.amounts,
      backgroundColor: '#A78BFA', // lighter purple
      borderRadius: 5,
      barThickness: 'flex',
      maxBarThickness: 30,
    }]
  };

  burnChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allow height to be controlled by container
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          borderColor: '#4B5563',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return 'Burned: ' + formatNumber(context.raw) + ' PBTC';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#9CA3AF' }
        },
        y: {
          grid: { color: 'rgba(75, 85, 99, 0.2)' },
          ticks: { color: '#9CA3AF', callback: function(value) { return formatNumber(value / 1000) + 'K'; } }
        }
      }
    }
  });
}

// Refresh market data from APIs
async function refreshMarketData() {
  console.log("Refreshing market data...");
  const chartLoadingOverlay = document.getElementById('chart-loading');
  if (chartLoadingOverlay && (!priceChart)) { // Show loading only if chart not yet initialized
      chartLoadingOverlay.classList.remove('hidden');
  }

  try {
    const marketData = await fetchPBTCMarketData(); // From dataService.js

    if (!marketData) {
        throw new Error("Received no market data from service.");
    }

    updateDashboardUI(marketData);

    if (marketData.priceHistory && marketData.priceHistory.prices.length > 0) {
        if (!priceChart) {
            createPriceChart(marketData.priceHistory);
        } else {
            updatePriceChartData(marketData.priceHistory);
        }
    } else {
        console.warn("No price history data available to create or update price chart.");
         if (chartLoadingOverlay) chartLoadingOverlay.classList.add('hidden'); // Hide loading if no data
    }

    if (marketData.burnData && marketData.burnData.amounts.length > 0) {
        if (!burnChart) {
            createBurnChart(marketData.burnData);
        } else {
            updateBurnChartData(marketData.burnData);
        }
    } else {
        console.warn("No burn data available to create or update burn chart.");
    }
    
    updateTradingPairs(marketData.tradingPairs || []);

    document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();
    console.log('Market data refreshed and UI updated.');

  } catch (error) {
    console.error('Failed to refresh market data:', error);
    showNotification('Data Error', 'Could not update market data. Displaying stale data if available. ' + error.message, 'error');
    if (chartLoadingOverlay) chartLoadingOverlay.classList.add('hidden'); // Hide loading on error
    // Optionally, clear parts of the UI or show "data unavailable" messages
  }
}

// Update the UI with new market data
function updateDashboardUI(data) {
  document.getElementById('current-price').textContent = '$' + (data.price ? data.price.toFixed(5) : 'N/A');
  const priceChangeElement = document.getElementById('price-change');
  if (data.priceChange !== undefined && data.priceChange !== null) {
    priceChangeElement.textContent = (data.priceChange > 0 ? '+' : '') + data.priceChange.toFixed(2) + '%';
    priceChangeElement.className = data.priceChange >= 0 ? 'text-xl font-bold text-green-400' : 'text-xl font-bold text-red-400';
  } else {
    priceChangeElement.textContent = 'N/A';
    priceChangeElement.className = 'text-xl font-bold text-gray-400';
  }

  document.getElementById('volume').textContent = '$' + formatNumber(data.volume);
  document.getElementById('market-cap').textContent = '$' + formatNumber(data.marketCap);

  document.getElementById('holders-count').textContent = formatNumber(data.holders);
  
  // Circulating Supply: Initial Supply - Total Burned
  // This calculation should happen in dataService or be based on fields provided by it.
  // Assuming dataService provides `initialSupply` and `totalBurned`.
  // Or, if dataService provides `circulatingSupply` directly (preferred if it's authoritative source)
  const circulatingSupply = data.circulatingSupply || (data.initialSupply - data.totalBurned);
  document.getElementById('circulating-supply').textContent = formatNumber(circulatingSupply) + ' PBTC';
  document.getElementById('total-burned').textContent = formatNumber(data.totalBurned) + ' PBTC';
  
  document.getElementById('ath').textContent = data.allTimeHigh ? '$' + data.allTimeHigh.toFixed(5) : 'N/A';
  document.getElementById('liquidity').textContent = '$' + formatNumber(data.liquidity);
  document.getElementById('exchange-count').textContent = (data.exchanges || 'N/A') + (data.exchanges === 1 ? ' exchange' : ' exchanges');

  const latestBurnEl = document.getElementById('latest-burn');
  if (data.latestBurn) {
    latestBurnEl.innerHTML = `
      <div class="flex justify-between items-center">
        <span>Amount: <b>${formatNumber(data.latestBurn.amount)} PBTC</b></span>
        <span class="text-xs text-gray-400">${data.latestBurn.time}</span>
      </div>
      <div class="mt-1 text-xs text-gray-400 truncate">
        Tx: <a href="https://solscan.io/tx/${data.latestBurn.txId}" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">${data.latestBurn.txId.substring(0, 16)}...</a>
      </div>
    `;
  } else {
    latestBurnEl.textContent = 'No burn data available.';
  }


  if (data.burnData) {
    document.getElementById('burn-rate').textContent = formatNumber(data.burnData.weeklyRate) + ' PBTC/week';
    document.getElementById('burn-projection').textContent = data.burnData.timeToHalfSupply || 'N/A';
  } else {
     document.getElementById('burn-rate').textContent = 'N/A';
     document.getElementById('burn-projection').textContent = 'N/A';
  }
}

// Update the price chart data without re-creating the chart
function updatePriceChartData(priceHistory) {
  if (!priceChart || !priceHistory) return;
  priceChart.data.labels = priceHistory.labels;
  priceChart.data.datasets[0].data = priceHistory.prices;
  priceChart.update();
}

// Update burn chart data
function updateBurnChartData(burnStats) {
  if (!burnChart || !burnStats) return;
  burnChart.data.labels = burnStats.labels;
  burnChart.data.datasets[0].data = burnStats.amounts;
  burnChart.update();
}

// Update trading pairs table
function updateTradingPairs(pairs) {
  const tableBody = document.getElementById('trading-pairs');
  if (!tableBody) return;

  if (!pairs || pairs.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="px-4 py-3 text-sm text-center text-gray-400">No trading pairs available.</td></tr>';
    return;
  }

  tableBody.innerHTML = pairs.map(pair => `
    <tr class="hover:bg-gray-800/50 transition-colors duration-150">
      <td class="px-4 py-3 text-sm whitespace-nowrap">${pair.exchange}</td>
      <td class="px-4 py-3 text-sm whitespace-nowrap">${pair.pair}</td>
      <td class="px-4 py-3 text-sm whitespace-nowrap">$${pair.price ? pair.price.toFixed(5) : 'N/A'}</td>
      <td class="px-4 py-3 text-sm whitespace-nowrap">$${formatNumber(pair.volume)}</td>
      <td class="px-4 py-3 text-sm whitespace-nowrap">
        <a href="${pair.link}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-purple-700 rounded-md text-xs hover:bg-purple-600 transition">
          Trade
        </a>
      </td>
    </tr>
  `).join('');
}

// Format numbers (ensure this is robust, could be moved to utilities.js if not already there)
// Assuming formatNumber is available globally from utilities.js or defined in this scope.
// If utilities.js's formatNumber is used, this local one can be removed.
// For safety, keep a local one or ensure utilities.js is loaded first and formatNumber is global.
// function formatNumber(num) {
//   if (num === null || num === undefined || isNaN(parseFloat(num))) return 'N/A';
//   return Number(num).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: num % 1 === 0 ? 0 : 2});
// }
// Using global formatNumber from utilities.js is preferred.


