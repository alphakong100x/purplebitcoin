// Notification system

let notificationActive = false;
let notificationQueue = [];
let currentNotificationTimeout = null;

function showNotification(title, message, type = 'info') {
  const notification = { title, message, type };

  if (notificationActive) {
    notificationQueue.push(notification);
    return;
  }
  displayNotification(notification);
}

function displayNotification(notification) {
  const notificationElement = document.getElementById('notification');
  const notificationTitle = document.getElementById('notification-title');
  const notificationMessage = document.getElementById('notification-message');
  const notificationIconContainer = document.getElementById('notification-icon');

  if (!notificationElement || !notificationTitle || !notificationMessage || !notificationIconContainer) {
    console.error('Notification elements not found in the DOM.');
    return;
  }

  notificationActive = true;

  // Sanitize title and message by setting textContent.
  // This prevents HTML injection if title/message come from untrusted sources.
  notificationTitle.textContent = notification.title;
  notificationMessage.textContent = notification.message;

  let iconClass = 'fas fa-info-circle';
  let iconBgColor = 'bg-purple-600'; // Default (info)
  let borderColor = 'border-purple-600';

  switch(notification.type) {
    case 'success':
      iconClass = 'fas fa-check-circle';
      iconBgColor = 'bg-green-500';
      borderColor = 'border-green-500';
      break;
    case 'error':
      iconClass = 'fas fa-exclamation-circle';
      iconBgColor = 'bg-red-500';
      borderColor = 'border-red-500';
      break;
    case 'warning':
      iconClass = 'fas fa-exclamation-triangle';
      iconBgColor = 'bg-yellow-500';
      borderColor = 'border-yellow-500';
      break;
    // 'info' uses default purple
  }

  notificationIconContainer.innerHTML = `<i class="${iconClass} text-white"></i>`;
  // Update classes on main notification div and icon container
  notificationElement.className = `fixed bottom-6 right-6 max-w-xs bg-gray-900 rounded-lg p-4 shadow-lg transform translate-y-20 opacity-0 transition-all duration-300 z-[100] border ${borderColor}`;
  notificationIconContainer.className = `w-6 h-6 rounded-full ${iconBgColor} flex items-center justify-center mr-3 shrink-0`;

  // Animate in
  requestAnimationFrame(() => {
    notificationElement.classList.remove('translate-y-20', 'opacity-0');
    notificationElement.classList.add('translate-y-0', 'opacity-100');
  });

  const closeButton = document.getElementById('close-notification');
  const newCloseButton = closeButton.cloneNode(true); // Clone to remove old listeners
  closeButton.parentNode.replaceChild(newCloseButton, closeButton);
  newCloseButton.addEventListener('click', () => hideNotification(true), { once: true });

  // Auto-hide after 5 seconds (or longer for errors)
  const autoHideDelay = notification.type === 'error' ? 8000 : 5000;
  if (currentNotificationTimeout) clearTimeout(currentNotificationTimeout); // Clear previous timeout
  currentNotificationTimeout = setTimeout(() => {
    hideNotification(false); // false means it's an auto-hide, not user click
  }, autoHideDelay);
}

function hideNotification(isUserClose = false) {
  const notificationElement = document.getElementById('notification');
  if (!notificationElement || !notificationActive) return; // Don't hide if not active or not found

  if(isUserClose && currentNotificationTimeout) {
    clearTimeout(currentNotificationTimeout); // Clear auto-hide if user closes manually
    currentNotificationTimeout = null;
  }

  notificationElement.classList.remove('translate-y-0', 'opacity-100');
  notificationElement.classList.add('translate-y-20', 'opacity-0');
  
  // Wait for animation before processing queue
  setTimeout(() => {
    notificationActive = false;
    if (notificationQueue.length > 0) {
      const nextNotification = notificationQueue.shift();
      displayNotification(nextNotification);
    }
  }, 300); // Animation duration matches CSS
}

function initializeNotifications() {
  console.log('Initializing notification system...');
  // Ensure the close button exists and attach an initial listener (though it's cloned in displayNotification)
  const closeButton = document.getElementById('close-notification');
  if (closeButton) {
    // The listener is attached dynamically in displayNotification to handle cloning.
  } else {
    console.warn('Notification close button not found during initialization.');
  }
}


