// News and updates service

// Re-use fetchWithRetry if it were in a shared utilities.js, or define locally if specific adjustments needed.
// For this example, assuming fetchWithRetry is available globally or imported if it were in utilities.js
// If not, it would need to be defined here or passed in. For now, let's assume a similar helper exists or we simplify.

async function simplifiedFetchWithRetry(url, retries = 2, delayMs = 500) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url); // No options needed for GET usually
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status} for ${url}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`News fetch attempt ${attempt} for ${url} failed: ${error.message}`);
            if (attempt === retries) {
                showNotification('News Error', `Failed to fetch data from ${url.split('/').pop()}.`, 'error');
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, delayMs));
            delayMs *= 2;
        }
    }
}


// Fetch news and announcements
async function fetchNews() {
  console.log("Fetching news and updates...");
  try {
    // In a real application, these would call specific backend endpoints.
    // const announcements = await simplifiedFetchWithRetry('/api/news/announcements');
    // const articles = await simplifiedFetchWithRetry('/api/news/articles');
    // const social = await simplifiedFetchWithRetry('/api/news/social-feed');

    // Simulate fetching different types of news content
    const [announcements, newsArticles, socialPosts] = await Promise.all([
      fetchOfficialAnnouncements(),
      fetchNewsArticles(),
      fetchSocialPosts()
    ]);

    updateAnnouncementsUI(announcements);
    updateNewsArticlesUI(newsArticles);
    updateSocialFeedUI(socialPosts);

    console.log('News and updates refreshed successfully.');
  } catch (error) {
    console.error('Error fetching news:', error.message);
    showNotification('Update Error', 'Failed to refresh news feeds. Some content may be outdated.', 'warning');
    // UI will show existing data or loading states if initial fetch failed.
  }
}

// Simulate fetching official announcements
async function fetchOfficialAnnouncements() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
  // Return mock data. In reality, this comes from a backend API.
  return [
    {
      title: 'Major Update: Purple Bitcoin v1.1 Deployed!',
      content: 'Version 1.1 of the Autonomous Online Asset is now live, featuring enhanced security, real-time data placeholders, and improved usability. Backend integration for core features is underway.',
      date: new Date(Date.now() - 1 * 60 * 60 * 1000).toLocaleString(), // 1 hour ago
      important: true,
      link: '#' // Placeholder link
    },
    {
      title: 'Community AMA with Dev Team Next Week',
      content: 'Join us for a live Ask-Me-Anything session with the Purple Bitcoin development team. Details and schedule to be announced on our social channels.',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString(), // 1 day ago
      important: false,
      link: '#'
    }
  ];
}

// Simulate fetching news articles
async function fetchNewsArticles() {
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));
  return [
    {
      title: 'Purple Bitcoin Gains Traction with Utility Focus',
      source: 'CryptoChronicle',
      summary: 'Analysts note PBTC\'s commitment to real-world utility through its travel platform and upcoming payment system as key differentiators in the meme coin space.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(), // 2 days ago
      link: '#'
    },
    {
      title: 'Solana Ecosystem Highlights: PBTC\'s Deflationary Model',
      source: 'Solana Insights',
      summary: 'A deep dive into innovative tokenomics on Solana, featuring Purple Bitcoin\'s consistent burn mechanism and its impact on supply dynamics.',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString(), // 3 days ago
      link: '#'
    }
  ];
}

// Simulate fetching social media posts
async function fetchSocialPosts() {
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
  return [
    {
      username: '@PurpleMaxi',
      content: 'Loving the new v1.1 interface for $PBTC! The active nav highlighting is a small but nice touch. #PurpleBitcoin #UIUX',
      platform: 'X (Twitter)',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(), // 2 hours ago
      link: '#'
    },
    {
      username: '@SolanaHolder123',
      content: 'The commitment to removing the API key from client-side $PBTC code is a big step for security. Trust++ for the team. #CryptoSecurity',
      platform: 'X (Twitter)',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString(), // 5 hours ago
      link: '#'
    }
  ];
}

// UI Update functions (These will be called with data from the fetches)
// Ensure these functions sanitize any data before inserting as HTML if it's not trusted.
// For internally generated/formatted dates, direct insertion is okay. For user-generated content from APIs, sanitize.

function updateAnnouncementsUI(announcements) {
  const container = document.getElementById('announcements');
  if (!container) return;
  if (!announcements || announcements.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-400">No recent announcements.</p>';
    return;
  }
  container.innerHTML = announcements.map(ann => `
    <div class="pb-4 border-b border-gray-800 last:border-0 last:pb-0">
      <h4 class="font-medium text-white flex items-center">
        ${ann.important ? '<span class="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2 shrink-0"></span>' : ''}
        <span class="truncate" title="${ann.title}">${ann.title}</span>
      </h4>
      <p class="text-sm text-gray-300 mt-1 mb-2">${ann.content}</p> <!-- Assume content is safe or sanitized by backend -->
      <div class="flex justify-between items-center">
        <span class="text-xs text-gray-400">${ann.date}</span>
        <a href="${ann.link}" target="_blank" rel="noopener noreferrer" class="text-xs text-purple-400 hover:text-purple-300">Read more</a>
      </div>
    </div>
  `).join('');
}

function updateNewsArticlesUI(articles) {
  const container = document.getElementById('news-articles');
  if (!container) return;
   if (!articles || articles.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-400">No recent news articles.</p>';
    return;
  }
  container.innerHTML = articles.map(article => `
    <div class="pb-4 border-b border-gray-800 last:border-0 last:pb-0">
      <h4 class="font-medium text-white truncate" title="${article.title}">${article.title}</h4>
      <p class="text-xs text-purple-300 mt-1">${article.source}</p>
      <p class="text-sm text-gray-300 mt-1 mb-2">${article.summary}</p> <!-- Assume content is safe or sanitized -->
      <div class="flex justify-between items-center">
        <span class="text-xs text-gray-400">${article.date}</span>
        <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="text-xs text-purple-400 hover:text-purple-300">Read full article</a>
      </div>
    </div>
  `).join('');
}

function updateSocialFeedUI(posts) {
  const container = document.getElementById('social-feed');
  if (!container) return;
  if (!posts || posts.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-400">No recent social activity.</p>';
    return;
  }
  container.innerHTML = posts.map(post => `
    <div class="pb-3 border-b border-gray-700/30 last:border-0 last:pb-0">
      <div class="flex justify-between">
        <span class="font-medium text-sm text-purple-300">${post.username}</span> <!-- Assume username is safe -->
        <span class="text-xs text-gray-400">${post.date}</span>
      </div>
      <p class="text-sm text-gray-300 mt-1">${post.content}</p> <!-- Assume content is safe or sanitized -->
      <div class="mt-1">
        <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="text-xs text-purple-400 hover:underline">View on ${post.platform}</a>
      </div>
    </div>
  `).join('');
}

// Initialize news service
function initializeNews() {
  console.log('Initializing news service...');
  fetchNews(); // Initial fetch
}


