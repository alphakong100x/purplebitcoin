/**
 * CryptoMarketer AI - Powered by Purple Bitcoin
 * Payment Integration Module
 */

// PBTC Payment Integration
class PBTCPayment {
    constructor() {
        this.isConnected = false;
        this.walletAddress = '';
        this.pbtcBalance = 0;
        this.subscriptionPrice = 0.5; // PBTC
        this.contractAddress = '0x7e2bf93a'; // Example contract address
    }

    // Connect wallet
    async connectWallet(provider) {
        return new Promise((resolve) => {
            console.log(`Connecting to ${provider} wallet...`);
            
            // Simulate connection delay
            setTimeout(() => {
                this.isConnected = true;
                this.walletAddress = '8FGh...3Kpq'; // Example wallet address
                this.pbtcBalance = 2.75; // Example PBTC balance
                
                console.log('Wallet connected successfully');
                resolve({
                    success: true,
                    address: this.walletAddress,
                    balance: this.pbtcBalance
                });
            }, 1500);
        });
    }

    // Disconnect wallet
    disconnectWallet() {
        this.isConnected = false;
        this.walletAddress = '';
        this.pbtcBalance = 0;
        
        console.log('Wallet disconnected');
        return { success: true };
    }

    // Check if user has sufficient PBTC balance
    checkBalance() {
        return this.pbtcBalance >= this.subscriptionPrice;
    }

    // Process payment
    async processPayment() {
        return new Promise((resolve) => {
            if (!this.isConnected) {
                resolve({
                    success: false,
                    message: 'Wallet not connected'
                });
                return;
            }
            
            if (!this.checkBalance()) {
                resolve({
                    success: false,
                    message: 'Insufficient PBTC balance'
                });
                return;
            }
            
            // Simulate payment processing
            console.log('Processing payment...');
            
            setTimeout(() => {
                this.pbtcBalance -= this.subscriptionPrice;
                
                console.log('Payment processed successfully');
                resolve({
                    success: true,
                    txHash: '0x3f5e9a7b2c1d8e4f6g0h1i2j3k4l5m6n7o8p9q0r',
                    remainingBalance: this.pbtcBalance
                });
            }, 2000);
        });
    }

    // Get supported wallet providers
    getSupportedWallets() {
        return [
            { name: 'Phantom', icon: 'phantom.png' },
            { name: 'Solflare', icon: 'solflare.png' },
            { name: 'Coinbase Wallet', icon: 'coinbase.png' },
            { name: 'MetaMask', icon: 'metamask.png' }
        ];
    }

    // Get PBTC price in USD
    async getPBTCPrice() {
        return new Promise((resolve) => {
            // Simulate API call to get price
            setTimeout(() => {
                resolve({
                    success: true,
                    price: 0.00428, // Example price in USD
                    change: 12.4 // Example 24h change percentage
                });
            }, 500);
        });
    }
}

// Initialize payment module
const pbtcPayment = new PBTCPayment();

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Payment buttons
    const payButtons = document.querySelectorAll('.primary-button');
    const walletConnectBtn = document.querySelector('.wallet-connect');
    
    // Add click event to payment buttons
    payButtons.forEach(button => {
        if (button.textContent.includes('Pay') || button.textContent.includes('Join') || button.textContent.includes('Secure')) {
            button.addEventListener('click', handlePaymentClick);
        }
    });
    
    // Wallet connect button
    if (walletConnectBtn) {
        walletConnectBtn.addEventListener('click', handleWalletConnect);
    }
    
    // Initialize PBTC price display
    initializePriceDisplay();
});

// Handle payment button click
async function handlePaymentClick(e) {
    e.preventDefault();
    
    // Check if wallet is connected
    if (!pbtcPayment.isConnected) {
        // Show wallet connect modal
        showWalletConnectModal();
        return;
    }
    
    // Show payment confirmation modal
    showPaymentConfirmationModal();
}

// Handle wallet connect button click
function handleWalletConnect(e) {
    e.preventDefault();
    
    // Show wallet connect modal
    showWalletConnectModal();
}

