// Utilities and helper functions

// Function to handle travel platform interactions
function initiateTravelBooking() {
  // In a real implementation, this would redirect to the Purple Travel platform
  // with the user's wallet information for a seamless experience
  window.open('https://purplebitcoin.com/travel', '_blank', 'noopener,noreferrer');
}

// Format numbers with commas and appropriate decimal places
function formatNumber(num, decimals) {
  if (num === null || num === undefined || isNaN(parseFloat(num))) {
    return 'N/A';
  }
  const numParsed = Number(num);
  const defaultDecimals = (numParsed % 1 === 0) ? 0 : 2; // Default to 0 decimals for integers, 2 for floats
  const finalDecimals = (decimals === undefined) ? defaultDecimals : decimals;
  
  return numParsed.toLocaleString(undefined, { 
    minimumFractionDigits: finalDecimals, 
    maximumFractionDigits: finalDecimals 
  });
}


// Truncate address for display
function truncateAddress(address, start = 6, end = 4) {
  if (!address || typeof address !== 'string' || address.length < start + end + 3) { // +3 for "..."
    return address || ''; // Return empty string if address is null/undefined
  }
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
}


// It's generally better to have specific data fetching functions in their respective services (dataService, walletService, etc.)
// rather than generic utility functions for fetching balances, as they often involve specific contexts (mint addresses, API endpoints).

// The following placeholder comments are for functions that are now expected to reside in their specific service files (e.g., gamification.js, walletService.js)
// and interact with a backend or blockchain directly.

/*
async function fetchRewardsBalance() {
    // RESIDES IN: gamification.js
    // This function should fetch the user's reward balance from a secure backend,
    // associated with their connected wallet address.
    // Example:
    // if (!isWalletConnected()) return 0;
    // const response = await fetch(`/api/rewards/balance?wallet=${getWalletAddress()}`);
    // const data = await response.json();
    // return data.balance;
}
*/

/*
async function fetchWalletPBTCTokenBalance() {
    // RESIDES IN: walletService.js (as part of fetchWalletBalance)
    // This function should use Solana Web3.js or similar to query the blockchain
    // for the connected user's PBTC token balance.
    // Example:
    // if (!isWalletConnected()) return 0;
    // const connection = new solanaWeb3.Connection(...);
    // const publicKey = new solanaWeb3.PublicKey(getWalletAddress());
    // const mintAddress = new solanaWeb3.PublicKey('PBTC_MINT_ADDRESS');
    // ... logic to get token account and balance ...
    // return balance;
}
*/

// Helper for simulating delays (can be removed in production)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


