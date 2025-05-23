// Gamification and reward functionality

function initializeGamification() {
  console.log('Initializing gamification system...');
  // Event listeners for task verification buttons are now added dynamically
  // by content.js when it renders the tasks.
  // We still need to initialize the rewards balance display.
  fetchRewardsBalance();
}

// setupTaskVerification is called by content.js after tasks are rendered.
// No need for it here if content.js handles dynamic button listener setup.

async function verifyTask(taskId, buttonElement) {
  const walletAddress = getWalletAddress(); // From walletService.js
  if (!walletAddress) {
    showNotification('Wallet Required', 'Please connect your wallet to verify task completion and earn rewards.', 'warning');
    return;
  }

  const originalText = buttonElement.textContent;
  buttonElement.disabled = true;
  buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Verifying...';

  try {
    console.log(`Verifying task ${taskId} for wallet ${walletAddress} via backend...`);
    // Simulate backend API call for task verification.
    // The backend would:
    // 1. Authenticate the user (e.g., via wallet signature if needed for sensitive actions).
    // 2. Check if the task was actually completed (e.g., query Twitter API for a tweet, check on-chain data).
    // 3. If verified, record completion and queue reward distribution.
    // const response = await fetch('/api/tasks/verify', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', /* 'Authorization': 'Bearer <token_if_any>' */ },
    //   body: JSON.stringify({ walletAddress, taskId })
    // });

    // if (!response.ok) {
    //   const errorData = await response.json().catch(() => ({ detail: "Verification request failed" }));
    //   throw new Error(errorData.detail || `Verification failed for task ${taskId}.`);
    // }
    // const result = await response.json(); // e.g., { success: true, message: "Task verified", reward_amount: 10 }

    // SIMULATED RESPONSE FOR V1.1
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000)); // Simulate backend processing
    
    // Simulate success/failure based on task type
    let verified = true; // Assume success for simulation
    let rewardAmount = 0;
    let message = "";

    switch(taskId) {
        case 'twitter-share': rewardAmount = 10; message = `Twitter share verified! +${rewardAmount} PBTC (simulated).`; break;
        case 'join-discord': rewardAmount = 5; message = `Discord join verified! +${rewardAmount} PBTC (simulated).`; break;
        case 'travel-booking': rewardAmount = 50; message = `Travel booking verified! +${rewardAmount} PBTC (simulated).`; verified = Math.random() > 0.3; break; // Simulate this might fail more
        default: verified = false; message = "Unknown task ID.";
    }

    if (verified) {
      buttonElement.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Verified';
      buttonElement.classList.remove('bg-gray-700', 'hover:bg-gray-600');
      buttonElement.classList.add('bg-green-700', 'cursor-not-allowed'); // No hover on green, already done
      // buttonElement.disabled = true; // Already disabled, will remain so.
      showNotification('Task Verified!', message, 'success');
      await fetchRewardsBalance(); // Refresh rewards balance from "backend"
    } else {
      buttonElement.textContent = originalText; // Reset button text
      buttonElement.disabled = false; // Re-enable for retry
      showNotification('Verification Failed', `Could not verify task: ${taskId}. Please ensure you've completed the action and try again. (Simulated failure)`, 'error');
    }

  } catch (error) {
    console.error('Error verifying task:', error);
    buttonElement.textContent = originalText; // Reset button on error
    buttonElement.disabled = false; // Re-enable for retry
    showNotification('Verification Error', `An error occurred: ${error.message}`, 'error');
  }
}

async function fetchRewardsBalance() {
  const rewardsElement = document.getElementById('rewards-balance');
  if (!rewardsElement) return;

  const walletAddress = getWalletAddress();
  if (!walletAddress) {
    rewardsElement.innerHTML = '<span class="text-purple-400 mr-1">Available rewards:</span><span>Connect wallet</span>';
    return;
  }

  rewardsElement.innerHTML = '<span class="text-purple-400 mr-1">Available rewards:</span><span>Loading...</span>';

  try {
    console.log(`Fetching rewards balance for ${walletAddress} from backend...`);
    // Simulate backend API call to get the user's actual rewards balance.
    // const response = await fetch(`/api/rewards/balance?walletAddress=${walletAddress}`);
    // if (!response.ok) {
    //   throw new Error("Failed to fetch rewards balance from backend.");
    // }
    // const data = await response.json(); // e.g., { balance: 125 }

    // SIMULATED RESPONSE FOR V1.1
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    // Simulate fetching a balance (e.g., sum of rewards for completed modules/tasks for this session)
    let simulatedTotalRewards = 0;
    const completedModules = await fetchCompletedModulesFromBackend(walletAddress); // From education.js (simulated backend)
    completedModules.forEach(moduleId => {
        // Get reward value for each module (could be stored in module definition or a config)
        if(moduleId === 'tokenomics') simulatedTotalRewards += 5;
        if(moduleId === 'solanaAdvantage') simulatedTotalRewards += 5;
        if(moduleId === 'purpleTravel') simulatedTotalRewards += 5;
    });
    // Add task rewards (this part is more complex to track without a real backend state for tasks)
    // For now, this simulation mainly reflects educational module rewards.
    // A real backend would track all rewards.

    rewardsElement.innerHTML = `<span class="text-purple-400 mr-1">Available rewards:</span><span>${formatNumber(simulatedTotalRewards)} PBTC (Simulated)</span>`;

  } catch (error) {
    console.error("Error fetching rewards balance:", error);
    rewardsElement.innerHTML = '<span class="text-purple-400 mr-1">Available rewards:</span><span class="text-red-400">Error</span>';
    showNotification('Rewards Error', `Could not fetch rewards balance: ${error.message}`, 'error');
  }
}

// This function is called by walletService when wallet connects/disconnects,
// and after task/module completions.