// Show wallet connect modal
function showWalletConnectModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'wallet-modal';
    modal.style.display = 'block';
    
    // Get supported wallets
    const wallets = pbtcPayment.getSupportedWallets();
    
    // Create wallet options HTML
    let walletsHTML = '';
    wallets.forEach(wallet => {
        walletsHTML += `
            <div class="wallet-option" data-wallet="${wallet.name.toLowerCase()}">
                <img src="assets/pbtc-logo.png" alt="${wallet.name}">
                <span>${wallet.name}</span>
            </div>
        `;
    });
    
    // Set modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Connect Your Wallet</h3>
            <p>Connect your wallet to pay with Purple Bitcoin (PBTC)</p>
            <div class="wallet-options">
                ${walletsHTML}
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add event listeners to wallet options
    const walletOptions = modal.querySelectorAll('.wallet-option');
    walletOptions.forEach(option => {
        option.addEventListener('click', async function() {
            const walletName = this.getAttribute('data-wallet');
            
            // Update modal content to show connecting state
            modal.querySelector('.modal-content').innerHTML = `
                <h3>Connecting to ${walletName}</h3>
                <div class="loading-spinner"></div>
                <p>Please approve the connection in your wallet</p>
            `;
            
            // Connect wallet
            try {
                const result = await pbtcPayment.connectWallet(walletName);
                
                if (result.success) {
                    // Update modal content to show success
                    modal.querySelector('.modal-content').innerHTML = `
                        <span class="close-modal">&times;</span>
                        <h3>Wallet Connected</h3>
                        <div class="wallet-info">
                            <p><strong>Address:</strong> ${result.address}</p>
                            <p><strong>PBTC Balance:</strong> ${result.balance} PBTC</p>
                        </div>
                        <button class="primary-button continue-btn">Continue</button>
                    `;
                    
                    // Add event listener to continue button
                    modal.querySelector('.continue-btn').addEventListener('click', function() {
                        // Close modal
                        document.body.removeChild(modal);
                        document.body.style.overflow = 'auto';
                        
                        // Update wallet connect button
                        const walletConnectBtn = document.querySelector('.wallet-connect');
                        if (walletConnectBtn) {
                            walletConnectBtn.textContent = 'Wallet Connected';
                            walletConnectBtn.classList.add('connected');
                        }
                        
                        // Show payment confirmation if balance is sufficient
                        if (pbtcPayment.checkBalance()) {
                            showPaymentConfirmationModal();
                        } else {
                            showInsufficientBalanceModal();
                        }
                    });
                    
                    // Add event listener to close button
                    const closeBtn = modal.querySelector('.close-modal');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', function() {
                            document.body.removeChild(modal);
                            document.body.style.overflow = 'auto';
                        });
                    }
                }
            } catch (error) {
                console.error('Error connecting wallet:', error);
                
                // Update modal content to show error
                modal.querySelector('.modal-content').innerHTML = `
                    <span class="close-modal">&times;</span>
                    <h3>Connection Failed</h3>
                    <p>There was an error connecting to your wallet. Please try again.</p>
                    <button class="primary-button try-again-btn">Try Again</button>
                `;
                
                // Add event listener to try again button
                modal.querySelector('.try-again-btn').addEventListener('click', function() {
                    document.body.removeChild(modal);
                    document.body.style.overflow = 'auto';
                    showWalletConnectModal();
                });
                
                // Add event listener to close button
                const closeBtn = modal.querySelector('.close-modal');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        document.body.removeChild(modal);
                        document.body.style.overflow = 'auto';
                    });
                }
            }
        });
    });
    
    // Add event listener to close button
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
}

// Show payment confirmation modal
function showPaymentConfirmationModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'payment-modal';
    modal.style.display = 'block';
    
    // Set modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Confirm Payment</h3>
            <div class="payment-details">
                <p><strong>Amount:</strong> ${pbtcPayment.subscriptionPrice} PBTC</p>
                <p><strong>Wallet:</strong> ${pbtcPayment.walletAddress}</p>
                <p><strong>Current Balance:</strong> ${pbtcPayment.pbtcBalance} PBTC</p>
            </div>
            <div class="payment-actions">
                <button class="primary-button confirm-payment-btn">Confirm Payment</button>
                <button class="secondary-button cancel-payment-btn">Cancel</button>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add event listener to confirm button
    const confirmBtn = modal.querySelector('.confirm-payment-btn');
    confirmBtn.addEventListener('click', async function() {
        // Update modal content to show processing state
        modal.querySelector('.modal-content').innerHTML = `
            <h3>Processing Payment</h3>
            <div class="loading-spinner"></div>
            <p>Please approve the transaction in your wallet</p>
        `;
        
        // Process payment
        try {
            const result = await pbtcPayment.processPayment();
            
            if (result.success) {
                // Update modal content to show success
                modal.querySelector('.modal-content').innerHTML = `
                    <span class="close-modal">&times;</span>
                    <h3>Payment Successful</h3>
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="payment-info">
                        <p><strong>Transaction Hash:</strong> ${result.txHash}</p>
                        <p><strong>Remaining Balance:</strong> ${result.remainingBalance} PBTC</p>
                    </div>
                    <p class="success-message">Thank you for your payment! You now have access to CryptoMarketer AI.</p>
                    <button class="primary-button access-platform-btn">Access Platform</button>
                `;
                
                // Add event listener to access platform button
                modal.querySelector('.access-platform-btn').addEventListener('click', function() {
                    // Close modal
                    document.body.removeChild(modal);
                    document.body.style.overflow = 'auto';
                    
                    // Redirect to dashboard (simulated)
                    alert('In a production environment, this would redirect to the platform dashboard.');
                });
                
                // Add event listener to close button
                const closeBtn = modal.querySelector('.close-modal');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        document.body.removeChild(modal);
                        document.body.style.overflow = 'auto';
                    });
                }
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            
            // Update modal content to show error
            modal.querySelector('.modal-content').innerHTML = `
                <span class="close-modal">&times;</span>
                <h3>Payment Failed</h3>
                <p>There was an error processing your payment. Please try again.</p>
                <button class="primary-button try-again-btn">Try Again</button>
            `;
            
            // Add event listener to try again button
            modal.querySelector('.try-again-btn').addEventListener('click', function() {
                document.body.removeChild(modal);
                document.body.style.overflow = 'auto';
                showPaymentConfirmationModal();
            });
            
            // Add event listener to close button
            const closeBtn = modal.querySelector('.close-modal');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    document.body.removeChild(modal);
                    document.body.style.overflow = 'auto';
                });
            }
        }
    });
    
    // Add event listener to cancel button
    const cancelBtn = modal.querySelector('.cancel-payment-btn');
    cancelBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });
    
    // Add event listener to close button
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
}

