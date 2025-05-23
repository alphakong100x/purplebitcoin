// Educational content functionality

let currentModule = null;
const TOTAL_MODULES = 3; // Define total number of modules

function initializeEducation() {
  console.log('Initializing education system...');
  setupEducationalModules();
  updateLearningProgress(); // Initial update based on backend/wallet state
}

function setupEducationalModules() {
  const moduleButtons = document.querySelectorAll('.read-module');
  moduleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const moduleId = this.dataset.module;
      openEducationalModule(moduleId);
    });
  });

  const closeModalButton = document.getElementById('close-modal');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeEducationalModule);
  }

  const markCompleteButton = document.getElementById('mark-complete');
  if (markCompleteButton) {
    markCompleteButton.addEventListener('click', async function() {
      if (currentModule) {
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
        try {
            await completeEducationalModule(currentModule);
        } finally {
            // Button state (text, disabled) will be updated by openEducationalModule
            // after re-checking completion status from backend (via updateLearningProgress -> fetchCompletedModulesFromBackend)
            // Or directly if completeEducationalModule returns status.
            // For now, we can re-enable if an error occurred before showing notification.
            // The current logic updates button state inside openEducationalModule based on completion.
        }
      }
    });
  }
}

// Simulate fetching completed modules from a backend
async function fetchCompletedModulesFromBackend(walletAddress) {
  if (!walletAddress) return []; // No wallet, no progress from backend

  console.log(`Fetching completed modules for ${walletAddress} from backend...`);
  // Placeholder: Simulate API call
  // const response = await fetch(`/api/education/progress?wallet=${walletAddress}`);
  // if (!response.ok) { console.error("Failed to fetch progress"); return []; }
  // const data = await response.json(); // e.g., { completed_modules: ["tokenomics"] }
  // return data.completed_modules;

  // For V1.1 simulation: use localStorage as a temporary mock for backend state PER SESSION
  // This is NOT secure or persistent like a real backend.
  // This is just to make the demo work without a real backend.
  // In a real app, localStorage for this would be removed.
  try {
    const storedProgress = JSON.parse(sessionStorage.getItem(`completedModules_${walletAddress}`) || '[]');
    return storedProgress;
  } catch (e) {
    return [];
  }
}

