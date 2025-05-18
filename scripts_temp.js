/**
 * CryptoMarketer AI - Powered by Purple Bitcoin
 * Main JavaScript functionality for the promotional website
 * @author CryptoMarketer AI Team
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    /**
     * Adds scroll effect to the navigation header
     * Adds 'scrolled' class when page is scrolled beyond 50px
     */
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /**
     * Toggles mobile menu visibility
     * Adds/removes 'active' class to show/hide mobile navigation
     */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    /**
     * Feature modal functionality
     * Shows detailed information about features when cards are clicked
     */
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

    /**
     * Closes the feature modal when close button is clicked
     */
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    /**
     * Closes the modal when clicking outside content
     * @param {Event} event - The click event
     */
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    /**
     * FAQ accordion functionality
     * Toggles visibility of FAQ answers when questions are clicked
     */
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

    /**
     * Copy contract address functionality
     * Copies the contract address to clipboard when button is clicked
     */
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

    /**
     * Animated counter for remaining spots
     * Animates the counter from 0 to target value
     */
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

    /**
     * Scroll to top button functionality
     * Shows/hides button based on scroll position and scrolls to top when clicked
     */
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

    /**
     * Smooth scrolling for anchor links
     * Scrolls smoothly to the target section when anchor links are clicked
     * @param {Event} e - The click event
     */
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

    /**
     * Form submission handler
     * Handles waitlist form submission and displays success message
     * @param {Event} e - The submit event
     */
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

    /**
     * Wallet connect button functionality
     * Shows wallet selection modal when connect button is clicked
     * @param {Event} e - The click event
     */
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
                option.style.backgroundColor = 'rgba(142, 53, 255, 0.1)';
                option.style.cursor = 'pointer';
                option.style.transition = 'all 0.3s ease';
                
                option.addEventListener('mouseover', function() {
                    this.style.backgroundColor = 'rgba(142, 53, 255, 0.2)';
                });
                
                option.addEventListener('mouseout', function() {
                    this.style.backgroundColor = 'rgba(142, 53, 255, 0.1)';
                });
                
                option.addEventListener('click', function() {
                    // Simulate wallet connection
                    const walletName = this.querySelector('span').textContent;
                    walletModal.querySelector('.modal-content').innerHTML = `
                        <h3 style="text-align: center; margin-bottom: 30px;">Connecting to ${walletName}...</h3>
                        <div style="display: flex; justify-content: center; margin: 30px 0;">
                            <div class="loader"></div>
                        </div>
                    `;
                    
                    // Simulate connection process
                    setTimeout(function() {
                        // Close modal
                        document.body.removeChild(walletModal);
                        document.body.style.overflow = 'auto';
                        
                        // Update button text
                        walletConnectBtn.textContent = 'Wallet Connected';
                        walletConnectBtn.classList.add('connected');
                        
                        // Show early access form
                        const earlyAccessSection = document.getElementById('early-access');
                        if (earlyAccessSection) {
                            earlyAccessSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 2000);
                });
            });
            
            // Close modal functionality
            const closeModalBtn = walletModal.querySelector('.close-modal');
            closeModalBtn.style.cursor = 'pointer';
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
});
