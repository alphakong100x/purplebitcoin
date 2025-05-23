// Content management for dynamic site content

// This file manages dynamic content that needs to be updated programmatically.
// V1.1: Focus on ensuring buttons/elements created here have event listeners attached correctly,
// often via event delegation in main.js or re-initialization routines.

// Initial content structure (simulated, would come from a CMS or config in a larger app)
const initialContent = {
  aiInsight: {
    content: "Based on recent market data and community sentiment, PBTC is showing positive momentum. The deflationary mechanism continues to reduce supply while utility adoption grows. Keep an eye on upcoming exchange listings and increased $PBTC use in the Purple Travel platform.",
    timestamp: "Today" // This should be dynamic
  },
  communitySpotlights: [
    { username: '@SolanaWhale', action: 'contributed 5,000 PBTC to the community wallet for marketing initiatives.', time: '2 days ago' },
    { username: '@PurpleDev', action: 'created an awesome PBTC visualization tool for tracking burns in real-time.', time: '4 days ago' }
  ],
  activeTasks: [
    { id: 'twitter-share', title: 'Share PBTC on X (Twitter)', reward: 10, description: "Share information about Purple Bitcoin with your followers. Mention @PurpleBitcoin and use #PBTC hashtag.", actionLink: "https://twitter.com/intent/tweet?text=I'm%20exploring%20Purple%20Bitcoin%20($PBTC)%20-%20a%20deflationary%20token%20on%20Solana%20with%20actual%20utility%20for%20travel%20and%20payments!%20Check%20it%20out%20at%20https://purplebitcoin.com%20@PurpleBitcoin%20%23PBTC%20%23Solana", actionText: 'Share Now' },
    { id: 'join-discord', title: 'Join Discord Community', reward: 5, description: "Join our Discord server to connect with the Purple Fam and stay updated on the latest news and developments.", actionLink: "https://discord.gg/purplebitcoin", actionText: 'Join Discord' },
    { id: 'travel-booking', title: 'Book Travel with PBTC', reward: 50, description: "Make a booking on Purple Travel Platform using PBTC and earn substantial rewards in addition to your booking discount.", actionLink: "https://purplebitcoin.com/travel", actionText: 'Book Travel' }
  ]
};