async function openEducationalModule(moduleId) {
  const modal = document.getElementById('education-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const moduleReward = document.getElementById('module-reward');
  const markCompleteButton = document.getElementById('mark-complete');

  if (!modal || !modalTitle || !modalContent || !markCompleteButton) return;

  currentModule = moduleId;

  modalContent.innerHTML = `<div class="animate-pulse"><div class="h-6 bg-gray-800 rounded w-3/4 mb-3"></div><div class="h-4 bg-gray-800 rounded w-full mb-2"></div><div class="h-4 bg-gray-800 rounded w-5/6 mb-2"></div></div>`;
  modal.classList.remove('hidden');

  try {
    const { frontMatter, markdown } = await fetchEducationalContent(moduleId);
    modalTitle.textContent = frontMatter.title || 'Educational Module';
    moduleReward.textContent = `+${frontMatter.reward || 0} PBTC`; // Use reward from front matter
    modalContent.innerHTML = marked.parse(markdown);

    // Check completion status (simulated from backend)
    const walletAddress = getWalletAddress(); // From walletService.js
    const completedModules = walletAddress ? await fetchCompletedModulesFromBackend(walletAddress) : [];
    const isCompleted = completedModules.includes(moduleId);

    markCompleteButton.disabled = isCompleted || !walletAddress;
    markCompleteButton.innerHTML = isCompleted ? 'Module Completed' : 'Mark as Complete';
    if (!walletAddress && !isCompleted) {
        markCompleteButton.innerHTML = 'Connect Wallet to Complete';
    }
    markCompleteButton.classList.toggle('bg-gray-600', isCompleted || !walletAddress);
    markCompleteButton.classList.toggle('cursor-not-allowed', isCompleted || !walletAddress);
    markCompleteButton.classList.toggle('bg-purple-600', !isCompleted && !!walletAddress);
    markCompleteButton.classList.toggle('hover:bg-purple-500', !isCompleted && !!walletAddress);

  } catch (error) {
    console.error('Error loading educational content:', error);
    modalContent.innerHTML = '<p class="text-red-400">Error loading content. Please try again later.</p>';
    showNotification('Content Error', `Failed to load module ${moduleId}: ${error.message}`, 'error');
  }
}

function closeEducationalModule() {
  const modal = document.getElementById('education-modal');
  if (modal) {
    modal.classList.add('hidden');
    currentModule = null;
  }
}

async function fetchEducationalContent(moduleId) {
  const response = await fetch(`content/educational/${moduleId}.md`);
  if (!response.ok) throw new Error(`Failed to load content (${response.status})`);
  const mdContent = await response.text();
  return processMarkdownWithFrontMatter(mdContent);
}

function processMarkdownWithFrontMatter(mdContent) {
  const match = mdContent.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
  if (match && match[1] && match[2]) {
    try {
      const frontMatter = jsyaml.load(match[1]);
      const markdown = match[2];
      return { frontMatter, markdown };
    } catch (e) {
      console.error("Error parsing YAML front matter:", e);
      return { frontMatter: {}, markdown: mdContent }; // Return full content if YAML fails
    }
  }
  return { frontMatter: {}, markdown: mdContent }; // No front matter found
}

async function updateLearningProgress() {
  const progressElement = document.getElementById('learning-progress');
  if (!progressElement) return;

  const walletAddress = getWalletAddress();
  if (!walletAddress) {
    progressElement.innerHTML = `<span class="text-purple-400 mr-1">Your progress:</span><span>Connect wallet to track</span>`;
    return;
  }

  const completedModules = await fetchCompletedModulesFromBackend(walletAddress);
  progressElement.innerHTML = `<span class="text-purple-400 mr-1">Your progress:</span><span>${completedModules.length}/${TOTAL_MODULES} completed</span>`;
}

async function completeEducationalModule(moduleId) {
  const walletAddress = getWalletAddress();
  if (!walletAddress) {
    showNotification('Wallet Required', 'Please connect your wallet to mark modules as complete and earn rewards.', 'warning');
    // Reset button state if needed, though openEducationalModule should handle it on re-check
    const markCompleteButton = document.getElementById('mark-complete');
    if(markCompleteButton) {
        markCompleteButton.disabled = true;
        markCompleteButton.innerHTML = 'Connect Wallet to Complete';
    }
    return;
  }

  console.log(`Attempting to mark module ${moduleId} as complete for wallet ${walletAddress} via backend...`);

  try {
    // Simulate backend API call
    // const response = await fetch('/api/education/complete', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', /* 'Authorization': 'Bearer <token_if_any>' */ },
    //   body: JSON.stringify({ walletAddress: walletAddress, moduleId: moduleId })
    // });

    // if (!response.ok) {
    //   const errorData = await response.json().catch(() => ({ detail: "Request failed with status " + response.status }));
    //   throw new Error(errorData.detail || "Failed to mark module as complete.");
    // }
    // const result = await response.json(); // e.g., { success: true, reward_status: "pending" }

    // SIMULATED SUCCESS FOR V1.1 (Remove localStorage in real backend scenario)
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate backend delay
    let completedModules = await fetchCompletedModulesFromBackend(walletAddress); // Get current "backend" state
    if (!completedModules.includes(moduleId)) {
        completedModules.push(moduleId);
        // Simulate saving to "backend" (localStorage for demo)
        sessionStorage.setItem(`completedModules_${walletAddress}`, JSON.stringify(completedModules));
    }
    // End simulation

    showNotification('Module Completed!', `You've completed the "${moduleId}" module. Rewards (if applicable) will be processed by the backend.`, 'success');
    
    await updateLearningProgress(); // Refresh progress display from "backend"
    closeEducationalModule(); // Close modal on success
    await fetchRewardsBalance(); // Refresh rewards balance as it might have changed

  } catch (error) {
    console.error('Error completing educational module:', error);
    showNotification('Completion Failed', `Could not mark module as complete: ${error.message}`, 'error');
    // Re-enable button if an error occurred, openEducationalModule will re-evaluate its state
    const markCompleteButton = document.getElementById('mark-complete');
    if(markCompleteButton) {
        markCompleteButton.disabled = false; // Allow retry
        markCompleteButton.innerHTML = 'Mark as Complete';
    }
  }
}


