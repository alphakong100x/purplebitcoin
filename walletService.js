// Wallet connection and management functionality

let currentWallet = null; // Holds { address: string, provider: object }
const PBTC_MINT_ADDRESS = 'ATH32PbLRUPJq8YnUhqWAJBGBGprBrW2gzw5jdZXiRr'; // Purple Bitcoin Mint Address

function initializeWalletFunctionality() {
  console.log('Initializing wallet functionality...');

  const connectButton = document.getElementById('connect-wallet-button');
  const mobileConnectButton = document.getElementById('mobile-connect-wallet');

  if (connectButton) {
    connectButton.addEventListener('click', handleConnectDisconnectClick);
  }
  if (mobileConnectButton) {
    mobileConnectButton.addEventListener('click', handleConnectDisconnectClick);
  }
  
  // Check for Phantom provider readiness
  if (window.solana && window.solana.isPhantom) {
    handleProvider(window.solana);
  } else {
    window.addEventListener('solana#initialized', () => handleProvider(window.solana), { once: true });
    // Fallback if event doesn't fire (e.g. already initialized)
    setTimeout(() => {
        if (window.solana && window.solana.isPhantom && !currentWallet) { // Check if not already handled
            handleProvider(window.solana);
        }
    }, 1000);
  }
  updateWalletUI(); // Initial UI setup
}

function handleProvider(provider) {
    console.log("Solana provider found:", provider);
    provider.on('connect', handleWalletConnectEvent);
    provider.on('disconnect', handleWalletDisconnectEvent);
    // Auto-connect if already approved (some wallets support this)
    // provider.connect({ onlyIfTrusted: true }).catch(err => console.log("Auto-connect failed or not supported:", err));
}


function handleConnectDisconnectClick() {
  if (currentWallet && currentWallet.provider) {
    disconnectWallet(currentWallet.provider);
  } else if (window.solana) {
    connectWallet(window.solana);
  } else {
    showNotification('Wallet Not Found', 'Please install a Solana wallet like Phantom.', 'error');
    window.open('https://phantom.app/', '_blank');
  }
}

async function connectWallet(provider) {
  if (!provider || !provider.isPhantom) { // Example check for Phantom
    showNotification('Wallet Not Found', 'Please install Phantom or another Solana wallet extension.', 'error');
    window.open('https://phantom.app/', '_blank');
    return;
  }

  showNotification('Connecting...', 'Please approve the connection in your wallet.', 'info');
  try {
    // The actual connection request. The 'connect' event will handle the rest if successful.
    await provider.connect();
    // If provider.connect() resolves without error AND the 'connect' event fires,
    // handleWalletConnectEvent will set currentWallet and update UI.
    // Some wallets might not fire 'connect' event if already connected, so we might need a direct check here.
    if (provider.publicKey && !currentWallet) { // If connect resolved and event handler didn't set currentWallet (e.g. already connected)
        console.log("Connect method resolved, public key available:", provider.publicKey.toString());
        handleWalletConnectEvent(provider.publicKey); // Manually trigger handler
    }

  } catch (error) {
    console.error('Error requesting wallet connection:', error);
    let userMessage = 'Failed to connect wallet. Please try again.';
    if (error.message && error.message.includes('User rejected the request')) {
      userMessage = 'Wallet connection request rejected.';
    } else if (error.code === 4001) { // Common code for user rejection
        userMessage = 'Wallet connection request rejected by user.';
    }
    showNotification('Connection Failed', userMessage, 'error');
    currentWallet = null; // Ensure state is clear
    updateWalletUI();
  }
}

// This function is called by the 'connect' event from the wallet provider
async function handleWalletConnectEvent(publicKey) { // publicKey might be passed by event or from provider object
    const provider = window.solana; // Assuming window.solana is the active provider
    if (!provider || !provider.publicKey) {
        console.error("Connect event fired, but provider or publicKey not available.");
        return;
    }
    const actualPublicKey = publicKey || provider.publicKey; // Use event publicKey if available

    console.log('Wallet connected via event. Public Key:', actualPublicKey.toString());
    currentWallet = {
      address: actualPublicKey.toString(),
      provider: provider,
      balance: 0 // Initial balance
    };

    updateWalletUI();
    await fetchWalletBalance();
    await fetchRewardsBalance(); // From gamification.js
    await updateLearningProgress(); // From education.js

    showNotification('Wallet Connected', `Connected: ${truncateAddress(currentWallet.address)}`, 'success');
}


