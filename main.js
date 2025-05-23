// Main JavaScript file to coordinate functionality

document.addEventListener('DOMContentLoaded', async function() {
  // Initialize services and components
  initializeUI();
  initializeWalletFunctionality(); // Initializes wallet connect button listeners
  initializeDashboard();
  initializeNews(); // Initial fetch of news
  initializeEducation(); // Sets up listeners for education module buttons
  initializeGamification(); // Sets up listeners for task verification buttons (via content.js rendering)
  initializeNotifications();
  initializeContent(); // Initialize dynamic content which might include buttons needing listeners

  // Show welcome notification
  showNotification(
    'Welcome to Purple Bitcoin v1.1',
    'Explore the Autonomous Online Asset to learn about PBTC and track real-time data.',
    'info'
  );

  // Start periodic updates
  scheduleUpdates();
});

// Initialize UI elements and event listeners
function initializeUI() {
  console.log('Initializing UI components...');

  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Close mobile menu when clicking on a link
  const mobileMenuLinks = mobileMenu?.querySelectorAll('a, button'); // Include button for mobile connect
  mobileMenuLinks?.forEach(link => {
    link.addEventListener('click', function() {
      // Don't close if it's the connect wallet button that needs to stay open for wallet interaction
      if (this.id !== 'mobile-connect-wallet' || !isWalletConnected()) {
         mobileMenu.classList.add('hidden');
      }
    });
  });
  
  // Mobile wallet connect is handled by initializeWalletFunctionality

  // Ask Soltoshi Modal
  const askSoltoshiModal = document.getElementById('ask-soltoshi-modal');
  const closeSoltoshiModal = document.getElementById('close-soltoshi-modal');
  const submitToSoltoshi = document.getElementById('submit-to-soltoshi');

  // Event delegation for "Ask Soltoshi" button, as it might be dynamically added by content.js
  document.body.addEventListener('click', function(event) {
      if (event.target && event.target.id === 'ask-ai') {
          const modal = document.getElementById('ask-soltoshi-modal');
          if (modal) {
              modal.classList.remove('hidden');
          }
      }
  });

  if (closeSoltoshiModal && askSoltoshiModal) {
    closeSoltoshiModal.addEventListener('click', function() {
      askSoltoshiModal.classList.add('hidden');
    });
  }

  if (submitToSoltoshi) {
    submitToSoltoshi.addEventListener('click', submitQuestionToAI);
  }

  // Refresh news button
  const refreshNewsButton = document.getElementById('refresh-news');
  if (refreshNewsButton) {
    refreshNewsButton.addEventListener('click', async function() {
      this.innerHTML = '<i class="fas fa-sync-alt fa-spin mr-2"></i> Refreshing...';
      this.disabled = true;
      try {
        await fetchNews(); // Ensure fetchNews is async and handles its own errors/notifications
      } catch (error) {
        // fetchNews should ideally show its own error, but this is a fallback
        showNotification('Error', 'Failed to refresh news. Please try again.', 'error');
      }
      this.innerHTML = '<i class="fas fa-sync-alt mr-2"></i> Refresh';
      this.disabled = false;
    });
  }

  // Add active state highlighting for navigation links
  setupActiveNavLinkHighlighting();
}

// Function to highlight the active navigation link
function setupActiveNavLinkHighlighting() {
    const mainNavLinks = document.querySelectorAll('#main-nav a');
    const mobileNavLinks = document.querySelectorAll('#mobile-menu nav a');
    const sections = document.querySelectorAll('main section[id]'); // Ensure sections have IDs

    const observerCallback = (entries) => {
        let currentActiveSectionId = null;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Prioritize sections that are more visible or higher up if multiple are "intersecting"
                // A simple way: the first one that's intersecting and at least partially visible
                if (!currentActiveSectionId) { // Take the first one that becomes visible
                    currentActiveSectionId = entry.target.id;
                }
            }
        });
        
        // Fallback if no section is actively intersecting (e.g. at very top or bottom of page)
        // or if only one entry is processed and it's not intersecting.
        // A more robust way would be to find the "most visible" one.
        // For now, if multiple are intersecting, the first one in DOM order that is intersecting will win.

        if (!currentActiveSectionId && entries.length > 0) {
            // If scrolled past all sections or before the first one, find the "closest" one
            // This part can be complex. A simpler approach: if nothing is clearly "active",
            // maybe clear all active states or highlight the first/last based on scroll.
            // For now, we'll rely on positive intersection.
        }


        mainNavLinks.forEach(link => {
            link.classList.remove('active-nav-link');
            if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
                link.classList.add('active-nav-link');
            }
        });
        mobileNavLinks.forEach(link => {
            link.classList.remove('active-nav-link-mobile');
             if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
                link.classList.add('active-nav-link-mobile');
            }
        });
    };

    const observerOptions = {
        root: null, // observing intersections with the viewport
        rootMargin: '-20% 0px -50% 0px', // Adjust margins: trigger when top 20% of section is visible, up to 50% from bottom
        threshold: 0.1 // At least 10% of the target is visible
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        if (section.id) { // Only observe sections with an ID
             observer.observe(section);
        }
    });
}