const contentManager = {
  updateHeroStats: function(price, change, volume, cap) {
    const priceEl = document.getElementById('current-price');
    const changeEl = document.getElementById('price-change');
    const volumeEl = document.getElementById('volume');
    const capEl = document.getElementById('market-cap');

    if (priceEl) priceEl.textContent = price !== null && price !== undefined ? `$${Number(price).toFixed(5)}` : '$0.00';
    if(changeEl) {
        if (change !== null && change !== undefined) {
            changeEl.textContent = `${change >= 0 ? '+' : ''}${Number(change).toFixed(2)}%`;
            changeEl.className = `text-xl font-bold ${parseFloat(change) >= 0 ? 'text-green-400' : 'text-red-400'}`;
        } else {
            changeEl.textContent = '0.00%';
            changeEl.className = 'text-xl font-bold text-gray-400';
        }
    }
    if (volumeEl) volumeEl.textContent = volume !== null && volume !== undefined ? `$${formatNumber(volume)}` : '$0';
    if (capEl) capEl.textContent = cap !== null && cap !== undefined ? `$${formatNumber(cap)}` : '$0';
  },

  updateAIInsights: function(content, timestamp = new Date().toLocaleTimeString()) {
    const insightsContainer = document.getElementById('ai-insights');
    if (!insightsContainer) return;

    // Sanitize content before inserting as HTML if it comes from an untrusted source.
    // Assuming 'content' here is either safe static text or pre-sanitized if from AI.
    // For user-generated AI content via 'Ask Soltoshi', sanitization is handled in main.js.
    insightsContainer.innerHTML = `
      <p class="text-sm text-gray-300 italic">${content}</p> <!-- Ensure 'content' is safe HTML or use textContent -->
      <div class="flex justify-between items-center mt-3">
        <span class="text-xs text-gray-400">Updated: ${timestamp}</span>
        <button id="ask-ai" class="text-purple-400 text-xs hover:text-purple-300">Ask Soltoshi</button>
      </div>
    `;
    // Event listener for 'ask-ai' is handled by event delegation in main.js
  },

  updateCommunitySpotlight: function(spotlights) {
    const spotlightContainer = document.getElementById('community-spotlight-container'); // Updated ID to target the div
    if (!spotlightContainer) return;

    let html = `<h3 class="text-lg font-medium mb-3 text-purple-300">Community Spotlight</h3>`;
    if (spotlights.length === 0) {
        html += `<p class="text-sm text-gray-400">No spotlights to show yet. Be the first!</p>`;
    } else {
        spotlights.forEach(item => {
          html += `
            <div class="bg-gray-800/50 rounded-lg p-3 mb-4">
              <p class="text-sm text-gray-300 mb-2">
                <span class="font-medium text-purple-300">${item.username}</span> ${item.action}
              </p>
              <span class="text-xs text-gray-400">${item.time}</span>
            </div>
          `;
        });
    }

    html += `
      <p class="text-xs text-gray-500 italic my-3">Note: Community Spotlight submissions are coming soon in a future version.</p>
      <button id="submit-showcase" class="text-sm text-purple-400 hover:text-purple-300" disabled>
        Submit your contribution (Coming Soon)
      </button>
    `;
    spotlightContainer.innerHTML = html;
    // The button is disabled, so no active listener needed currently.
    // If it were enabled, an event listener would be added here or via delegation.
    // The old listener with showNotification("Coming Soon") is fine even if button is disabled visually.
    const submitShowcaseButton = document.getElementById('submit-showcase');
    if(submitShowcaseButton){
        submitShowcaseButton.addEventListener('click', () => {
             showNotification(
              'Coming Soon',
              'The community showcase submission feature is under development.',
              'info'
            );
        });
    }
  },

  updateAvailableTasks: function(tasks) {
    const tasksContainer = document.getElementById('active-tasks-container'); // Updated ID
    if (!tasksContainer) return;

    let html = `<h3 class="text-lg font-medium mb-3 text-purple-300">Active Tasks</h3>`;
    if (tasks.length === 0) {
        html += `<p class="text-sm text-gray-400">No active tasks at the moment. Check back soon!</p>`;
    } else {
        html += `<div class="space-y-4">`;
        tasks.forEach(task => {
          html += `
            <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
              <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                <h4 class="font-medium">${task.title}</h4>
                <span class="text-sm text-purple-300 mt-1 sm:mt-0">+${task.reward} PBTC (Simulated Reward)</span>
              </div>
              <p class="text-sm text-gray-300 mb-3">${task.description}</p>
              <a href="${task.actionLink}" target="_blank" rel="noopener noreferrer" class="inline-block px-4 py-2 bg-purple-700 rounded-lg text-sm hover:bg-purple-600 transition">
                ${task.actionText}
              </a>
              <button class="verify-task inline-block ml-2 px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition" data-task-id="${task.id}">
                Verify Completion
              </button>
            </div>
          `;
        });
        html += `</div>`;
    }
    tasksContainer.innerHTML = html;
    this.attachTaskVerificationListeners(); // Attach listeners after rendering
  },

  attachTaskVerificationListeners: function() {
    const verifyTaskButtons = document.querySelectorAll('.verify-task');
    verifyTaskButtons.forEach(button => {
      // Remove existing listener to prevent duplicates if re-rendered
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      newButton.addEventListener('click', function() {
        const taskId = this.dataset.taskId;
        // Call verifyTask from gamification.js (assuming it's globally available or imported)
        if (typeof verifyTask === 'function') {
          verifyTask(taskId, this); // Pass button element for state management
        } else {
          console.error('verifyTask function not found.');
          showNotification('Error', 'Task verification system is currently unavailable.', 'error');
        }
      });
    });
  }
};

// Function to initialize content on page load
function initializeContent() {
    console.log("Initializing dynamic content sections...");
    contentManager.updateAIInsights(initialContent.aiInsight.content, initialContent.aiInsight.timestamp);
    contentManager.updateCommunitySpotlight(initialContent.communitySpotlights);
    contentManager.updateAvailableTasks(initialContent.activeTasks);
    // Hero stats are updated by dashboard.js after fetching market data
}

// Make contentManager available if other scripts need to call it directly (though less ideal than events)
// window.contentManager = contentManager;


