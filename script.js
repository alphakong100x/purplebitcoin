/**
 * CryptoMarketer AI - Powered by Purple Bitcoin
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Feature modal functionality
    const featureCards = document.querySelectorAll('.feature-card');
    const modal = document.getElementById('feature-modal');
    const closeModal = document.querySelector('.close-modal');
    
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            
            // Hide all feature content
            document.querySelectorAll('.modal-feature').forEach(content => {
                content.style.display = 'none';
            });
            
            // Show selected feature content
            document.getElementById(`modal-${feature}`).style.display = 'block';
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Copy contract address
    const copyButton = document.getElementById('copy-contract');
    const contractValue = document.querySelector('.contract-value');
    
    if (copyButton && contractValue) {
        copyButton.addEventListener('click', function() {
            const textArea = document.createElement('textarea');
            textArea.value = contractValue.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Show copied message
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(function() {
                copyButton.innerHTML = originalText;
            }, 2000);
        });
    }

    // Countdown animation
    const spotsCounter = document.getElementById('spots-counter');
    
    if (spotsCounter) {
        const targetValue = parseInt(spotsCounter.textContent);
        let currentValue = 0;
        const duration = 2000; // 2 seconds
        const interval = 20; // Update every 20ms
        const steps = duration / interval;
        const increment = targetValue / steps;
        
        const counterAnimation = setInterval(function() {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(counterAnimation);
            }
            
            spotsCounter.textContent = Math.floor(currentValue);
        }, interval);
    }

    // Scroll to top button
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Form submission
    const waitlistForm = document.getElementById('waitlist-form');
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(waitlistForm);
            const formDataObj = {};
            
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Simulate form submission
            const submitButton = waitlistForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(function() {
                // Show success message
                waitlistForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success-green); margin-bottom: 20px;"></i>
                        <h3>Thank you for joining the waitlist!</h3>
                        <p>We've received your information and will contact you when early access is available.</p>
                    </div>
                `;
                
                // Scroll to success message
                waitlistForm.scrollIntoView({ behavior: 'smooth' });
            }, 1500);
        });
    }

    // Wallet connect button
    const walletConnectBtn = document.querySelector('.wallet-connect');
    
    if (walletConnectBtn) {
        walletConnectBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create wallet selection modal
            const walletModal = document.createElement('div');
            walletModal.className = 'modal';
            walletModal.style.display = 'block';
            
            walletModal.innerHTML = `
                <div class="modal-content" style="max-width: 500px;">
                    <span class="close-modal">&times;</span>
                    <h3 style="text-align: center; margin-bottom: 30px;">Connect Your Wallet</h3>
                    <div class="wallet-options">
                        <div class="wallet-option">
                            <img src="assets/pbtc-logo.png" alt="Phantom" style="width: 40px; height: 40px;">
                            <span>Phantom</span>
                        </div>
                        <div class="wallet-option">
                            <img src="assets/pbtc-logo.png" alt="Solflare" style="width: 40px; height: 40px;">
                            <span>Solflare</span>
                        </div>
                        <div class="wallet-option">
                            <img src="assets/pbtc-logo.png" alt="Coinbase Wallet" style="width: 40px; height: 40px;">
                            <span>Coinbase Wallet</span>
                        </div>
                        <div class="wallet-option">
                            <img src="assets/pbtc-logo.png" alt="MetaMask" style="width: 40px; height: 40px;">
                            <span>MetaMask</span>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(walletModal);
            document.body.style.overflow = 'hidden';
            
            // Style wallet options
            const walletOptions = walletModal.querySelectorAll('.wallet-option');
            
            walletOptions.forEach(option => {
                option.style.display = 'flex';
                option.style.alignItems = 'center';
                option.style.gap = '15px';
                option.style.padding = '15px';
                option.style.margin = '10px 0';
                option.style.borderRadius = '10px';
                option.style.border = '1px solid rgba(144, 19, 254, 0.2)';
                option.style.cursor = 'pointer';
                option.style.transition = 'background 0.25s ease-out';
                
                option.addEventListener('mouseover', function() {
                    this.style.background = 'rgba(144, 19, 254, 0.1)';
                });
                
                option.addEventListener('mouseout', function() {
                    this.style.background = 'transparent';
                });
                
                option.addEventListener('click', function() {
                    // Simulate wallet connection
                    walletModal.querySelector('.modal-content').innerHTML = `
                        <h3 style="text-align: center; margin-bottom: 30px;">Connecting...</h3>
                        <div style="display: flex; justify-content: center; margin: 30px 0;">
                            <div class="loading-spinner"></div>
                        </div>
                        <p style="text-align: center;">Please approve the connection in your wallet</p>
                    `;
                    
                    // Add spinner style
                    const style = document.createElement('style');
                    style.textContent = `
                        .loading-spinner {
                            width: 50px;
                            height: 50px;
                            border: 5px solid rgba(144, 19, 254, 0.1);
                            border-radius: 50%;
                            border-top-color: var(--primary-purple);
                            animation: spin 1s linear infinite;
                        }
                        
                        @keyframes spin {
                            to {
                                transform: rotate(360deg);
                            }
                        }
                    `;
                    document.head.appendChild(style);
                    
                    // Simulate connection success
                    setTimeout(function() {
                        walletModal.querySelector('.modal-content').innerHTML = `
                            <h3 style="text-align: center; margin-bottom: 30px;">Connected Successfully!</h3>
                            <div style="display: flex; justify-content: center; margin: 30px 0;">
                                <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success-green);"></i>
                            </div>
                            <p style="text-align: center;">Your wallet is now connected</p>
                            <button class="primary-button" style="display: block; margin: 30px auto 0;">Continue</button>
                        `;
                        
                        // Close modal on continue
                        walletModal.querySelector('.primary-button').addEventListener('click', function() {
                            document.body.removeChild(walletModal);
                            document.body.style.overflow = 'auto';
                            
                            // Update connect button
                            walletConnectBtn.textContent = 'Wallet Connected';
                            walletConnectBtn.classList.add('connected');
                        });
                    }, 2000);
                });
            });
            
            // Close modal functionality
            const closeModalBtn = walletModal.querySelector('.close-modal');
            
            closeModalBtn.addEventListener('click', function() {
                document.body.removeChild(walletModal);
                document.body.style.overflow = 'auto';
            });
            
            // Close when clicking outside
            walletModal.addEventListener('click', function(event) {
                if (event.target === walletModal) {
                    document.body.removeChild(walletModal);
                    document.body.style.overflow = 'auto';
                }
            });
        });
    }

    // PBTC price ticker simulation
    const pbtcPrice = document.getElementById('pbtc-price');
    
    if (pbtcPrice) {
        // Simulate price updates
        setInterval(function() {
            const currentPrice = parseFloat(pbtcPrice.textContent.replace('$', ''));
            const change = (Math.random() - 0.45) * 0.0001; // Slight bias towards increase
            const newPrice = currentPrice + change;
            
            pbtcPrice.textContent = '$' + newPrice.toFixed(5);
            
            // Update price change indicator
            const priceChange = document.querySelector('.price-change');
            
            if (change > 0) {
                priceChange.textContent = '+' + (Math.random() * 15).toFixed(1) + '%';
                priceChange.classList.add('positive');
                priceChange.classList.remove('negative');
            } else {
                priceChange.textContent = '-' + (Math.random() * 5).toFixed(1) + '%';
                priceChange.classList.add('negative');
                priceChange.classList.remove('positive');
            }
        }, 5000); // Update every 5 seconds
    }

    // Initialize first FAQ item as open
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
});