// Submit question to AI via a secure backend proxy
async function submitQuestionToAI() {
  const questionElement = document.getElementById('soltoshi-question');
  const answerElement = document.getElementById('soltoshi-answer');
  const submitButton = document.getElementById('submit-to-soltoshi');

  if (!questionElement || !answerElement || !submitButton) return;

  const rawQuestion = questionElement.value;
  const question = rawQuestion.trim();

  if (!question) {
    showNotification('Input Required', 'Please enter a question for Purple Soltoshi.', 'warning');
    return;
  }

  // Basic client-side input validation (length, etc.) can be added here if desired.
  // Robust validation and sanitization must happen server-side.

  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
  answerElement.innerHTML = '<div class="animate-pulse"><div class="h-4 bg-purple-800/30 rounded w-full mb-2"></div><div class="h-4 bg-purple-800/30 rounded w-11/12 mb-2"></div><div class="h-4 bg-purple-800/30 rounded w-3/4"></div></div>';
  answerElement.classList.remove('hidden');

  try {
    // Call the secure backend proxy endpoint
    const response = await fetch('/api/ask-soltoshi', { // This is a placeholder endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization headers (e.g., JWT token) would be added here if the backend requires authentication
      },
      body: JSON.stringify({ question: question }) // Send the trimmed question
    });

    if (!response.ok) {
      // Try to get error message from backend response body
      let errorMsg = 'Failed to get response from AI service.';
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) { /* Ignore if response is not JSON */ }
      throw new Error(`AI service request failed: ${response.status} ${response.statusText}. ${errorMsg}`);
    }

    const data = await response.json();

    if (data.answer) {
      // The backend proxy is responsible for ensuring the 'answer' content is safe to render.
      // If the answer is plain text and needs line breaks preserved:
      // answerElement.textContent = data.answer; // This is safest if no HTML is expected.
      // If the answer might contain safe HTML (e.g., <p>, <br>, <b> from Markdown conversion):
      answerElement.innerHTML = data.answer; // Assumes backend returns sanitized HTML
    } else {
      answerElement.innerHTML = '<p class="text-yellow-400">Purple Soltoshi provided an empty response. Try rephrasing your question.</p>';
    }

  } catch (error) {
    console.error('Error submitting question to AI proxy:', error);
    answerElement.innerHTML = `<p class="text-red-400">Sorry, an error occurred: ${error.message}. Please try again later.</p>`;
    showNotification('AI Error', `Could not get response: ${error.message}`, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Ask Soltoshi';
  }
}

// Schedule periodic data updates
function scheduleUpdates() {
  // Update market data every 60 seconds
  setInterval(async () => {
    try {
        await refreshMarketData(); // refreshMarketData should handle its own errors and notifications
        document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();
    } catch (error) {
        console.error("Periodic market data refresh failed:", error);
        // showNotification might be redundant if refreshMarketData handles it, but good as a fallback.
        // showNotification('Update Error', 'Could not refresh market data.', 'error');
    }
  }, 60000);

  // Update news every 10 minutes
  setInterval(async () => {
    try {
        await fetchNews(); // fetchNews should handle its own errors/notifications
    } catch (error) {
        console.error("Periodic news refresh failed:", error);
    }
  }, 600000); // 10 minutes

  // Update AI insights periodically (e.g., a default message or featured insight)
  setInterval(async () => {
    try {
        // Example: Fetch a "thought of the day" or a default insight if the AI section needs periodic refresh
        // This is conceptual and depends on whether `updateAIInsights` in content.js is designed for this.
        // For now, AI insights are primarily user-driven via "Ask Soltoshi".
        // If a default insight needs to be fetched from backend:
        // const defaultInsight = await fetch('/api/soltoshi-default-insight').then(res => res.json());
        // contentManager.updateAIInsights(defaultInsight.text, new Date().toLocaleTimeString());
    } catch (error) {
        console.error("Periodic AI insight refresh failed:", error);
    }
  }, 900000); // 15 minutes


  // Optional: Random notifications about PBTC events (Can keep or enhance)
  // Consider if these are truly autonomous or should be driven by real backend events.
  // For a true autonomous asset, these would be less random and more event-driven.
  // setInterval(() => {
  //   if (Math.random() > 0.85) { // Reduced frequency
  //     const notifications = [
  //       { title: 'Market Update', message: 'PBTC market cap just crossed a new milestone!', type: 'info' },
  //       { title: 'Burn Alert', message: 'Significant PBTC burn recorded on-chain.', type: 'success' },
  //       { title: 'Community Growth', message: 'Welcome new members to the Purple Bitcoin family!', type: 'info' },
  //     ];
  //     const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
  //     showNotification(randomNotification.title, randomNotification.message, randomNotification.type);
  //   }
  // }, 300000); // Every 5 minutes
}