async function disconnectWallet(provider) {
  if (!provider) {
    console.warn("Disconnect called without a provider.");
    // Fallback to clear state if provider is missing but currentWallet exists
    if (currentWallet) {
        currentWallet = null;
        updateWalletUI();
        showNotification('Wallet Disconnected', 'Wallet session cleared locally.', 'info');
    }
    return;
  }
  try {
    await provider.disconnect();
    // The 'disconnect' event handler (handleWalletDisconnectEvent) should take care of cleanup.
    // If it doesn't fire for some reason, the UI might remain in connected state.
  } catch (error) {
    console.error('Error calling wallet provider disconnect:', error);
    showNotification('Disconnect Error', 'Could not disconnect wallet cleanly. Resetting state.', 'warning');
    // Force cleanup if provider call fails
    currentWallet = null;
    updateWalletUI();
  }
}

// This function is called by the 'disconnect' event from the wallet provider
function handleWalletDisconnectEvent() {
    console.log('Wallet disconnected via event.');
    if (currentWallet) { // Only show notification if we thought it was connected
        showNotification('Wallet Disconnected', `Wallet ${truncateAddress(currentWallet.address)} has been disconnected.`, 'info');
    }
    currentWallet = null;
    updateWalletUI();
    // Also update sections that depend on wallet state
    fetchRewardsBalance(); // Will show "connect wallet"
    updateLearningProgress(); // Will show "connect wallet"
}

function updateWalletUI() {
  const walletBanner = document.getElementById('wallet-banner');
  const connectButton = document.getElementById('connect-wallet-button');
  const mobileConnectButton = document.getElementById('mobile-connect-wallet');
  const walletAddressElement = document.getElementById('wallet-address');
  const pbtcBalanceElement = document.getElementById('pbtc-balance');

  if (currentWallet && currentWallet.address) {
    walletBanner.classList.remove('hidden');
    walletAddressElement.textContent = truncateAddress(currentWallet.address);
    if (connectButton) connectButton.textContent = 'Disconnect Wallet';
    if (mobileConnectButton) mobileConnectButton.textContent = 'Disconnect Wallet';
    // Balance is updated by fetchWalletBalance
  } else {
    walletBanner.classList.add('hidden');
    walletAddressElement.textContent = '...';
    if (pbtcBalanceElement) pbtcBalanceElement.textContent = '-- PBTC';
    if (connectButton) connectButton.textContent = 'Connect Wallet';
    if (mobileConnectButton) mobileConnectButton.textContent = 'Connect Wallet';
  }
}

async function fetchWalletBalance() {
  if (!currentWallet || !currentWallet.address || !currentWallet.provider) {
    const pbtcBalanceElement = document.getElementById('pbtc-balance');
    if (pbtcBalanceElement) pbtcBalanceElement.textContent = '-- PBTC';
    return;
  }

  const pbtcBalanceElement = document.getElementById('pbtc-balance');
  if (pbtcBalanceElement) pbtcBalanceElement.textContent = 'Loading...';

  try {
    // REAL Solana blockchain call placeholder using @solana/web3.js
    // This requires the @solana/web3.js library to be available.
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
    const walletPublicKey = new solanaWeb3.PublicKey(currentWallet.address);
    const pbtcMintPublicKey = new solanaWeb3.PublicKey(PBTC_MINT_ADDRESS);

    // Get the associated token account for PBTC for the connected wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
      mint: pbtcMintPublicKey,
    });
    
    let pbtcBalance = 0;
    if (tokenAccounts.value.length > 0) {
      // Assuming the first account is the primary one, or sum them up if multiple exist (rare for non-custodial)
      const accountInfo = tokenAccounts.value[0].account.data.parsed.info;
      pbtcBalance = accountInfo.tokenAmount.uiAmount; // This gives the balance in human-readable format
    }
    
    currentWallet.balance = pbtcBalance;

    if (pbtcBalanceElement) {
      pbtcBalanceElement.textContent = `${formatNumber(currentWallet.balance)} PBTC`;
    }
    console.log('Actual wallet PBTC balance fetched:', currentWallet.balance);

  } catch (error) {
    console.error('Error fetching PBTC balance from Solana network:', error);
    if (pbtcBalanceElement) pbtcBalanceElement.textContent = 'Error';
    showNotification('Balance Error', `Failed to fetch your PBTC balance: ${error.message}`, 'error');
  }
}

function isWalletConnected() {
  return currentWallet !== null && currentWallet.address !== null;
}

function getWalletAddress() {
  return currentWallet ? currentWallet.address : null;
}

// Expose necessary functions globally if not using modules
window.isWalletConnected = isWalletConnected;
window.getWalletAddress = getWalletAddress;