// Show insufficient balance modal
function showInsufficientBalanceModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'balance-modal';
    modal.style.display = 'block';
    
    // Set modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Insufficient Balance</h3>
            <p>Your current PBTC balance (${pbtcPayment.pbtcBalance} PBTC) is insufficient to complete this transaction.</p>
            <p>Required amount: ${pbtcPayment.subscriptionPrice} PBTC</p>
            <button class="primary-button get-pbtc-btn">Get PBTC</button>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add event listener to get PBTC button
    const getPBTCBtn = modal.querySelector('.get-pbtc-btn');
    getPBTCBtn.addEventListener('click', function() {
        // Close current modal
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
        
        // Show get PBTC modal
        showGetPBTCModal();
    });
    
    // Add event listener to close button
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
}

// Show get PBTC modal
function showGetPBTCModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'get-pbtc-modal';
    modal.style.display = 'block';
    
    // Set modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Get Purple Bitcoin (PBTC)</h3>
            <p>You can acquire PBTC through the following methods:</p>
            <div class="pbtc-options">
                <div class="pbtc-option">
                    <h4>1. Swap for PBTC</h4>
                    <p>Exchange other cryptocurrencies for PBTC using a decentralized exchange.</p>
                    <button class="primary-button swap-btn">Swap Now</button>
                </div>
                <div class="pbtc-option">
                    <h4>2. Purchase on Exchange</h4>
                    <p>Buy PBTC directly on supported exchanges.</p>
                    <button class="primary-button exchange-btn">View Exchanges</button>
                </div>
                <div class="pbtc-option">
                    <h4>3. Bridge from Other Chains</h4>
                    <p>Use a bridge to transfer tokens from other blockchains.</p>
                    <button class="primary-button bridge-btn">Use Bridge</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add event listeners to buttons
    const swapBtn = modal.querySelector('.swap-btn');
    swapBtn.addEventListener('click', function() {
        // Simulate opening swap interface
        alert('In a production environment, this would open a DEX swap interface.');
    });
    
    const exchangeBtn = modal.querySelector('.exchange-btn');
    exchangeBtn.addEventListener('click', function() {
        // Simulate opening exchanges list
        alert('In a production environment, this would show a list of exchanges where PBTC is listed.');
    });
    
    const bridgeBtn = modal.querySelector('.bridge-btn');
    bridgeBtn.addEventListener('click', function() {
        // Simulate opening bridge interface
        alert('In a production environment, this would open a cross-chain bridge interface.');
    });
    
    // Add event listener to close button
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize PBTC price display
async function initializePriceDisplay() {
    const priceElement = document.getElementById('pbtc-price');
    const changeElement = document.querySelector('.price-change');
    
    if (priceElement && changeElement) {
        try {
            const priceData = await pbtcPayment.getPBTCPrice();
            
            if (priceData.success) {
                priceElement.textContent = '$' + priceData.price.toFixed(5);
                
                if (priceData.change >= 0) {
                    changeElement.textContent = '+' + priceData.change.toFixed(1) + '%';
                    changeElement.classList.add('positive');
                    changeElement.classList.remove('negative');
                } else {
                    changeElement.textContent = priceData.change.toFixed(1) + '%';
                    changeElement.classList.add('negative');
                    changeElement.classList.remove('positive');
                }
            }
        } catch (error) {
            console.error('Error fetching PBTC price:', error);
        }
    }
}
